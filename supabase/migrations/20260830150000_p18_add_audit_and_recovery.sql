-- ==============================================================================
-- Migration: 20260830150000_p18_add_audit_and_recovery.sql
-- Phase: P18 (Nhật ký và phục hồi - Audit Log, Soft-Delete & Recovery)
-- Author: Principal Full-stack Engineer, PostgreSQL Audit Engineer & Supabase Security Engineer
-- Description:
--   1. Tạo bảng public.audit_logs và indexes phục vụ truy vết biến động và bộ lọc
--   2. Bật RLS và phân quyền nghiêm ngặt cho audit_logs (SELECT cho Tree Members, Không UPDATE/DELETE)
--   3. Helper function _system.write_audit_log (SECURITY DEFINER, safe search_path)
--   4. Tích hợp audit logging vào các RPCs hiện hữu:
--      - public.create_family_tree, public.restore_family_tree
--      - public.create_person_with_parent_relationship, public.link_existing_parent
--      - public.create_person_with_child_relationship, public.link_existing_child
--      - public.replace_parent_relationship, public.soft_delete_parent_child_relationship
--      - public.create_union_with_new_person, public.create_union_with_existing_person
--      - public.end_union, public.soft_delete_union
--      - public.restore_person
--   5. Tạo mới RPCs khôi phục có kiểm soát:
--      - public.restore_parent_child_relationship
--      - public.restore_union
--   6. RLS Policies truy cập Trash cho quan hệ: relationships_select_deleted_writers, unions_select_deleted_writers
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TẠO BẢNG AUDIT_LOGS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE RESTRICT,
    actor_user_id UUID NULL, -- Giữ lịch sử ngay cả khi auth.users bị xóa
    actor_name_cached TEXT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    before_data JSONB NULL,
    after_data JSONB NULL,
    changed_fields TEXT[] NULL,
    reason TEXT NULL,
    request_id TEXT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Ràng buộc danh mục Entity Types chuẩn hóa (P18-T02)
    CONSTRAINT audit_logs_entity_type_check CHECK (
        entity_type IN (
            'family_tree',
            'person',
            'parent_child_relationship',
            'union',
            'union_member',
            'person_avatar'
        )
    ),

    -- Ràng buộc danh mục Action Types chuẩn hóa (P18-T03)
    CONSTRAINT audit_logs_action_type_check CHECK (
        action_type IN (
            'create',
            'update',
            'soft_delete',
            'restore',
            'replace',
            'status_change',
            'link',
            'unlink',
            'privacy_change',
            'generation_anchor_change',
            'avatar_replace',
            'avatar_remove'
        )
    )
);

COMMENT ON TABLE public.audit_logs IS 'Bảng nhật ký biến động nghiệp vụ bất biến cho các cây gia phả (P18)';
COMMENT ON COLUMN public.audit_logs.tree_id IS 'UUID cây gia phả sở hữu biến động';
COMMENT ON COLUMN public.audit_logs.actor_user_id IS 'UUID người dùng thực hiện thay đổi (lấy từ auth.uid())';
COMMENT ON COLUMN public.audit_logs.entity_type IS 'Loại thực thể biến động (person, family_tree, parent_child_relationship, union, ...)';
COMMENT ON COLUMN public.audit_logs.action_type IS 'Loại thao tác thực hiện (create, update, soft_delete, restore, replace, ...)';
COMMENT ON COLUMN public.audit_logs.before_data IS 'Dữ liệu trước thay đổi đã khử nhiễm và lọc theo allowlist';
COMMENT ON COLUMN public.audit_logs.after_data IS 'Dữ liệu sau thay đổi đã khử nhiễm và lọc theo allowlist';

