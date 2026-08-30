-- ==============================================================================
-- Test Suite: 04200_relationship_transactions.test.sql
-- Phase: P13 (Quản lý quan hệ - Transaction Atomicity & Rollback)
-- ==============================================================================

BEGIN;
SELECT plan(4);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_person_a UUID;
    v_person_b UUID;
    v_person_c UUID;
    v_rel_id UUID;
    v_initial_person_count INTEGER;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'tx-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Tx User');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Kiểm Thử Transaction');

    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Person A', v_user_id, v_user_id) RETURNING id INTO v_person_a;
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Person B', v_user_id, v_user_id) RETURNING id INTO v_person_b;

    -- Thiết lập quan hệ A là cha B
    v_rel_id := public.link_existing_parent(v_tree_id, v_person_a, v_person_b, 'father', 'biological', 'verified');

    SELECT count(*)::int INTO v_initial_person_count FROM public.persons WHERE tree_id = v_tree_id;

    -- Test 1: Tạo Person mới nhưng thất bại do child không tồn tại -> Không sinh Person rác
    PERFORM throws_matching(
        format('SELECT public.create_person_with_parent_relationship(%L, %L, %L)',
            v_tree_id, gen_random_uuid(), 'Người Bị Thất Bại'),
        'Child person not found',
        'Transaction must fail when child does not exist'
    );

    PERFORM is(
        (SELECT count(*)::int FROM public.persons WHERE tree_id = v_tree_id),
        v_initial_person_count,
        'No orphan person row must be created after failed transaction'
    );

    -- Test 2: Replace parent relationship: thay thế A bằng Person C làm cha B
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Person C', v_user_id, v_user_id) RETURNING id INTO v_person_c;

    PERFORM public.replace_parent_relationship(
        p_tree_id => v_tree_id,
        p_old_relationship_id => v_rel_id,
        p_old_expected_version => 1,
        p_new_parent_id => v_person_c,
        p_child_id => v_person_b,
        p_parent_role => 'father',
        p_relationship_kind => 'biological',
        p_verification_status => 'verified'
    );

    PERFORM is(
        (SELECT deleted_at IS NOT NULL FROM public.parent_child_relationships WHERE id = v_rel_id),
        true,
        'Old relationship must be soft deleted after atomic replacement'
    );

    PERFORM is(
        (SELECT count(*)::int FROM public.parent_child_relationships WHERE tree_id = v_tree_id AND parent_id = v_person_c AND child_id = v_person_b AND deleted_at IS NULL),
        1,
        'New relationship must be active after atomic replacement'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;
