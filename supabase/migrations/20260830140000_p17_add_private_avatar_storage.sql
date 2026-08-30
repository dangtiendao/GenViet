-- ==============================================================================
-- Migration: 20260830140000_p17_add_private_avatar_storage.sql
-- Phase: P17 (Ảnh đại diện & Storage)
-- Author: Principal Full-stack Engineer & Supabase Storage Architect
-- Description:
--   1. Tạo private bucket person-avatars trong storage.buckets.
--   2. Bổ sung cột avatar_path vào bảng public.persons.
--   3. Tạo bảng public.person_avatars lưu trữ metadata ảnh đại diện.
--   4. Tạo helper functions trích xuất Tree ID và Person ID an toàn từ object path.
--   5. Thiết lập RLS policies cho bảng metadata person_avatars và storage.objects.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TẠO PRIVATE STORAGE BUCKET
-- ------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'person-avatars',
    'person-avatars',
    false,
    10485760, -- 10 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- ------------------------------------------------------------------------------
-- 2. BỔ SUNG CỘT AVATAR_PATH VÀO BẢNG PERSONS
-- ------------------------------------------------------------------------------

ALTER TABLE public.persons
ADD COLUMN IF NOT EXISTS avatar_path TEXT NULL;

COMMENT ON COLUMN public.persons.avatar_path IS 'Đường dẫn tới ảnh đại diện active trong bucket person-avatars';

-- ------------------------------------------------------------------------------
-- 3. BẢNG QUẢN LÝ METADATA ẢNH ĐẠI DIỆN (person_avatars)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.person_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    bucket_id TEXT NOT NULL DEFAULT 'person-avatars',
    object_path TEXT NOT NULL,
    thumbnail_path TEXT NOT NULL,
    original_filename TEXT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    width INTEGER NULL,
    height INTEGER NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('temporary', 'active', 'replaced', 'deleted')),
    created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT uq_person_avatars_object_path UNIQUE (object_path)
);

COMMENT ON TABLE public.person_avatars IS 'Lưu trữ metadata và lịch sử ảnh đại diện của nhân vật phả hệ';

CREATE INDEX IF NOT EXISTS idx_person_avatars_tree_person_status
ON public.person_avatars (tree_id, person_id, status)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_person_avatars_temporary_cleanup
ON public.person_avatars (created_at)
WHERE status = 'temporary' AND deleted_at IS NULL;

CREATE TRIGGER trg_person_avatars_updated_at
BEFORE UPDATE ON public.person_avatars
FOR EACH ROW EXECUTE FUNCTION _system.set_updated_at();

-- ------------------------------------------------------------------------------
-- 4. HELPER FUNCTIONS TRÍCH XUẤT PATH SEGMENTS AN TOÀN
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.extract_tree_id_from_avatar_path(name text)
RETURNS uuid AS $$
DECLARE
    v_parts text[];
    v_tree_str text;
BEGIN
    IF name IS NULL THEN
        RETURN NULL;
    END IF;

    v_parts := string_to_array(name, '/');

    -- Pattern 1: trees/{tree_id}/persons/...
    IF array_length(v_parts, 1) >= 2 AND v_parts[1] = 'trees' THEN
        v_tree_str := v_parts[2];
    -- Pattern 2: temporary/trees/{tree_id}/persons/...
    ELSIF array_length(v_parts, 1) >= 3 AND v_parts[1] = 'temporary' AND v_parts[2] = 'trees' THEN
        v_tree_str := v_parts[3];
    ELSE
        RETURN NULL;
    END IF;

    IF v_tree_str ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        RETURN v_tree_str::uuid;
    END IF;

    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION _system.extract_person_id_from_avatar_path(name text)
RETURNS uuid AS $$
DECLARE
    v_parts text[];
    v_person_str text;
BEGIN
    IF name IS NULL THEN
        RETURN NULL;
    END IF;

    v_parts := string_to_array(name, '/');

    -- Pattern 1: trees/{tree_id}/persons/{person_id}/...
    IF array_length(v_parts, 1) >= 4 AND v_parts[1] = 'trees' AND v_parts[3] = 'persons' THEN
        v_person_str := v_parts[4];
    -- Pattern 2: temporary/trees/{tree_id}/persons/{person_id}/...
    ELSIF array_length(v_parts, 1) >= 5 AND v_parts[1] = 'temporary' AND v_parts[2] = 'trees' AND v_parts[3] = 'persons' THEN
        v_person_str := v_parts[4];
    ELSE
        RETURN NULL;
    END IF;

    IF v_person_str ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        RETURN v_person_str::uuid;
    END IF;

    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ------------------------------------------------------------------------------
