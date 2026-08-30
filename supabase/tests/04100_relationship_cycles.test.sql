-- ==============================================================================
-- Test Suite: 04100_relationship_cycles.test.sql
-- Phase: P13 (Quản lý quan hệ - Recursive Cycle Detection)
-- ==============================================================================

BEGIN;
SELECT plan(6);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_a UUID;
    v_b UUID;
    v_c UUID;
    v_d UUID;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'cycle-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Cycle User');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Kiểm Thử Chu Trình');

    -- Tạo chuỗi A (Cụ) -> B (Ông) -> C (Bố) -> D (Con)
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Cụ A', v_user_id, v_user_id) RETURNING id INTO v_a;
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Ông B', v_user_id, v_user_id) RETURNING id INTO v_b;
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Bố C', v_user_id, v_user_id) RETURNING id INTO v_c;
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by) VALUES (v_tree_id, 'Con D', v_user_id, v_user_id) RETURNING id INTO v_d;

    -- Thêm các cạnh A -> B, B -> C, C -> D
    PERFORM public.link_existing_parent(v_tree_id, v_a, v_b, 'father', 'biological', 'verified');
    PERFORM public.link_existing_parent(v_tree_id, v_b, v_c, 'father', 'biological', 'verified');
    PERFORM public.link_existing_parent(v_tree_id, v_c, v_d, 'father', 'biological', 'verified');

    -- Test 1: Hai-node cycle rejection: B -> A (B là con A, cố gắng làm cha A)
    PERFORM is(
        _system.check_parent_child_cycle(v_tree_id, v_b, v_a),
        true,
        '2-node cycle B -> A must be detected as cycle'
    );

    PERFORM throws_matching(
        format('SELECT public.link_existing_parent(%L, %L, %L, %L, %L, %L)',
            v_tree_id, v_b, v_a, 'father', 'biological', 'verified'),
        'RELATIONSHIP_CYCLE',
        'Direct RPC linking B as parent of A must throw RELATIONSHIP_CYCLE'
    );

    -- Test 2: Ba thế hệ cycle rejection: C -> A (C là cháu A, cố gắng làm cha A)
    PERFORM is(
        _system.check_parent_child_cycle(v_tree_id, v_c, v_a),
        true,
        '3-generation cycle C -> A must be detected as cycle'
    );

    PERFORM throws_matching(
        format('SELECT public.link_existing_parent(%L, %L, %L, %L, %L, %L)',
            v_tree_id, v_c, v_a, 'father', 'biological', 'verified'),
        'RELATIONSHIP_CYCLE',
        'Direct RPC linking C as parent of A must throw RELATIONSHIP_CYCLE'
    );

    -- Test 3: Bốn thế hệ cycle rejection: D -> A (D là chắt A, cố gắng làm cha A)
    PERFORM is(
        _system.check_parent_child_cycle(v_tree_id, v_d, v_a),
        true,
        '4-generation cycle D -> A must be detected as cycle'
    );

    -- Test 4: Hợp lệ: Thêm người ngoài làm cha của A (không có chu trình)
    PERFORM is(
        _system.check_parent_child_cycle(v_tree_id, gen_random_uuid(), v_a),
        false,
        'Adding unrelated person as parent of A does not create cycle'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;
