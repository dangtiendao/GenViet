-- ==============================================================================
-- Migration: 20260830110000_p13_add_relationship_transactions.sql
-- Phase: P13 (Quản lý quan hệ phả hệ - Relationship Management)
-- Author: Principal Database Architect & PostgreSQL Graph Engineer
-- Description:
--   1. Cycle detection helper: _system.check_parent_child_cycle
--   2. Atomic Parent-Child RPCs: create_person_with_parent_relationship, link_existing_parent,
--      create_person_with_child_relationship, link_existing_child, replace_parent_relationship,
--      soft_delete_parent_child_relationship
--   3. Atomic Union RPCs: create_union_with_new_person, create_union_with_existing_person,
--      end_union, soft_delete_union
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. RECURSIVE CYCLE DETECTION HELPER
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.check_parent_child_cycle(
    p_tree_id UUID,
    p_parent_id UUID,
    p_child_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_has_cycle boolean;
BEGIN
    -- 1. Self-link: cha/mẹ trùng với con -> Chu trình hiển nhiên
    IF p_parent_id = p_child_id THEN
        RETURN true;
    END IF;

    -- 2. Recursive CTE: Tìm tất cả các hậu duệ (descendants) của p_child_id
    -- Nếu p_parent_id nằm trong tập hậu duệ của p_child_id => Tạo quan hệ sẽ tạo chu trình!
    WITH RECURSIVE descendants AS (
        -- Anchor: các con trực tiếp của p_child_id
        SELECT child_id AS descendant_id, 1 AS depth
        FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND parent_id = p_child_id
          AND deleted_at IS NULL

        UNION

        -- Recursive: các con của hậu duệ
        SELECT r.child_id, d.depth + 1
        FROM public.parent_child_relationships r
        JOIN descendants d ON r.parent_id = d.descendant_id
        WHERE r.tree_id = p_tree_id
          AND r.deleted_at IS NULL
          AND d.depth < 100 -- Guard chống lặp vô hạn
    )
    SELECT EXISTS (
        SELECT 1 FROM descendants WHERE descendant_id = p_parent_id
    ) INTO v_has_cycle;

    RETURN COALESCE(v_has_cycle, false);
END;
$$;

COMMENT ON FUNCTION _system.check_parent_child_cycle(UUID, UUID, UUID) IS
    'Returns true if adding parent_id -> child_id edge in tree_id would create an ancestor-descendant cycle';

-- ------------------------------------------------------------------------------
-- 2. PARENT FLOW RPCs
-- ------------------------------------------------------------------------------

-- 2.1. Tạo Person mới và tạo quan hệ cha/mẹ (Atomic)
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
    v_child_tree_id UUID;
    v_new_person_id UUID;
    v_rel_id UUID;
    v_existing_verified_count INTEGER;
BEGIN
    -- 1. Xác thực actor
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    -- 2. Kiểm tra quyền ghi trên cây
    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can add relationships' USING ERRCODE = '42501';
    END IF;

    -- 3. Kiểm tra child thuộc đúng tree và đang active
    SELECT tree_id INTO v_child_tree_id
    FROM public.persons
    WHERE id = p_child_id AND tree_id = p_tree_id AND deleted_at IS NULL;

    IF v_child_tree_id IS NULL THEN
        RAISE EXCEPTION 'Child person not found in this tree' USING ERRCODE = 'P0002';
    END IF;

    -- 4. Kiểm tra cảnh báo cha/mẹ ruột đã xác minh
    IF p_relationship_kind = 'biological' AND p_verification_status = 'verified' AND p_parent_role IN ('father', 'mother') THEN
        SELECT count(*)::int INTO v_existing_verified_count
        FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND child_id = p_child_id
          AND parent_role = p_parent_role
          AND relationship_kind = 'biological'
          AND verification_status = 'verified'
          AND deleted_at IS NULL;

        IF v_existing_verified_count > 0 AND NOT p_confirm_warnings THEN
            RAISE EXCEPTION 'WARNING_EXISTING_VERIFIED_PARENT: A verified biological parent already exists for this child'
                USING ERRCODE = '01000';
        END IF;
    END IF;

    -- 5. Tạo Person mới
    INSERT INTO public.persons (
        tree_id, full_name, normalized_name, gender, living_status,
        birth_date, birth_year, birth_date_precision, birth_is_estimated,
        death_date, death_year, death_date_precision, death_is_estimated,
        birth_place_text, death_place_text, hometown_text, burial_place_text,
        occupation_text, biography, verification_status,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_full_name, _system.normalize_person_name(p_full_name), p_gender, p_living_status,
        p_birth_date, p_birth_year, p_birth_date_precision, p_birth_is_estimated,
        p_death_date, p_death_year, p_death_date_precision, p_death_is_estimated,
        p_birth_place_text, p_death_place_text, p_hometown_text, p_burial_place_text,
        p_occupation_text, p_biography, p_verification_status,
        v_user_id, v_user_id
    ) RETURNING id INTO v_new_person_id;

    -- 6. Kiểm tra chu trình (Cycle Detection)
    IF _system.check_parent_child_cycle(p_tree_id, v_new_person_id, p_child_id) THEN
        RAISE EXCEPTION 'RELATIONSHIP_CYCLE: Cannot create ancestor cycle' USING ERRCODE = '40002';
    END IF;

    -- 7. Tạo Parent-Child relationship
    INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind,
        verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, v_new_person_id, p_child_id, p_parent_role, p_relationship_kind,
        p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_rel_id;

    RETURN jsonb_build_object(
        'person_id', v_new_person_id,
        'relationship_id', v_rel_id
    );
END;
$$;

-- 2.2. Liên kết cha/mẹ có sẵn
CREATE OR REPLACE FUNCTION public.link_existing_parent(
    p_tree_id UUID,
    p_parent_id UUID,
    p_child_id UUID,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_parent_tree_id UUID;
    v_child_tree_id UUID;
    v_rel_id UUID;
    v_existing_verified_count INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can add relationships' USING ERRCODE = '42501';
    END IF;

    -- Kiểm tra self-link
    IF p_parent_id = p_child_id THEN
        RAISE EXCEPTION 'RELATIONSHIP_SELF_LINK: A person cannot be their own parent' USING ERRCODE = '23514';
    END IF;

    -- Kiểm tra cả 2 người thuộc cùng tree và active
    SELECT tree_id INTO v_parent_tree_id FROM public.persons WHERE id = p_parent_id AND tree_id = p_tree_id AND deleted_at IS NULL;
    SELECT tree_id INTO v_child_tree_id FROM public.persons WHERE id = p_child_id AND tree_id = p_tree_id AND deleted_at IS NULL;

    IF v_parent_tree_id IS NULL OR v_child_tree_id IS NULL THEN
        RAISE EXCEPTION 'RELATIONSHIP_TREE_MISMATCH: Both parent and child must belong to the specified tree' USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra cycle
    IF _system.check_parent_child_cycle(p_tree_id, p_parent_id, p_child_id) THEN
        RAISE EXCEPTION 'RELATIONSHIP_CYCLE: Cannot create ancestor cycle' USING ERRCODE = '40002';
    END IF;

    -- Kiểm tra exact duplicate
    IF EXISTS (
        SELECT 1 FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND parent_id = p_parent_id
          AND child_id = p_child_id
          AND parent_role = p_parent_role
          AND relationship_kind = p_relationship_kind
          AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'RELATIONSHIP_DUPLICATE: This relationship already exists' USING ERRCODE = '23505';
    END IF;

    -- Kiểm tra verified biological parent warning
    IF p_relationship_kind = 'biological' AND p_verification_status = 'verified' AND p_parent_role IN ('father', 'mother') THEN
        SELECT count(*)::int INTO v_existing_verified_count
        FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND child_id = p_child_id
          AND parent_role = p_parent_role
          AND relationship_kind = 'biological'
          AND verification_status = 'verified'
          AND deleted_at IS NULL;

        IF v_existing_verified_count > 0 AND NOT p_confirm_warnings THEN
            RAISE EXCEPTION 'WARNING_EXISTING_VERIFIED_PARENT: A verified biological parent already exists for this child'
                USING ERRCODE = '01000';
        END IF;
    END IF;

    INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind,
        verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, p_parent_id, p_child_id, p_parent_role, p_relationship_kind,
        p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_rel_id;

    RETURN v_rel_id;
END;
$$;

-- 2.3. Tạo Person con mới (và tùy chọn liên kết với cha/mẹ thứ hai) (Atomic)
CREATE OR REPLACE FUNCTION public.create_person_with_child_relationship(
    p_tree_id UUID,
    p_parent_id UUID,
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
    p_other_parent_id UUID DEFAULT NULL,
    p_other_parent_role parent_role_type DEFAULT 'unspecified',
    p_other_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_parent_tree_id UUID;
    v_other_parent_tree_id UUID;
    v_new_child_id UUID;
    v_rel_id_1 UUID;
    v_rel_id_2 UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can add relationships' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_parent_tree_id FROM public.persons WHERE id = p_parent_id AND tree_id = p_tree_id AND deleted_at IS NULL;
    IF v_parent_tree_id IS NULL THEN
        RAISE EXCEPTION 'Parent person not found in this tree' USING ERRCODE = 'P0002';
    END IF;

    IF p_other_parent_id IS NOT NULL THEN
        IF p_other_parent_id = p_parent_id THEN
            RAISE EXCEPTION 'RELATIONSHIP_SELF_LINK: Both parents cannot be the same person' USING ERRCODE = '23514';
        END IF;

        SELECT tree_id INTO v_other_parent_tree_id FROM public.persons WHERE id = p_other_parent_id AND tree_id = p_tree_id AND deleted_at IS NULL;
        IF v_other_parent_tree_id IS NULL THEN
            RAISE EXCEPTION 'Other parent person not found in this tree' USING ERRCODE = 'P0002';
        END IF;
    END IF;

    -- Tạo Person con mới
    INSERT INTO public.persons (
        tree_id, full_name, normalized_name, gender, living_status,
        birth_date, birth_year, birth_date_precision, birth_is_estimated,
        death_date, death_year, death_date_precision, death_is_estimated,
        birth_place_text, death_place_text, hometown_text, burial_place_text,
        occupation_text, biography, verification_status,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_full_name, _system.normalize_person_name(p_full_name), p_gender, p_living_status,
        p_birth_date, p_birth_year, p_birth_date_precision, p_birth_is_estimated,
        p_death_date, p_death_year, p_death_date_precision, p_death_is_estimated,
        p_birth_place_text, p_death_place_text, p_hometown_text, p_burial_place_text,
        p_occupation_text, p_biography, p_verification_status,
        v_user_id, v_user_id
    ) RETURNING id INTO v_new_child_id;

    -- Cycle check
    IF _system.check_parent_child_cycle(p_tree_id, p_parent_id, v_new_child_id) THEN
        RAISE EXCEPTION 'RELATIONSHIP_CYCLE: Cannot create ancestor cycle' USING ERRCODE = '40002';
    END IF;

    -- Insert primary parent relationship
    INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind,
        verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, p_parent_id, v_new_child_id, p_parent_role, p_relationship_kind,
        p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_rel_id_1;

    -- Insert secondary parent relationship if provided
    IF p_other_parent_id IS NOT NULL THEN
        IF _system.check_parent_child_cycle(p_tree_id, p_other_parent_id, v_new_child_id) THEN
            RAISE EXCEPTION 'RELATIONSHIP_CYCLE: Cannot create ancestor cycle for other parent' USING ERRCODE = '40002';
        END IF;

        INSERT INTO public.parent_child_relationships (
            tree_id, parent_id, child_id, parent_role, relationship_kind,
            verification_status, created_by, updated_by
        ) VALUES (
            p_tree_id, p_other_parent_id, v_new_child_id, p_other_parent_role, p_other_relationship_kind,
            p_verification_status, v_user_id, v_user_id
        ) RETURNING id INTO v_rel_id_2;
    END IF;

    RETURN jsonb_build_object(
        'person_id', v_new_child_id,
        'relationship_id', v_rel_id_1,
        'other_relationship_id', v_rel_id_2
    );
END;
$$;

-- 2.4. Liên kết con có sẵn
CREATE OR REPLACE FUNCTION public.link_existing_child(
    p_tree_id UUID,
    p_parent_id UUID,
    p_child_id UUID,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
BEGIN
    -- Hàm này tương đương link_existing_parent với đúng thứ tự parent_id -> child_id
    RETURN public.link_existing_parent(
        p_tree_id,
        p_parent_id,
        p_child_id,
        p_parent_role,
        p_relationship_kind,
        p_verification_status,
        p_confirm_warnings
    );
END;
$$;

-- 2.5. Thay thế quan hệ cha/mẹ (Atomic Replace)
CREATE OR REPLACE FUNCTION public.replace_parent_relationship(
    p_tree_id UUID,
    p_old_relationship_id UUID,
    p_old_expected_version INTEGER,
    p_new_parent_id UUID,
    p_child_id UUID,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_rows_deleted INTEGER;
    v_new_rel_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can replace relationships' USING ERRCODE = '42501';
    END IF;

    -- 1. Xóa mềm quan hệ cũ với version check
    UPDATE public.parent_child_relationships
    SET
        deleted_at = timezone('utc'::text, now()),
        deleted_by = v_user_id,
        version = version + 1,
        updated_by = v_user_id
    WHERE id = p_old_relationship_id
      AND tree_id = p_tree_id
      AND version = p_old_expected_version
      AND deleted_at IS NULL;

    GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
    IF v_rows_deleted = 0 THEN
        RAISE EXCEPTION 'RELATIONSHIP_VERSION_CONFLICT: Old relationship version conflict or not found'
            USING ERRCODE = '40001';
    END IF;

    -- 2. Tạo quan hệ mới (đã bao gồm same-tree, self-link, cycle và duplicate checks)
    v_new_rel_id := public.link_existing_parent(
        p_tree_id,
        p_new_parent_id,
        p_child_id,
        p_parent_role,
        p_relationship_kind,
        p_verification_status,
        p_confirm_warnings
    );

    RETURN v_new_rel_id;
END;
$$;

-- 2.6. Xóa mềm quan hệ cha-con
CREATE OR REPLACE FUNCTION public.soft_delete_parent_child_relationship(
    p_relationship_id UUID,
    p_expected_version INTEGER
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_rows INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_tree_id
    FROM public.parent_child_relationships
    WHERE id = p_relationship_id AND deleted_at IS NULL;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Relationship not found' USING ERRCODE = 'P0002';
    END IF;

    IF NOT _system.can_write_tree(v_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can delete relationships' USING ERRCODE = '42501';
    END IF;

    UPDATE public.parent_child_relationships
    SET
        deleted_at = timezone('utc'::text, now()),
        deleted_by = v_user_id,
        version = version + 1,
        updated_by = v_user_id
    WHERE id = p_relationship_id
      AND version = p_expected_version
      AND deleted_at IS NULL;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows = 0 THEN
        RAISE EXCEPTION 'RELATIONSHIP_VERSION_CONFLICT: Relationship version conflict' USING ERRCODE = '40001';
    END IF;

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. UNION & SPOUSE FLOW RPCs
-- ------------------------------------------------------------------------------

-- 3.1. Tạo Person phối ngẫu mới + Union + 2 Union Members (Atomic)
CREATE OR REPLACE FUNCTION public.create_union_with_new_person(
    p_tree_id UUID,
    p_subject_person_id UUID,
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
    p_hometown_text TEXT DEFAULT NULL,
    p_occupation_text TEXT DEFAULT NULL,
    p_biography TEXT DEFAULT NULL,
    p_subject_member_role union_member_role_type DEFAULT 'spouse',
    p_partner_member_role union_member_role_type DEFAULT 'spouse',
    p_union_status union_status_type DEFAULT 'active',
    p_start_date DATE DEFAULT NULL,
    p_start_year SMALLINT DEFAULT NULL,
    p_start_date_precision date_precision_type DEFAULT 'unknown',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_subject_tree_id UUID;
    v_new_partner_id UUID;
    v_union_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can create unions' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_subject_tree_id FROM public.persons WHERE id = p_subject_person_id AND tree_id = p_tree_id AND deleted_at IS NULL;
    IF v_subject_tree_id IS NULL THEN
        RAISE EXCEPTION 'Subject person not found in this tree' USING ERRCODE = 'P0002';
    END IF;

    -- 1. Tạo Person mới cho phối ngẫu
    INSERT INTO public.persons (
        tree_id, full_name, normalized_name, gender, living_status,
        birth_date, birth_year, birth_date_precision, birth_is_estimated,
        death_date, death_year, death_date_precision, death_is_estimated,
        hometown_text, occupation_text, biography,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_full_name, _system.normalize_person_name(p_full_name), p_gender, p_living_status,
        p_birth_date, p_birth_year, p_birth_date_precision, p_birth_is_estimated,
        p_death_date, p_death_year, p_death_date_precision, p_death_is_estimated,
        p_hometown_text, p_occupation_text, p_biography,
        v_user_id, v_user_id
    ) RETURNING id INTO v_new_partner_id;

    -- 2. Tạo Union
    INSERT INTO public.unions (
        tree_id, status, start_date, start_year, start_date_precision,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_union_status, p_start_date, p_start_year, p_start_date_precision,
        v_user_id, v_user_id
    ) RETURNING id INTO v_union_id;

    -- 3. Tạo 2 Union Members
    INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by)
    VALUES (p_tree_id, v_union_id, p_subject_person_id, p_subject_member_role, v_user_id);

    INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by)
    VALUES (p_tree_id, v_union_id, v_new_partner_id, p_partner_member_role, v_user_id);

    RETURN jsonb_build_object(
        'person_id', v_new_partner_id,
        'union_id', v_union_id
    );
END;
$$;

-- 3.2. Tạo Union giữa 2 Person có sẵn (Atomic)
CREATE OR REPLACE FUNCTION public.create_union_with_existing_person(
    p_tree_id UUID,
    p_person_1_id UUID,
    p_person_2_id UUID,
    p_member_1_role union_member_role_type DEFAULT 'spouse',
    p_member_2_role union_member_role_type DEFAULT 'spouse',
    p_union_status union_status_type DEFAULT 'active',
    p_start_date DATE DEFAULT NULL,
    p_start_year SMALLINT DEFAULT NULL,
    p_start_date_precision date_precision_type DEFAULT 'unknown',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_1 UUID;
    v_tree_2 UUID;
    v_union_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can create unions' USING ERRCODE = '42501';
    END IF;

    -- Self-spouse check
    IF p_person_1_id = p_person_2_id THEN
        RAISE EXCEPTION 'UNION_SELF_LINK: A person cannot marry themselves' USING ERRCODE = '23514';
    END IF;

    SELECT tree_id INTO v_tree_1 FROM public.persons WHERE id = p_person_1_id AND tree_id = p_tree_id AND deleted_at IS NULL;
    SELECT tree_id INTO v_tree_2 FROM public.persons WHERE id = p_person_2_id AND tree_id = p_tree_id AND deleted_at IS NULL;

    IF v_tree_1 IS NULL OR v_tree_2 IS NULL THEN
        RAISE EXCEPTION 'RELATIONSHIP_TREE_MISMATCH: Both persons must belong to the tree' USING ERRCODE = 'P0002';
    END IF;

    -- 1. Tạo Union
    INSERT INTO public.unions (
        tree_id, status, start_date, start_year, start_date_precision,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_union_status, p_start_date, p_start_year, p_start_date_precision,
        v_user_id, v_user_id
    ) RETURNING id INTO v_union_id;

    -- 2. Tạo 2 Union Members
    INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by)
    VALUES (p_tree_id, v_union_id, p_person_1_id, p_member_1_role, v_user_id);

    INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by)
    VALUES (p_tree_id, v_union_id, p_person_2_id, p_member_2_role, v_user_id);

    RETURN v_union_id;
END;
$$;

-- 3.3. Kết thúc quan hệ hôn nhân (End Union)
CREATE OR REPLACE FUNCTION public.end_union(
    p_union_id UUID,
    p_expected_version INTEGER,
    p_new_status union_status_type,
    p_end_date DATE DEFAULT NULL,
    p_end_year SMALLINT DEFAULT NULL,
    p_end_date_precision date_precision_type DEFAULT 'unknown'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_rows INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_tree_id FROM public.unions WHERE id = p_union_id AND deleted_at IS NULL;
    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Union not found' USING ERRCODE = 'P0002';
    END IF;

    IF NOT _system.can_write_tree(v_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can update unions' USING ERRCODE = '42501';
    END IF;

    UPDATE public.unions
    SET
        status = p_new_status,
        end_date = p_end_date,
        end_year = p_end_year,
        end_date_precision = p_end_date_precision,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_union_id
      AND version = p_expected_version
      AND deleted_at IS NULL;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows = 0 THEN
        RAISE EXCEPTION 'UNION_VERSION_CONFLICT: Union version conflict' USING ERRCODE = '40001';
    END IF;

    RETURN true;
END;
$$;

-- 3.4. Xóa mềm Union
CREATE OR REPLACE FUNCTION public.soft_delete_union(
    p_union_id UUID,
    p_expected_version INTEGER
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_rows INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_tree_id FROM public.unions WHERE id = p_union_id AND deleted_at IS NULL;
    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Union not found' USING ERRCODE = 'P0002';
    END IF;

    IF NOT _system.can_write_tree(v_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can delete unions' USING ERRCODE = '42501';
    END IF;

    -- Xóa mềm Union Members trước
    UPDATE public.union_members
    SET deleted_at = timezone('utc'::text, now()), deleted_by = v_user_id
    WHERE union_id = p_union_id AND deleted_at IS NULL;

    -- Xóa mềm Union
    UPDATE public.unions
    SET
        deleted_at = timezone('utc'::text, now()),
        deleted_by = v_user_id,
        version = version + 1,
        updated_by = v_user_id
    WHERE id = p_union_id
      AND version = p_expected_version
      AND deleted_at IS NULL;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows = 0 THEN
        RAISE EXCEPTION 'UNION_VERSION_CONFLICT: Union version conflict' USING ERRCODE = '40001';
    END IF;

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. FUNCTION PERMISSIONS & GRANTS
-- ------------------------------------------------------------------------------

REVOKE ALL ON FUNCTION public.create_person_with_parent_relationship FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_person_with_parent_relationship TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.link_existing_parent FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.link_existing_parent TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_person_with_child_relationship FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_person_with_child_relationship TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.link_existing_child FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.link_existing_child TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.replace_parent_relationship FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.replace_parent_relationship TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.soft_delete_parent_child_relationship FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.soft_delete_parent_child_relationship TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_union_with_new_person FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_union_with_new_person TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_union_with_existing_person FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_union_with_existing_person TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.end_union FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.end_union TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.soft_delete_union FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.soft_delete_union TO authenticated, service_role;
