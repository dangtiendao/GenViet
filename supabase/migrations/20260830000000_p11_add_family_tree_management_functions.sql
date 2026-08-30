-- ==============================================================================
-- Migration: 20260830000000_p11_add_family_tree_management_functions.sql
-- Phase: P11 (Family Tree Management - Quản lý gia phả)
-- Author: Principal Full-stack Engineer & Database Architect
-- Description:
--   1. Atomic RPC: public.create_family_tree (creates tree & owner membership atomically)
--   2. Atomic RPC: public.restore_family_tree (restores soft-deleted tree for owner)
--   3. Owner Trash RLS policy: family_trees_select_deleted_owners
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ATOMIC CREATE FAMILY TREE RPC FUNCTION
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_family_tree(
    p_name text,
    p_description text DEFAULT NULL,
    p_privacy_level tree_privacy_level DEFAULT 'private'::tree_privacy_level
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_trimmed_name text;
    v_trimmed_desc text;
BEGIN
    -- 1. Xác thực actor
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to create a family tree'
            USING ERRCODE = '42501';
    END IF;

    -- 2. Validate input
    v_trimmed_name := trim(p_name);
    IF v_trimmed_name IS NULL OR char_length(v_trimmed_name) = 0 THEN
        RAISE EXCEPTION 'Family tree name cannot be empty'
            USING ERRCODE = '22023';
    END IF;

    IF char_length(v_trimmed_name) > 100 THEN
        RAISE EXCEPTION 'Family tree name exceeds maximum length of 100 characters'
            USING ERRCODE = '22023';
    END IF;

    IF p_description IS NOT NULL THEN
        v_trimmed_desc := trim(p_description);
        IF char_length(v_trimmed_desc) > 1000 THEN
            RAISE EXCEPTION 'Family tree description exceeds maximum length of 1000 characters'
                USING ERRCODE = '22023';
        END IF;
        IF char_length(v_trimmed_desc) = 0 THEN
            v_trimmed_desc := NULL;
        END IF;
    ELSE
        v_trimmed_desc := NULL;
    END IF;

    -- 3. Tạo Family Tree
    INSERT INTO public.family_trees (
        name,
        description,
        status,
        privacy_level,
        created_by,
        updated_by
    ) VALUES (
        v_trimmed_name,
        v_trimmed_desc,
        'active'::tree_status,
        COALESCE(p_privacy_level, 'private'::tree_privacy_level),
        v_user_id,
        v_user_id
    ) RETURNING id INTO v_tree_id;

    -- 4. Tạo Owner Membership cho chính user đó
    INSERT INTO public.tree_memberships (
        tree_id,
        user_id,
        role,
        status,
        created_by,
        updated_by
    ) VALUES (
        v_tree_id,
        v_user_id,
        'owner'::membership_role,
        'active'::membership_status,
        v_user_id,
        v_user_id
    );

    RETURN v_tree_id;
END;
$$;

COMMENT ON FUNCTION public.create_family_tree(text, text, tree_privacy_level) IS
    'Atomically creates a new family tree and assigns active owner membership to auth.uid()';

REVOKE ALL ON FUNCTION public.create_family_tree(text, text, tree_privacy_level) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_family_tree(text, text, tree_privacy_level) TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 2. ATOMIC RESTORE FAMILY TREE RPC FUNCTION
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.restore_family_tree(
    p_tree_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_is_owner boolean;
    v_is_deleted boolean;
BEGIN
    -- 1. Xác thực actor
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore a family tree'
            USING ERRCODE = '42501';
    END IF;

    -- 2. Kiểm tra quyền Owner
    v_is_owner := _system.is_tree_owner(p_tree_id, v_user_id);
    IF NOT v_is_owner THEN
        RAISE EXCEPTION 'Forbidden: Only an active owner can restore this family tree'
            USING ERRCODE = '42501';
    END IF;

    -- 3. Kiểm tra trạng thái hiện tại của Tree
    SELECT (deleted_at IS NOT NULL) INTO v_is_deleted
    FROM public.family_trees
    WHERE id = p_tree_id;

    IF v_is_deleted IS NULL THEN
        RAISE EXCEPTION 'Family tree not found'
            USING ERRCODE = 'P0002';
    END IF;

    -- Idempotent: nếu đã khôi phục rồi thì trả về true
    IF NOT v_is_deleted THEN
        RETURN true;
    END IF;

    -- 4. Thực hiện khôi phục
    UPDATE public.family_trees
    SET
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_tree_id;

    RETURN true;
END;
$$;

COMMENT ON FUNCTION public.restore_family_tree(UUID) IS
    'Safely restores a soft-deleted family tree for an authenticated active owner';

REVOKE ALL ON FUNCTION public.restore_family_tree(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_family_tree(UUID) TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 3. RLS POLICY CHO OWNER XEM CÂY ĐÃ XÓA MỀM (TRASH ACCESS)
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS family_trees_select_deleted_owners ON public.family_trees;
CREATE POLICY family_trees_select_deleted_owners
    ON public.family_trees
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NOT NULL
        AND _system.is_tree_owner(id)
    );
