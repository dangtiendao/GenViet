-- ==============================================================================
-- Test Suite: 06100_person_name_search.test.sql
-- Phase: P16 (Person Name Search - Exact, No-Accent, Prefix, and Trigram)
-- ==============================================================================

BEGIN;
SELECT plan(6);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_person1_id UUID;
    v_person2_id UUID;
    v_person3_id UUID;
    v_count INTEGER;
    v_top_name TEXT;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'search-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Search Tester');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Họ Đặng');

    INSERT INTO public.persons (tree_id, full_name, birth_year, created_by, updated_by)
    VALUES (v_tree_id, 'Đặng Tiến Đạo', 1980, v_user_id, v_user_id)
    RETURNING id INTO v_person1_id;

    INSERT INTO public.persons (tree_id, full_name, birth_year, created_by, updated_by)
    VALUES (v_tree_id, 'Đặng Văn Minh', 1985, v_user_id, v_user_id)
    RETURNING id INTO v_person2_id;

    INSERT INTO public.persons (tree_id, full_name, birth_year, created_by, updated_by)
    VALUES (v_tree_id, 'Nguyễn Thị Mai', 1990, v_user_id, v_user_id)
    RETURNING id INTO v_person3_id;

    -- Test 1: Tìm kiếm không dấu 'dang tien dao' tìm đúng 'Đặng Tiến Đạo'
    SELECT count(*), min(full_name) INTO v_count, v_top_name
    FROM public.search_persons_in_tree(v_tree_id, 'dang tien dao');

    PERFORM is(v_count, 1, 'Search "dang tien dao" should find 1 exact match');
    PERFORM is(v_top_name, 'Đặng Tiến Đạo', 'Search "dang tien dao" should return "Đặng Tiến Đạo"');

    -- Test 2: Tìm kiếm tiền tố 'dang' tìm được cả 2 người họ Đặng
    SELECT count(*) INTO v_count
    FROM public.search_persons_in_tree(v_tree_id, 'dang');

    PERFORM is(v_count, 2, 'Search prefix "dang" should find 2 people');

    -- Test 3: Tìm kiếm có dấu 'Đặng' vẫn tìm được cả 2 người
    SELECT count(*) INTO v_count
    FROM public.search_persons_in_tree(v_tree_id, 'Đặng');

    PERFORM is(v_count, 2, 'Search accented "Đặng" should find 2 people');

    -- Test 4: Tìm kiếm substring 'Tien' tìm được 'Đặng Tiến Đạo'
    SELECT count(*), min(full_name) INTO v_count, v_top_name
    FROM public.search_persons_in_tree(v_tree_id, 'tien');

    PERFORM is(v_count, 1, 'Search substring "tien" should find 1 match');
    PERFORM is(v_top_name, 'Đặng Tiến Đạo', 'Search substring "tien" should return "Đặng Tiến Đạo"');

END $$;

SELECT * FROM finish();
ROLLBACK;
