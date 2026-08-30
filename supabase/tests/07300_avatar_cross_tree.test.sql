-- ==============================================================================
-- Test Suite: 07300_avatar_cross_tree.test.sql
-- Phase: P17 (Avatar Metadata Cross-Tree Isolation & Security)
-- ==============================================================================

BEGIN;
SELECT plan(3);

DO $$
DECLARE
    v_user_a UUID := gen_random_uuid();
    v_user_b UUID := gen_random_uuid();
    v_tree_a UUID;
    v_tree_b UUID;
    v_person_a UUID;
    v_person_b UUID;
    v_avatar_a UUID;
    v_count INTEGER;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_a, 'usera@genviet.local');
    INSERT INTO auth.users (id, email) VALUES (v_user_b, 'userb@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_a, 'User A');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_b, 'User B');

    -- User A creates Tree A and Person A
    PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_a := public.create_family_tree('Cây Gia Phả A');
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree_a, 'Người Tree A', v_user_a, v_user_a)
    RETURNING id INTO v_person_a;

    INSERT INTO public.person_avatars (
        tree_id,
        person_id,
        object_path,
        thumbnail_path,
        mime_type,
        size_bytes,
        created_by
    ) VALUES (
        v_tree_a,
        v_person_a,
        'trees/' || v_tree_a || '/persons/' || v_person_a || '/avatars/media-a/avatar.webp',
        'trees/' || v_tree_a || '/persons/' || v_person_a || '/avatars/media-a/thumb.webp',
        'image/webp',
        50000,
        v_user_a
    ) RETURNING id INTO v_avatar_a;

    -- User B creates Tree B and Person B
    PERFORM set_config('request.jwt.claim.sub', v_user_b::text, true);
    v_tree_b := public.create_family_tree('Cây Gia Phả B');
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree_b, 'Người Tree B', v_user_b, v_user_b)
    RETURNING id INTO v_person_b;

    -- Test 1: User B không thể đọc avatar metadata của Tree A
    SELECT count(*) INTO v_count FROM public.person_avatars WHERE tree_id = v_tree_a;
    PERFORM is(v_count, 0, 'User B must not see avatar metadata from Tree A');

    -- Test 2: User B không thể update/xóa avatar metadata của Tree A
    UPDATE public.person_avatars SET status = 'deleted' WHERE id = v_avatar_a;
    PERFORM is(
        (SELECT status FROM public.person_avatars WHERE id = v_avatar_a),
        'active',
        'User B cannot update or soft-delete avatar metadata of Tree A'
    );

    -- Test 3: User B không thể tạo avatar metadata giả mạo gán vào Person của Tree A
    BEGIN
        INSERT INTO public.person_avatars (
            tree_id,
            person_id,
            object_path,
            thumbnail_path,
            mime_type,
            size_bytes,
            created_by
        ) VALUES (
            v_tree_a,
            v_person_a,
            'trees/' || v_tree_a || '/persons/' || v_person_a || '/avatars/fake/avatar.webp',
            'trees/' || v_tree_a || '/persons/' || v_person_a || '/avatars/fake/thumb.webp',
            'image/webp',
            1000,
            v_user_b
        );
        PERFORM ok(false, 'User B inserting into Tree A must be rejected by RLS');
    EXCEPTION WHEN OTHERS THEN
        PERFORM ok(true, 'User B inserting into Tree A is blocked by RLS');
    END;

END $$;

SELECT * FROM finish();
ROLLBACK;
