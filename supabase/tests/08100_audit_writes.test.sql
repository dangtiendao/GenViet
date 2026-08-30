BEGIN;
SELECT plan(6);

-- 1. Helper _system.write_audit_log phải tồn tại
SELECT has_function('_system', 'write_audit_log', 'Hàm _system.write_audit_log phải tồn tại');

-- 2. RPC public.record_audit_event phải tồn tại
SELECT has_function('public', 'record_audit_event', 'Hàm public.record_audit_event phải tồn tại');

-- 3. Tạo mock tree và ghi log
DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_tree_id UUID := '22222222-2222-4222-a222-222222222222';
    v_person_id UUID := '33333333-3333-4333-a333-333333333333';
    v_audit_id UUID;
BEGIN
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Tester Alpha')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.family_trees (id, name, status, created_by, updated_by)
    VALUES (v_tree_id, 'Cây Thử Nghiệm Audit', 'active', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    v_audit_id := _system.write_audit_log(
        v_tree_id,
        'person',
        v_person_id,
        'create',
        NULL,
        jsonb_build_object('full_name', 'Nguyễn Văn Test'),
        ARRAY['full_name'],
        'Thử nghiệm ghi audit',
        'unit_test',
        NULL,
        v_user_id
    );

    IF v_audit_id IS NULL THEN
        RAISE EXCEPTION 'Audit ID returned is null';
    END IF;
END;
$$;

SELECT isnt_empty(
    'SELECT 1 FROM public.audit_logs WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' AND entity_type = ''person''',
    'Bản ghi audit log cho person đã được ghi thành công'
);

SELECT results_eq(
    'SELECT actor_name_cached FROM public.audit_logs WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' LIMIT 1',
    ARRAY['Tester Alpha'],
    'Actor name cached được ghi chính xác'
);

SELECT results_eq(
    'SELECT action_type FROM public.audit_logs WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' LIMIT 1',
    ARRAY['create'::varchar(50)],
    'Action type là create'
);

SELECT results_eq(
    'SELECT (after_data->>''full_name'') FROM public.audit_logs WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' LIMIT 1',
    ARRAY['Nguyễn Văn Test'],
    'After data chứa full_name chính xác'
);

SELECT * FROM finish();
ROLLBACK;
