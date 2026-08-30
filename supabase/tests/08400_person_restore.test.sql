BEGIN;
SELECT plan(4);

-- Kiểm tra RPC restore_person tồn tại và hoạt động an toàn
SELECT has_function('public', 'restore_person', ARRAY['uuid', 'integer'], 'Hàm public.restore_person(uuid, integer) phải tồn tại');

DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_tree_id UUID := '22222222-2222-4222-a222-222222222222';
    v_person_id UUID := '33333333-3333-4333-a333-333333333333';
    v_ok boolean;
BEGIN
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Tester Person Restore')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.family_trees (id, name, status, created_by, updated_by)
    VALUES (v_tree_id, 'Cây Khôi Phục Person', 'active', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
    VALUES (v_tree_id, v_user_id, 'owner', 'active', v_user_id, v_user_id)
    ON CONFLICT (tree_id, user_id) DO NOTHING;

    -- Insert person bị soft deleted
    INSERT INTO public.persons (
        id, tree_id, full_name, normalized_name, gender, living_status,
        version, deleted_at, deleted_by, created_by, updated_by
    ) VALUES (
        v_person_id, v_tree_id, 'Người Bị Xóa', 'nguoi bi xoa', 'male', 'living',
        1, timezone('utc'::text, now()), v_user_id, v_user_id, v_user_id
    ) ON CONFLICT (id) DO UPDATE SET deleted_at = timezone('utc'::text, now()), version = 1;

    -- Giả lập auth.uid()
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);

    -- Gọi restore
    v_ok := public.restore_person(v_person_id, 1);
    IF NOT v_ok THEN
        RAISE EXCEPTION 'restore_person returned false';
    END IF;
END;
$$;

SELECT is(
    (SELECT deleted_at IS NULL FROM public.persons WHERE id = '33333333-3333-4333-a333-333333333333'),
    true,
    'Person deleted_at đã trở về NULL sau khi restore'
);

SELECT results_eq(
    'SELECT version FROM public.persons WHERE id = ''33333333-3333-4333-a333-333333333333''',
    ARRAY[2],
    'Person version tăng lên 2 sau khi restore'
);

SELECT isnt_empty(
    'SELECT 1 FROM public.audit_logs WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' AND entity_type = ''person'' AND action_type = ''restore''',
    'Audit log cho thao tác restore person đã được tự động ghi nhận'
);

SELECT * FROM finish();
ROLLBACK;
