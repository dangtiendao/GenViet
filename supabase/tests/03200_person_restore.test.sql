-- ==============================================================================
-- Test Suite: 03200_person_restore.test.sql
-- Phase: P12 (Person Management - Soft Delete & Restore Verification)
-- ==============================================================================

BEGIN;
SELECT plan(6);

DO $$
DECLARE
    v_owner_id UUID := gen_random_uuid();
    v_outsider_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_person_id UUID;
    v_restore_ok boolean;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_owner_id, 'p12-owner@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_owner_id, 'Owner P12');

    INSERT INTO auth.users (id, email) VALUES (v_outsider_id, 'p12-outsider@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_outsider_id, 'Outsider P12');

    PERFORM set_config('request.jwt.claim.sub', v_owner_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Họ Lê Restore');

    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree_id, 'Lê Văn Khôi', v_owner_id, v_owner_id)
    RETURNING id INTO v_person_id;

    -- Soft delete the person
    UPDATE public.persons
    SET deleted_at = timezone('utc'::text, now()), deleted_by = v_owner_id, version = version + 1
    WHERE id = v_person_id;

    -- Test 1: Person is soft-deleted
    PERFORM is(
        (SELECT count(*)::int FROM public.persons WHERE id = v_person_id AND deleted_at IS NOT NULL),
        1,
        'Person should be marked as soft-deleted'
    );

    -- Test 2: Normal select returns 0 rows due to RLS
    PERFORM is(
        (SELECT count(*)::int FROM public.persons WHERE id = v_person_id AND deleted_at IS NULL),
        0,
        'Normal select must exclude soft-deleted person'
    );

    -- Test 3: Outsider cannot restore
    PERFORM set_config('request.jwt.claim.sub', v_outsider_id::text, true);
    PERFORM throws_matching(
        format('SELECT public.restore_person(%L, 2)', v_person_id),
        'Forbidden: Only tree writers',
        'Outsider cannot restore soft-deleted person'
    );

    -- Test 4: Restore with wrong version fails
    PERFORM set_config('request.jwt.claim.sub', v_owner_id::text, true);
    PERFORM throws_matching(
        format('SELECT public.restore_person(%L, 999)', v_person_id),
        'Person version conflict',
        'Restore with mismatched version must be rejected'
    );

    -- Test 5: Owner restores successfully with expected version
    v_restore_ok := public.restore_person(v_person_id, 2);
    PERFORM is(v_restore_ok, true, 'restore_person must return true for authorized writer');

    -- Test 6: Person is active again with incremented version
    PERFORM is(
        (SELECT version FROM public.persons WHERE id = v_person_id AND deleted_at IS NULL),
        3,
        'Restored person must have version 3 and deleted_at NULL'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;
