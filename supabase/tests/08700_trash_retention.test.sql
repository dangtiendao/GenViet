BEGIN;
SELECT plan(2);

-- Kiểm tra logic lọc bản ghi thùng rác đủ điều kiện purge (> 30 ngày)
DO $$
DECLARE
    v_user_id UUID := '11111111-1111-4111-a111-111111111111';
    v_tree_id UUID := '22222222-2222-4222-a222-222222222222';
    v_person_old_id UUID := '33333333-3333-4333-a333-333333333333';
    v_person_recent_id UUID := '44444444-4444-4444-a444-444444444444';
BEGIN
    INSERT INTO public.profiles (id, full_name) VALUES (v_user_id, 'Tester Retention')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.family_trees (id, name, status, created_by, updated_by)
    VALUES (v_tree_id, 'Cây Retention', 'active', v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    -- 1. Person bị xóa 35 ngày trước (đủ điều kiện purge)
    INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, deleted_at, created_by, updated_by)
    VALUES (v_person_old_id, v_tree_id, 'Cụ Quá Hạn', 'cu qua han', 'male', 'deceased', timezone('utc'::text, now() - INTERVAL '35 days'), v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;

    -- 2. Person bị xóa 5 ngày trước (chưa đủ điều kiện purge)
    INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, deleted_at, created_by, updated_by)
    VALUES (v_person_recent_id, v_tree_id, 'Cụ Mới Xóa', 'cu moi xoa', 'male', 'deceased', timezone('utc'::text, now() - INTERVAL '5 days'), v_user_id, v_user_id)
    ON CONFLICT (id) DO NOTHING;
END;
$$;

SELECT results_eq(
    'SELECT id FROM public.persons WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' AND deleted_at < timezone(''utc''::text, now() - INTERVAL ''30 days'')',
    ARRAY['33333333-3333-4333-a333-333333333333'::uuid],
    'Chỉ có person bị xóa > 30 ngày mới đủ điều kiện dọn dẹp'
);

SELECT results_eq(
    'SELECT id FROM public.persons WHERE tree_id = ''22222222-2222-4222-a222-222222222222'' AND deleted_at >= timezone(''utc''::text, now() - INTERVAL ''30 days'')',
    ARRAY['44444444-4444-4444-a444-444444444444'::uuid],
    'Person bị xóa < 30 ngày được bảo lưu an toàn trong thùng rác'
);

SELECT * FROM finish();
ROLLBACK;