-- 5. RLS POLICIES CHO BẢNG METADATA (public.person_avatars)
-- ------------------------------------------------------------------------------

ALTER TABLE public.person_avatars ENABLE ROW LEVEL SECURITY;

-- SELECT policy: Thành viên active của Tree hoặc Tree public
CREATE POLICY person_avatars_select_policy
ON public.person_avatars
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = person_avatars.tree_id
          AND tm.user_id = auth.uid()
          AND tm.deleted_at IS NULL
          AND tm.status = 'active'
    ) OR EXISTS (
        SELECT 1
        FROM public.family_trees ft
        WHERE ft.id = person_avatars.tree_id
          AND ft.deleted_at IS NULL
          AND ft.privacy_level = 'public'
          AND ft.status = 'active'
    )
);

-- INSERT policy: Chỉ Writer (Owner, Admin, Editor) của Tree
CREATE POLICY person_avatars_insert_policy
ON public.person_avatars
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = person_avatars.tree_id
          AND tm.user_id = auth.uid()
          AND tm.deleted_at IS NULL
          AND tm.status = 'active'
          AND tm.role IN ('owner', 'admin', 'editor')
    )
);

-- UPDATE policy: Chỉ Writer (Owner, Admin, Editor) của Tree
CREATE POLICY person_avatars_update_policy
ON public.person_avatars
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = person_avatars.tree_id
          AND tm.user_id = auth.uid()
          AND tm.deleted_at IS NULL
          AND tm.status = 'active'
          AND tm.role IN ('owner', 'admin', 'editor')
    )
);

-- DELETE policy: Chỉ Writer (Owner, Admin, Editor) của Tree
CREATE POLICY person_avatars_delete_policy
ON public.person_avatars
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = person_avatars.tree_id
          AND tm.user_id = auth.uid()
          AND tm.deleted_at IS NULL
          AND tm.status = 'active'
          AND tm.role IN ('owner', 'admin', 'editor')
    )
);

-- ------------------------------------------------------------------------------
-- 6. STORAGE RLS POLICIES TRÊN storage.objects (Bucket person-avatars)
-- ------------------------------------------------------------------------------

-- 6.1. READ POLICY (SELECT)
CREATE POLICY person_avatars_storage_read_policy
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'person-avatars'
    AND (
        EXISTS (
            SELECT 1
            FROM public.tree_memberships tm
            WHERE tm.tree_id = _system.extract_tree_id_from_avatar_path(name)
              AND tm.user_id = auth.uid()
              AND tm.deleted_at IS NULL
              AND tm.status = 'active'
        ) OR EXISTS (
            SELECT 1
            FROM public.family_trees ft
            WHERE ft.id = _system.extract_tree_id_from_avatar_path(name)
              AND ft.deleted_at IS NULL
              AND ft.privacy_level = 'public'
              AND ft.status = 'active'
        )
    )
);

-- 6.2. UPLOAD POLICY (INSERT)
CREATE POLICY person_avatars_storage_upload_policy
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'person-avatars'
    AND EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        JOIN public.persons p ON p.id = _system.extract_person_id_from_avatar_path(name)
        WHERE tm.tree_id = _system.extract_tree_id_from_avatar_path(name)
          AND tm.user_id = auth.uid()
          AND tm.deleted_at IS NULL
          AND tm.status = 'active'
          AND tm.role IN ('owner', 'admin', 'editor')
          AND p.tree_id = tm.tree_id
          AND p.deleted_at IS NULL
    )
);

-- 6.3. DELETE POLICY (DELETE)
CREATE POLICY person_avatars_storage_delete_policy
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'person-avatars'
    AND EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = _system.extract_tree_id_from_avatar_path(name)
          AND tm.user_id = auth.uid()
          AND tm.deleted_at IS NULL
          AND tm.status = 'active'
          AND tm.role IN ('owner', 'admin', 'editor')
    )
);
