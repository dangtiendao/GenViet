-- ==============================================================================
-- Test Suite: 06300_person_search_pagination.test.sql
-- Phase: P16 (Deterministic Cursor Pagination & Stable Ordering)
-- ==============================================================================

BEGIN;
SELECT plan(4);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_p1 RECORD;
    v_p2 RECORD;
    v_p3 RECORD;
    v_page1 RECORD;
    v_page2 RECORD;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'cursor-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Cursor Tester');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Kiểm Thử Phân Trang');

    INSERT INTO public.persons (tree_id, full_name, birth_year, created_by, updated_by)
    VALUES (v_tree_id, 'Lê Văn An', 1980, v_user_id, v_user_id);

    INSERT INTO public.persons (tree_id, full_name, birth_year, created_by, updated_by)
    VALUES (v_tree_id, 'Lê Văn Bình', 1985, v_user_id, v_user_id);

    INSERT INTO public.persons (tree_id, full_name, birth_year, created_by, updated_by)
    VALUES (v_tree_id, 'Lê Văn Cường', 1990, v_user_id, v_user_id);

    -- Lấy trang 1 với limit = 2
    SELECT * INTO v_p1 FROM public.search_persons_in_tree(v_tree_id, 'Le', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2) OFFSET 0 LIMIT 1;
    SELECT * INTO v_p2 FROM public.search_persons_in_tree(v_tree_id, 'Le', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2) OFFSET 1 LIMIT 1;

    PERFORM is(v_p1.full_name, 'Lê Văn An', 'Page 1 item 1 should be Lê Văn An');
    PERFORM is(v_p2.full_name, 'Lê Văn Bình', 'Page 1 item 2 should be Lê Văn Bình');

    -- Lấy trang 2 bằng cursor từ item 2
    SELECT * INTO v_p3 FROM public.search_persons_in_tree(
        v_tree_id,
        'Le',
        NULL,
        NULL,
        NULL,
        v_p2.match_tier,
        v_p2.similarity_score,
        v_p2.normalized_name,
        v_p2.birth_year,
        v_p2.id,
        2
    );

    PERFORM is(v_p3.full_name, 'Lê Văn Cường', 'Page 2 using cursor should return Lê Văn Cường seamlessly');
    PERFORM isnt(v_p3.id, v_p2.id, 'Page 2 should not duplicate item from Page 1');

END $$;

SELECT * FROM finish();
ROLLBACK;
