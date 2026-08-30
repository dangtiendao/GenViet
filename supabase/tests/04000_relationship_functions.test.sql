-- ==============================================================================
-- Test Suite: 04000_relationship_functions.test.sql
-- Phase: P13 (Quản lý quan hệ - Basic Relationship Functions & Direction)
-- ==============================================================================

BEGIN;
SELECT plan(6);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_child_id UUID;
    v_father_result jsonb;
    v_father_id UUID;
    v_rel_id UUID;
    v_parent_id_db UUID;
    v_child_id_db UUID;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'rel-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Rel User');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Quan Hệ Họ Trần');

    -- Create a child person
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree_id, 'Trần Văn Con', v_user_id, v_user_id)
    RETURNING id INTO v_child_id;

    -- Test 1: Create new father via RPC
    v_father_result := public.create_person_with_parent_relationship(
        p_tree_id => v_tree_id,
        p_child_id => v_child_id,
        p_full_name => 'Trần Văn Cha',
        p_gender => 'male',
        p_living_status => 'deceased',
        p_parent_role => 'father',
        p_relationship_kind => 'biological',
        p_verification_status => 'verified'
    );

    v_father_id := (v_father_result->>'person_id')::UUID;
    v_rel_id := (v_father_result->>'relationship_id')::UUID;

    PERFORM is(
        (SELECT count(*)::int FROM public.persons WHERE id = v_father_id),
        1,
        'Father person must be created in persons table'
    );

    -- Test 2: Direction is strictly Parent -> Child
    SELECT parent_id, child_id INTO v_parent_id_db, v_child_id_db
    FROM public.parent_child_relationships
    WHERE id = v_rel_id;

    PERFORM is(v_parent_id_db, v_father_id, 'parent_id must be the father person ID');
    PERFORM is(v_child_id_db, v_child_id, 'child_id must be the child person ID');

    -- Test 3: Self-link parent check fails
    PERFORM throws_matching(
        format('SELECT public.link_existing_parent(%L, %L, %L, %L, %L, %L)',
            v_tree_id, v_child_id, v_child_id, 'father', 'biological', 'verified'),
        'RELATIONSHIP_SELF_LINK',
        'Self-link (person as own parent) must be rejected'
    );

    -- Test 4: Exact duplicate relation is rejected
    PERFORM throws_matching(
        format('SELECT public.link_existing_parent(%L, %L, %L, %L, %L, %L)',
            v_tree_id, v_father_id, v_child_id, 'father', 'biological', 'verified'),
        'RELATIONSHIP_DUPLICATE',
        'Exact duplicate active relationship must be rejected'
    );

    -- Test 5: Soft delete relationship
    PERFORM is(
        public.soft_delete_parent_child_relationship(v_rel_id, 1),
        true,
        'soft_delete_parent_child_relationship should succeed with expected version'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;
