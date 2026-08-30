BEGIN;
SELECT plan(4);

DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_new_tree_id UUID := 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
    v_new_person_id UUID := 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
    v_payload JSONB;
    v_res JSONB;
BEGIN
    INSERT INTO public.profiles (id, full_name) VALUES (v_user_id, 'Tester Import')
    ON CONFLICT (id) DO NOTHING;

    -- Thiết lập JWT context
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);

    v_payload := jsonb_build_object(
        'tree', jsonb_build_object(
            'id', v_new_tree_id,
            'name', 'Cây Nhập Từ Backup',
            'description', 'Mô tả test import',
            'privacyLevel', 'private'
        ),
        'persons', jsonb_build_array(
            jsonb_build_object(
                'id', v_new_person_id,
                'fullName', 'Nguyễn Văn Đã Nhập',
                'gender', 'male',
                'livingStatus', 'living'
            )
        ),
        'parentChildRelationships', '[]'::jsonb,
        'unions', '[]'::jsonb,
        'unionMembers', '[]'::jsonb
    );

    v_res := public.import_family_tree_backup(v_payload);
END;
$$;

SELECT ok(
    EXISTS (SELECT 1 FROM public.family_trees WHERE id = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'::uuid AND privacy_level = 'private'),
    'Import thành công tạo Family Tree mới ở trạng thái private'
);

SELECT ok(
    EXISTS (SELECT 1 FROM public.tree_memberships WHERE tree_id = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'::uuid AND user_id = '11111111-1111-4111-a111-111111111111'::uuid AND role = 'owner'),
    'Người thực hiện import trở thành Owner của cây mới'
);

SELECT ok(
    EXISTS (SELECT 1 FROM public.persons WHERE id = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'::uuid AND tree_id = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'::uuid),
    'Nhân vật được import thành công với đúng tree_id mới'
);

SELECT ok(
    EXISTS (SELECT 1 FROM public.audit_logs WHERE tree_id = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'::uuid AND action_type = 'create'),
    'Audit log tự động ghi nhận sự kiện import'
);

SELECT * FROM finish();
ROLLBACK;
