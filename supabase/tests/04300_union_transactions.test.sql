-- ==============================================================================
-- Test Suite: 04300_union_transactions.test.sql
-- Phase: P13 (Quản lý quan hệ - Union & Spouse Transactions)
-- ==============================================================================

BEGIN;
SELECT plan(6);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_subject_id UUID;
    v_spouse_1_id UUID;
    v_spouse_2_id UUID;
    v_union_1_id UUID;
    v_union_2_id UUID;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'union-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Union User');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Hôn Nhân');

    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Chồng A', v_user_id, v_user_id) RETURNING id INTO v_subject_id;
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Vợ 1', v_user_id, v_user_id) RETURNING id INTO v_spouse_1_id;
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Vợ 2', v_user_id, v_user_id) RETURNING id INTO v_spouse_2_id;

    -- Test 1: Self-spouse check fails
    PERFORM throws_matching(
        format('SELECT public.create_union_with_existing_person(%L, %L, %L)',
            v_tree_id, v_subject_id, v_subject_id),
        'UNION_SELF_LINK',
        'Self-spouse must be rejected'
    );

    -- Test 2: Create Union 1 with existing spouse 1
    v_union_1_id := public.create_union_with_existing_person(
        p_tree_id => v_tree_id,
        p_person_1_id => v_subject_id,
        p_person_2_id => v_spouse_1_id,
        p_member_1_role => 'spouse',
        p_member_2_role => 'spouse',
        p_union_status => 'active'
    );

    PERFORM is(
        (SELECT count(*)::int FROM public.union_members WHERE union_id = v_union_1_id AND deleted_at IS NULL),
        2,
        'Union 1 must have exactly 2 active union members'
    );

    -- Test 3: Multiple marriages supported: Create Union 2 with existing spouse 2
    v_union_2_id := public.create_union_with_existing_person(
        p_tree_id => v_tree_id,
        p_person_1_id => v_subject_id,
        p_person_2_id => v_spouse_2_id,
        p_member_1_role => 'spouse',
        p_member_2_role => 'spouse',
        p_union_status => 'active'
    );

    PERFORM is(
        (SELECT count(*)::int FROM public.unions WHERE tree_id = v_tree_id AND deleted_at IS NULL),
        2,
        'Multiple marriages for same subject person must be supported'
    );

    -- Test 4: End Union 1 (status = divorced)
    PERFORM is(
        public.end_union(
            p_union_id => v_union_1_id,
            p_expected_version => 1,
            p_new_status => 'divorced'
        ),
        true,
        'end_union should succeed and update status to divorced'
    );

    PERFORM is(
        (SELECT status::text FROM public.unions WHERE id = v_union_1_id),
        'divorced',
        'Union 1 status must be divorced in database'
    );

    -- Test 5: Soft delete Union 2
    PERFORM is(
        public.soft_delete_union(v_union_2_id, 1),
        true,
        'soft_delete_union should succeed'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;
