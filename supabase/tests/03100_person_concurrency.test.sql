-- ==============================================================================
-- Test Suite: 03100_person_concurrency.test.sql
-- Phase: P12 (Person Management - Optimistic Concurrency & Versioning)
-- ==============================================================================

BEGIN;
SELECT plan(4);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_person_id UUID;
    v_rows int;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'version-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Version User');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Concurrency Test');

    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree_id, 'Phan Văn Hậu', v_user_id, v_user_id)
    RETURNING id INTO v_person_id;

    -- Test 1: Initial version is 1
    PERFORM is(
        (SELECT version FROM public.persons WHERE id = v_person_id),
        1,
        'Initial version must be 1'
    );

    -- Test 2: Update with correct version succeeds
    UPDATE public.persons
    SET full_name = 'Phan Văn Hậu (Sửa)', version = version + 1
    WHERE id = v_person_id AND version = 1;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    PERFORM is(v_rows, 1, 'Update with matching version should succeed');
    PERFORM is(
        (SELECT version FROM public.persons WHERE id = v_person_id),
        2,
        'Version should increment to 2'
    );

    -- Test 3: Stale update with version = 1 fails (0 rows affected)
    UPDATE public.persons
    SET full_name = 'Phan Văn Hậu (Stale)', version = version + 1
    WHERE id = v_person_id AND version = 1;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    PERFORM is(v_rows, 0, 'Update with stale version must affect 0 rows');
END $$;

SELECT * FROM finish();
ROLLBACK;
