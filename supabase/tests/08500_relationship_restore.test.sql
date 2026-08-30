BEGIN;
SELECT plan(4);

SELECT has_function('public', 'restore_parent_child_relationship', ARRAY['uuid', 'integer'], 'Hàm public.restore_parent_child_relationship(uuid, integer) phải tồn tại');

DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_tree_id UUID := '22222222-2222-4222-a222-222222222222';
    v_parent_id UUID := '33333333-3333-4333-a333-333333333333';
    v_child_id UUID := '44444444-4444-4444-a444-444444444444';
    v_rel_id UUID := '55555555-5555-4555-a555-555555555555';
    v_ok boolean;
BEGIN
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Tester Rel Restore')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.family_trees (id, name, status, created_by, updated_by)
    VALUES (v_tree_id, 'Cây Khôi Phục Quan Hệ', 'active', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
    VALUES (v_tree_id, v_user_id, 'owner', 'active', v_user_id, v_user_id)
    ON CONFLICT (tree_id, user_id) DO NOTHING;

    -- Insert parent & child active
    INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by)
    VALUES (v_parent_id, v_tree_id, 'Bố', 'bo', 'male', 'living', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by)
    VALUES (v_child_id, v_tree_id, 'Con', 'con', 'male', 'living', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    -- Insert relationship soft-deleted
    INSERT INTO public.parent_child_relationships (
        id, tree_id, parent_id, child_id, parent_role, relationship_kind,
        version, deleted_at, deleted_by, created_by, updated_by
    ) VALUES (
        v_rel_id, v_tree_id, v_parent_id, v_child_id, 'father', 'biological',
        1, timezone('utc'::text, now()), v_user_id, v_user_id, v_user_id
    ) ON CONFLICT (id) DO NOTHING;

    -- Giả lập auth
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);

    -- Khôi phục
    v_ok := public.restore_parent_child_relationship(v_rel_id, 1);
    IF NOT v_ok THEN
        RAISE EXCEPTION 'restore_parent_child_relationship returned false';
    END IF;
END;
$$;

SELECT is(
    (SELECT deleted_at IS NULL FROM public.parent_child_relationships WHERE id = '55555555-5555-4555-a555-555555555555'),
    true,
    'Relationship deleted_at trở về NULL sau khi restore'
);

SELECT results_eq(
    'SELECT version FROM public.parent_child_relationships WHERE id = ''55555555-5555-4555-a555-555555555555''',
    ARRAY[2],
    'Relationship version tăng lên 2 sau khi restore'
);

SELECT isnt_empty(
    'SELECT 1 FROM public.audit_logs WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' AND entity_type = ''parent_child_relationship'' AND action_type = ''restore''',
    'Audit log cho thao tác restore relationship đã được tự động ghi nhận'
);

SELECT * FROM finish();
ROLLBACK;
