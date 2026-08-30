-- ==============================================================================
-- Test Suite: 02100_family_tree_restore.test.sql
-- Phase: P11 (Family Tree Management - Soft Delete & Restore Verification)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Setup: Create Owner User and a soft-deleted tree
DO $$
DECLARE
    v_owner_id UUID := gen_random_uuid();
    v_other_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_restore_result boolean;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_owner_id, 'restore-owner@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_owner_id, 'Owner Restore');

    INSERT INTO auth.users (id, email) VALUES (v_other_user_id, 'other-user@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_other_user_id, 'Other User');

    -- Giả lập Owner tạo cây
    PERFORM set_config('request.jwt.claim.sub', v_owner_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Họ Trần Cần Khôi Phục');

    -- Xóa mềm cây
    UPDATE public.family_trees
    SET deleted_at = timezone('utc'::text, now()), deleted_by = v_owner_id
    WHERE id = v_tree_id;

    -- Kiểm tra cây đã bị xóa mềm
    PERFORM is(
        (SELECT count(*)::int FROM public.family_trees WHERE id = v_tree_id AND deleted_at IS NOT NULL),
        1,
        'Tree should be marked as soft deleted'
    );

    -- Test: Người dùng khác không thể khôi phục cây của Owner
    PERFORM set_config('request.jwt.claim.sub', v_other_user_id::text, true);
    PERFORM throws_matching(
        format('SELECT public.restore_family_tree(%L)', v_tree_id),
        'Forbidden: Only an active owner',
        'Non-owner cannot restore family tree'
    );

    -- Test: Owner thực hiện khôi phục thành công
    PERFORM set_config('request.jwt.claim.sub', v_owner_id::text, true);
    v_restore_result := public.restore_family_tree(v_tree_id);

    PERFORM is(
        v_restore_result,
        true,
        'restore_family_tree must return true for active owner'
    );

    -- Kiểm tra deleted_at đã được đặt lại null
    PERFORM is(
        (SELECT count(*)::int FROM public.family_trees WHERE id = v_tree_id AND deleted_at IS NULL),
        1,
        'Tree must be active again with deleted_at = NULL'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;
