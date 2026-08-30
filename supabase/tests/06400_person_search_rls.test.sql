-- ==============================================================================
-- Test Suite: 06400_person_search_rls.test.sql
-- Phase: P16 (Person Search Authorization & Cross-Tree Isolation)
-- ==============================================================================

BEGIN;
SELECT plan(3);

DO $$
DECLARE
    v_owner_id UUID := gen_random_uuid();
    v_outsider_id UUID := gen_random_uuid();
    v_tree1_id UUID;
    v_tree2_id UUID;
    v_count INTEGER;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_owner_id, 'owner@genviet.local');
    INSERT INTO auth.users (id, email) VALUES (v_outsider_id, 'outsider@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_owner_id, 'Tree Owner');
    INSERT INTO public.profiles (id, display_name) VALUES (v_outsider_id, 'Outsider User');

    -- Setup Tree 1 owned by v_owner_id
    PERFORM set_config('request.jwt.claim.sub', v_owner_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree1_id := public.create_family_tree('Cây Gia Phả 1 (Private)');
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree1_id, 'Người Cây 1', v_owner_id, v_owner_id);

    -- Setup Tree 2 owned by v_outsider_id
    PERFORM set_config('request.jwt.claim.sub', v_outsider_id::text, true);
    v_tree2_id := public.create_family_tree('Cây Gia Phả 2 (Private)');
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree2_id, 'Người Cây 2', v_outsider_id, v_outsider_id);

    -- Test 1: Owner tìm kiếm trong Tree 1 thành công
    PERFORM set_config('request.jwt.claim.sub', v_owner_id::text, true);
    SELECT count(*) INTO v_count FROM public.search_persons_in_tree(v_tree1_id, 'Nguoi');
    PERFORM is(v_count, 1, 'Owner can search in their own private tree');

    -- Test 2: Owner không thể tìm kiếm trong Tree 2 (Outsider Tree)
    BEGIN
        SELECT count(*) INTO v_count FROM public.search_persons_in_tree(v_tree2_id, 'Nguoi');
        PERFORM ok(false, 'Should have thrown permission error for tree 2');
    EXCEPTION WHEN OTHERS THEN
        PERFORM ok(true, 'Access denied when owner searches outsider private tree');
    END;

    -- Test 3: Unauthenticated user bị từ chối
    PERFORM set_config('request.jwt.claim.sub', '', true);
    PERFORM set_config('request.jwt.claim.role', 'anon', true);

    BEGIN
        SELECT count(*) INTO v_count FROM public.search_persons_in_tree(v_tree1_id, 'Nguoi');
        PERFORM ok(false, 'Anonymous search should be rejected');
    EXCEPTION WHEN OTHERS THEN
        PERFORM ok(true, 'Anonymous search is correctly rejected');
    END;

END $$;

SELECT * FROM finish();
ROLLBACK;
