-- ==============================================================================
-- Test Suite: 04400_relationship_authorization.test.sql
-- Phase: P13 (Quản lý quan hệ - RLS & Authorization Verification)
-- ==============================================================================

BEGIN;
SELECT plan(4);

DO $$
DECLARE
    v_owner_id UUID := gen_random_uuid();
    v_viewer_id UUID := gen_random_uuid();
    v_outsider_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_person_1 UUID;
    v_person_2 UUID;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_owner_id, 'owner-rel@genviet.local');
    INSERT INTO auth.users (id, email) VALUES (v_viewer_id, 'viewer-rel@genviet.local');
    INSERT INTO auth.users (id, email) VALUES (v_outsider_id, 'outsider-rel@genviet.local');

    INSERT INTO public.profiles (id, display_name) VALUES (v_owner_id, 'Owner Rel');
    INSERT INTO public.profiles (id, display_name) VALUES (v_viewer_id, 'Viewer Rel');
    INSERT INTO public.profiles (id, display_name) VALUES (v_outsider_id, 'Outsider Rel');

    -- Setup as Owner
    PERFORM set_config('request.jwt.claim.sub', v_owner_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Phân Quyền');
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'P1', v_owner_id, v_owner_id) RETURNING id INTO v_person_1;
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'P2', v_owner_id, v_owner_id) RETURNING id INTO v_person_2;

    -- Add Viewer membership
    INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
    VALUES (v_tree_id, v_viewer_id, 'viewer', 'active');

    -- Test 1: Viewer tries to link parent -> Forbidden
    PERFORM set_config('request.jwt.claim.sub', v_viewer_id::text, true);
    PERFORM throws_matching(
        format('SELECT public.link_existing_parent(%L, %L, %L)', v_tree_id, v_person_1, v_person_2),
        'Forbidden: Only tree writers can add relationships',
        'Viewer must be rejected when calling link_existing_parent'
    );

    -- Test 2: Outsider tries to create union -> Forbidden
    PERFORM set_config('request.jwt.claim.sub', v_outsider_id::text, true);
    PERFORM throws_matching(
        format('SELECT public.create_union_with_existing_person(%L, %L, %L)', v_tree_id, v_person_1, v_person_2),
        'Forbidden: Only tree writers can create unions',
        'Outsider must be rejected when calling create_union_with_existing_person'
    );

    -- Test 3: Unauthenticated user -> Authentication required
    PERFORM set_config('request.jwt.claim.sub', '', true);
    PERFORM throws_matching(
        format('SELECT public.link_existing_parent(%L, %L, %L)', v_tree_id, v_person_1, v_person_2),
        'Authentication required',
        'Unauthenticated call must be rejected'
    );

    -- Test 4: Owner can successfully link parent
    PERFORM set_config('request.jwt.claim.sub', v_owner_id::text, true);
    PERFORM isnt(
        public.link_existing_parent(v_tree_id, v_person_1, v_person_2, 'father', 'biological', 'verified'),
        NULL,
        'Owner can create relationship successfully'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;
