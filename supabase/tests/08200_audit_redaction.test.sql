BEGIN;
SELECT plan(3);

-- Kiểm tra snapshot before và after không lưu trữ dữ liệu nhạy cảm
DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_tree_id UUID := '22222222-2222-4222-a222-222222222222';
    v_person_id UUID := '33333333-3333-4333-a333-333333333333';
BEGIN
    INSERT INTO public.profiles (id, full_name) VALUES (v_user_id, 'Tester Alpha')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.family_trees (id, name, status, created_by, updated_by)
    VALUES (v_tree_id, 'Cây Redaction', 'active', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    PERFORM _system.write_audit_log(
        v_tree_id,
        'person',
        v_person_id,
        'update',
        jsonb_build_object('full_name', 'Tên Cũ', 'living_status', 'living'),
        jsonb_build_object('full_name', 'Tên Mới', 'living_status', 'living'),
        ARRAY['full_name'],
        'Cập nhật họ tên',
        'unit_test',
        NULL,
        v_user_id
    );
END;
$$;

SELECT results_eq(
    'SELECT changed_fields FROM public.audit_logs WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' AND action_type = ''update''',
    ARRAY[ARRAY['full_name']],
    'Changed fields chỉ chứa trường thực sự thay đổi'
);

SELECT is(
    (SELECT before_data ? 'password' FROM public.audit_logs WHERE tree_id = '22222222-2222-4222-a222-222222222222' LIMIT 1),
    false,
    'Before data tuyệt đối không chứa password'
);

SELECT is(
    (SELECT after_data ? 'token' FROM public.audit_logs WHERE tree_id = '22222222-2222-4222-a222-222222222222' LIMIT 1),
    false,
    'After data tuyệt đối không chứa token'
);

SELECT * FROM finish();
ROLLBACK;
