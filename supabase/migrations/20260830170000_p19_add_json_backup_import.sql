-- ==============================================================================
-- MIGRATION: Phase P19 - Versioned JSON Backup Export & Atomic Import RPC
-- ==============================================================================
-- Description:
--   1. Function public.export_family_tree_backup: Consistent snapshot projection for backup export.
--   2. Function public.import_family_tree_backup: Atomic transactional import for GenViet backup JSON.
-- ==============================================================================

-- 1. EXPORT FUNCTION
CREATE OR REPLACE FUNCTION public.export_family_tree_backup(
    p_tree_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_is_member BOOLEAN;
    v_tree_data JSONB;
    v_persons_data JSONB;
    v_rels_data JSONB;
    v_unions_data JSONB;
    v_members_data JSONB;
    v_media_data JSONB;
    v_result JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHENTICATED' USING ERRCODE = '42501';
    END IF;

    -- Kiểm tra quyền: Phải là thành viên có quyền (Owner/Admin/Editor) của cây gia phả
    SELECT EXISTS (
        SELECT 1 FROM public.tree_memberships
        WHERE tree_id = p_tree_id
          AND user_id = v_user_id
          AND status = 'active'
          AND role IN ('owner', 'admin', 'editor')
    ) INTO v_is_member;

    IF NOT v_is_member THEN
        RAISE EXCEPTION 'BACKUP_EXPORT_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    -- 1. Snapshot Family Tree
    SELECT jsonb_build_object(
        'sourceId', id,
        'name', name,
        'description', description,
        'privacyLevel', privacy_level,
        'generationAnchorPersonId', generation_anchor_person_id,
        'defaultPersonId', default_person_id
    ) INTO v_tree_data
    FROM public.family_trees
    WHERE id = p_tree_id AND deleted_at IS NULL;

    IF v_tree_data IS NULL THEN
        RAISE EXCEPTION 'BACKUP_TREE_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    -- 2. Snapshot Persons
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'fullName', full_name,
            'gender', gender,
            'livingStatus', living_status,
            'birthDate', birth_date,
            'birthYear', birth_year,
            'birthDatePrecision', birth_date_precision,
            'birthIsEstimated', birth_is_estimated,
            'deathDate', death_date,
            'deathYear', death_year,
            'deathDatePrecision', death_date_precision,
            'deathIsEstimated', death_is_estimated,
            'birthPlaceText', birth_place_text,
            'deathPlaceText', death_place_text,
            'hometownText', hometown_text,
            'burialPlaceText', burial_place_text,
            'occupationText', occupation_text,
            'biography', biography,
            'verificationStatus', verification_status,
            'avatarPath', NULL -- Không export direct avatar path
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_persons_data
    FROM public.persons
    WHERE tree_id = p_tree_id AND deleted_at IS NULL;

    -- 3. Snapshot Parent-Child Relationships
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'parentId', parent_id,
            'childId', child_id,
            'parentRole', parent_role,
            'relationshipKind', relationship_kind,
            'verificationStatus', verification_status
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_rels_data
    FROM public.parent_child_relationships
    WHERE tree_id = p_tree_id AND deleted_at IS NULL;

    -- 4. Snapshot Unions
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'status', status,
            'startDate', start_date,
            'startYear', start_year,
            'startDatePrecision', start_date_precision,
            'startIsEstimated', start_is_estimated,
            'endDate', end_date,
            'endYear', end_year,
            'endDatePrecision', end_date_precision,
            'endIsEstimated', end_is_estimated,
            'notes', notes,
            'verificationStatus', verification_status
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_unions_data
    FROM public.unions
    WHERE tree_id = p_tree_id AND deleted_at IS NULL;

    -- 5. Snapshot Union Members
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'unionId', union_id,
            'personId', person_id,
            'memberRole', member_role
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_members_data
    FROM public.union_members
    WHERE tree_id = p_tree_id AND deleted_at IS NULL;

    -- 6. Snapshot Media Metadata (Metadata-only, no binary)
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'personId', person_id,
            'mimeType', mime_type,
            'fileSizeBytes', file_size_bytes,
            'binaryIncluded', false,
            'availability', 'metadata_only'
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_media_data
    FROM public.person_avatars
    WHERE tree_id = p_tree_id AND deleted_at IS NULL AND status = 'active';

    -- 7. Compose Root Document
    v_result := jsonb_build_object(
        'schemaVersion', 1,
        'exportedAt', timezone('utc'::text, now()),
        'generator', jsonb_build_object(
            'name', 'GenViet',
            'version', '0.1.0'
        ),
        'tree', v_tree_data,
        'persons', v_persons_data,
        'parentChildRelationships', v_rels_data,
        'unions', v_unions_data,
        'unionMembers', v_members_data,
        'mediaMetadata', v_media_data,
        'manifest', jsonb_build_object(
            'personCount', jsonb_array_length(v_persons_data),
            'relationshipCount', jsonb_array_length(v_rels_data),
            'unionCount', jsonb_array_length(v_unions_data),
            'mediaCount', jsonb_array_length(v_media_data)
        )
    );

    RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.export_family_tree_backup(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.export_family_tree_backup(UUID) TO authenticated, service_role;


-- 2. ATOMIC TRANSACTIONAL IMPORT FUNCTION
CREATE OR REPLACE FUNCTION public.import_family_tree_backup(
    p_backup_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_new_tree_id UUID;
    v_tree_obj JSONB;
    v_persons_arr JSONB;
    v_rels_arr JSONB;
    v_unions_arr JSONB;
    v_members_arr JSONB;
    v_item JSONB;
    v_person_count INT := 0;
    v_rel_count INT := 0;
    v_union_count INT := 0;
    v_anchor_id UUID;
    v_default_person_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHENTICATED' USING ERRCODE = '42501';
    END IF;

    -- Validate input structure
    v_tree_obj := p_backup_data->'tree';
    IF v_tree_obj IS NULL OR (v_tree_obj->>'id') IS NULL THEN
        RAISE EXCEPTION 'BACKUP_SCHEMA_INVALID: Missing tree object' USING ERRCODE = '22023';
    END IF;

    v_new_tree_id := (v_tree_obj->>'id')::uuid;
    v_persons_arr := COALESCE(p_backup_data->'persons', '[]'::jsonb);
    v_rels_arr := COALESCE(p_backup_data->'parentChildRelationships', '[]'::jsonb);
    v_unions_arr := COALESCE(p_backup_data->'unions', '[]'::jsonb);
    v_members_arr := COALESCE(p_backup_data->'unionMembers', '[]'::jsonb);

    -- 1. Insert Family Tree (Always Private, Current User is Owner)
    INSERT INTO public.family_trees (
        id,
        name,
        description,
        status,
        privacy_level,
        created_by,
        updated_by
    ) VALUES (
        v_new_tree_id,
        COALESCE(v_tree_obj->>'name', 'Cây gia phả mới'),
        v_tree_obj->>'description',
        'active',
        'private', -- Luôn luôn private khi import
        v_user_id,
        v_user_id
    );

    -- 2. Insert Owner Membership
    INSERT INTO public.tree_memberships (
        tree_id,
        user_id,
        role,
        status,
        created_by,
        updated_by
    ) VALUES (
        v_new_tree_id,
        v_user_id,
        'owner',
        'active',
        v_user_id,
        v_user_id
    );

    -- 3. Insert Persons
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_persons_arr)
    LOOP
        INSERT INTO public.persons (
            id,
            tree_id,
            full_name,
            normalized_name,
            gender,
            living_status,
            birth_date,
            birth_year,
            birth_date_precision,
            birth_is_estimated,
            death_date,
            death_year,
            death_date_precision,
            death_is_estimated,
            birth_place_text,
            death_place_text,
            hometown_text,
            burial_place_text,
            occupation_text,
            biography,
            verification_status,
            avatar_path,
            created_by,
            updated_by
        ) VALUES (
            (v_item->>'id')::uuid,
            v_new_tree_id,
            v_item->>'fullName',
            _system.normalize_person_name(v_item->>'fullName'),
            (v_item->>'gender')::public.gender_type,
            (v_item->>'livingStatus')::public.living_status_type,
            NULLIF(v_item->>'birthDate', '')::date,
            (v_item->>'birthYear')::int,
            COALESCE((v_item->>'birthDatePrecision')::public.date_precision_type, 'unknown'),
            COALESCE((v_item->>'birthIsEstimated')::boolean, false),
            NULLIF(v_item->>'deathDate', '')::date,
            (v_item->>'deathYear')::int,
            COALESCE((v_item->>'deathDatePrecision')::public.date_precision_type, 'unknown'),
            COALESCE((v_item->>'deathIsEstimated')::boolean, false),
            v_item->>'birthPlaceText',
            v_item->>'deathPlaceText',
            v_item->>'hometownText',
            v_item->>'burialPlaceText',
            v_item->>'occupationText',
            v_item->>'biography',
            COALESCE((v_item->>'verificationStatus')::public.verification_status_type, 'unverified'),
            NULL, -- Không trỏ tới file Storage cũ
            v_user_id,
            v_user_id
        );
        v_person_count := v_person_count + 1;
    END LOOP;

    -- 4. Insert Parent-Child Relationships
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_rels_arr)
    LOOP
        -- Kiểm tra tự liên kết
        IF (v_item->>'parentId')::uuid = (v_item->>'childId')::uuid THEN
            RAISE EXCEPTION 'BACKUP_CYCLE_DETECTED: Self-link parent and child' USING ERRCODE = '23514';
        END IF;

        INSERT INTO public.parent_child_relationships (
            id,
            tree_id,
            parent_id,
            child_id,
            parent_role,
            relationship_kind,
            verification_status,
            created_by,
            updated_by
        ) VALUES (
            (v_item->>'id')::uuid,
            v_new_tree_id,
            (v_item->>'parentId')::uuid,
            (v_item->>'childId')::uuid,
            COALESCE((v_item->>'parentRole')::public.parent_role_type, 'unspecified'),
            COALESCE((v_item->>'relationshipKind')::public.relationship_kind_type, 'biological'),
            COALESCE((v_item->>'verificationStatus')::public.verification_status_type, 'unverified'),
            v_user_id,
            v_user_id
        );
        v_rel_count := v_rel_count + 1;
    END LOOP;

    -- 5. Insert Unions
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_unions_arr)
    LOOP
        INSERT INTO public.unions (
            id,
            tree_id,
            status,
            start_date,
            start_year,
            start_date_precision,
            start_is_estimated,
            end_date,
            end_year,
            end_date_precision,
            end_is_estimated,
            notes,
            verification_status,
            created_by,
            updated_by
        ) VALUES (
            (v_item->>'id')::uuid,
            v_new_tree_id,
            (v_item->>'status')::public.union_status_type,
            NULLIF(v_item->>'startDate', '')::date,
            (v_item->>'startYear')::int,
            COALESCE((v_item->>'startDatePrecision')::public.date_precision_type, 'unknown'),
            COALESCE((v_item->>'startIsEstimated')::boolean, false),
            NULLIF(v_item->>'endDate', '')::date,
            (v_item->>'endYear')::int,
            COALESCE((v_item->>'endDatePrecision')::public.date_precision_type, 'unknown'),
            COALESCE((v_item->>'endIsEstimated')::boolean, false),
            v_item->>'notes',
            COALESCE((v_item->>'verificationStatus')::public.verification_status_type, 'unverified'),
            v_user_id,
            v_user_id
        );
        v_union_count := v_union_count + 1;
    END LOOP;

    -- 6. Insert Union Members
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_members_arr)
    LOOP
        INSERT INTO public.union_members (
            id,
            tree_id,
            union_id,
            person_id,
            member_role,
            created_by
        ) VALUES (
            (v_item->>'id')::uuid,
            v_new_tree_id,
            (v_item->>'unionId')::uuid,
            (v_item->>'personId')::uuid,
            COALESCE((v_item->>'memberRole')::public.union_member_role_type, 'unspecified'),
            v_user_id
        );
    END LOOP;

    -- 7. Update Tree Generation Anchor & Default Person
    v_anchor_id := (v_tree_obj->>'generationAnchorPersonId')::uuid;
    v_default_person_id := (v_tree_obj->>'defaultPersonId')::uuid;

    IF v_anchor_id IS NOT NULL OR v_default_person_id IS NOT NULL THEN
        UPDATE public.family_trees
        SET generation_anchor_person_id = v_anchor_id,
            default_person_id = v_default_person_id,
            updated_by = v_user_id
        WHERE id = v_new_tree_id;
    END IF;

    -- 8. Ghi Audit Log cho sự kiện Import
    PERFORM _system.write_audit_log(
        p_tree_id => v_new_tree_id,
        p_actor_user_id => v_user_id,
        p_actor_name_cached => 'Chủ sở hữu (Bản nhập)',
        p_entity_type => 'family_tree',
        p_entity_id => v_new_tree_id,
        p_action_type => 'create',
        p_before_data => NULL,
        p_after_data => jsonb_build_object(
            'name', v_tree_obj->>'name',
            'person_count', v_person_count,
            'relationship_count', v_rel_count,
            'union_count', v_union_count
        ),
        p_changed_fields => ARRAY['name', 'person_count', 'relationship_count', 'union_count'],
        p_reason => 'Tạo cây gia phả từ tệp sao lưu JSON',
        p_source => 'backup_import'
    );

    RETURN jsonb_build_object(
        'success', true,
        'treeId', v_new_tree_id,
        'treeName', v_tree_obj->>'name',
        'personCount', v_person_count,
        'relationshipCount', v_rel_count,
        'unionCount', v_union_count
    );
END;
$$;

REVOKE ALL ON FUNCTION public.import_family_tree_backup(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.import_family_tree_backup(JSONB) TO authenticated, service_role;
