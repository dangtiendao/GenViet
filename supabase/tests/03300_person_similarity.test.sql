-- ==============================================================================
-- Test Suite: 03300_person_similarity.test.sql
-- Phase: P12 (Person Management - Similarity Candidate Query & Cross-Tree Isolation)
-- ==============================================================================

BEGIN;
SELECT plan(4);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_other_user_id UUID := gen_random_uuid();
    v_tree_a UUID;
    v_tree_b UUID;
    v_person_a1 UUID;
    v_person_a2 UUID;
    v_person_b1 UUID;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'sim-a@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'User Sim A');

    INSERT INTO auth.users (id, email) VALUES (v_other_user_id, 'sim-b@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_other_user_id, 'User Sim B');

    -- User A creates Tree A
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
    v_tree_a := public.create_family_tree('Cây Gia Phả A');

    -- Insert Persons into Tree A
    INSERT INTO public.persons (tree_id, full_name, birth_year, birth_date_precision, created_by, updated_by)
    VALUES (v_tree_a, 'Nguyễn Văn An', 1980, 'year', v_user_id, v_user_id)
    RETURNING id INTO v_person_a1;

    INSERT INTO public.persons (tree_id, full_name, birth_year, birth_date_precision, created_by, updated_by)
    VALUES (v_tree_a, 'Nguyễn Văn An', 1995, 'year', v_user_id, v_user_id)
    RETURNING id INTO v_person_a2;

    -- User B creates Tree B and a person with the same name
    PERFORM set_config('request.jwt.claim.sub', v_other_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
    v_tree_b := public.create_family_tree('Cây Gia Phả B');

    INSERT INTO public.persons (tree_id, full_name, birth_year, birth_date_precision, created_by, updated_by)
    VALUES (v_tree_b, 'Nguyễn Văn An', 1980, 'year', v_other_user_id, v_other_user_id)
    RETURNING id INTO v_person_b1;

    -- Test 1: User A querying Tree A for "nguyễn văn an" finds 2 candidates in Tree A
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM is(
        (SELECT count(*)::int FROM public.persons WHERE tree_id = v_tree_a AND normalized_name = 'nguyễn văn an' AND deleted_at IS NULL),
        2,
        'Should find 2 active candidates in Tree A'
    );

    -- Test 2: User A querying Tree A never sees candidates from Tree B
    PERFORM is(
        (SELECT count(*)::int FROM public.persons WHERE tree_id = v_tree_a AND id = v_person_b1),
        0,
        'Tree A search must never include candidates from Tree B'
    );

    -- Test 3: Cross-tree query on Tree B by User A returns 0 rows (RLS blocked)
    PERFORM is(
        (SELECT count(*)::int FROM public.persons WHERE tree_id = v_tree_b),
        0,
        'RLS must block User A from querying Persons in Tree B'
    );

    -- Test 4: Soft-deleted person in Tree A is excluded from active similarity query
    UPDATE public.persons SET deleted_at = timezone('utc'::text, now()) WHERE id = v_person_a2;
    PERFORM is(
        (SELECT count(*)::int FROM public.persons WHERE tree_id = v_tree_a AND normalized_name = 'nguyễn văn an' AND deleted_at IS NULL),
        1,
        'Soft-deleted candidates must be excluded from active similarity query'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;
