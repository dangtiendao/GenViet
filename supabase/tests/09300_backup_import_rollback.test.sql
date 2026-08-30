BEGIN;
SELECT plan(2);

DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_new_tree_id UUID := 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
    v_person_id UUID := 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
    v_payload JSONB;
BEGIN
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Tester Rollback')
    ON CONFLICT (id) DO NOTHING;

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);

    -- Tạo payload cố tình chứa lỗi Self-link ở Relationship để kích hoạt Exception
    v_payload := jsonb_build_object(
        'tree', jsonb_build_object(
            'id', v_new_tree_id,
            'name', 'Cây Phải Bị Rollback'
        ),
        'persons', jsonb_build_array(
            jsonb_build_object(
                'id', v_person_id,
                'fullName', 'Nguyễn Văn A',
                'gender', 'male',
                'livingStatus', 'living'
            )
        ),
        'parentChildRelationships', jsonb_build_array(
            jsonb_build_object(
                'id', 'cccccccc-cccc-4ccc-cccc-cccccccccccc'::uuid,
                'parentId', v_person_id,
                'childId', v_person_id -- LỖI: Self-link
            )
        ),
        'unions', '[]'::jsonb,
        'unionMembers', '[]'::jsonb
    );

    BEGIN
        PERFORM public.import_family_tree_backup(v_payload);
    EXCEPTION WHEN OTHERS THEN
        -- Bắt lỗi để kiểm tra trạng thái CSDL sau exception
        NULL;
    END;
END;
$$;

SELECT ok(
    NOT EXISTS (SELECT 1 FROM public.family_trees WHERE id = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'::uuid),
    'Khi có lỗi xảy ra giữa chừng, Family Tree không được tạo (Rollback 100%)'
);

SELECT ok(
    NOT EXISTS (SELECT 1 FROM public.persons WHERE id = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'::uuid),
    'Các Person được chèn trước đó cũng được Rollback hoàn toàn, không có dữ liệu mồ côi'
);

SELECT * FROM finish();
ROLLBACK;
