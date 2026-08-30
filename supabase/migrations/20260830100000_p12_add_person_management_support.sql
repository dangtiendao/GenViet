-- ==============================================================================
-- Migration: 20260830100000_p12_add_person_management_support.sql
-- Phase: P12 (Person Management - Quản lý nhân vật)
-- Author: Principal Database Architect & PostgreSQL Engineer
-- Description:
--   1. Atomic RPC: public.restore_person (safely restores a soft-deleted person with versioning)
--   2. Trash Access RLS policy: persons_select_deleted_writers
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ATOMIC RESTORE PERSON RPC FUNCTION
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.restore_person(
    p_person_id UUID,
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_current_version INTEGER;
    v_is_deleted boolean;
    v_can_write boolean;
    v_rows_updated INTEGER;
BEGIN
    -- 1. Xác thực actor
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore a person'
            USING ERRCODE = '42501';
    END IF;

    -- 2. Lấy thông tin hiện tại của Person
    SELECT tree_id, (deleted_at IS NOT NULL), version
    INTO v_tree_id, v_is_deleted, v_current_version
    FROM public.persons
    WHERE id = p_person_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Person not found'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Kiểm tra quyền ghi trên Family Tree
    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can restore this person'
            USING ERRCODE = '42501';
    END IF;

    -- 4. Idempotent: nếu Person đang active thì trả về true
    IF NOT v_is_deleted THEN
        RETURN true;
    END IF;

    -- 5. Kiểm tra Optimistic Concurrency nếu caller truyền p_expected_version
    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Person version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

    -- 6. Thực hiện khôi phục
    UPDATE public.persons
    SET
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_person_id
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Failed to restore person due to concurrency conflict'
            USING ERRCODE = '40001';
    END IF;

    RETURN true;
END;
$$;

COMMENT ON FUNCTION public.restore_person(UUID, INTEGER) IS
    'Safely restores a soft-deleted person for an authorized tree writer with optimistic concurrency check';

REVOKE ALL ON FUNCTION public.restore_person(UUID, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_person(UUID, INTEGER) TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 2. RLS POLICY CHO WRITERS TRUY CẬP PERSONS ĐÃ XÓA MỀM (TRASH ACCESS)
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS persons_select_deleted_writers ON public.persons;
CREATE POLICY persons_select_deleted_writers
    ON public.persons
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NOT NULL
        AND _system.can_write_tree(tree_id)
    );
