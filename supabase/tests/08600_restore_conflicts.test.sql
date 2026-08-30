BEGIN;
SELECT plan(2);

-- Kiểm tra chặn restore khi person cha đang bị xóa (Dependency deleted guard)
DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_tree_id UUID := '22222222-2222-4222-a222-222222222222';
    v_parent_id UUID := '33333333-3333-4333-a333-333333333333';
    v_child_id UUID := '44444444-4444-4444-a444-444444444444';
    v_rel_id UUID := '55555555-5555-4555-a555-555555555555';
    v_error_thrown boolean := false;
BEGIN
    INSERT INTO public.profiles (id, full_name) VALUES (v_user_id, 'Tester Conflict')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.family_trees (id, name, status, created_by, updated_by)
    VALUES (v_tree_id, 'Cây Conflict', 'active', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
    VALUES (v_tree_id, v_user_id, 'owner', 'active', v_user_id, v_user_id)
    ON CONFLICT (tree_id, user_id) DO NOTHING;

    -- Insert parent ĐANG BỊ XÓA MỀM
    INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, deleted_at, created_by, updated_by)
    VALUES (v_parent_id, v_tree_id, 'Bố Bị Xóa', 'bo bi xoa', 'male', 'living', timezone('utc'::text, now()), v_user_id, v_user_id)
    ON CONFLICT (id) DO UPDATE SET deleted_at = timezone('utc'::text, now());

    -- Insert child active
    INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by)
    VALUES (v_child_id, v_tree_id, 'Con Active', 'con active', 'male', 'living', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    -- Insert relationship soft-deleted
    INSERT INTO public.parent_child_relationships (
        id, tree_id, parent_id, child_id, parent_role, relationship_kind,
        version, deleted_at, deleted_by, created_by, updated_by
    ) VALUES (
        v_rel_id, v_tree_id, v_parent_id, v_child_id, 'father', 'biological',
        1, timezone('utc'::text, now()), v_user_id, v_user_id, v_user_id
    ) ON CONFLICT (id) DO NOTHING;

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);

    BEGIN
        PERFORM public.restore_parent_child_relationship(v_rel_id, 1);
    EXCEPTION WHEN OTHERS THEN
        v_error_thrown := true;
    END;

    IF NOT v_error_thrown THEN
        RAISE EXCEPTION 'Expected error when restoring relationship with deleted parent, but succeeded!';
    END IF;
END;
$$;

SELECT is(
    (SELECT deleted_at IS NOT NULL FROM public.parent_child_relationships WHERE id = '55555555-5555-4555-a555-555555555555'),
    true,
    'Relationship vẫn ở trạng thái deleted khi cha/mẹ chưa được restore'
);

SELECT pass('Chặn thành công khôi phục quan hệ khi person phụ thuộc bị xóa');

SELECT * FROM finish();
ROLLBACK;