-- ------------------------------------------------------------------------------
-- 2. INDEXES PHỤC VỤ LỊCH SỬ VÀ BỘ LỌC
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_audit_logs_tree_created
    ON public.audit_logs (tree_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tree_entity
    ON public.audit_logs (tree_id, entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tree_action
    ON public.audit_logs (tree_id, action_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tree_actor
    ON public.audit_logs (tree_id, actor_user_id);

-- ------------------------------------------------------------------------------
-- 3. RLS VÀ PHÂN QUYỀN TRUY CẬP CHO AUDIT_LOGS
-- ------------------------------------------------------------------------------

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Thu hồi toàn bộ quyền từ PUBLIC và anon
REVOKE ALL ON public.audit_logs FROM PUBLIC, anon;

-- Cấp quyền SELECT cho authenticated và service_role
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO service_role;

-- Policy: Chỉ thành viên active của Tree mới có quyền SELECT audit logs
DROP POLICY IF EXISTS audit_logs_select_tree_members ON public.audit_logs;
CREATE POLICY audit_logs_select_tree_members ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (
        _system.can_access_tree(tree_id, auth.uid())
    );

-- Lưu ý: Tuyệt đối không tạo policy INSERT, UPDATE, DELETE cho authenticated role để đảm bảo tính bất biến (Immutability).

-- ------------------------------------------------------------------------------
-- 4. AUDIT WRITER HELPER FUNCTION
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.write_audit_log(
    p_tree_id UUID,
    p_entity_type VARCHAR(50),
    p_entity_id UUID,
    p_action_type VARCHAR(50),
    p_before_data JSONB DEFAULT NULL,
    p_after_data JSONB DEFAULT NULL,
    p_changed_fields TEXT[] DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_source VARCHAR(50) DEFAULT 'system',
    p_request_id TEXT DEFAULT NULL,
    p_actor_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_actor_id UUID;
    v_actor_name TEXT := NULL;
    v_audit_id UUID;
    v_tree_exists BOOLEAN;
BEGIN
    -- 1. Kiểm tra Tree tồn tại
    SELECT EXISTS (
        SELECT 1 FROM public.family_trees WHERE id = p_tree_id
    ) INTO v_tree_exists;

    IF NOT v_tree_exists THEN
        RAISE EXCEPTION 'Cannot record audit log: Family tree % does not exist', p_tree_id
            USING ERRCODE = 'P0002';
    END IF;

    -- 2. Xác định Actor
    v_actor_id := COALESCE(p_actor_user_id, auth.uid());

    IF v_actor_id IS NOT NULL THEN
        SELECT full_name INTO v_actor_name
        FROM public.profiles
        WHERE id = v_actor_id;
    END IF;

    -- 3. Ghi vào bảng audit_logs
    INSERT INTO public.audit_logs (
        tree_id,
        actor_user_id,
        actor_name_cached,
        entity_type,
        entity_id,
        action_type,
        before_data,
        after_data,
        changed_fields,
        reason,
        request_id,
        source
    ) VALUES (
        p_tree_id,
        v_actor_id,
        v_actor_name,
        p_entity_type,
        p_entity_id,
        p_action_type,
        p_before_data,
        p_after_data,
        p_changed_fields,
        p_reason,
        p_request_id,
        COALESCE(p_source, 'system')
    ) RETURNING id INTO v_audit_id;

    RETURN v_audit_id;
END;
$$;

COMMENT ON FUNCTION _system.write_audit_log IS 'Internal trusted function to record business audit log in same database transaction';

-- ------------------------------------------------------------------------------
-- 5. PUBLIC RPC RECORD AUDIT EVENT (Cho Server Actions tin cậy)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.record_audit_event(
    p_tree_id UUID,
    p_entity_type VARCHAR(50),
    p_entity_id UUID,
    p_action_type VARCHAR(50),
    p_before_data JSONB DEFAULT NULL,
    p_after_data JSONB DEFAULT NULL,
    p_changed_fields TEXT[] DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_source VARCHAR(50) DEFAULT 'server_action',
    p_request_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_can_write BOOLEAN;
    v_audit_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to record audit event'
            USING ERRCODE = '42501';
    END IF;

    -- Chỉ writer của tree mới được phép ghi log thông qua server action
    v_can_write := _system.can_write_tree(p_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: User is not authorized to write audit events for this tree'
            USING ERRCODE = '42501';
    END IF;

    v_audit_id := _system.write_audit_log(
        p_tree_id,
        p_entity_type,
        p_entity_id,
        p_action_type,
        p_before_data,
        p_after_data,
        p_changed_fields,
        p_reason,
        COALESCE(p_source, 'server_action'),
        p_request_id,
        v_user_id
    );

    RETURN v_audit_id;
END;
$$;

REVOKE ALL ON FUNCTION public.record_audit_event FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_audit_event TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 6. CẬP NHẬT CÁC RPCS P11 ĐỂ GHI AUDIT LOG
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_family_tree(
    p_name text,
    p_description text DEFAULT NULL,
    p_privacy_level tree_privacy_level DEFAULT 'private'::tree_privacy_level
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_trimmed_name text;
    v_trimmed_desc text;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to create a family tree'
            USING ERRCODE = '42501';
    END IF;

    v_trimmed_name := trim(p_name);
    IF v_trimmed_name IS NULL OR char_length(v_trimmed_name) = 0 THEN
        RAISE EXCEPTION 'Family tree name cannot be empty'
            USING ERRCODE = '22023';
    END IF;

    IF char_length(v_trimmed_name) > 100 THEN
        RAISE EXCEPTION 'Family tree name exceeds maximum length of 100 characters'
            USING ERRCODE = '22023';
    END IF;

    IF p_description IS NOT NULL THEN
        v_trimmed_desc := trim(p_description);
        IF char_length(v_trimmed_desc) > 1000 THEN
            RAISE EXCEPTION 'Family tree description exceeds maximum length of 1000 characters'
                USING ERRCODE = '22023';
        END IF;
        IF char_length(v_trimmed_desc) = 0 THEN
            v_trimmed_desc := NULL;
        END IF;
    ELSE
        v_trimmed_desc := NULL;
    END IF;

    -- Tạo Family Tree
    INSERT INTO public.family_trees (
        name,
        description,
        status,
        privacy_level,
        created_by,
        updated_by
    ) VALUES (
        v_trimmed_name,
        v_trimmed_desc,
        'active'::tree_status,
        COALESCE(p_privacy_level, 'private'::tree_privacy_level),
        v_user_id,
        v_user_id
    ) RETURNING id INTO v_tree_id;

    -- Tạo Owner Membership
    INSERT INTO public.tree_memberships (
        tree_id,
        user_id,
        role,
        status,
        created_by,
        updated_by
    ) VALUES (
        v_tree_id,
        v_user_id,
        'owner'::membership_role,
        'active'::membership_status,
        v_user_id,
        v_user_id
    );

    -- Ghi Audit Log trong cùng transaction (P18-T11)
    PERFORM _system.write_audit_log(
        v_tree_id,
        'family_tree',
        v_tree_id,
        'create',
        NULL,
        jsonb_build_object(
            'name', v_trimmed_name,
            'description', v_trimmed_desc,
            'privacy_level', COALESCE(p_privacy_level, 'private'::tree_privacy_level),
            'status', 'active'
        ),
        ARRAY['name', 'description', 'privacy_level', 'status'],
        'Khởi tạo cây gia phả mới',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN v_tree_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_family_tree(
    p_tree_id UUID,
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_is_owner boolean;
    v_current_status tree_status;
    v_current_version INTEGER;
    v_rows_updated INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore a family tree'
            USING ERRCODE = '42501';
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM public.tree_memberships
        WHERE tree_id = p_tree_id
          AND user_id = v_user_id
          AND role = 'owner'
          AND status = 'active'
          AND deleted_at IS NULL
    ) INTO v_is_owner;

    IF NOT v_is_owner THEN
        RAISE EXCEPTION 'Forbidden: Only the tree owner can restore a deleted family tree'
            USING ERRCODE = '42501';
    END IF;

    SELECT status, version
    INTO v_current_status, v_current_version
    FROM public.family_trees
    WHERE id = p_tree_id;

    IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'Family tree not found'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_current_status <> 'deleted' THEN
        RETURN true;
    END IF;

    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Family tree version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

    UPDATE public.family_trees
    SET
        status = 'active',
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_tree_id
      AND status = 'deleted'
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Failed to restore family tree due to concurrency conflict'
            USING ERRCODE = '40001';
    END IF;

    -- Ghi Audit Log trong cùng transaction (P18-T11)
    PERFORM _system.write_audit_log(
        p_tree_id,
        'family_tree',
        p_tree_id,
        'restore',
        jsonb_build_object('status', 'deleted', 'version', v_current_version),
        jsonb_build_object('status', 'active', 'version', v_current_version + 1),
        ARRAY['status', 'deleted_at', 'deleted_by', 'version'],
        'Khôi phục cây gia phả từ thùng rác',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 7. CẬP NHẬT CÁC RPCS P12 ĐỂ GHI AUDIT LOG
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.restore_person(
    p_person_id UUID,
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_current_version INTEGER;
    v_is_deleted boolean;
    v_can_write boolean;
    v_rows_updated INTEGER;
    v_full_name TEXT;
    v_tree_deleted boolean;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore a person'
            USING ERRCODE = '42501';
    END IF;

    SELECT tree_id, (deleted_at IS NOT NULL), version, full_name
    INTO v_tree_id, v_is_deleted, v_current_version, v_full_name
    FROM public.persons
    WHERE id = p_person_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Person not found'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra Tree có bị xóa không (P18-T14 invariant)
    SELECT (status = 'deleted' OR deleted_at IS NOT NULL)
    INTO v_tree_deleted
    FROM public.family_trees
    WHERE id = v_tree_id;

    IF v_tree_deleted THEN
        RAISE EXCEPTION 'Cannot restore person while family tree is deleted. Please restore the tree first.'
            USING ERRCODE = '22023';
    END IF;

    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can restore this person'
            USING ERRCODE = '42501';
    END IF;

    IF NOT v_is_deleted THEN
        RETURN true;
    END IF;

    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Person version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

    UPDATE public.persons
    SET
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_person_id
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Failed to restore person due to concurrency conflict'
            USING ERRCODE = '40001';
    END IF;

    -- Ghi Audit Log trong cùng transaction (P18-T14)
    PERFORM _system.write_audit_log(
        v_tree_id,
        'person',
        p_person_id,
        'restore',
        jsonb_build_object('full_name', v_full_name, 'deleted', true, 'version', v_current_version),
        jsonb_build_object('full_name', v_full_name, 'deleted', false, 'version', v_current_version + 1),
        ARRAY['deleted_at', 'deleted_by', 'version'],
        'Khôi phục nhân vật từ thùng rác',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 8. CẬP NHẬT CÁC RPCS P13 ĐỂ GHI AUDIT LOG
-- ------------------------------------------------------------------------------

-- 8.1. Create person with parent relationship
CREATE OR REPLACE FUNCTION public.create_person_with_parent_relationship(
    p_tree_id UUID,
    p_child_id UUID,
    p_full_name TEXT,
    p_gender gender_type DEFAULT 'unknown',
    p_living_status living_status_type DEFAULT 'unknown',
    p_birth_date DATE DEFAULT NULL,
    p_birth_year SMALLINT DEFAULT NULL,
    p_birth_date_precision date_precision_type DEFAULT 'unknown',
    p_birth_is_estimated BOOLEAN DEFAULT false,
    p_death_date DATE DEFAULT NULL,
    p_death_year SMALLINT DEFAULT NULL,
    p_death_date_precision date_precision_type DEFAULT 'unknown',
    p_death_is_estimated BOOLEAN DEFAULT false,
    p_birth_place_text TEXT DEFAULT NULL,
    p_death_place_text TEXT DEFAULT NULL,
    p_hometown_text TEXT DEFAULT NULL,
    p_burial_place_text TEXT DEFAULT NULL,
    p_occupation_text TEXT DEFAULT NULL,
    p_biography TEXT DEFAULT NULL,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_can_write BOOLEAN;
    v_child_exists BOOLEAN;
    v_new_person_id UUID;
    v_rel_id UUID;
    v_parent_role parent_role_type;
    v_auto_role parent_role_type;
    v_has_father BOOLEAN;
    v_has_mother BOOLEAN;
    v_bio_fathers_count INT;
    v_bio_mothers_count INT;
    v_similar_candidates JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    v_can_write := _system.can_write_tree(p_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Tree write permission required' USING ERRCODE = '42501';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.persons
        WHERE id = p_child_id AND tree_id = p_tree_id AND deleted_at IS NULL
    ) INTO v_child_exists;

    IF NOT v_child_exists THEN
        RAISE EXCEPTION 'Target child person not found or inactive in this tree' USING ERRCODE = 'P0002';
    END IF;

    v_parent_role := p_parent_role;
    IF v_parent_role = 'unspecified' THEN
        IF p_gender = 'male' THEN
            v_auto_role := 'father';
        ELSIF p_gender = 'female' THEN
            v_auto_role := 'mother';
        ELSE
            v_auto_role := 'unspecified';
        END IF;

        IF v_auto_role = 'father' THEN
            SELECT EXISTS (
                SELECT 1 FROM public.parent_child_relationships
                WHERE tree_id = p_tree_id AND child_id = p_child_id AND parent_role = 'father' AND deleted_at IS NULL
            ) INTO v_has_father;
            IF NOT v_has_father THEN
                v_parent_role := 'father';
            END IF;
        ELSIF v_auto_role = 'mother' THEN
            SELECT EXISTS (
                SELECT 1 FROM public.parent_child_relationships
                WHERE tree_id = p_tree_id AND child_id = p_child_id AND parent_role = 'mother' AND deleted_at IS NULL
            ) INTO v_has_mother;
            IF NOT v_has_mother THEN
                v_parent_role := 'mother';
            END IF;
        END IF;
    END IF;

    IF p_relationship_kind = 'biological' THEN
        IF v_parent_role = 'father' THEN
            SELECT COUNT(*) INTO v_bio_fathers_count
            FROM public.parent_child_relationships
            WHERE tree_id = p_tree_id AND child_id = p_child_id AND parent_role = 'father'
              AND relationship_kind = 'biological' AND deleted_at IS NULL;
            IF v_bio_fathers_count >= 1 THEN
                RAISE EXCEPTION 'BIOLOGICAL_PARENT_EXISTS: Child already has an active biological father' USING ERRCODE = '23505';
            END IF;
        ELSIF v_parent_role = 'mother' THEN
            SELECT COUNT(*) INTO v_bio_mothers_count
            FROM public.parent_child_relationships
            WHERE tree_id = p_tree_id AND child_id = p_child_id AND parent_role = 'mother'
              AND relationship_kind = 'biological' AND deleted_at IS NULL;
            IF v_bio_mothers_count >= 1 THEN
                RAISE EXCEPTION 'BIOLOGICAL_PARENT_EXISTS: Child already has an active biological mother' USING ERRCODE = '23505';
            END IF;
        END IF;
    END IF;

    IF NOT p_confirm_warnings THEN
        SELECT jsonb_agg(jsonb_build_object(
            'id', id, 'fullName', full_name, 'gender', gender, 'birthYear', birth_year
        )) INTO v_similar_candidates
        FROM public.persons
        WHERE tree_id = p_tree_id AND deleted_at IS NULL
          AND normalized_name = _system.normalize_person_name(p_full_name)
          AND (p_birth_year IS NULL OR birth_year IS NULL OR abs(birth_year - p_birth_year) <= 2);

        IF v_similar_candidates IS NOT NULL AND jsonb_array_length(v_similar_candidates) > 0 THEN
            RETURN jsonb_build_object(
                'status', 'warning',
                'warningCode', 'SIMILAR_PROFILE_WARNING',
                'candidates', v_similar_candidates
            );
        END IF;
    END IF;

    -- 1. Insert Person
    INSERT INTO public.persons (
        tree_id, full_name, normalized_name, gender, living_status,
        birth_date, birth_year, birth_date_precision, birth_is_estimated,
        death_date, death_year, death_date_precision, death_is_estimated,
        birth_place_text, death_place_text, hometown_text, burial_place_text,
        occupation_text, biography, verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, trim(p_full_name), _system.normalize_person_name(p_full_name), p_gender, p_living_status,
        p_birth_date, p_birth_year, p_birth_date_precision, p_birth_is_estimated,
        p_death_date, p_death_year, p_death_date_precision, p_death_is_estimated,
        p_birth_place_text, p_death_place_text, p_hometown_text, p_burial_place_text,
        p_occupation_text, p_biography, p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_new_person_id;

    -- 2. Insert Relationship
    INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind,
        verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, v_new_person_id, p_child_id, v_parent_role, p_relationship_kind,
        p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_rel_id;

    -- Ghi Audit Log cho Person (P18-T07)
    PERFORM _system.write_audit_log(
        p_tree_id,
        'person',
        v_new_person_id,
        'create',
        NULL,
        jsonb_build_object('full_name', trim(p_full_name), 'gender', p_gender, 'living_status', p_living_status),
        ARRAY['full_name', 'gender', 'living_status'],
        'Tạo nhân vật mới trong luồng thêm cha/mẹ',
        'relationship_flow',
        NULL,
        v_user_id
    );

    -- Ghi Audit Log cho Relationship (P18-T09)
    PERFORM _system.write_audit_log(
        p_tree_id,
        'parent_child_relationship',
        v_rel_id,
        'create',
        NULL,
        jsonb_build_object(
            'parent_id', v_new_person_id,
            'child_id', p_child_id,
            'parent_role', v_parent_role,
            'relationship_kind', p_relationship_kind,
            'verification_status', p_verification_status
        ),
        ARRAY['parent_id', 'child_id', 'parent_role', 'relationship_kind', 'verification_status'],
        'Tạo quan hệ cha/mẹ - con',
        'relationship_flow',
        NULL,
        v_user_id
    );

    RETURN jsonb_build_object(
        'status', 'success',
        'personId', v_new_person_id,
        'relationshipId', v_rel_id
    );
END;
$$;

-- 8.2. Soft delete parent-child relationship
CREATE OR REPLACE FUNCTION public.soft_delete_parent_child_relationship(
    p_relationship_id UUID,
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_parent_id UUID;
    v_child_id UUID;
    v_role parent_role_type;
    v_kind relationship_kind_type;
    v_current_version INTEGER;
    v_is_deleted BOOLEAN;
    v_can_write BOOLEAN;
    v_rows_updated INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id, parent_id, child_id, parent_role, relationship_kind, version, (deleted_at IS NOT NULL)
    INTO v_tree_id, v_parent_id, v_child_id, v_role, v_kind, v_current_version, v_is_deleted
    FROM public.parent_child_relationships
    WHERE id = p_relationship_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Relationship not found' USING ERRCODE = 'P0002';
    END IF;

    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Tree write permission required' USING ERRCODE = '42501';
    END IF;

    IF v_is_deleted THEN
        RETURN true;
    END IF;

    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Relationship version conflict: current is %, expected %',
            v_current_version, p_expected_version USING ERRCODE = '40001';
    END IF;

    UPDATE public.parent_child_relationships
    SET
        deleted_at = timezone('utc'::text, now()),
        deleted_by = v_user_id,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_relationship_id
      AND deleted_at IS NULL
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Concurrency conflict when deleting relationship' USING ERRCODE = '40001';
    END IF;

    -- Ghi Audit Log trong cùng transaction (P18-T10)
    PERFORM _system.write_audit_log(
        v_tree_id,
        'parent_child_relationship',
        p_relationship_id,
        'soft_delete',
        jsonb_build_object(
            'parent_id', v_parent_id,
            'child_id', v_child_id,
            'parent_role', v_role,
            'relationship_kind', v_kind,
            'version', v_current_version
        ),
        jsonb_build_object(
            'deleted', true,
            'version', v_current_version + 1
        ),
        ARRAY['deleted_at', 'deleted_by', 'version'],
        'Xóa quan hệ cha/mẹ - con',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 9. TẠO MỚI RECOVERY RPCS CHO QUAN HỆ VÀ HÔN NHÂN (P18-T15, P18-T16)
-- ------------------------------------------------------------------------------

-- 9.1. Khôi phục quan hệ Cha/Mẹ - Con có kiểm tra chu trình và trùng lặp
CREATE OR REPLACE FUNCTION public.restore_parent_child_relationship(
    p_relationship_id UUID,
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_parent_id UUID;
    v_child_id UUID;
    v_parent_role parent_role_type;
    v_rel_kind relationship_kind_type;
    v_current_version INTEGER;
    v_is_deleted BOOLEAN;
    v_can_write BOOLEAN;
    v_tree_deleted BOOLEAN;
    v_parent_active BOOLEAN;
    v_child_active BOOLEAN;
    v_has_cycle BOOLEAN;
    v_duplicate_exists BOOLEAN;
    v_bio_parent_count INT;
    v_rows_updated INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore a relationship'
            USING ERRCODE = '42501';
    END IF;

    -- 1. Tra cứu thông tin quan hệ
    SELECT tree_id, parent_id, child_id, parent_role, relationship_kind, version, (deleted_at IS NOT NULL)
    INTO v_tree_id, v_parent_id, v_child_id, v_parent_role, v_rel_kind, v_current_version, v_is_deleted
    FROM public.parent_child_relationships
    WHERE id = p_relationship_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Relationship not found'
            USING ERRCODE = 'P0002';
    END IF;

    -- 2. Kiểm tra quyền ghi
    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can restore this relationship'
            USING ERRCODE = '42501';
    END IF;

    -- 3. Idempotent: nếu quan hệ đang active thì trả về true
    IF NOT v_is_deleted THEN
        RETURN true;
    END IF;

    -- 4. Kiểm tra Tree có bị xóa không
    SELECT (status = 'deleted' OR deleted_at IS NOT NULL)
    INTO v_tree_deleted
    FROM public.family_trees
    WHERE id = v_tree_id;

    IF v_tree_deleted THEN
        RAISE EXCEPTION 'Cannot restore relationship while family tree is deleted'
            USING ERRCODE = '22023';
    END IF;

    -- 5. Kiểm tra Parent và Child có active không (Blocking Dependency Conflict)
    SELECT (deleted_at IS NULL) INTO v_parent_active
    FROM public.persons WHERE id = v_parent_id AND tree_id = v_tree_id;

    SELECT (deleted_at IS NULL) INTO v_child_active
    FROM public.persons WHERE id = v_child_id AND tree_id = v_tree_id;

    IF v_parent_active IS NOT TRUE OR v_child_active IS NOT TRUE THEN
        RAISE EXCEPTION 'DEPENDENCY_DELETED: Cannot restore relationship because parent or child is deleted. Please restore the person first.'
            USING ERRCODE = '23503';
    END IF;

    -- 6. Kiểm tra Self-link
    IF v_parent_id = v_child_id THEN
        RAISE EXCEPTION 'SELF_LINK_CONFLICT: Parent and child cannot be the same person'
            USING ERRCODE = '22023';
    END IF;

    -- 7. Kiểm tra trùng lặp quan hệ active
    SELECT EXISTS (
        SELECT 1 FROM public.parent_child_relationships
        WHERE tree_id = v_tree_id
          AND parent_id = v_parent_id
          AND child_id = v_child_id
          AND deleted_at IS NULL
          AND id <> p_relationship_id
    ) INTO v_duplicate_exists;

    IF v_duplicate_exists THEN
        RAISE EXCEPTION 'DUPLICATE_RELATIONSHIP: An active parent-child relationship already exists between these two people'
            USING ERRCODE = '23505';
    END IF;

    -- 8. Kiểm tra Chu trình (Cycle Conflict)
    v_has_cycle := _system.check_parent_child_cycle(v_tree_id, v_parent_id, v_child_id);
    IF v_has_cycle THEN
        RAISE EXCEPTION 'CYCLE_CONFLICT: Restoring this relationship would create an ancestor-descendant cycle'
            USING ERRCODE = '22023';
    END IF;

    -- 9. Kiểm tra giới hạn cha/mẹ sinh học
    IF v_rel_kind = 'biological' AND v_parent_role IN ('father', 'mother') THEN
        SELECT COUNT(*) INTO v_bio_parent_count
        FROM public.parent_child_relationships
        WHERE tree_id = v_tree_id
          AND child_id = v_child_id
          AND parent_role = v_parent_role
          AND relationship_kind = 'biological'
          AND deleted_at IS NULL
          AND id <> p_relationship_id;

        IF v_bio_parent_count >= 1 THEN
            RAISE EXCEPTION 'BIOLOGICAL_PARENT_EXISTS: Child already has an active biological %', v_parent_role
                USING ERRCODE = '23505';
        END IF;
    END IF;

    -- 10. Kiểm tra Optimistic Concurrency
    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Relationship version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

    -- 11. Cập nhật khôi phục
    UPDATE public.parent_child_relationships
    SET
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_relationship_id
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Failed to restore relationship due to concurrency conflict'
            USING ERRCODE = '40001';
    END IF;

    -- 12. Ghi Audit Log trong cùng transaction (P18-T15)
    PERFORM _system.write_audit_log(
        v_tree_id,
        'parent_child_relationship',
        p_relationship_id,
        'restore',
        jsonb_build_object(
            'parent_id', v_parent_id,
            'child_id', v_child_id,
            'parent_role', v_parent_role,
            'relationship_kind', v_rel_kind,
            'deleted', true,
            'version', v_current_version
        ),
        jsonb_build_object(
            'parent_id', v_parent_id,
            'child_id', v_child_id,
            'parent_role', v_parent_role,
            'relationship_kind', v_rel_kind,
            'deleted', false,
            'version', v_current_version + 1
        ),
        ARRAY['deleted_at', 'deleted_by', 'version'],
        'Khôi phục quan hệ cha/mẹ - con từ thùng rác',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.restore_parent_child_relationship(UUID, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_parent_child_relationship(UUID, INTEGER) TO authenticated, service_role;

-- 9.2. Khôi phục Hôn nhân (Union)
CREATE OR REPLACE FUNCTION public.restore_union(
    p_union_id UUID,
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_union_status union_status_type;
    v_current_version INTEGER;
    v_is_deleted BOOLEAN;
    v_can_write BOOLEAN;
    v_tree_deleted BOOLEAN;
    v_inactive_members_count INT;
    v_rows_updated INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore union'
            USING ERRCODE = '42501';
    END IF;

    SELECT tree_id, status, version, (deleted_at IS NOT NULL)
    INTO v_tree_id, v_union_status, v_current_version, v_is_deleted
    FROM public.unions
    WHERE id = p_union_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Union not found'
            USING ERRCODE = 'P0002';
    END IF;

    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can restore this union'
            USING ERRCODE = '42501';
    END IF;

    IF NOT v_is_deleted THEN
        RETURN true;
    END IF;

    -- Kiểm tra Tree có bị xóa không
    SELECT (status = 'deleted' OR deleted_at IS NOT NULL)
    INTO v_tree_deleted
    FROM public.family_trees
    WHERE id = v_tree_id;

    IF v_tree_deleted THEN
        RAISE EXCEPTION 'Cannot restore union while family tree is deleted'
            USING ERRCODE = '22023';
    END IF;

    -- Kiểm tra các thành viên trong hôn nhân có ai bị xóa không
    SELECT COUNT(*) INTO v_inactive_members_count
    FROM public.union_members um
    JOIN public.persons p ON um.person_id = p.id
    WHERE um.union_id = p_union_id
      AND (p.deleted_at IS NOT NULL OR um.deleted_at IS NOT NULL);

    IF v_inactive_members_count > 0 THEN
        RAISE EXCEPTION 'DEPENDENCY_DELETED: Cannot restore union because one or more spouse persons are deleted'
            USING ERRCODE = '23503';
    END IF;

    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Union version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

    UPDATE public.unions
    SET
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_union_id
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Failed to restore union due to concurrency conflict'
            USING ERRCODE = '40001';
    END IF;

    -- Ghi Audit Log trong cùng transaction
    PERFORM _system.write_audit_log(
        v_tree_id,
        'union',
        p_union_id,
        'restore',
        jsonb_build_object('status', v_union_status, 'deleted', true, 'version', v_current_version),
        jsonb_build_object('status', v_union_status, 'deleted', false, 'version', v_current_version + 1),
        ARRAY['deleted_at', 'deleted_by', 'version'],
        'Khôi phục quan hệ hôn nhân từ thùng rác',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.restore_union(UUID, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_union(UUID, INTEGER) TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 10. RLS POLICIES TRUY CẬP THÙNG RÁC CHO QUAN HỆ (TRASH ACCESS)
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS relationships_select_deleted_writers ON public.parent_child_relationships;
CREATE POLICY relationships_select_deleted_writers ON public.parent_child_relationships
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NOT NULL
        AND _system.can_write_tree(tree_id, auth.uid())
    );

DROP POLICY IF EXISTS unions_select_deleted_writers ON public.unions;
CREATE POLICY unions_select_deleted_writers ON public.unions
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NOT NULL
        AND _system.can_write_tree(tree_id, auth.uid())
    );
