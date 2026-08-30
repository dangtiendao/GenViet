-- ==============================================================================
-- Test Suite: 07200_avatar_metadata.test.sql
-- Phase: P17 (Person Avatars Metadata Table & RLS)
-- ==============================================================================

BEGIN;
SELECT plan(4);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_person_id UUID;
    v_avatar_id UUID;
    v_count INTEGER;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'avatar-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Avatar User');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Quản Lý Ảnh Đại Diện');

    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree_id, 'Nguyễn Văn Chân Dung', v_user_id, v_user_id)
    RETURNING id INTO v_person_id;

    -- Test 1: Tạo bản ghi metadata avatar
    INSERT INTO public.person_avatars (
        tree_id,
        person_id,
        object_path,
        thumbnail_path,
        mime_type,
        size_bytes,
        width,
        height,
        status,
        created_by
    ) VALUES (
        v_tree_id,
        v_person_id,
        'trees/' || v_tree_id || '/persons/' || v_person_id || '/avatars/media-1/avatar.webp',
        'trees/' || v_tree_id || '/persons/' || v_person_id || '/avatars/media-1/thumb.webp',
        'image/webp',
        45000,
        512,
        512,
        'active',
        v_user_id
    ) RETURNING id INTO v_avatar_id;

    PERFORM is(
        (SELECT count(*)::integer FROM public.person_avatars WHERE id = v_avatar_id),
        1,
        'Active member can insert person_avatar metadata record'
    );

    -- Test 2: Cập nhật avatar_path trên bảng persons
    UPDATE public.persons
    SET avatar_path = 'trees/' || v_tree_id || '/persons/' || v_person_id || '/avatars/media-1/avatar.webp'
    WHERE id = v_person_id;

    PERFORM is(
        (SELECT avatar_path FROM public.persons WHERE id = v_person_id),
        'trees/' || v_tree_id || '/persons/' || v_person_id || '/avatars/media-1/avatar.webp',
        'Person avatar_path references active avatar object path'
    );

    -- Test 3: RLS SELECT trả về đúng bản ghi cho Tree member
    SELECT count(*) INTO v_count FROM public.person_avatars WHERE person_id = v_person_id;
    PERFORM is(v_count, 1, 'Tree member can read person_avatars metadata');

    -- Test 4: Thay thế avatar (chuyển trạng thái avatar cũ sang replaced)
    UPDATE public.person_avatars
    SET status = 'replaced'
    WHERE id = v_avatar_id;

    PERFORM is(
        (SELECT status FROM public.person_avatars WHERE id = v_avatar_id),
        'replaced',
        'Can transition previous avatar metadata status to replaced'
    );

END $$;

SELECT * FROM finish();
ROLLBACK;
