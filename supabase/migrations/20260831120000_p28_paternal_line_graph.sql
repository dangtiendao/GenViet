-- Migration: 20260831120000_p28_paternal_line_graph.sql
-- Phase: P28 (Chế độ hiển thị dòng họ mặc định - Default Paternal-Line Tree View)
-- Description: Cập nhật hàm get_tree_graph_slice hỗ trợ chế độ duyệt PATERNAL_LINE và ALL_DESCENDANTS,
--              Center-Female exception, phân loại truncation reasons và metadata hasHiddenDescendants.

-- 1. Xóa hàm cũ với chữ ký 6 tham số để tránh xung đột signature
DROP FUNCTION IF EXISTS public.get_tree_graph_slice(UUID, UUID, INTEGER, INTEGER, BOOLEAN, BOOLEAN);
DROP FUNCTION IF EXISTS public.get_tree_graph_slice(UUID, UUID, INTEGER, INTEGER, BOOLEAN, BOOLEAN, TEXT, UUID);

CREATE OR REPLACE FUNCTION public.get_tree_graph_slice(
    p_tree_id UUID,
    p_center_person_id UUID,
    p_ancestor_depth INTEGER DEFAULT 2,
    p_descendant_depth INTEGER DEFAULT 2,
    p_include_spouses BOOLEAN DEFAULT true,
    p_include_unverified BOOLEAN DEFAULT true,
    p_descendant_traversal_mode TEXT DEFAULT 'PATERNAL_LINE',
    p_branch_boundary_person_id UUID DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_can_read BOOLEAN;
    v_center_tree_id UUID;
    v_center_deleted_at TIMESTAMPTZ;
    v_tree_deleted_at TIMESTAMPTZ;
    v_max_ancestor_depth CONSTANT INTEGER := 5;
    v_max_descendant_depth CONSTANT INTEGER := 5;
    v_max_persons_budget CONSTANT INTEGER := 250;
    v_max_relationships_budget CONSTANT INTEGER := 500;
    v_max_unions_budget CONSTANT INTEGER := 150;
    v_applied_ancestor_depth INTEGER;
    v_applied_descendant_depth INTEGER;
    v_traversal_mode TEXT;
    
    v_slice_person_ids UUID[];
    v_ancestor_person_ids UUID[];
    v_descendant_person_ids UUID[];
    v_spouse_person_ids UUID[] := ARRAY[]::UUID[];
    v_children_person_ids UUID[] := ARRAY[]::UUID[];
    v_union_ids UUID[] := ARRAY[]::UUID[];
    
    v_persons_json jsonb;
    v_relationships_json jsonb;
    v_unions_json jsonb;
    v_union_members_json jsonb;
    v_expansion_json jsonb := '{}'::jsonb;
    
    v_person_count INTEGER := 0;
    v_relationship_count INTEGER := 0;
    v_union_count INTEGER := 0;
    v_truncated BOOLEAN := false;
    v_truncated_reason TEXT := NULL;
BEGIN
    -- 1. Xác thực người dùng
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'TREE_GRAPH_UNAUTHORIZED' USING ERRCODE = '42501';
    END IF;

    -- 2. Chuẩn hóa & kiểm tra Traversal Mode
    v_traversal_mode := COALESCE(NULLIF(TRIM(p_descendant_traversal_mode), ''), 'PATERNAL_LINE');
    IF v_traversal_mode NOT IN ('PATERNAL_LINE', 'ALL_DESCENDANTS') THEN
        RAISE EXCEPTION 'GRAPH_TRAVERSAL_MODE_INVALID' USING ERRCODE = '22023';
    END IF;

    -- 3. Kiểm tra quyền truy cập cây gia phả
    SELECT _system.can_read_tree(p_tree_id, v_user_id) INTO v_can_read;
    IF NOT COALESCE(v_can_read, false) THEN
        RAISE EXCEPTION 'TREE_GRAPH_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    -- 4. Kiểm tra trạng thái cây
    SELECT deleted_at INTO v_tree_deleted_at
    FROM public.family_trees
    WHERE id = p_tree_id;

    IF v_tree_deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'TREE_GRAPH_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    -- 5. Kiểm tra Center Person
    SELECT tree_id, deleted_at INTO v_center_tree_id, v_center_deleted_at
    FROM public.persons
    WHERE id = p_center_person_id;

    IF v_center_tree_id IS NULL THEN
        RAISE EXCEPTION 'TREE_GRAPH_CENTER_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    IF v_center_tree_id <> p_tree_id THEN
        RAISE EXCEPTION 'TREE_GRAPH_TREE_MISMATCH' USING ERRCODE = '40003';
    END IF;

    IF v_center_deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'TREE_GRAPH_CENTER_DELETED' USING ERRCODE = 'P0002';
    END IF;

    -- 6. Kiểm tra Branch Boundary (nếu có)
    IF p_branch_boundary_person_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.persons
            WHERE id = p_branch_boundary_person_id
              AND tree_id = p_tree_id
              AND deleted_at IS NULL
        ) THEN
            RAISE EXCEPTION 'GRAPH_BRANCH_BOUNDARY_CROSS_TREE' USING ERRCODE = '42501';
        END IF;
    END IF;

    -- 7. Áp dụng giới hạn độ sâu
    IF p_ancestor_depth < 0 OR p_descendant_depth < 0 THEN
        RAISE EXCEPTION 'TREE_GRAPH_DEPTH_INVALID' USING ERRCODE = '22023';
    END IF;

    v_applied_ancestor_depth := LEAST(p_ancestor_depth, v_max_ancestor_depth);
    v_applied_descendant_depth := LEAST(p_descendant_depth, v_max_descendant_depth);

    -- 8. Recursive CTE 1: Traversal Tổ tiên (Ancestors)
    WITH RECURSIVE ancestor_cte AS (
        SELECT 
            p_center_person_id AS person_id,
            0 AS depth,
            ARRAY[p_center_person_id] AS visited_path
        
        UNION ALL
        
        SELECT 
            r.parent_id AS person_id,
            a.depth + 1 AS depth,
            a.visited_path || r.parent_id
        FROM ancestor_cte a
        JOIN public.parent_child_relationships r 
            ON r.child_id = a.person_id 
            AND r.tree_id = p_tree_id 
            AND r.deleted_at IS NULL
            AND (p_include_unverified OR r.verification_status = 'verified')
        JOIN public.persons p 
            ON p.id = r.parent_id 
            AND p.tree_id = p_tree_id 
            AND p.deleted_at IS NULL
        WHERE a.depth < v_applied_ancestor_depth
          AND NOT (r.parent_id = ANY(a.visited_path))
    )
    SELECT ARRAY_AGG(DISTINCT person_id) INTO v_ancestor_person_ids
    FROM ancestor_cte;

    -- 9. Recursive CTE 2: Traversal Hậu duệ (Descendants) với PATERNAL_LINE stop
    WITH RECURSIVE descendant_cte AS (
        -- Anchor: Center Person (depth = 0)
        SELECT 
            p_center_person_id AS person_id,
            0 AS depth,
            ARRAY[p_center_person_id] AS visited_path,
            p.gender AS current_gender
        FROM public.persons p
        WHERE p.id = p_center_person_id
          AND p.tree_id = p_tree_id
          AND p.deleted_at IS NULL
        
        UNION ALL
        
        -- Recursive: Duyệt con cái
        SELECT 
            r.child_id AS person_id,
            d.depth + 1 AS depth,
            d.visited_path || r.child_id,
            p.gender AS current_gender
        FROM descendant_cte d
        JOIN public.parent_child_relationships r 
            ON r.parent_id = d.person_id 
            AND r.tree_id = p_tree_id 
            AND r.deleted_at IS NULL
            AND (p_include_unverified OR r.verification_status = 'verified')
        JOIN public.persons p 
            ON p.id = r.child_id 
            AND p.tree_id = p_tree_id 
            AND p.deleted_at IS NULL
        WHERE d.depth < v_applied_descendant_depth
          AND NOT (r.child_id = ANY(d.visited_path))
          -- Quy tắc PATERNAL_LINE: Dừng duyệt từ d nếu d là Nữ và d không phải là Root (depth > 0)
          AND (
              v_traversal_mode <> 'PATERNAL_LINE'
              OR d.depth = 0
              OR d.current_gender <> 'female'
              OR (p_branch_boundary_person_id IS NOT NULL AND d.person_id = p_branch_boundary_person_id)
          )
    )
    SELECT ARRAY_AGG(DISTINCT person_id) INTO v_descendant_person_ids
    FROM descendant_cte;

    -- Hợp nhất tập Person ban đầu
    SELECT ARRAY_AGG(DISTINCT pid) INTO v_slice_person_ids
    FROM (
        SELECT UNNEST(COALESCE(v_ancestor_person_ids, ARRAY[]::UUID[])) AS pid
        UNION
        SELECT UNNEST(COALESCE(v_descendant_person_ids, ARRAY[]::UUID[])) AS pid
        UNION
        SELECT p_center_person_id AS pid
    ) combined;

    -- 10. Truy vấn Unions và Phối ngẫu (Spouses) nếu p_include_spouses = true
    IF p_include_spouses THEN
        SELECT ARRAY_AGG(DISTINCT u.id) INTO v_union_ids
        FROM public.unions u
        JOIN public.union_members um 
            ON um.union_id = u.id 
            AND um.tree_id = p_tree_id 
            AND um.deleted_at IS NULL
        WHERE u.tree_id = p_tree_id
          AND u.deleted_at IS NULL
          AND um.person_id = ANY(v_slice_person_ids);

        IF v_union_ids IS NOT NULL AND ARRAY_LENGTH(v_union_ids, 1) > 0 THEN
            SELECT ARRAY_AGG(DISTINCT um.person_id) INTO v_spouse_person_ids
            FROM public.union_members um
            JOIN public.persons p 
                ON p.id = um.person_id 
                AND p.tree_id = p_tree_id 
                AND p.deleted_at IS NULL
            WHERE um.union_id = ANY(v_union_ids)
              AND um.tree_id = p_tree_id
              AND um.deleted_at IS NULL;

            -- Thêm spouses vào slice
            SELECT ARRAY_AGG(DISTINCT pid) INTO v_slice_person_ids
            FROM (
                SELECT UNNEST(v_slice_person_ids) AS pid
                UNION
                SELECT UNNEST(COALESCE(v_spouse_person_ids, ARRAY[]::UUID[])) AS pid
            ) combined_with_spouses;
        END IF;
    END IF;

    -- 10.1. Lấy thêm con cái trực tiếp của các Cha/Mẹ (Ancestors, Center & Spouses) có trong slice
    -- Tuân thủ PATERNAL_LINE: Chỉ quét con của người cha hoặc của Center Person
    SELECT ARRAY_AGG(DISTINCT r.child_id) INTO v_children_person_ids
    FROM public.parent_child_relationships r
    JOIN public.persons p 
        ON p.id = r.child_id 
        AND p.tree_id = p_tree_id 
        AND p.deleted_at IS NULL
    JOIN public.persons parent_p
        ON parent_p.id = r.parent_id
        AND parent_p.tree_id = p_tree_id
        AND parent_p.deleted_at IS NULL
    WHERE r.tree_id = p_tree_id
      AND r.deleted_at IS NULL
      AND r.parent_id = ANY(v_slice_person_ids)
      AND (p_include_unverified OR r.verification_status = 'verified')
      AND (
          v_traversal_mode <> 'PATERNAL_LINE'
          OR parent_p.id = p_center_person_id
          OR parent_p.gender <> 'female'
          OR (p_branch_boundary_person_id IS NOT NULL AND parent_p.id = p_branch_boundary_person_id)
      );

    IF v_children_person_ids IS NOT NULL AND ARRAY_LENGTH(v_children_person_ids, 1) > 0 THEN
        SELECT ARRAY_AGG(DISTINCT pid) INTO v_slice_person_ids
        FROM (
            SELECT UNNEST(v_slice_person_ids) AS pid
            UNION
            SELECT UNNEST(v_children_person_ids) AS pid
        ) combined_with_children;
    END IF;

    -- 11. Kiểm tra ngân sách kích thước (Size Budgets)
    v_person_count := COALESCE(ARRAY_LENGTH(v_slice_person_ids, 1), 0);
    IF v_person_count > v_max_persons_budget THEN
        v_truncated := true;
        v_truncated_reason := 'person_budget_exceeded';
        v_slice_person_ids := v_slice_person_ids[1:v_max_persons_budget];
        v_person_count := v_max_persons_budget;
    END IF;

    -- 12. Trích xuất Persons JSON
    SELECT COALESCE(jsonb_agg(p_row ORDER BY p_row->>'fullName' ASC, p_row->>'id' ASC), '[]'::jsonb)
    INTO v_persons_json
    FROM (
        SELECT jsonb_build_object(
            'id', p.id,
            'fullName', p.full_name,
            'gender', p.gender,
            'livingStatus', p.living_status,
            'birthDate', p.birth_date,
            'birthYear', p.birth_year,
            'birthDatePrecision', p.birth_date_precision,
            'birthIsEstimated', p.birth_is_estimated,
            'deathDate', p.death_date,
            'deathYear', p.death_year,
            'deathDatePrecision', p.death_date_precision,
            'deathIsEstimated', p.death_is_estimated,
            'verificationStatus', p.verification_status,
            'avatarPath', p.avatar_path,
            'isCenter', (p.id = p_center_person_id)
        ) AS p_row
        FROM public.persons p
        WHERE p.id = ANY(v_slice_person_ids)
          AND p.tree_id = p_tree_id
          AND p.deleted_at IS NULL
    ) persons_sub;

    -- 13. Trích xuất Parent-Child Relationships JSON
    SELECT COALESCE(jsonb_agg(r_row ORDER BY r_row->>'parentId' ASC, r_row->>'childId' ASC), '[]'::jsonb),
           COUNT(*)
    INTO v_relationships_json, v_relationship_count
    FROM (
        SELECT jsonb_build_object(
            'id', r.id,
            'parentId', r.parent_id,
            'childId', r.child_id,
            'parentRole', r.parent_role,
            'relationshipKind', r.relationship_kind,
            'verificationStatus', r.verification_status
        ) AS r_row
        FROM public.parent_child_relationships r
        WHERE r.tree_id = p_tree_id
          AND r.deleted_at IS NULL
          AND r.parent_id = ANY(v_slice_person_ids)
          AND r.child_id = ANY(v_slice_person_ids)
          AND (p_include_unverified OR r.verification_status = 'verified')
        LIMIT v_max_relationships_budget
    ) rels_sub;

    -- 14. Trích xuất Unions & Union Members JSON
    IF p_include_spouses AND v_union_ids IS NOT NULL AND ARRAY_LENGTH(v_union_ids, 1) > 0 THEN
        SELECT COALESCE(jsonb_agg(u_row ORDER BY u_row->>'id' ASC), '[]'::jsonb),
               COUNT(*)
        INTO v_unions_json, v_union_count
        FROM (
            SELECT jsonb_build_object(
                'id', u.id,
                'status', u.status,
                'startDate', u.start_date,
                'startYear', u.start_year,
                'startDatePrecision', u.start_date_precision,
                'endDate', u.end_date,
                'endYear', u.end_year,
                'endDatePrecision', u.end_date_precision,
                'verificationStatus', u.verification_status
            ) AS u_row
            FROM public.unions u
            WHERE u.id = ANY(v_union_ids)
              AND u.tree_id = p_tree_id
              AND u.deleted_at IS NULL
            LIMIT v_max_unions_budget
        ) unions_sub;

        SELECT COALESCE(jsonb_agg(um_row ORDER BY um_row->>'unionId' ASC, um_row->>'personId' ASC), '[]'::jsonb)
        INTO v_union_members_json
        FROM (
            SELECT jsonb_build_object(
                'unionId', um.union_id,
                'personId', um.person_id,
                'memberRole', um.member_role
            ) AS um_row
            FROM public.union_members um
            WHERE um.union_id = ANY(v_union_ids)
              AND um.tree_id = p_tree_id
              AND um.deleted_at IS NULL
              AND um.person_id = ANY(v_slice_person_ids)
        ) um_sub;
    ELSE
        v_unions_json := '[]'::jsonb;
        v_union_members_json := '[]'::jsonb;
        v_union_count := 0;
    END IF;

    -- 15. Tính Expansion Metadata cho từng Person trong slice (Phase P28 Extended)
    SELECT jsonb_object_agg(
        p_id::text,
        jsonb_build_object(
            'hasMoreAncestors', has_more_anc,
            'hasMoreDescendants', has_more_desc,
            'canAddFather', can_add_fat,
            'canAddMother', can_add_mot,
            'canExpandAncestors', has_more_anc,
            'canExpandDescendants', CASE 
                WHEN is_female_branch_stopped THEN false 
                ELSE has_more_desc 
            END,
            'hasVerifiedBiologicalFather', has_ver_fat,
            'hasVerifiedBiologicalMother', has_ver_mot,
            'hasHiddenDescendants', has_hidden_desc,
            'descendantsTruncated', (has_hidden_desc OR (has_more_desc AND NOT is_female_branch_stopped)),
            'truncationReason', CASE 
                WHEN has_hidden_desc THEN 'PATERNAL_LINE'
                WHEN has_more_desc THEN 'DEPTH_LIMIT'
                ELSE NULL 
            END
        )
    )
    INTO v_expansion_json
    FROM (
        SELECT 
            p.id AS p_id,
            EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                JOIN public.persons pr 
                    ON pr.id = r.parent_id 
                    AND pr.tree_id = p_tree_id 
                    AND pr.deleted_at IS NULL
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND (p_include_unverified OR r.verification_status = 'verified')
                  AND NOT (r.parent_id = ANY(v_slice_person_ids))
            ) AS has_more_anc,
            EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                JOIN public.persons cr 
                    ON cr.id = r.child_id 
                    AND cr.tree_id = p_tree_id 
                    AND cr.deleted_at IS NULL
                WHERE r.tree_id = p_tree_id
                  AND r.parent_id = p.id
                  AND r.deleted_at IS NULL
                  AND (p_include_unverified OR r.verification_status = 'verified')
                  AND NOT (r.child_id = ANY(v_slice_person_ids))
            ) AS has_more_desc,
            (
                v_traversal_mode = 'PATERNAL_LINE'
                AND p.gender = 'female'
                AND p.id <> p_center_person_id
                AND (p_branch_boundary_person_id IS NULL OR p.id <> p_branch_boundary_person_id)
                AND EXISTS (
                    SELECT 1 
                    FROM public.parent_child_relationships r
                    JOIN public.persons cr 
                        ON cr.id = r.child_id 
                        AND cr.tree_id = p_tree_id 
                        AND cr.deleted_at IS NULL
                    WHERE r.tree_id = p_tree_id
                      AND r.parent_id = p.id
                      AND r.deleted_at IS NULL
                      AND (p_include_unverified OR r.verification_status = 'verified')
                )
            ) AS has_hidden_desc,
            (
                v_traversal_mode = 'PATERNAL_LINE'
                AND p.gender = 'female'
                AND p.id <> p_center_person_id
                AND (p_branch_boundary_person_id IS NULL OR p.id <> p_branch_boundary_person_id)
            ) AS is_female_branch_stopped,
            NOT EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND r.parent_role = 'father'
                  AND r.relationship_kind = 'biological'
                  AND r.verification_status = 'verified'
            ) AS can_add_fat,
            NOT EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND r.parent_role = 'mother'
                  AND r.relationship_kind = 'biological'
                  AND r.verification_status = 'verified'
            ) AS can_add_mot,
            EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND r.parent_role = 'father'
                  AND r.relationship_kind = 'biological'
                  AND r.verification_status = 'verified'
            ) AS has_ver_fat,
            EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND r.parent_role = 'mother'
                  AND r.relationship_kind = 'biological'
                  AND r.verification_status = 'verified'
            ) AS has_ver_mot
        FROM public.persons p
        WHERE p.id = ANY(v_slice_person_ids)
          AND p.tree_id = p_tree_id
          AND p.deleted_at IS NULL
    ) exp_sub;

    -- 16. Tổng hợp TreeGraphDto hoàn chỉnh
    RETURN jsonb_build_object(
        'schemaVersion', 1,
        'treeId', p_tree_id,
        'centerPersonId', p_center_person_id,
        'descendantTraversalMode', v_traversal_mode,
        'persons', v_persons_json,
        'parentChildRelationships', v_relationships_json,
        'unions', v_unions_json,
        'unionMembers', v_union_members_json,
        'expansion', COALESCE(v_expansion_json, '{}'::jsonb),
        'limits', jsonb_build_object(
            'requestedAncestorDepth', p_ancestor_depth,
            'requestedDescendantDepth', p_descendant_depth,
            'appliedAncestorDepth', v_applied_ancestor_depth,
            'appliedDescendantDepth', v_applied_descendant_depth,
            'maxAncestorDepth', v_max_ancestor_depth,
            'maxDescendantDepth', v_max_descendant_depth,
            'maxPersonsBudget', v_max_persons_budget,
            'maxRelationshipsBudget', v_max_relationships_budget,
            'maxUnionsBudget', v_max_unions_budget,
            'returnedPersonCount', v_person_count,
            'returnedRelationshipCount', v_relationship_count,
            'returnedUnionCount', v_union_count,
            'truncated', v_truncated,
            'truncatedReason', v_truncated_reason
        ),
        'truncated', v_truncated,
        'warnings', CASE 
            WHEN v_truncated THEN jsonb_build_array('Graph slice was truncated due to budget constraints')
            ELSE '[]'::jsonb
        END
    );
END;
$$;

-- Phân quyền cho RPC
REVOKE ALL ON FUNCTION public.get_tree_graph_slice(UUID, UUID, INTEGER, INTEGER, BOOLEAN, BOOLEAN, TEXT, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_tree_graph_slice(UUID, UUID, INTEGER, INTEGER, BOOLEAN, BOOLEAN, TEXT, UUID) TO authenticated, service_role;
