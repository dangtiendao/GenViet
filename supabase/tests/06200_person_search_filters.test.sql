-- ==============================================================================
-- Test Suite: 06200_person_search_filters.test.sql
-- Phase: P16 (Person Search Filters - Birth Year, Living Status, Missing Information)
-- ==============================================================================

BEGIN;
SELECT plan(6);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_count INTEGER;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'filter-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Filter Tester');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Kiểm Thử Bộ Lọc');

    -- Person 1: Living, birth_year 1980, full info
    INSERT INTO public.persons (tree_id, full_name, gender, living_status, birth_year, birth_date_precision, hometown_text, verification_status, created_by, updated_by)
    VALUES (v_tree_id, 'Nguyễn Văn Một', 'male', 'living', 1980, 'year', 'Hà Nội', 'verified', v_user_id, v_user_id);

    -- Person 2: Deceased, birth_year 1950, death_year 2020, hometown null
    INSERT INTO public.persons (tree_id, full_name, gender, living_status, birth_year, birth_date_precision, death_year, death_date_precision, hometown_text, verification_status, created_by, updated_by)
    VALUES (v_tree_id, 'Nguyễn Văn Hai', 'male', 'deceased', 1950, 'year', 2020, 'year', NULL, 'verified', v_user_id, v_user_id);

    -- Person 3: Unknown living status, no birth year, unverified
    INSERT INTO public.persons (tree_id, full_name, gender, living_status, birth_year, birth_date_precision, hometown_text, verification_status, created_by, updated_by)
    VALUES (v_tree_id, 'Nguyễn Thị Ba', 'female', 'unknown', NULL, 'unknown', NULL, 'unverified', v_user_id, v_user_id);

    -- Test 1: Lọc theo năm sinh = 1980
    SELECT count(*) INTO v_count
    FROM public.search_persons_in_tree(v_tree_id, NULL, 1980::smallint);
    PERFORM is(v_count, 1, 'Filter birth_year = 1980 should return 1 person');

    -- Test 2: Lọc theo living_status = 'living'
    SELECT count(*) INTO v_count
    FROM public.search_persons_in_tree(v_tree_id, NULL, NULL, 'living');
    PERFORM is(v_count, 1, 'Filter living_status = living should return 1 person');

    -- Test 3: Lọc theo living_status = 'deceased'
    SELECT count(*) INTO v_count
    FROM public.search_persons_in_tree(v_tree_id, NULL, NULL, 'deceased');
    PERFORM is(v_count, 1, 'Filter living_status = deceased should return 1 person');

    -- Test 4: Lọc missing_birth (thiếu năm sinh) -> Person 3
    SELECT count(*) INTO v_count
    FROM public.search_persons_in_tree(v_tree_id, NULL, NULL, NULL, 'missing_birth');
    PERFORM is(v_count, 1, 'Filter missing_birth should return 1 person');

    -- Test 5: Lọc missing_hometown (thiếu quê quán) -> Person 2 và 3
    SELECT count(*) INTO v_count
    FROM public.search_persons_in_tree(v_tree_id, NULL, NULL, NULL, 'missing_hometown');
    PERFORM is(v_count, 2, 'Filter missing_hometown should return 2 persons');

    -- Test 6: Lọc missing_any_core -> Person 2 và 3
    SELECT count(*) INTO v_count
    FROM public.search_persons_in_tree(v_tree_id, NULL, NULL, NULL, 'missing_any_core');
    PERFORM is(v_count, 2, 'Filter missing_any_core should return 2 incomplete persons');

END $$;

SELECT * FROM finish();
ROLLBACK;
