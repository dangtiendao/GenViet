-- ==============================================================================
-- PROJECT: GenViet - Responsive Web App Quản Lý Cây Gia Phả
-- FILE: supabase/full_schema.sql
-- MỤC ĐÍCH: Hợp nhất toàn bộ các file migration SQL để triển khai 1 lần duy nhất.
-- GHI CHÚ: File này được tổng hợp tuần tự từ tất cả migration trong supabase/migrations/.
--          Các file migration gốc vẫn được giữ nguyên đầy đủ để quản lý theo version.
-- TỔNG SỐ MIGRATION: 14
-- ==============================================================================

-- ==============================================================================
-- DANH SÁCH CÁC MIGRATION ĐƯỢC HỢP NHẤT (THEO THỨ TỰ THỜI GIAN):
--   01. 20260829152230_p06_initialize_supabase_foundation.sql
--   02. 20260829154907_p07_create_core_genealogy_schema.sql
--   03. 20260829160221_p08_add_rls_authorization_policies.sql
--   04. 20260829163000_p09_provision_profiles.sql
--   05. 20260830000000_p11_add_family_tree_management_functions.sql
--   06. 20260830100000_p12_add_person_management_support.sql
--   07. 20260830110000_p13_add_relationship_transactions.sql
--   08. 20260830120000_p14_add_tree_graph_query.sql
--   09. 20260830130000_p16_add_person_search.sql
--   10. 20260830140000_p17_add_private_avatar_storage.sql
--   11. 20260830150000_p18_add_audit_and_recovery.sql
--   12. 20260830170000_p19_add_json_backup_import.sql
--   13. 20260830180000_p21_add_system_heartbeats.sql
--   14. 20260830190000_p23_optimize_graph_queries.sql
-- ==============================================================================

/*******************************************************************************
 * [01/14] MIGRATION: 20260829152230_p06_initialize_supabase_foundation.sql
 *******************************************************************************/

-- ==============================================================================
-- Migration: 20260829152230_p06_initialize_supabase_foundation.sql
-- Phase: P06 (Thiết lập Supabase & Môi trường Ban đầu)
-- Task: P06-T04
-- Author: Principal Backend Engineer & Database DevOps
-- Description: Khởi tạo nền tảng Supabase ban đầu, thiết lập múi giờ UTC và
--              các tiện ích mở rộng chuẩn (extensions) phục vụ phả hệ.
-- Rules: Tuyệt đối không tạo schema nghiệp vụ P07 (profiles, trees, persons).
-- ==============================================================================

-- 1. Đảm bảo các tiện ích mở rộng cốt lõi (Core PostgreSQL Extensions) được kích hoạt
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- 2. Thiết lập định dạng múi giờ mặc định cho database session
SET TIME ZONE 'UTC';

-- 3. Tạo schema kỹ thuật nội bộ cho metadata hệ thống (nếu cần tracking hạ tầng)
CREATE SCHEMA IF NOT EXISTS _system;
COMMENT ON SCHEMA _system IS 'Internal system schema for infrastructure tracking and migration verification';

GRANT USAGE ON SCHEMA _system TO postgres, authenticated, anon, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA _system GRANT EXECUTE ON FUNCTIONS TO postgres, authenticated, anon, service_role;


-- 4. Bảng kỹ thuật theo dõi trạng thái hạ tầng hệ thống
CREATE TABLE IF NOT EXISTS _system.infrastructure_status (
    id TEXT PRIMARY KEY DEFAULT 'genviet_foundation',
    phase_code TEXT NOT NULL DEFAULT 'P06',
    initialized_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    version TEXT NOT NULL DEFAULT 'v0.1.0'
);

COMMENT ON TABLE _system.infrastructure_status IS 'Tracks initial Supabase infrastructure bootstrap status';

-- Ghi nhận marker hạ tầng hoàn tất
INSERT INTO _system.infrastructure_status (id, phase_code, version)
VALUES ('genviet_foundation', 'P06', 'v0.1.0')
ON CONFLICT (id) DO UPDATE
SET initialized_at = timezone('utc'::text, now()),
    version = EXCLUDED.version;

/*******************************************************************************
 * [02/14] MIGRATION: 20260829154907_p07_create_core_genealogy_schema.sql
 *******************************************************************************/

-- ==============================================================================
-- Migration: 20260829154907_p07_create_core_genealogy_schema.sql
-- Phase: P07 (Thiết kế cơ sở dữ liệu lõi & DDL Schema)
-- Author: Principal Database Architect & PostgreSQL Engineer
-- Description: Khởi tạo schema PostgreSQL cốt lõi cho ứng dụng quản lý gia phả GenViet:
--              1. Schema helper functions (_system)
--              2. Domain Enum types
--              3. Core tables: profiles, family_trees, tree_memberships, persons,
--                 parent_child_relationships, unions, union_members
--              4. Composite Foreign Keys cưỡng chế cùng Family Tree (Same-Tree Isolation)
--              5. Check constraints, Unique Partial Indexes, Graph Query Indexes
--              6. Updated_at & Name normalization triggers
--              7. RLS Deny-by-default baseline (không tạo business policies)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HELPER FUNCTIONS (_system Schema)
-- ------------------------------------------------------------------------------

-- Trigger function cập nhật cột updated_at tự động theo UTC
CREATE OR REPLACE FUNCTION _system.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, _system, pg_temp;


COMMENT ON FUNCTION _system.set_updated_at() IS 'Trigger function automatically updating updated_at timestamp in UTC';

-- Function chuẩn hóa họ và tên (hạ chữ thường, trim và thu gọn khoảng trắng liên tiếp)
CREATE OR REPLACE FUNCTION _system.normalize_person_name(input_text text)
RETURNS text AS $$
BEGIN
    IF input_text IS NULL THEN
        RETURN '';
    END IF;
    RETURN lower(regexp_replace(trim(input_text), '\s+', ' ', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION _system.normalize_person_name(text) IS 'Deterministic function to trim, lowercase, and collapse multiple whitespaces';

-- ------------------------------------------------------------------------------
-- 2. DOMAIN ENUM TYPES
-- ------------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE tree_status AS ENUM ('active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tree_privacy_level AS ENUM ('private', 'public');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_role AS ENUM ('owner', 'admin', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_status AS ENUM ('active', 'invited', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'unknown');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE living_status_type AS ENUM ('living', 'deceased', 'unknown');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE date_precision_type AS ENUM ('exact', 'year', 'unknown');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status_type AS ENUM ('unverified', 'verified', 'disputed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE parent_role_type AS ENUM ('father', 'mother', 'unspecified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE relationship_kind_type AS ENUM ('biological', 'adoptive', 'step', 'foster');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE union_status_type AS ENUM ('active', 'separated', 'divorced', 'widowed', 'former');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE union_member_role_type AS ENUM ('spouse', 'partner', 'unspecified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 3. PROFILES (Hồ sơ người dùng ứng dụng - mở rộng từ auth.users)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL CHECK (char_length(trim(display_name)) > 0),
    avatar_path TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.profiles IS 'Application user profile metadata extending auth.users';
COMMENT ON COLUMN public.profiles.id IS 'Primary key mapped 1:1 with auth.users(id)';
COMMENT ON COLUMN public.profiles.display_name IS 'User public display name';

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION _system.set_updated_at();

-- ------------------------------------------------------------------------------
-- 4. FAMILY TREES (Không gian quản lý cây gia phả độc lập)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.family_trees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
    description TEXT NULL,
    status tree_status NOT NULL DEFAULT 'active',
    privacy_level tree_privacy_level NOT NULL DEFAULT 'private',
    generation_anchor_person_id UUID NULL,
    created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0)
);

COMMENT ON TABLE public.family_trees IS 'Root container and privacy boundary for a family tree';
COMMENT ON COLUMN public.family_trees.generation_anchor_person_id IS 'Optional reference to person node designated as Generation 1 anchor';

CREATE TRIGGER trg_family_trees_updated_at
BEFORE UPDATE ON public.family_trees
FOR EACH ROW EXECUTE FUNCTION _system.set_updated_at();

-- ------------------------------------------------------------------------------
-- 5. TREE MEMBERSHIPS (Liên kết thành viên tài khoản với cây gia phả)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tree_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role membership_role NOT NULL DEFAULT 'viewer',
    status membership_status NOT NULL DEFAULT 'active',
    created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0)
);

COMMENT ON TABLE public.tree_memberships IS 'User permissions and membership association to family trees';

CREATE UNIQUE INDEX IF NOT EXISTS idx_tree_memberships_active_user
ON public.tree_memberships (tree_id, user_id)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tree_memberships_tree_id
ON public.tree_memberships (tree_id)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tree_memberships_user_id
ON public.tree_memberships (user_id)
WHERE deleted_at IS NULL;

CREATE TRIGGER trg_tree_memberships_updated_at
BEFORE UPDATE ON public.tree_memberships
FOR EACH ROW EXECUTE FUNCTION _system.set_updated_at();

-- ------------------------------------------------------------------------------
-- 6. PERSONS (Thành viên / nhân vật trong cây gia phả)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE RESTRICT,
    full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) > 0),
    normalized_name TEXT NOT NULL,
    gender gender_type NOT NULL DEFAULT 'unknown',
    living_status living_status_type NOT NULL DEFAULT 'unknown',
    birth_date DATE NULL,
    birth_year SMALLINT NULL CHECK (birth_year IS NULL OR (birth_year >= 100 AND birth_year <= 2500)),
    birth_date_precision date_precision_type NOT NULL DEFAULT 'unknown',
    birth_is_estimated BOOLEAN NOT NULL DEFAULT false,
    death_date DATE NULL,
    death_year SMALLINT NULL CHECK (death_year IS NULL OR (death_year >= 100 AND death_year <= 2500)),
    death_date_precision date_precision_type NOT NULL DEFAULT 'unknown',
    death_is_estimated BOOLEAN NOT NULL DEFAULT false,
    birth_place_text TEXT NULL,
    death_place_text TEXT NULL,
    hometown_text TEXT NULL,
    burial_place_text TEXT NULL,
    occupation_text TEXT NULL,
    biography TEXT NULL,
    verification_status verification_status_type NOT NULL DEFAULT 'unverified',
    created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
    CONSTRAINT uq_persons_tree_id_id UNIQUE (tree_id, id),
    CONSTRAINT chk_persons_exact_death_after_birth CHECK (
        death_date IS NULL OR birth_date IS NULL OR death_date >= birth_date
    ),
    CONSTRAINT chk_persons_year_death_after_birth CHECK (
        death_year IS NULL OR birth_year IS NULL OR death_year >= birth_year OR death_is_estimated = true OR birth_is_estimated = true
    ),
    CONSTRAINT chk_persons_birth_date_precision_consistency CHECK (
        (birth_date_precision = 'exact' AND birth_date IS NOT NULL) OR
        (birth_date_precision = 'year' AND birth_year IS NOT NULL AND birth_date IS NULL) OR
        (birth_date_precision = 'unknown' AND birth_date IS NULL AND birth_year IS NULL)
    ),
    CONSTRAINT chk_persons_death_date_precision_consistency CHECK (
        (death_date_precision = 'exact' AND death_date IS NOT NULL) OR
        (death_date_precision = 'year' AND death_year IS NOT NULL AND death_date IS NULL) OR
        (death_date_precision = 'unknown' AND death_date IS NULL AND death_year IS NULL)
    )
);

COMMENT ON TABLE public.persons IS 'Genealogical individual record scoped to a single family tree';
COMMENT ON CONSTRAINT uq_persons_tree_id_id ON public.persons IS 'Unique composite constraint enabling strict same-tree foreign keys';

-- Trigger duy trì normalized_name tự động
CREATE OR REPLACE FUNCTION _system.maintain_person_normalized_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.normalized_name = _system.normalize_person_name(NEW.full_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, _system, extensions, pg_temp;


CREATE TRIGGER trg_persons_maintain_normalized_name
BEFORE INSERT OR UPDATE OF full_name ON public.persons
FOR EACH ROW EXECUTE FUNCTION _system.maintain_person_normalized_name();

CREATE TRIGGER trg_persons_updated_at
BEFORE UPDATE ON public.persons
FOR EACH ROW EXECUTE FUNCTION _system.set_updated_at();

-- Foreign key cho Generation Anchor trên bảng family_trees (bảo đảm cùng tree)
ALTER TABLE public.family_trees
ADD CONSTRAINT fk_family_trees_generation_anchor
FOREIGN KEY (id, generation_anchor_person_id)
REFERENCES public.persons(tree_id, id)
ON DELETE SET NULL;

-- Indexes trên bảng persons
CREATE INDEX IF NOT EXISTS idx_persons_tree_active
ON public.persons (tree_id)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_persons_tree_search_name
ON public.persons (tree_id, normalized_name)
WHERE deleted_at IS NULL;

-- ------------------------------------------------------------------------------
-- 7. PARENT_CHILD_RELATIONSHIPS (Quan hệ huyết thống và nhận nuôi cha/mẹ - con)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.parent_child_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE RESTRICT,
    parent_id UUID NOT NULL,
    child_id UUID NOT NULL,
    parent_role parent_role_type NOT NULL DEFAULT 'unspecified',
    relationship_kind relationship_kind_type NOT NULL DEFAULT 'biological',
    verification_status verification_status_type NOT NULL DEFAULT 'unverified',
    notes TEXT NULL,
    created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
    CONSTRAINT chk_parent_child_not_self CHECK (parent_id <> child_id),
    CONSTRAINT fk_parent_child_parent FOREIGN KEY (tree_id, parent_id) REFERENCES public.persons(tree_id, id) ON DELETE RESTRICT,
    CONSTRAINT fk_parent_child_child FOREIGN KEY (tree_id, child_id) REFERENCES public.persons(tree_id, id) ON DELETE RESTRICT
);

COMMENT ON TABLE public.parent_child_relationships IS 'Directed lineage edge between parent person and child person in the same tree';

CREATE UNIQUE INDEX IF NOT EXISTS idx_parent_child_active_unique
ON public.parent_child_relationships (tree_id, parent_id, child_id, relationship_kind, parent_role)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_parent_child_parent_lookup
ON public.parent_child_relationships (tree_id, parent_id)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_parent_child_child_lookup
ON public.parent_child_relationships (tree_id, child_id)
WHERE deleted_at IS NULL;

CREATE TRIGGER trg_parent_child_relationships_updated_at
BEFORE UPDATE ON public.parent_child_relationships
FOR EACH ROW EXECUTE FUNCTION _system.set_updated_at();

-- ------------------------------------------------------------------------------
-- 8. UNIONS & UNION MEMBERS (Quan hệ hôn nhân & kết đôi)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.unions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE RESTRICT,
    status union_status_type NOT NULL DEFAULT 'active',
    start_date DATE NULL,
    start_year SMALLINT NULL CHECK (start_year IS NULL OR (start_year >= 100 AND start_year <= 2500)),
    start_date_precision date_precision_type NOT NULL DEFAULT 'unknown',
    end_date DATE NULL,
    end_year SMALLINT NULL CHECK (end_year IS NULL OR (end_year >= 100 AND end_year <= 2500)),
    end_date_precision date_precision_type NOT NULL DEFAULT 'unknown',
    notes TEXT NULL,
    verification_status verification_status_type NOT NULL DEFAULT 'unverified',
    created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
    CONSTRAINT uq_unions_tree_id_id UNIQUE (tree_id, id),
    CONSTRAINT chk_unions_end_date_after_start CHECK (
        end_date IS NULL OR start_date IS NULL OR end_date >= start_date
    )
);

COMMENT ON TABLE public.unions IS 'Union / Marriage aggregate linking partners in the same family tree';

CREATE INDEX IF NOT EXISTS idx_unions_tree_active
ON public.unions (tree_id)
WHERE deleted_at IS NULL;

CREATE TRIGGER trg_unions_updated_at
BEFORE UPDATE ON public.unions
FOR EACH ROW EXECUTE FUNCTION _system.set_updated_at();

CREATE TABLE IF NOT EXISTS public.union_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE RESTRICT,
    union_id UUID NOT NULL,
    person_id UUID NOT NULL,
    member_role union_member_role_type NOT NULL DEFAULT 'spouse',
    created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ NULL,
    deleted_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_union_members_union FOREIGN KEY (tree_id, union_id) REFERENCES public.unions(tree_id, id) ON DELETE CASCADE,
    CONSTRAINT fk_union_members_person FOREIGN KEY (tree_id, person_id) REFERENCES public.persons(tree_id, id) ON DELETE RESTRICT
);

COMMENT ON TABLE public.union_members IS 'Association record binding an individual Person to a Union aggregate';

CREATE UNIQUE INDEX IF NOT EXISTS idx_union_members_active_unique
ON public.union_members (union_id, person_id)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_union_members_union_lookup
ON public.union_members (tree_id, union_id)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_union_members_person_lookup
ON public.union_members (tree_id, person_id)
WHERE deleted_at IS NULL;

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY BASELINE (Deny-by-default for all public tables)
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tree_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.union_members ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 10. INFRASTRUCTURE STATUS UPDATE
-- ------------------------------------------------------------------------------

INSERT INTO _system.infrastructure_status (id, phase_code, version)
VALUES ('genviet_core_schema', 'P07', 'v0.1.0')
ON CONFLICT (id) DO UPDATE
SET initialized_at = timezone('utc'::text, now()),
    version = EXCLUDED.version;

/*******************************************************************************
 * [03/14] MIGRATION: 20260829160221_p08_add_rls_authorization_policies.sql
 *******************************************************************************/

-- ==============================================================================
-- Migration: 20260829160221_p08_add_rls_authorization_policies.sql
-- Phase: P08 (RLS and Authorization Policies)
-- Description: Establishes complete Row Level Security policies, least-privilege
--              grants, immutable column enforcement triggers, and helper functions.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Authorization Functions (Schema: _system)
-- ------------------------------------------------------------------------------

-- Helper: Check if a user has an active membership in a given Family Tree
CREATE OR REPLACE FUNCTION _system.is_active_tree_member(
    p_tree_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = p_tree_id
          AND tm.user_id = p_user_id
          AND tm.status = 'active'::membership_status
          AND tm.deleted_at IS NULL
    );
$$;

-- Helper: Check if a user is an active Owner of a given Family Tree
CREATE OR REPLACE FUNCTION _system.is_tree_owner(
    p_tree_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = p_tree_id
          AND tm.user_id = p_user_id
          AND tm.role = 'owner'::membership_role
          AND tm.status = 'active'::membership_status
          AND tm.deleted_at IS NULL
    );
$$;

-- Helper: Check if a user has write permission in a given Family Tree (Owner, Admin, Editor)
CREATE OR REPLACE FUNCTION _system.can_write_tree(
    p_tree_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = p_tree_id
          AND tm.user_id = p_user_id
          AND tm.role IN ('owner'::membership_role, 'admin'::membership_role, 'editor'::membership_role)
          AND tm.status = 'active'::membership_status
          AND tm.deleted_at IS NULL
    );
$$;

-- Helper: Check if a user has read permission in a given Family Tree (Active member or Public tree)
CREATE OR REPLACE FUNCTION _system.can_read_tree(
    p_tree_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
    SELECT (
        _system.is_active_tree_member(p_tree_id, p_user_id)
        OR EXISTS (
            SELECT 1
            FROM public.family_trees ft
            WHERE ft.id = p_tree_id
              AND ft.privacy_level = 'public'::tree_privacy_level
              AND ft.status = 'active'::tree_status
              AND ft.deleted_at IS NULL
        )
    );
$$;

-- Revoke execute from PUBLIC and anon, grant to authenticated and service_role
REVOKE EXECUTE ON FUNCTION _system.is_active_tree_member(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION _system.is_active_tree_member(UUID, UUID) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION _system.is_tree_owner(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION _system.is_tree_owner(UUID, UUID) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION _system.can_write_tree(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION _system.can_write_tree(UUID, UUID) TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION _system.can_read_tree(UUID, UUID) TO authenticated, anon, service_role;


-- ------------------------------------------------------------------------------
-- 2. Trigger Function: Prevent Immutable Columns Mutation (P08-T16)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.prevent_immutable_columns_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Common immutable columns
    IF OLD.id IS DISTINCT FROM NEW.id THEN
        RAISE EXCEPTION 'Cannot mutate immutable column id' USING ERRCODE = '42501';
    END IF;

    -- Tree ID immutability for domain entities
    IF TG_TABLE_NAME IN ('persons', 'parent_child_relationships', 'unions', 'union_members', 'tree_memberships') THEN
        IF OLD.tree_id IS DISTINCT FROM NEW.tree_id THEN
            RAISE EXCEPTION 'Cannot mutate immutable column tree_id' USING ERRCODE = '42501';
        END IF;
    END IF;

    -- Audit creation immutability
    IF TG_TABLE_NAME IN ('family_trees', 'tree_memberships', 'persons', 'parent_child_relationships', 'unions') THEN
        IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
            RAISE EXCEPTION 'Cannot mutate immutable column created_at' USING ERRCODE = '42501';
        END IF;
        IF OLD.created_by IS DISTINCT FROM NEW.created_by THEN
            RAISE EXCEPTION 'Cannot mutate immutable column created_by' USING ERRCODE = '42501';
        END IF;
    END IF;

    -- Membership user_id immutability
    IF TG_TABLE_NAME = 'tree_memberships' THEN
        IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
            RAISE EXCEPTION 'Cannot mutate immutable column user_id on tree_memberships' USING ERRCODE = '42501';
        END IF;
    END IF;

    -- Profiles created_at immutability
    IF TG_TABLE_NAME = 'profiles' THEN
        IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
            RAISE EXCEPTION 'Cannot mutate immutable column created_at on profiles' USING ERRCODE = '42501';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Apply immutable columns triggers
DROP TRIGGER IF EXISTS trg_profiles_prevent_immutable_mutation ON public.profiles;
CREATE TRIGGER trg_profiles_prevent_immutable_mutation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION _system.prevent_immutable_columns_mutation();

DROP TRIGGER IF EXISTS trg_family_trees_prevent_immutable_mutation ON public.family_trees;
CREATE TRIGGER trg_family_trees_prevent_immutable_mutation
    BEFORE UPDATE ON public.family_trees
    FOR EACH ROW
    EXECUTE FUNCTION _system.prevent_immutable_columns_mutation();

DROP TRIGGER IF EXISTS trg_tree_memberships_prevent_immutable_mutation ON public.tree_memberships;
CREATE TRIGGER trg_tree_memberships_prevent_immutable_mutation
    BEFORE UPDATE ON public.tree_memberships
    FOR EACH ROW
    EXECUTE FUNCTION _system.prevent_immutable_columns_mutation();

DROP TRIGGER IF EXISTS trg_persons_prevent_immutable_mutation ON public.persons;
CREATE TRIGGER trg_persons_prevent_immutable_mutation
    BEFORE UPDATE ON public.persons
    FOR EACH ROW
    EXECUTE FUNCTION _system.prevent_immutable_columns_mutation();

DROP TRIGGER IF EXISTS trg_parent_child_prevent_immutable_mutation ON public.parent_child_relationships;
CREATE TRIGGER trg_parent_child_prevent_immutable_mutation
    BEFORE UPDATE ON public.parent_child_relationships
    FOR EACH ROW
    EXECUTE FUNCTION _system.prevent_immutable_columns_mutation();

DROP TRIGGER IF EXISTS trg_unions_prevent_immutable_mutation ON public.unions;
CREATE TRIGGER trg_unions_prevent_immutable_mutation
    BEFORE UPDATE ON public.unions
    FOR EACH ROW
    EXECUTE FUNCTION _system.prevent_immutable_columns_mutation();

DROP TRIGGER IF EXISTS trg_union_members_prevent_immutable_mutation ON public.union_members;
CREATE TRIGGER trg_union_members_prevent_immutable_mutation
    BEFORE UPDATE ON public.union_members
    FOR EACH ROW
    EXECUTE FUNCTION _system.prevent_immutable_columns_mutation();

-- ------------------------------------------------------------------------------
-- 3. Grants Baseline & Least Privilege (P08-T01, AC-P08-010..012)
-- ------------------------------------------------------------------------------

-- Revoke all table permissions from anon role (v0.1 has no public unauthenticated trees)
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.family_trees FROM anon;
REVOKE ALL ON TABLE public.tree_memberships FROM anon;
REVOKE ALL ON TABLE public.persons FROM anon;
REVOKE ALL ON TABLE public.parent_child_relationships FROM anon;
REVOKE ALL ON TABLE public.unions FROM anon;
REVOKE ALL ON TABLE public.union_members FROM anon;

-- Grant selective privileges to authenticated role
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.family_trees TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tree_memberships TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.persons TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.parent_child_relationships TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.unions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.union_members TO authenticated;

-- Revoke hard DELETE on tables where deletion is soft-delete only
REVOKE DELETE ON TABLE public.family_trees FROM authenticated;
REVOKE DELETE ON TABLE public.persons FROM authenticated;
REVOKE DELETE ON TABLE public.parent_child_relationships FROM authenticated;
REVOKE DELETE ON TABLE public.unions FROM authenticated;
REVOKE DELETE ON TABLE public.union_members FROM authenticated;

-- Grant schema usage on _system to authenticated and service_role so RLS policies and triggers can execute helper functions
GRANT USAGE ON SCHEMA _system TO authenticated, anon, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA _system TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA _system GRANT EXECUTE ON FUNCTIONS TO authenticated, service_role;


-- ------------------------------------------------------------------------------
-- 4. Row Level Security Policies
-- ------------------------------------------------------------------------------

-- 4.1. Profiles Table Policies (P08-T02, P08-T03)
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id = (select auth.uid()));

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (id = (select auth.uid()))
    WITH CHECK (id = (select auth.uid()));

-- 4.2. Family Trees Table Policies (P08-T04..P08-T07)
DROP POLICY IF EXISTS family_trees_insert_authenticated ON public.family_trees;
CREATE POLICY family_trees_insert_authenticated
    ON public.family_trees
    FOR INSERT
    TO authenticated
    WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS family_trees_select_members ON public.family_trees;
CREATE POLICY family_trees_select_members
    ON public.family_trees
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.is_active_tree_member(id)
    );

DROP POLICY IF EXISTS family_trees_update_owners ON public.family_trees;
CREATE POLICY family_trees_update_owners
    ON public.family_trees
    FOR UPDATE
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.is_tree_owner(id)
    )
    WITH CHECK (_system.is_tree_owner(id));

-- 4.3. Tree Memberships Table Policies (P08-T08, P08-T09)
DROP POLICY IF EXISTS tree_memberships_select_members ON public.tree_memberships;
CREATE POLICY tree_memberships_select_members
    ON public.tree_memberships
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NULL
        AND (
            user_id = (select auth.uid())
            OR _system.is_active_tree_member(tree_id)
        )
    );

DROP POLICY IF EXISTS tree_memberships_insert_owners ON public.tree_memberships;
CREATE POLICY tree_memberships_insert_owners
    ON public.tree_memberships
    FOR INSERT
    TO authenticated
    WITH CHECK (
        _system.is_tree_owner(tree_id)
        OR (
            EXISTS (
                SELECT 1
                FROM public.family_trees ft
                WHERE ft.id = tree_id
                  AND ft.created_by = (select auth.uid())
                  AND ft.deleted_at IS NULL
            )
            AND user_id = (select auth.uid())
            AND role = 'owner'::membership_role
        )
    );

DROP POLICY IF EXISTS tree_memberships_update_owners ON public.tree_memberships;
CREATE POLICY tree_memberships_update_owners
    ON public.tree_memberships
    FOR UPDATE
    TO authenticated
    USING (_system.is_tree_owner(tree_id))
    WITH CHECK (_system.is_tree_owner(tree_id));

DROP POLICY IF EXISTS tree_memberships_delete_owners ON public.tree_memberships;
CREATE POLICY tree_memberships_delete_owners
    ON public.tree_memberships
    FOR DELETE
    TO authenticated
    USING (_system.is_tree_owner(tree_id));

-- 4.4. Persons Table Policies (P08-T10..P08-T13)
DROP POLICY IF EXISTS persons_select_members ON public.persons;
CREATE POLICY persons_select_members
    ON public.persons
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.is_active_tree_member(tree_id)
    );

DROP POLICY IF EXISTS persons_insert_writers ON public.persons;
CREATE POLICY persons_insert_writers
    ON public.persons
    FOR INSERT
    TO authenticated
    WITH CHECK (
        deleted_at IS NULL
        AND _system.can_write_tree(tree_id)
    );

DROP POLICY IF EXISTS persons_update_writers ON public.persons;
CREATE POLICY persons_update_writers
    ON public.persons
    FOR UPDATE
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.can_write_tree(tree_id)
    )
    WITH CHECK (_system.can_write_tree(tree_id));

-- 4.5. Parent-Child Relationships Table Policies (P08-T14)
DROP POLICY IF EXISTS parent_child_relationships_select_members ON public.parent_child_relationships;
CREATE POLICY parent_child_relationships_select_members
    ON public.parent_child_relationships
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.is_active_tree_member(tree_id)
    );

DROP POLICY IF EXISTS parent_child_relationships_insert_writers ON public.parent_child_relationships;
CREATE POLICY parent_child_relationships_insert_writers
    ON public.parent_child_relationships
    FOR INSERT
    TO authenticated
    WITH CHECK (
        deleted_at IS NULL
        AND _system.can_write_tree(tree_id)
    );

DROP POLICY IF EXISTS parent_child_relationships_update_writers ON public.parent_child_relationships;
CREATE POLICY parent_child_relationships_update_writers
    ON public.parent_child_relationships
    FOR UPDATE
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.can_write_tree(tree_id)
    )
    WITH CHECK (_system.can_write_tree(tree_id));

-- 4.6. Unions Table Policies (P08-T15)
DROP POLICY IF EXISTS unions_select_members ON public.unions;
CREATE POLICY unions_select_members
    ON public.unions
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.is_active_tree_member(tree_id)
    );

DROP POLICY IF EXISTS unions_insert_writers ON public.unions;
CREATE POLICY unions_insert_writers
    ON public.unions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        deleted_at IS NULL
        AND _system.can_write_tree(tree_id)
    );

DROP POLICY IF EXISTS unions_update_writers ON public.unions;
CREATE POLICY unions_update_writers
    ON public.unions
    FOR UPDATE
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.can_write_tree(tree_id)
    )
    WITH CHECK (_system.can_write_tree(tree_id));

-- 4.7. Union Members Table Policies (P08-T15)
DROP POLICY IF EXISTS union_members_select_members ON public.union_members;
CREATE POLICY union_members_select_members
    ON public.union_members
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.is_active_tree_member(tree_id)
    );

DROP POLICY IF EXISTS union_members_insert_writers ON public.union_members;
CREATE POLICY union_members_insert_writers
    ON public.union_members
    FOR INSERT
    TO authenticated
    WITH CHECK (
        deleted_at IS NULL
        AND _system.can_write_tree(tree_id)
    );

DROP POLICY IF EXISTS union_members_update_writers ON public.union_members;
CREATE POLICY union_members_update_writers
    ON public.union_members
    FOR UPDATE
    TO authenticated
    USING (
        deleted_at IS NULL
        AND _system.can_write_tree(tree_id)
    )
    WITH CHECK (_system.can_write_tree(tree_id));

-- ------------------------------------------------------------------------------
-- 5. Supporting Indexes for High-Performance RLS Authorization
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_tree_memberships_auth_lookup
    ON public.tree_memberships (user_id, tree_id, role)
    WHERE deleted_at IS NULL AND status = 'active';

CREATE INDEX IF NOT EXISTS idx_tree_memberships_tree_owner_lookup
    ON public.tree_memberships (tree_id, user_id)
    WHERE deleted_at IS NULL AND status = 'active' AND role = 'owner';

/*******************************************************************************
 * [04/14] MIGRATION: 20260829163000_p09_provision_profiles.sql
 *******************************************************************************/

-- ==============================================================================
-- Migration: 20260829163000_p09_provision_profiles.sql
-- Project: GenViet (Responsive Web App quản lý cây gia phả)
-- Phase: P09 (Xác thực người dùng - Profile Provisioning Trigger)
-- ==============================================================================

-- 1. Create Profile Provisioning Function in _system schema
CREATE OR REPLACE FUNCTION _system.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_raw_name text;
    v_display_name text;
BEGIN
    -- Extract display name from user metadata or fallback to email prefix
    v_raw_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'display_name',
        split_part(NEW.email, '@', 1)
    );

    -- Sanitize and limit display name
    v_display_name := NULLIF(TRIM(v_raw_name), '');
    IF v_display_name IS NULL THEN
        v_display_name := 'Thành viên GenViet';
    END IF;
    
    -- Substring to max 100 characters according to profiles.display_name column definition
    v_display_name := SUBSTRING(v_display_name FROM 1 FOR 100);

    -- Idempotently insert into public.profiles
    INSERT INTO public.profiles (
        id,
        display_name,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        v_display_name,
        timezone('utc', now()),
        timezone('utc', now())
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- 2. Revoke public/anon execute and grant authenticated / postgres execute
REVOKE EXECUTE ON FUNCTION _system.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION _system.handle_new_user() FROM anon;
GRANT EXECUTE ON FUNCTION _system.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION _system.handle_new_user() TO postgres;

-- 3. Create Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION _system.handle_new_user();

-- Comment on function for documentation
COMMENT ON FUNCTION _system.handle_new_user() IS 'P09: Idempotently creates a public.profile record upon auth.users creation';

/*******************************************************************************
 * [05/14] MIGRATION: 20260830000000_p11_add_family_tree_management_functions.sql
 *******************************************************************************/

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

/*******************************************************************************
 * [06/14] MIGRATION: 20260830100000_p12_add_person_management_support.sql
 *******************************************************************************/

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

/*******************************************************************************
 * [07/14] MIGRATION: 20260830110000_p13_add_relationship_transactions.sql
 *******************************************************************************/

-- ==============================================================================
-- Migration: 20260830110000_p13_add_relationship_transactions.sql
-- Phase: P13 (Quản lý quan hệ phả hệ - Relationship Management)
-- Author: Principal Database Architect & PostgreSQL Graph Engineer
-- Description:
--   1. Cycle detection helper: _system.check_parent_child_cycle
--   2. Atomic Parent-Child RPCs: create_person_with_parent_relationship, link_existing_parent,
--      create_person_with_child_relationship, link_existing_child, replace_parent_relationship,
--      soft_delete_parent_child_relationship
--   3. Atomic Union RPCs: create_union_with_new_person, create_union_with_existing_person,
--      end_union, soft_delete_union
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. RECURSIVE CYCLE DETECTION HELPER
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.check_parent_child_cycle(
    p_tree_id UUID,
    p_parent_id UUID,
    p_child_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_has_cycle boolean;
BEGIN
    -- 1. Self-link: cha/mẹ trùng với con -> Chu trình hiển nhiên
    IF p_parent_id = p_child_id THEN
        RETURN true;
    END IF;

    -- 2. Recursive CTE: Tìm tất cả các hậu duệ (descendants) của p_child_id
    -- Nếu p_parent_id nằm trong tập hậu duệ của p_child_id => Tạo quan hệ sẽ tạo chu trình!
    WITH RECURSIVE descendants AS (
        -- Anchor: các con trực tiếp của p_child_id
        SELECT child_id AS descendant_id, 1 AS depth
        FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND parent_id = p_child_id
          AND deleted_at IS NULL

        UNION

        -- Recursive: các con của hậu duệ
        SELECT r.child_id, d.depth + 1
        FROM public.parent_child_relationships r
        JOIN descendants d ON r.parent_id = d.descendant_id
        WHERE r.tree_id = p_tree_id
          AND r.deleted_at IS NULL
          AND d.depth < 100 -- Guard chống lặp vô hạn
    )
    SELECT EXISTS (
        SELECT 1 FROM descendants WHERE descendant_id = p_parent_id
    ) INTO v_has_cycle;

    RETURN COALESCE(v_has_cycle, false);
END;
$$;

COMMENT ON FUNCTION _system.check_parent_child_cycle(UUID, UUID, UUID) IS
    'Returns true if adding parent_id -> child_id edge in tree_id would create an ancestor-descendant cycle';

-- ------------------------------------------------------------------------------
-- 2. PARENT FLOW RPCs
-- ------------------------------------------------------------------------------

-- 2.1. Tạo Person mới và tạo quan hệ cha/mẹ (Atomic)
CREATE OR REPLACE FUNCTION public.create_person_with_parent_relationship(
    p_tree_id UUID,
    p_child_id UUID,
    p_full_name TEXT,
    p_gender gender_type DEFAULT 'unknown',
    p_living_status living_status_type DEFAULT 'unknown',
    p_birth_date DATE DEFAULT NULL,
    p_birth_year SMALLINT DEFAULT NULL,
    p_birth_date_precision date_precision_type DEFAULT 'unknown',
    p_birth_is_estimated BOOLEAN DEFAULT false,
    p_death_date DATE DEFAULT NULL,
    p_death_year SMALLINT DEFAULT NULL,
    p_death_date_precision date_precision_type DEFAULT 'unknown',
    p_death_is_estimated BOOLEAN DEFAULT false,
    p_birth_place_text TEXT DEFAULT NULL,
    p_death_place_text TEXT DEFAULT NULL,
    p_hometown_text TEXT DEFAULT NULL,
    p_burial_place_text TEXT DEFAULT NULL,
    p_occupation_text TEXT DEFAULT NULL,
    p_biography TEXT DEFAULT NULL,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_child_tree_id UUID;
    v_new_person_id UUID;
    v_rel_id UUID;
    v_existing_verified_count INTEGER;
BEGIN
    -- 1. Xác thực actor
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    -- 2. Kiểm tra quyền ghi trên cây
    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can add relationships' USING ERRCODE = '42501';
    END IF;

    -- 3. Kiểm tra child thuộc đúng tree và đang active
    SELECT tree_id INTO v_child_tree_id
    FROM public.persons
    WHERE id = p_child_id AND tree_id = p_tree_id AND deleted_at IS NULL;

    IF v_child_tree_id IS NULL THEN
        RAISE EXCEPTION 'Child person not found in this tree' USING ERRCODE = 'P0002';
    END IF;

    -- 4. Kiểm tra cảnh báo cha/mẹ ruột đã xác minh
    IF p_relationship_kind = 'biological' AND p_verification_status = 'verified' AND p_parent_role IN ('father', 'mother') THEN
        SELECT count(*)::int INTO v_existing_verified_count
        FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND child_id = p_child_id
          AND parent_role = p_parent_role
          AND relationship_kind = 'biological'
          AND verification_status = 'verified'
          AND deleted_at IS NULL;

        IF v_existing_verified_count > 0 AND NOT p_confirm_warnings THEN
            RAISE EXCEPTION 'WARNING_EXISTING_VERIFIED_PARENT: A verified biological parent already exists for this child'
                USING ERRCODE = '01000';
        END IF;
    END IF;

    -- 5. Tạo Person mới
    INSERT INTO public.persons (
        tree_id, full_name, normalized_name, gender, living_status,
        birth_date, birth_year, birth_date_precision, birth_is_estimated,
        death_date, death_year, death_date_precision, death_is_estimated,
        birth_place_text, death_place_text, hometown_text, burial_place_text,
        occupation_text, biography, verification_status,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_full_name, _system.normalize_person_name(p_full_name), p_gender, p_living_status,
        p_birth_date, p_birth_year, p_birth_date_precision, p_birth_is_estimated,
        p_death_date, p_death_year, p_death_date_precision, p_death_is_estimated,
        p_birth_place_text, p_death_place_text, p_hometown_text, p_burial_place_text,
        p_occupation_text, p_biography, p_verification_status,
        v_user_id, v_user_id
    ) RETURNING id INTO v_new_person_id;

    -- 6. Kiểm tra chu trình (Cycle Detection)
    IF _system.check_parent_child_cycle(p_tree_id, v_new_person_id, p_child_id) THEN
        RAISE EXCEPTION 'RELATIONSHIP_CYCLE: Cannot create ancestor cycle' USING ERRCODE = '40002';
    END IF;

    -- 7. Tạo Parent-Child relationship
    INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind,
        verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, v_new_person_id, p_child_id, p_parent_role, p_relationship_kind,
        p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_rel_id;

    RETURN jsonb_build_object(
        'person_id', v_new_person_id,
        'relationship_id', v_rel_id
    );
END;
$$;

-- 2.2. Liên kết cha/mẹ có sẵn
CREATE OR REPLACE FUNCTION public.link_existing_parent(
    p_tree_id UUID,
    p_parent_id UUID,
    p_child_id UUID,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_parent_tree_id UUID;
    v_child_tree_id UUID;
    v_rel_id UUID;
    v_existing_verified_count INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can add relationships' USING ERRCODE = '42501';
    END IF;

    -- Kiểm tra self-link
    IF p_parent_id = p_child_id THEN
        RAISE EXCEPTION 'RELATIONSHIP_SELF_LINK: A person cannot be their own parent' USING ERRCODE = '23514';
    END IF;

    -- Kiểm tra cả 2 người thuộc cùng tree và active
    SELECT tree_id INTO v_parent_tree_id FROM public.persons WHERE id = p_parent_id AND tree_id = p_tree_id AND deleted_at IS NULL;
    SELECT tree_id INTO v_child_tree_id FROM public.persons WHERE id = p_child_id AND tree_id = p_tree_id AND deleted_at IS NULL;

    IF v_parent_tree_id IS NULL OR v_child_tree_id IS NULL THEN
        RAISE EXCEPTION 'RELATIONSHIP_TREE_MISMATCH: Both parent and child must belong to the specified tree' USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra cycle
    IF _system.check_parent_child_cycle(p_tree_id, p_parent_id, p_child_id) THEN
        RAISE EXCEPTION 'RELATIONSHIP_CYCLE: Cannot create ancestor cycle' USING ERRCODE = '40002';
    END IF;

    -- Kiểm tra exact duplicate
    IF EXISTS (
        SELECT 1 FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND parent_id = p_parent_id
          AND child_id = p_child_id
          AND parent_role = p_parent_role
          AND relationship_kind = p_relationship_kind
          AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'RELATIONSHIP_DUPLICATE: This relationship already exists' USING ERRCODE = '23505';
    END IF;

    -- Kiểm tra verified biological parent warning
    IF p_relationship_kind = 'biological' AND p_verification_status = 'verified' AND p_parent_role IN ('father', 'mother') THEN
        SELECT count(*)::int INTO v_existing_verified_count
        FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND child_id = p_child_id
          AND parent_role = p_parent_role
          AND relationship_kind = 'biological'
          AND verification_status = 'verified'
          AND deleted_at IS NULL;

        IF v_existing_verified_count > 0 AND NOT p_confirm_warnings THEN
            RAISE EXCEPTION 'WARNING_EXISTING_VERIFIED_PARENT: A verified biological parent already exists for this child'
                USING ERRCODE = '01000';
        END IF;
    END IF;

    INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind,
        verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, p_parent_id, p_child_id, p_parent_role, p_relationship_kind,
        p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_rel_id;

    RETURN v_rel_id;
END;
$$;

-- 2.3. Tạo Person con mới (và tùy chọn liên kết với cha/mẹ thứ hai) (Atomic)
CREATE OR REPLACE FUNCTION public.create_person_with_child_relationship(
    p_tree_id UUID,
    p_parent_id UUID,
    p_full_name TEXT,
    p_gender gender_type DEFAULT 'unknown',
    p_living_status living_status_type DEFAULT 'unknown',
    p_birth_date DATE DEFAULT NULL,
    p_birth_year SMALLINT DEFAULT NULL,
    p_birth_date_precision date_precision_type DEFAULT 'unknown',
    p_birth_is_estimated BOOLEAN DEFAULT false,
    p_death_date DATE DEFAULT NULL,
    p_death_year SMALLINT DEFAULT NULL,
    p_death_date_precision date_precision_type DEFAULT 'unknown',
    p_death_is_estimated BOOLEAN DEFAULT false,
    p_birth_place_text TEXT DEFAULT NULL,
    p_death_place_text TEXT DEFAULT NULL,
    p_hometown_text TEXT DEFAULT NULL,
    p_burial_place_text TEXT DEFAULT NULL,
    p_occupation_text TEXT DEFAULT NULL,
    p_biography TEXT DEFAULT NULL,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_other_parent_id UUID DEFAULT NULL,
    p_other_parent_role parent_role_type DEFAULT 'unspecified',
    p_other_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_parent_tree_id UUID;
    v_other_parent_tree_id UUID;
    v_new_child_id UUID;
    v_rel_id_1 UUID;
    v_rel_id_2 UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can add relationships' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_parent_tree_id FROM public.persons WHERE id = p_parent_id AND tree_id = p_tree_id AND deleted_at IS NULL;
    IF v_parent_tree_id IS NULL THEN
        RAISE EXCEPTION 'Parent person not found in this tree' USING ERRCODE = 'P0002';
    END IF;

    IF p_other_parent_id IS NOT NULL THEN
        IF p_other_parent_id = p_parent_id THEN
            RAISE EXCEPTION 'RELATIONSHIP_SELF_LINK: Both parents cannot be the same person' USING ERRCODE = '23514';
        END IF;

        SELECT tree_id INTO v_other_parent_tree_id FROM public.persons WHERE id = p_other_parent_id AND tree_id = p_tree_id AND deleted_at IS NULL;
        IF v_other_parent_tree_id IS NULL THEN
            RAISE EXCEPTION 'Other parent person not found in this tree' USING ERRCODE = 'P0002';
        END IF;
    END IF;

    -- Tạo Person con mới
    INSERT INTO public.persons (
        tree_id, full_name, normalized_name, gender, living_status,
        birth_date, birth_year, birth_date_precision, birth_is_estimated,
        death_date, death_year, death_date_precision, death_is_estimated,
        birth_place_text, death_place_text, hometown_text, burial_place_text,
        occupation_text, biography, verification_status,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_full_name, _system.normalize_person_name(p_full_name), p_gender, p_living_status,
        p_birth_date, p_birth_year, p_birth_date_precision, p_birth_is_estimated,
        p_death_date, p_death_year, p_death_date_precision, p_death_is_estimated,
        p_birth_place_text, p_death_place_text, p_hometown_text, p_burial_place_text,
        p_occupation_text, p_biography, p_verification_status,
        v_user_id, v_user_id
    ) RETURNING id INTO v_new_child_id;

    -- Cycle check
    IF _system.check_parent_child_cycle(p_tree_id, p_parent_id, v_new_child_id) THEN
        RAISE EXCEPTION 'RELATIONSHIP_CYCLE: Cannot create ancestor cycle' USING ERRCODE = '40002';
    END IF;

    -- Insert primary parent relationship
    INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind,
        verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, p_parent_id, v_new_child_id, p_parent_role, p_relationship_kind,
        p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_rel_id_1;

    -- Insert secondary parent relationship if provided
    IF p_other_parent_id IS NOT NULL THEN
        IF _system.check_parent_child_cycle(p_tree_id, p_other_parent_id, v_new_child_id) THEN
            RAISE EXCEPTION 'RELATIONSHIP_CYCLE: Cannot create ancestor cycle for other parent' USING ERRCODE = '40002';
        END IF;

        INSERT INTO public.parent_child_relationships (
            tree_id, parent_id, child_id, parent_role, relationship_kind,
            verification_status, created_by, updated_by
        ) VALUES (
            p_tree_id, p_other_parent_id, v_new_child_id, p_other_parent_role, p_other_relationship_kind,
            p_verification_status, v_user_id, v_user_id
        ) RETURNING id INTO v_rel_id_2;
    END IF;

    RETURN jsonb_build_object(
        'person_id', v_new_child_id,
        'relationship_id', v_rel_id_1,
        'other_relationship_id', v_rel_id_2
    );
END;
$$;

-- 2.4. Liên kết con có sẵn
CREATE OR REPLACE FUNCTION public.link_existing_child(
    p_tree_id UUID,
    p_parent_id UUID,
    p_child_id UUID,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
BEGIN
    -- Hàm này tương đương link_existing_parent với đúng thứ tự parent_id -> child_id
    RETURN public.link_existing_parent(
        p_tree_id,
        p_parent_id,
        p_child_id,
        p_parent_role,
        p_relationship_kind,
        p_verification_status,
        p_confirm_warnings
    );
END;
$$;

-- 2.5. Thay thế quan hệ cha/mẹ (Atomic Replace)
CREATE OR REPLACE FUNCTION public.replace_parent_relationship(
    p_tree_id UUID,
    p_old_relationship_id UUID,
    p_old_expected_version INTEGER,
    p_new_parent_id UUID,
    p_child_id UUID,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_rows_deleted INTEGER;
    v_new_rel_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can replace relationships' USING ERRCODE = '42501';
    END IF;

    -- 1. Xóa mềm quan hệ cũ với version check
    UPDATE public.parent_child_relationships
    SET
        deleted_at = timezone('utc'::text, now()),
        deleted_by = v_user_id,
        version = version + 1,
        updated_by = v_user_id
    WHERE id = p_old_relationship_id
      AND tree_id = p_tree_id
      AND version = p_old_expected_version
      AND deleted_at IS NULL;

    GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
    IF v_rows_deleted = 0 THEN
        RAISE EXCEPTION 'RELATIONSHIP_VERSION_CONFLICT: Old relationship version conflict or not found'
            USING ERRCODE = '40001';
    END IF;

    -- 2. Tạo quan hệ mới (đã bao gồm same-tree, self-link, cycle và duplicate checks)
    v_new_rel_id := public.link_existing_parent(
        p_tree_id,
        p_new_parent_id,
        p_child_id,
        p_parent_role,
        p_relationship_kind,
        p_verification_status,
        p_confirm_warnings
    );

    RETURN v_new_rel_id;
END;
$$;

-- 2.6. Xóa mềm quan hệ cha-con
CREATE OR REPLACE FUNCTION public.soft_delete_parent_child_relationship(
    p_relationship_id UUID,
    p_expected_version INTEGER
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_rows INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_tree_id
    FROM public.parent_child_relationships
    WHERE id = p_relationship_id AND deleted_at IS NULL;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Relationship not found' USING ERRCODE = 'P0002';
    END IF;

    IF NOT _system.can_write_tree(v_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can delete relationships' USING ERRCODE = '42501';
    END IF;

    UPDATE public.parent_child_relationships
    SET
        deleted_at = timezone('utc'::text, now()),
        deleted_by = v_user_id,
        version = version + 1,
        updated_by = v_user_id
    WHERE id = p_relationship_id
      AND version = p_expected_version
      AND deleted_at IS NULL;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows = 0 THEN
        RAISE EXCEPTION 'RELATIONSHIP_VERSION_CONFLICT: Relationship version conflict' USING ERRCODE = '40001';
    END IF;

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. UNION & SPOUSE FLOW RPCs
-- ------------------------------------------------------------------------------

-- 3.1. Tạo Person phối ngẫu mới + Union + 2 Union Members (Atomic)
CREATE OR REPLACE FUNCTION public.create_union_with_new_person(
    p_tree_id UUID,
    p_subject_person_id UUID,
    p_full_name TEXT,
    p_gender gender_type DEFAULT 'unknown',
    p_living_status living_status_type DEFAULT 'unknown',
    p_birth_date DATE DEFAULT NULL,
    p_birth_year SMALLINT DEFAULT NULL,
    p_birth_date_precision date_precision_type DEFAULT 'unknown',
    p_birth_is_estimated BOOLEAN DEFAULT false,
    p_death_date DATE DEFAULT NULL,
    p_death_year SMALLINT DEFAULT NULL,
    p_death_date_precision date_precision_type DEFAULT 'unknown',
    p_death_is_estimated BOOLEAN DEFAULT false,
    p_hometown_text TEXT DEFAULT NULL,
    p_occupation_text TEXT DEFAULT NULL,
    p_biography TEXT DEFAULT NULL,
    p_subject_member_role union_member_role_type DEFAULT 'spouse',
    p_partner_member_role union_member_role_type DEFAULT 'spouse',
    p_union_status union_status_type DEFAULT 'active',
    p_start_date DATE DEFAULT NULL,
    p_start_year SMALLINT DEFAULT NULL,
    p_start_date_precision date_precision_type DEFAULT 'unknown',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_subject_tree_id UUID;
    v_new_partner_id UUID;
    v_union_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can create unions' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_subject_tree_id FROM public.persons WHERE id = p_subject_person_id AND tree_id = p_tree_id AND deleted_at IS NULL;
    IF v_subject_tree_id IS NULL THEN
        RAISE EXCEPTION 'Subject person not found in this tree' USING ERRCODE = 'P0002';
    END IF;

    -- 1. Tạo Person mới cho phối ngẫu
    INSERT INTO public.persons (
        tree_id, full_name, normalized_name, gender, living_status,
        birth_date, birth_year, birth_date_precision, birth_is_estimated,
        death_date, death_year, death_date_precision, death_is_estimated,
        hometown_text, occupation_text, biography,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_full_name, _system.normalize_person_name(p_full_name), p_gender, p_living_status,
        p_birth_date, p_birth_year, p_birth_date_precision, p_birth_is_estimated,
        p_death_date, p_death_year, p_death_date_precision, p_death_is_estimated,
        p_hometown_text, p_occupation_text, p_biography,
        v_user_id, v_user_id
    ) RETURNING id INTO v_new_partner_id;

    -- 2. Tạo Union
    INSERT INTO public.unions (
        tree_id, status, start_date, start_year, start_date_precision,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_union_status, p_start_date, p_start_year, p_start_date_precision,
        v_user_id, v_user_id
    ) RETURNING id INTO v_union_id;

    -- 3. Tạo 2 Union Members
    INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by)
    VALUES (p_tree_id, v_union_id, p_subject_person_id, p_subject_member_role, v_user_id);

    INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by)
    VALUES (p_tree_id, v_union_id, v_new_partner_id, p_partner_member_role, v_user_id);

    RETURN jsonb_build_object(
        'person_id', v_new_partner_id,
        'union_id', v_union_id
    );
END;
$$;

-- 3.2. Tạo Union giữa 2 Person có sẵn (Atomic)
CREATE OR REPLACE FUNCTION public.create_union_with_existing_person(
    p_tree_id UUID,
    p_person_1_id UUID,
    p_person_2_id UUID,
    p_member_1_role union_member_role_type DEFAULT 'spouse',
    p_member_2_role union_member_role_type DEFAULT 'spouse',
    p_union_status union_status_type DEFAULT 'active',
    p_start_date DATE DEFAULT NULL,
    p_start_year SMALLINT DEFAULT NULL,
    p_start_date_precision date_precision_type DEFAULT 'unknown',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_1 UUID;
    v_tree_2 UUID;
    v_union_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    IF NOT _system.can_write_tree(p_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can create unions' USING ERRCODE = '42501';
    END IF;

    -- Self-spouse check
    IF p_person_1_id = p_person_2_id THEN
        RAISE EXCEPTION 'UNION_SELF_LINK: A person cannot marry themselves' USING ERRCODE = '23514';
    END IF;

    SELECT tree_id INTO v_tree_1 FROM public.persons WHERE id = p_person_1_id AND tree_id = p_tree_id AND deleted_at IS NULL;
    SELECT tree_id INTO v_tree_2 FROM public.persons WHERE id = p_person_2_id AND tree_id = p_tree_id AND deleted_at IS NULL;

    IF v_tree_1 IS NULL OR v_tree_2 IS NULL THEN
        RAISE EXCEPTION 'RELATIONSHIP_TREE_MISMATCH: Both persons must belong to the tree' USING ERRCODE = 'P0002';
    END IF;

    -- 1. Tạo Union
    INSERT INTO public.unions (
        tree_id, status, start_date, start_year, start_date_precision,
        created_by, updated_by
    ) VALUES (
        p_tree_id, p_union_status, p_start_date, p_start_year, p_start_date_precision,
        v_user_id, v_user_id
    ) RETURNING id INTO v_union_id;

    -- 2. Tạo 2 Union Members
    INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by)
    VALUES (p_tree_id, v_union_id, p_person_1_id, p_member_1_role, v_user_id);

    INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by)
    VALUES (p_tree_id, v_union_id, p_person_2_id, p_member_2_role, v_user_id);

    RETURN v_union_id;
END;
$$;

-- 3.3. Kết thúc quan hệ hôn nhân (End Union)
CREATE OR REPLACE FUNCTION public.end_union(
    p_union_id UUID,
    p_expected_version INTEGER,
    p_new_status union_status_type,
    p_end_date DATE DEFAULT NULL,
    p_end_year SMALLINT DEFAULT NULL,
    p_end_date_precision date_precision_type DEFAULT 'unknown'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_rows INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_tree_id FROM public.unions WHERE id = p_union_id AND deleted_at IS NULL;
    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Union not found' USING ERRCODE = 'P0002';
    END IF;

    IF NOT _system.can_write_tree(v_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can update unions' USING ERRCODE = '42501';
    END IF;

    UPDATE public.unions
    SET
        status = p_new_status,
        end_date = p_end_date,
        end_year = p_end_year,
        end_date_precision = p_end_date_precision,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_union_id
      AND version = p_expected_version
      AND deleted_at IS NULL;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows = 0 THEN
        RAISE EXCEPTION 'UNION_VERSION_CONFLICT: Union version conflict' USING ERRCODE = '40001';
    END IF;

    RETURN true;
END;
$$;

-- 3.4. Xóa mềm Union
CREATE OR REPLACE FUNCTION public.soft_delete_union(
    p_union_id UUID,
    p_expected_version INTEGER
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_tree_id UUID;
    v_rows INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id INTO v_tree_id FROM public.unions WHERE id = p_union_id AND deleted_at IS NULL;
    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Union not found' USING ERRCODE = 'P0002';
    END IF;

    IF NOT _system.can_write_tree(v_tree_id, v_user_id) THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can delete unions' USING ERRCODE = '42501';
    END IF;

    -- Xóa mềm Union Members trước
    UPDATE public.union_members
    SET deleted_at = timezone('utc'::text, now()), deleted_by = v_user_id
    WHERE union_id = p_union_id AND deleted_at IS NULL;

    -- Xóa mềm Union
    UPDATE public.unions
    SET
        deleted_at = timezone('utc'::text, now()),
        deleted_by = v_user_id,
        version = version + 1,
        updated_by = v_user_id
    WHERE id = p_union_id
      AND version = p_expected_version
      AND deleted_at IS NULL;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows = 0 THEN
        RAISE EXCEPTION 'UNION_VERSION_CONFLICT: Union version conflict' USING ERRCODE = '40001';
    END IF;

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. FUNCTION PERMISSIONS & GRANTS
-- ------------------------------------------------------------------------------

REVOKE ALL ON FUNCTION public.create_person_with_parent_relationship FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_person_with_parent_relationship TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.link_existing_parent FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.link_existing_parent TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_person_with_child_relationship FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_person_with_child_relationship TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.link_existing_child FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.link_existing_child TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.replace_parent_relationship FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.replace_parent_relationship TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.soft_delete_parent_child_relationship FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.soft_delete_parent_child_relationship TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_union_with_new_person FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_union_with_new_person TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_union_with_existing_person FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_union_with_existing_person TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.end_union FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.end_union TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.soft_delete_union FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.soft_delete_union TO authenticated, service_role;

/*******************************************************************************
 * [08/14] MIGRATION: 20260830120000_p14_add_tree_graph_query.sql
 *******************************************************************************/

-- Migration: 20260830120000_p14_add_tree_graph_query.sql
-- Description: Bounded Tree Graph Slice Query RPC with Recursive CTE, Spouses, Expansion Metadata and Limits

CREATE OR REPLACE FUNCTION public.get_tree_graph_slice(
    p_tree_id UUID,
    p_center_person_id UUID,
    p_ancestor_depth INTEGER DEFAULT 2,
    p_descendant_depth INTEGER DEFAULT 2,
    p_include_spouses BOOLEAN DEFAULT true,
    p_include_unverified BOOLEAN DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_can_read BOOLEAN;
    v_center_exists BOOLEAN;
    v_center_tree_id UUID;
    v_center_deleted_at TIMESTAMPTZ;
    v_tree_deleted_at TIMESTAMPTZ;
    v_max_ancestor_depth CONSTANT INTEGER := 5;
    v_max_descendant_depth CONSTANT INTEGER := 5;
    v_max_persons_budget CONSTANT INTEGER := 250;
    v_max_relationships_budget CONSTANT INTEGER := 500;
    v_max_unions_budget CONSTANT INTEGER := 150;
    v_applied_ancestor_depth INTEGER;
    v_applied_descendant_depth INTEGER;
    
    v_slice_person_ids UUID[];
    v_ancestor_person_ids UUID[];
    v_descendant_person_ids UUID[];
    v_spouse_person_ids UUID[] := ARRAY[]::UUID[];
    v_children_person_ids UUID[] := ARRAY[]::UUID[];
    v_union_ids UUID[] := ARRAY[]::UUID[];
    
    v_persons_json jsonb;

    v_relationships_json jsonb;
    v_unions_json jsonb;
    v_union_members_json jsonb;
    v_expansion_json jsonb := '{}'::jsonb;
    
    v_person_count INTEGER := 0;
    v_relationship_count INTEGER := 0;
    v_union_count INTEGER := 0;
    v_truncated BOOLEAN := false;
    v_truncated_reason TEXT := NULL;
BEGIN
    -- 1. Xác thực người dùng
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'TREE_GRAPH_UNAUTHORIZED' USING ERRCODE = '42501';
    END IF;

    -- 2. Kiểm tra quyền truy cập cây
    SELECT _system.can_read_tree(p_tree_id, v_user_id) INTO v_can_read;
    IF NOT COALESCE(v_can_read, false) THEN
        RAISE EXCEPTION 'TREE_GRAPH_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    -- 3. Kiểm tra trạng thái cây
    SELECT deleted_at INTO v_tree_deleted_at
    FROM public.family_trees
    WHERE id = p_tree_id;

    IF v_tree_deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'TREE_GRAPH_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    -- 4. Kiểm tra Center Person
    SELECT tree_id, deleted_at INTO v_center_tree_id, v_center_deleted_at
    FROM public.persons
    WHERE id = p_center_person_id;

    IF v_center_tree_id IS NULL THEN
        RAISE EXCEPTION 'TREE_GRAPH_CENTER_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    IF v_center_tree_id <> p_tree_id THEN
        RAISE EXCEPTION 'TREE_GRAPH_TREE_MISMATCH' USING ERRCODE = '40003';
    END IF;

    IF v_center_deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'TREE_GRAPH_CENTER_DELETED' USING ERRCODE = 'P0002';
    END IF;

    -- 5. Áp dụng giới hạn độ sâu
    IF p_ancestor_depth < 0 OR p_descendant_depth < 0 THEN
        RAISE EXCEPTION 'TREE_GRAPH_DEPTH_INVALID' USING ERRCODE = '22023';
    END IF;

    v_applied_ancestor_depth := LEAST(p_ancestor_depth, v_max_ancestor_depth);
    v_applied_descendant_depth := LEAST(p_descendant_depth, v_max_descendant_depth);

    -- 6. Recursive CTE 1: Traversal Tổ tiên (Ancestors)
    WITH RECURSIVE ancestor_cte AS (
        SELECT 
            p_center_person_id AS person_id,
            0 AS depth,
            ARRAY[p_center_person_id] AS visited_path
        
        UNION ALL
        
        SELECT 
            r.parent_id AS person_id,
            a.depth + 1 AS depth,
            a.visited_path || r.parent_id
        FROM ancestor_cte a
        JOIN public.parent_child_relationships r 
            ON r.child_id = a.person_id 
            AND r.tree_id = p_tree_id 
            AND r.deleted_at IS NULL
            AND (p_include_unverified OR r.verification_status = 'verified')
        JOIN public.persons p 
            ON p.id = r.parent_id 
            AND p.tree_id = p_tree_id 
            AND p.deleted_at IS NULL
        WHERE a.depth < v_applied_ancestor_depth
          AND NOT (r.parent_id = ANY(a.visited_path))
    )
    SELECT ARRAY_AGG(DISTINCT person_id) INTO v_ancestor_person_ids
    FROM ancestor_cte;

    -- 7. Recursive CTE 2: Traversal Hậu duệ (Descendants)
    WITH RECURSIVE descendant_cte AS (
        SELECT 
            p_center_person_id AS person_id,
            0 AS depth,
            ARRAY[p_center_person_id] AS visited_path
        
        UNION ALL
        
        SELECT 
            r.child_id AS person_id,
            d.depth + 1 AS depth,
            d.visited_path || r.child_id
        FROM descendant_cte d
        JOIN public.parent_child_relationships r 
            ON r.parent_id = d.person_id 
            AND r.tree_id = p_tree_id 
            AND r.deleted_at IS NULL
            AND (p_include_unverified OR r.verification_status = 'verified')
        JOIN public.persons p 
            ON p.id = r.child_id 
            AND p.tree_id = p_tree_id 
            AND p.deleted_at IS NULL
        WHERE d.depth < v_applied_descendant_depth
          AND NOT (r.child_id = ANY(d.visited_path))
    )
    SELECT ARRAY_AGG(DISTINCT person_id) INTO v_descendant_person_ids
    FROM descendant_cte;

    -- Hợp nhất tập Person ban đầu
    SELECT ARRAY_AGG(DISTINCT pid) INTO v_slice_person_ids
    FROM (
        SELECT UNNEST(COALESCE(v_ancestor_person_ids, ARRAY[]::UUID[])) AS pid
        UNION
        SELECT UNNEST(COALESCE(v_descendant_person_ids, ARRAY[]::UUID[])) AS pid
        UNION
        SELECT p_center_person_id AS pid
    ) combined;

    -- 8. Truy vấn Unions và Phối ngẫu (Spouses) nếu p_include_spouses = true
    IF p_include_spouses THEN
        SELECT ARRAY_AGG(DISTINCT u.id) INTO v_union_ids
        FROM public.unions u
        JOIN public.union_members um 
            ON um.union_id = u.id 
            AND um.tree_id = p_tree_id 
            AND um.deleted_at IS NULL
        WHERE u.tree_id = p_tree_id
          AND u.deleted_at IS NULL
          AND um.person_id = ANY(v_slice_person_ids);

        IF v_union_ids IS NOT NULL AND ARRAY_LENGTH(v_union_ids, 1) > 0 THEN
            SELECT ARRAY_AGG(DISTINCT um.person_id) INTO v_spouse_person_ids
            FROM public.union_members um
            JOIN public.persons p 
                ON p.id = um.person_id 
                AND p.tree_id = p_tree_id 
                AND p.deleted_at IS NULL
            WHERE um.union_id = ANY(v_union_ids)
              AND um.tree_id = p_tree_id
              AND um.deleted_at IS NULL;

            -- Thêm spouses vào slice
            SELECT ARRAY_AGG(DISTINCT pid) INTO v_slice_person_ids
            FROM (
                SELECT UNNEST(v_slice_person_ids) AS pid
                UNION
                SELECT UNNEST(COALESCE(v_spouse_person_ids, ARRAY[]::UUID[])) AS pid
            ) combined_with_spouses;
        END IF;
    END IF;

    -- 8.1. Lấy thêm con cái trực tiếp của các Cha/Mẹ (Ancestors, Center & Spouses) có trong slice (Siblings / Children of visible parents)
    SELECT ARRAY_AGG(DISTINCT r.child_id) INTO v_children_person_ids
    FROM public.parent_child_relationships r
    JOIN public.persons p 
        ON p.id = r.child_id 
        AND p.tree_id = p_tree_id 
        AND p.deleted_at IS NULL
    WHERE r.tree_id = p_tree_id
      AND r.deleted_at IS NULL
      AND r.parent_id = ANY(v_slice_person_ids)
      AND (p_include_unverified OR r.verification_status = 'verified');

    IF v_children_person_ids IS NOT NULL AND ARRAY_LENGTH(v_children_person_ids, 1) > 0 THEN
        SELECT ARRAY_AGG(DISTINCT pid) INTO v_slice_person_ids
        FROM (
            SELECT UNNEST(v_slice_person_ids) AS pid
            UNION
            SELECT UNNEST(v_children_person_ids) AS pid
        ) combined_with_children;
    END IF;

    -- 9. Kiểm tra ngân sách kích thước (Size Budgets)

    v_person_count := COALESCE(ARRAY_LENGTH(v_slice_person_ids, 1), 0);
    IF v_person_count > v_max_persons_budget THEN
        v_truncated := true;
        v_truncated_reason := 'person_budget_exceeded';
        -- Cắt gọt deterministic bảo đảm Center Person luôn còn
        v_slice_person_ids := v_slice_person_ids[1:v_max_persons_budget];
        v_person_count := v_max_persons_budget;
    END IF;

    -- 10. Trích xuất Persons JSON
    SELECT COALESCE(jsonb_agg(p_row ORDER BY p_row->>'fullName' ASC, p_row->>'id' ASC), '[]'::jsonb)
    INTO v_persons_json
    FROM (
        SELECT jsonb_build_object(
            'id', p.id,
            'fullName', p.full_name,
            'gender', p.gender,
            'livingStatus', p.living_status,
            'birthDate', p.birth_date,
            'birthYear', p.birth_year,
            'birthDatePrecision', p.birth_date_precision,
            'birthIsEstimated', p.birth_is_estimated,
            'deathDate', p.death_date,
            'deathYear', p.death_year,
            'deathDatePrecision', p.death_date_precision,
            'deathIsEstimated', p.death_is_estimated,
            'verificationStatus', p.verification_status,
            'avatarPath', p.avatar_path,
            'isCenter', (p.id = p_center_person_id)
        ) AS p_row

        FROM public.persons p
        WHERE p.id = ANY(v_slice_person_ids)
          AND p.tree_id = p_tree_id
          AND p.deleted_at IS NULL
    ) persons_sub;

    -- 11. Trích xuất Parent-Child Relationships JSON
    SELECT COALESCE(jsonb_agg(r_row ORDER BY r_row->>'parentId' ASC, r_row->>'childId' ASC), '[]'::jsonb),
           COUNT(*)
    INTO v_relationships_json, v_relationship_count
    FROM (
        SELECT jsonb_build_object(
            'id', r.id,
            'parentId', r.parent_id,
            'childId', r.child_id,
            'parentRole', r.parent_role,
            'relationshipKind', r.relationship_kind,
            'verificationStatus', r.verification_status
        ) AS r_row
        FROM public.parent_child_relationships r
        WHERE r.tree_id = p_tree_id
          AND r.deleted_at IS NULL
          AND r.parent_id = ANY(v_slice_person_ids)
          AND r.child_id = ANY(v_slice_person_ids)
          AND (p_include_unverified OR r.verification_status = 'verified')
        LIMIT v_max_relationships_budget
    ) rels_sub;

    -- 12. Trích xuất Unions & Union Members JSON
    IF p_include_spouses AND v_union_ids IS NOT NULL AND ARRAY_LENGTH(v_union_ids, 1) > 0 THEN
        SELECT COALESCE(jsonb_agg(u_row ORDER BY u_row->>'id' ASC), '[]'::jsonb),
               COUNT(*)
        INTO v_unions_json, v_union_count
        FROM (
            SELECT jsonb_build_object(
                'id', u.id,
                'status', u.status,
                'startDate', u.start_date,
                'startYear', u.start_year,
                'startDatePrecision', u.start_date_precision,
                'endDate', u.end_date,
                'endYear', u.end_year,
                'endDatePrecision', u.end_date_precision,
                'verificationStatus', u.verification_status
            ) AS u_row
            FROM public.unions u
            WHERE u.id = ANY(v_union_ids)
              AND u.tree_id = p_tree_id
              AND u.deleted_at IS NULL
            LIMIT v_max_unions_budget
        ) unions_sub;

        SELECT COALESCE(jsonb_agg(um_row ORDER BY um_row->>'unionId' ASC, um_row->>'personId' ASC), '[]'::jsonb)
        INTO v_union_members_json
        FROM (
            SELECT jsonb_build_object(
                'unionId', um.union_id,
                'personId', um.person_id,
                'memberRole', um.member_role
            ) AS um_row
            FROM public.union_members um
            WHERE um.union_id = ANY(v_union_ids)
              AND um.tree_id = p_tree_id
              AND um.deleted_at IS NULL
              AND um.person_id = ANY(v_slice_person_ids)
        ) um_sub;
    ELSE
        v_unions_json := '[]'::jsonb;
        v_union_members_json := '[]'::jsonb;
        v_union_count := 0;
    END IF;

    -- 13. Tính Expansion Metadata cho từng Person trong slice
    SELECT jsonb_object_agg(
        p_id::text,
        jsonb_build_object(
            'hasMoreAncestors', has_more_anc,
            'hasMoreDescendants', has_more_desc,
            'canAddFather', can_add_fat,
            'canAddMother', can_add_mot,
            'canExpandAncestors', has_more_anc,
            'canExpandDescendants', has_more_desc,
            'hasVerifiedBiologicalFather', has_ver_fat,
            'hasVerifiedBiologicalMother', has_ver_mot
        )
    )
    INTO v_expansion_json
    FROM (
        SELECT 
            p.id AS p_id,
            EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                JOIN public.persons pr 
                    ON pr.id = r.parent_id 
                    AND pr.tree_id = p_tree_id 
                    AND pr.deleted_at IS NULL
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND (p_include_unverified OR r.verification_status = 'verified')
                  AND NOT (r.parent_id = ANY(v_slice_person_ids))
            ) AS has_more_anc,
            EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                JOIN public.persons cr 
                    ON cr.id = r.child_id 
                    AND cr.tree_id = p_tree_id 
                    AND cr.deleted_at IS NULL
                WHERE r.tree_id = p_tree_id
                  AND r.parent_id = p.id
                  AND r.deleted_at IS NULL
                  AND (p_include_unverified OR r.verification_status = 'verified')
                  AND NOT (r.child_id = ANY(v_slice_person_ids))
            ) AS has_more_desc,
            NOT EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND r.parent_role = 'father'
                  AND r.relationship_kind = 'biological'
                  AND r.verification_status = 'verified'
            ) AS can_add_fat,
            NOT EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND r.parent_role = 'mother'
                  AND r.relationship_kind = 'biological'
                  AND r.verification_status = 'verified'
            ) AS can_add_mot,
            EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND r.parent_role = 'father'
                  AND r.relationship_kind = 'biological'
                  AND r.verification_status = 'verified'
            ) AS has_ver_fat,
            EXISTS (
                SELECT 1 
                FROM public.parent_child_relationships r
                WHERE r.tree_id = p_tree_id
                  AND r.child_id = p.id
                  AND r.deleted_at IS NULL
                  AND r.parent_role = 'mother'
                  AND r.relationship_kind = 'biological'
                  AND r.verification_status = 'verified'
            ) AS has_ver_mot
        FROM public.persons p
        WHERE p.id = ANY(v_slice_person_ids)
          AND p.tree_id = p_tree_id
          AND p.deleted_at IS NULL
    ) exp_sub;

    -- 14. Tổng hợp TreeGraphDto hoàn chỉnh
    RETURN jsonb_build_object(
        'schemaVersion', 1,
        'treeId', p_tree_id,
        'centerPersonId', p_center_person_id,
        'persons', v_persons_json,
        'parentChildRelationships', v_relationships_json,
        'unions', v_unions_json,
        'unionMembers', v_union_members_json,
        'expansion', COALESCE(v_expansion_json, '{}'::jsonb),
        'limits', jsonb_build_object(
            'requestedAncestorDepth', p_ancestor_depth,
            'requestedDescendantDepth', p_descendant_depth,
            'appliedAncestorDepth', v_applied_ancestor_depth,
            'appliedDescendantDepth', v_applied_descendant_depth,
            'maxAncestorDepth', v_max_ancestor_depth,
            'maxDescendantDepth', v_max_descendant_depth,
            'maxPersonsBudget', v_max_persons_budget,
            'maxRelationshipsBudget', v_max_relationships_budget,
            'maxUnionsBudget', v_max_unions_budget,
            'returnedPersonCount', v_person_count,
            'returnedRelationshipCount', v_relationship_count,
            'returnedUnionCount', v_union_count,
            'truncated', v_truncated,
            'truncatedReason', v_truncated_reason
        ),
        'truncated', v_truncated,
        'warnings', CASE 
            WHEN v_truncated THEN jsonb_build_array('Graph slice was truncated due to budget constraints')
            ELSE '[]'::jsonb
        END
    );
END;
$$;

-- Phân quyền cho RPC
REVOKE ALL ON FUNCTION public.get_tree_graph_slice(UUID, UUID, INTEGER, INTEGER, BOOLEAN, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_tree_graph_slice(UUID, UUID, INTEGER, INTEGER, BOOLEAN, BOOLEAN) TO authenticated, service_role;

/*******************************************************************************
 * [09/14] MIGRATION: 20260830130000_p16_add_person_search.sql
 *******************************************************************************/

-- ==============================================================================
-- Migration: 20260830130000_p16_add_person_search.sql
-- Phase: P16 (Tìm kiếm nhân vật tiếng Việt & Bộ lọc)
-- Author: Principal Database Architect & PostgreSQL Search Engineer
-- Description:
--   1. Kích hoạt extensions unaccent & pg_trgm trong schema extensions.
--   2. Cập nhật hàm _system.normalize_person_name() chuẩn hóa tiếng Việt bỏ dấu & đ -> d.
--   3. Backfill dữ liệu normalized_name cho toàn bộ persons hiện có.
--   4. Tạo chỉ mục tìm kiếm: GIN Trigram index & Composite B-tree indexes.
--   5. Tạo hàm RPC search_persons_in_tree() hỗ trợ text search, filters,
--      deterministic cursor pagination và parent context không N+1.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. KÍCH HOẠT EXTENSIONS
-- ------------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA extensions;

-- ------------------------------------------------------------------------------
-- 2. HÀM CHUẨN HÓA TIẾNG VIỆT TẬP TRUNG (_system.normalize_person_name)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.normalize_person_name(input_text text)
RETURNS text AS $$
DECLARE
    cleaned text;
BEGIN
    IF input_text IS NULL THEN
        RETURN '';
    END IF;

    -- 1. Trim và thu gọn nhiều khoảng trắng liên tiếp (space, tab, newline, NBSP)
    cleaned := trim(regexp_replace(input_text, '\s+', ' ', 'g'));
    IF cleaned = '' THEN
        RETURN '';
    END IF;

    -- 2. Chuyển chữ thường
    cleaned := lower(cleaned);

    -- 3. Quy đổi ký tự 'đ' và 'Đ' thành 'd'
    cleaned := replace(replace(cleaned, 'Đ', 'd'), 'đ', 'd');

    -- 4. Bỏ dấu thanh qua unaccent
    RETURN extensions.unaccent('extensions.unaccent', cleaned);
EXCEPTION
    WHEN OTHERS THEN
        -- Fallback nếu dictionary unaccent không khả dụng
        RETURN lower(replace(replace(regexp_replace(trim(input_text), '\s+', ' ', 'g'), 'Đ', 'd'), 'đ', 'd'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION _system.normalize_person_name(text) IS
'Chuẩn hóa tên tiếng Việt: chuyển chữ thường, đổi đ/Đ thành d, bỏ dấu thanh unaccent, thu gọn khoảng trắng';

-- ------------------------------------------------------------------------------
-- 3. BACKFILL DỮ LIỆU NORMALIZED_NAME CHO PERSONS HIỆN CÓ
-- ------------------------------------------------------------------------------

UPDATE public.persons
SET normalized_name = _system.normalize_person_name(full_name)
WHERE deleted_at IS NULL OR normalized_name IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 4. CHỈ MỤC TÌM KIẾM (SEARCH INDEXES)
-- ------------------------------------------------------------------------------

-- GIN Trigram index phục vụ tìm kiếm substring và similarity không dấu
CREATE INDEX IF NOT EXISTS idx_persons_normalized_name_trgm
ON public.persons USING gin (normalized_name extensions.gin_trgm_ops)
WHERE deleted_at IS NULL;

-- Composite B-tree index phục vụ prefix matching, sorting và cursor pagination theo Tree
CREATE INDEX IF NOT EXISTS idx_persons_tree_search_name_id
ON public.persons (tree_id, normalized_name, id)
WHERE deleted_at IS NULL;

-- Composite B-tree index phục vụ lọc theo năm sinh và phân trang theo Tree
CREATE INDEX IF NOT EXISTS idx_persons_tree_birth_year_id
ON public.persons (tree_id, birth_year, id)
WHERE deleted_at IS NULL;

-- Composite B-tree index phục vụ lọc theo trạng thái sống
CREATE INDEX IF NOT EXISTS idx_persons_tree_living_status_id
ON public.persons (tree_id, living_status, id)
WHERE deleted_at IS NULL;

-- ------------------------------------------------------------------------------
-- 5. RPC SEARCH PERSONS IN TREE (public.search_persons_in_tree)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.search_persons_in_tree(
    p_tree_id UUID,
    p_query TEXT DEFAULT NULL,
    p_birth_year SMALLINT DEFAULT NULL,
    p_living_status TEXT DEFAULT NULL,
    p_missing_information TEXT DEFAULT NULL,
    p_cursor_rank_tier INTEGER DEFAULT NULL,
    p_cursor_similarity REAL DEFAULT NULL,
    p_cursor_normalized_name TEXT DEFAULT NULL,
    p_cursor_birth_year SMALLINT DEFAULT NULL,
    p_cursor_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    tree_id UUID,
    full_name TEXT,
    normalized_name TEXT,
    gender gender_type,
    living_status living_status_type,
    birth_date DATE,
    birth_year SMALLINT,
    birth_date_precision date_precision_type,
    birth_is_estimated BOOLEAN,
    death_date DATE,
    death_year SMALLINT,
    death_date_precision date_precision_type,
    death_is_estimated BOOLEAN,
    hometown_text TEXT,
    occupation_text TEXT,
    verification_status verification_status_type,
    parents_json JSONB,
    match_tier INTEGER,
    similarity_score REAL
) AS $$
DECLARE
    v_user_id UUID;
    v_has_access BOOLEAN;
    v_norm_query TEXT;
    v_safe_limit INTEGER;
BEGIN
    -- 1. Xác thực người dùng và phân quyền cùng Tree
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'PERSON_SEARCH_UNAUTHENTICATED: Yêu cầu đăng nhập để tìm kiếm.'
            USING ERRCODE = '42501';
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = p_tree_id
          AND tm.user_id = v_user_id
          AND tm.deleted_at IS NULL
          AND tm.status = 'active'
    ) OR EXISTS (
        SELECT 1
        FROM public.family_trees ft
        WHERE ft.id = p_tree_id
          AND ft.deleted_at IS NULL
          AND ft.privacy_level = 'public'
          AND ft.status = 'active'
    ) INTO v_has_access;

    IF NOT v_has_access THEN
        RAISE EXCEPTION 'PERSON_SEARCH_FORBIDDEN: Không có quyền truy cập cây gia phả.'
            USING ERRCODE = '42501';
    END IF;

    -- 2. Chuẩn hóa query và limit an toàn
    v_norm_query := _system.normalize_person_name(p_query);
    v_safe_limit := LEAST(GREATEST(coalesce(p_limit, 20), 1), 100);

    -- 3. Thực thi truy vấn kết hợp ranking và parent context
    RETURN QUERY
    WITH candidate_persons AS (
        SELECT
            p.id AS p_id,
            p.tree_id AS p_tree_id,
            p.full_name AS p_full_name,
            p.normalized_name AS p_normalized_name,
            p.gender AS p_gender,
            p.living_status AS p_living_status,
            p.birth_date AS p_birth_date,
            p.birth_year AS p_birth_year,
            p.birth_date_precision AS p_birth_date_precision,
            p.birth_is_estimated AS p_birth_is_estimated,
            p.death_date AS p_death_date,
            p.death_year AS p_death_year,
            p.death_date_precision AS p_death_date_precision,
            p.death_is_estimated AS p_death_is_estimated,
            p.hometown_text AS p_hometown_text,
            p.occupation_text AS p_occupation_text,
            p.verification_status AS p_verification_status,
            CASE
                WHEN v_norm_query = '' THEN 5
                WHEN p.normalized_name = v_norm_query THEN 1
                WHEN p.normalized_name LIKE (v_norm_query || '%') THEN 2
                WHEN p.normalized_name LIKE ('%' || v_norm_query || '%') THEN 3
                ELSE 4
            END AS p_match_tier,
            CASE
                WHEN v_norm_query = '' THEN 0.0::real
                ELSE extensions.similarity(p.normalized_name, v_norm_query)
            END AS p_similarity_score
        FROM public.persons p
        WHERE p.tree_id = p_tree_id
          AND p.deleted_at IS NULL
          -- Lọc theo Query text nếu có
          AND (
              v_norm_query = ''
              OR p.normalized_name = v_norm_query
              OR p.normalized_name LIKE (v_norm_query || '%')
              OR p.normalized_name LIKE ('%' || v_norm_query || '%')
              OR (length(v_norm_query) >= 3 AND extensions.similarity(p.normalized_name, v_norm_query) >= 0.25)
          )
          -- Lọc theo năm sinh
          AND (p_birth_year IS NULL OR p.birth_year = p_birth_year)
          -- Lọc theo trạng thái sống
          AND (
              p_living_status IS NULL
              OR p_living_status = 'all'
              OR p.living_status = p_living_status::living_status_type
          )
          -- Lọc hồ sơ thiếu thông tin
          AND (
              p_missing_information IS NULL
              OR p_missing_information = 'none'
              OR (p_missing_information = 'missing_birth' AND p.birth_year IS NULL AND p.birth_date IS NULL)
              OR (p_missing_information = 'missing_death_for_deceased' AND p.living_status = 'deceased' AND p.death_year IS NULL AND p.death_date IS NULL)
              OR (p_missing_information = 'missing_hometown' AND (p.hometown_text IS NULL OR trim(p.hometown_text) = ''))
              OR (p_missing_information = 'missing_any_core' AND (
                  (p.birth_year IS NULL AND p.birth_date IS NULL)
                  OR (p.living_status = 'unknown')
                  OR (p.hometown_text IS NULL OR trim(p.hometown_text) = '')
                  OR (p.verification_status = 'unverified')
              ))
          )
    )
    SELECT
        cp.p_id AS id,
        cp.p_tree_id AS tree_id,
        cp.p_full_name AS full_name,
        cp.p_normalized_name AS normalized_name,
        cp.p_gender AS gender,
        cp.p_living_status AS living_status,
        cp.p_birth_date AS birth_date,
        cp.p_birth_year AS birth_year,
        cp.p_birth_date_precision AS birth_date_precision,
        cp.p_birth_is_estimated AS birth_is_estimated,
        cp.p_death_date AS death_date,
        cp.p_death_year AS death_year,
        cp.p_death_date_precision AS death_date_precision,
        cp.p_death_is_estimated AS death_is_estimated,
        cp.p_hometown_text AS hometown_text,
        cp.p_occupation_text AS occupation_text,
        cp.p_verification_status AS verification_status,
        (
            SELECT coalesce(
                jsonb_agg(
                    jsonb_build_object(
                        'id', parent.id,
                        'fullName', parent.full_name,
                        'parentRole', rel.parent_role,
                        'relationshipKind', rel.relationship_kind,
                        'verificationStatus', rel.verification_status
                    ) ORDER BY
                        CASE rel.parent_role WHEN 'father' THEN 1 WHEN 'mother' THEN 2 ELSE 3 END,
                        parent.full_name ASC
                ),
                '[]'::jsonb
            )
            FROM public.parent_child_relationships rel
            JOIN public.persons parent ON parent.id = rel.parent_id
            WHERE rel.child_id = cp.p_id
              AND rel.tree_id = cp.p_tree_id
              AND rel.deleted_at IS NULL
              AND parent.deleted_at IS NULL
        ) AS parents_json,
        cp.p_match_tier AS match_tier,
        cp.p_similarity_score AS similarity_score
    FROM candidate_persons cp
    WHERE (
        p_cursor_id IS NULL
        OR (
            cp.p_match_tier,
            -cp.p_similarity_score,
            cp.p_normalized_name,
            coalesce(cp.p_birth_year, 9999::smallint),
            cp.p_id
        ) > (
            p_cursor_rank_tier,
            -coalesce(p_cursor_similarity, 0.0::real),
            coalesce(p_cursor_normalized_name, ''),
            coalesce(p_cursor_birth_year, 9999::smallint),
            p_cursor_id
        )
    )
    ORDER BY
        cp.p_match_tier ASC,
        cp.p_similarity_score DESC,
        cp.p_normalized_name ASC,
        cp.p_birth_year ASC NULLS LAST,
        cp.p_id ASC
    LIMIT v_safe_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, extensions, _system, pg_temp;

REVOKE EXECUTE ON FUNCTION public.search_persons_in_tree FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_persons_in_tree TO authenticated;

COMMENT ON FUNCTION public.search_persons_in_tree IS
'RPC tìm kiếm nhân vật phả hệ tiếng Việt có dấu/không dấu, lọc theo năm sinh/trạng thái/thông tin thiếu, phân trang cursor và tích hợp parent context';

/*******************************************************************************
 * [10/14] MIGRATION: 20260830140000_p17_add_private_avatar_storage.sql
 *******************************************************************************/

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
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public, _system, extensions, pg_temp;

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
    ELSIF array_length(v_parts, 1) >= 5 AND v_parts[1] = 'temporary' AND v_parts[2] = 'trees' AND v_parts[4] = 'persons' THEN
        v_person_str := v_parts[5];
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
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER SET search_path = public, _system, extensions, pg_temp;

GRANT EXECUTE ON FUNCTION _system.extract_tree_id_from_avatar_path(text) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION _system.extract_person_id_from_avatar_path(text) TO authenticated, anon, service_role;


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

-- 6.4. UPDATE POLICY (UPDATE / OVERWRITE)
CREATE POLICY person_avatars_storage_update_policy
ON storage.objects
FOR UPDATE
TO authenticated
USING (
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
)
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

/*******************************************************************************
 * [11/14] MIGRATION: 20260830150000_p18_add_audit_and_recovery.sql
 *******************************************************************************/

-- ==============================================================================
-- Migration: 20260830150000_p18_add_audit_and_recovery.sql
-- Phase: P18 (Nhật ký và phục hồi - Audit Log, Soft-Delete & Recovery)
-- Author: Principal Full-stack Engineer, PostgreSQL Audit Engineer & Supabase Security Engineer
-- Description:
--   1. Tạo bảng public.audit_logs và indexes phục vụ truy vết biến động và bộ lọc
--   2. Bật RLS và phân quyền nghiêm ngặt cho audit_logs (SELECT cho Tree Members, Không UPDATE/DELETE)
--   3. Helper function _system.write_audit_log (SECURITY DEFINER, safe search_path)
--   4. Tích hợp audit logging vào các RPCs hiện hữu:
--      - public.create_family_tree, public.restore_family_tree
--      - public.create_person_with_parent_relationship, public.link_existing_parent
--      - public.create_person_with_child_relationship, public.link_existing_child
--      - public.replace_parent_relationship, public.soft_delete_parent_child_relationship
--      - public.create_union_with_new_person, public.create_union_with_existing_person
--      - public.end_union, public.soft_delete_union
--      - public.restore_person
--   5. Tạo mới RPCs khôi phục có kiểm soát:
--      - public.restore_parent_child_relationship
--      - public.restore_union
--   6. RLS Policies truy cập Trash cho quan hệ: relationships_select_deleted_writers, unions_select_deleted_writers
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TẠO BẢNG AUDIT_LOGS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE RESTRICT,
    actor_user_id UUID NULL, -- Giữ lịch sử ngay cả khi auth.users bị xóa
    actor_name_cached TEXT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    before_data JSONB NULL,
    after_data JSONB NULL,
    changed_fields TEXT[] NULL,
    reason TEXT NULL,
    request_id TEXT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Ràng buộc danh mục Entity Types chuẩn hóa (P18-T02)
    CONSTRAINT audit_logs_entity_type_check CHECK (
        entity_type IN (
            'family_tree',
            'person',
            'parent_child_relationship',
            'union',
            'union_member',
            'person_avatar'
        )
    ),

    -- Ràng buộc danh mục Action Types chuẩn hóa (P18-T03)
    CONSTRAINT audit_logs_action_type_check CHECK (
        action_type IN (
            'create',
            'update',
            'soft_delete',
            'restore',
            'replace',
            'status_change',
            'link',
            'unlink',
            'privacy_change',
            'generation_anchor_change',
            'avatar_replace',
            'avatar_remove'
        )
    )
);

COMMENT ON TABLE public.audit_logs IS 'Bảng nhật ký biến động nghiệp vụ bất biến cho các cây gia phả (P18)';
COMMENT ON COLUMN public.audit_logs.tree_id IS 'UUID cây gia phả sở hữu biến động';
COMMENT ON COLUMN public.audit_logs.actor_user_id IS 'UUID người dùng thực hiện thay đổi (lấy từ auth.uid())';
COMMENT ON COLUMN public.audit_logs.entity_type IS 'Loại thực thể biến động (person, family_tree, parent_child_relationship, union, ...)';
COMMENT ON COLUMN public.audit_logs.action_type IS 'Loại thao tác thực hiện (create, update, soft_delete, restore, replace, ...)';
COMMENT ON COLUMN public.audit_logs.before_data IS 'Dữ liệu trước thay đổi đã khử nhiễm và lọc theo allowlist';
COMMENT ON COLUMN public.audit_logs.after_data IS 'Dữ liệu sau thay đổi đã khử nhiễm và lọc theo allowlist';

-- ------------------------------------------------------------------------------
-- 2. INDEXES PHỤC VỤ LỊCH SỬ VÀ BỘ LỌC
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_audit_logs_tree_created
    ON public.audit_logs (tree_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tree_entity
    ON public.audit_logs (tree_id, entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tree_action
    ON public.audit_logs (tree_id, action_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tree_actor
    ON public.audit_logs (tree_id, actor_user_id);

-- ------------------------------------------------------------------------------
-- 3. RLS VÀ PHÂN QUYỀN TRUY CẬP CHO AUDIT_LOGS
-- ------------------------------------------------------------------------------

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Thu hồi toàn bộ quyền từ PUBLIC và anon
REVOKE ALL ON public.audit_logs FROM PUBLIC, anon;

-- Cấp quyền SELECT cho authenticated và service_role
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO service_role;

-- Policy: Chỉ thành viên active của Tree mới có quyền SELECT audit logs
DROP POLICY IF EXISTS audit_logs_select_tree_members ON public.audit_logs;
CREATE POLICY audit_logs_select_tree_members ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (
        _system.is_active_tree_member(tree_id, auth.uid())
    );

-- Lưu ý: Tuyệt đối không tạo policy INSERT, UPDATE, DELETE cho authenticated role để đảm bảo tính bất biến (Immutability).

-- ------------------------------------------------------------------------------
-- 4. AUDIT WRITER HELPER FUNCTION
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.write_audit_log(
    p_tree_id UUID,
    p_entity_type VARCHAR(50),
    p_entity_id UUID,
    p_action_type VARCHAR(50),
    p_before_data JSONB DEFAULT NULL,
    p_after_data JSONB DEFAULT NULL,
    p_changed_fields TEXT[] DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_source VARCHAR(50) DEFAULT 'system',
    p_request_id TEXT DEFAULT NULL,
    p_actor_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_actor_id UUID;
    v_actor_name TEXT := NULL;
    v_audit_id UUID;
    v_tree_exists BOOLEAN;
BEGIN
    -- 1. Kiểm tra Tree tồn tại
    SELECT EXISTS (
        SELECT 1 FROM public.family_trees WHERE id = p_tree_id
    ) INTO v_tree_exists;

    IF NOT v_tree_exists THEN
        RAISE EXCEPTION 'Cannot record audit log: Family tree % does not exist', p_tree_id
            USING ERRCODE = 'P0002';
    END IF;

    -- 2. Xác định Actor
    v_actor_id := COALESCE(p_actor_user_id, auth.uid());

    IF v_actor_id IS NOT NULL THEN
        SELECT display_name INTO v_actor_name
        FROM public.profiles
        WHERE id = v_actor_id;
    END IF;

    -- 3. Ghi vào bảng audit_logs
    INSERT INTO public.audit_logs (
        tree_id,
        actor_user_id,
        actor_name_cached,
        entity_type,
        entity_id,
        action_type,
        before_data,
        after_data,
        changed_fields,
        reason,
        request_id,
        source
    ) VALUES (
        p_tree_id,
        v_actor_id,
        v_actor_name,
        p_entity_type,
        p_entity_id,
        p_action_type,
        p_before_data,
        p_after_data,
        p_changed_fields,
        p_reason,
        p_request_id,
        COALESCE(p_source, 'system')
    ) RETURNING id INTO v_audit_id;

    RETURN v_audit_id;
END;
$$;

COMMENT ON FUNCTION _system.write_audit_log IS 'Internal trusted function to record business audit log in same database transaction';

-- ------------------------------------------------------------------------------
-- 5. PUBLIC RPC RECORD AUDIT EVENT (Cho Server Actions tin cậy)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.record_audit_event(
    p_tree_id UUID,
    p_entity_type VARCHAR(50),
    p_entity_id UUID,
    p_action_type VARCHAR(50),
    p_before_data JSONB DEFAULT NULL,
    p_after_data JSONB DEFAULT NULL,
    p_changed_fields TEXT[] DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_source VARCHAR(50) DEFAULT 'server_action',
    p_request_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_can_write BOOLEAN;
    v_audit_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to record audit event'
            USING ERRCODE = '42501';
    END IF;

    -- Chỉ writer của tree mới được phép ghi log thông qua server action
    v_can_write := _system.can_write_tree(p_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: User is not authorized to write audit events for this tree'
            USING ERRCODE = '42501';
    END IF;

    v_audit_id := _system.write_audit_log(
        p_tree_id,
        p_entity_type,
        p_entity_id,
        p_action_type,
        p_before_data,
        p_after_data,
        p_changed_fields,
        p_reason,
        COALESCE(p_source, 'server_action'),
        p_request_id,
        v_user_id
    );

    RETURN v_audit_id;
END;
$$;

REVOKE ALL ON FUNCTION public.record_audit_event FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_audit_event TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 6. CẬP NHẬT CÁC RPCS P11 ĐỂ GHI AUDIT LOG
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
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to create a family tree'
            USING ERRCODE = '42501';
    END IF;

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

    -- Tạo Family Tree
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

    -- Tạo Owner Membership
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

    -- Ghi Audit Log trong cùng transaction (P18-T11)
    PERFORM _system.write_audit_log(
        v_tree_id,
        'family_tree',
        v_tree_id,
        'create',
        NULL,
        jsonb_build_object(
            'name', v_trimmed_name,
            'description', v_trimmed_desc,
            'privacy_level', COALESCE(p_privacy_level, 'private'::tree_privacy_level),
            'status', 'active'
        ),
        ARRAY['name', 'description', 'privacy_level', 'status'],
        'Khởi tạo cây gia phả mới',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN v_tree_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_family_tree(
    p_tree_id UUID,
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_is_owner boolean;
    v_current_status tree_status;
    v_current_version INTEGER;
    v_rows_updated INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore a family tree'
            USING ERRCODE = '42501';
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM public.tree_memberships
        WHERE tree_id = p_tree_id
          AND user_id = v_user_id
          AND role = 'owner'
          AND status = 'active'
          AND deleted_at IS NULL
    ) INTO v_is_owner;

    IF NOT v_is_owner THEN
        RAISE EXCEPTION 'Forbidden: Only the tree owner can restore a deleted family tree'
            USING ERRCODE = '42501';
    END IF;

    SELECT status, version
    INTO v_current_status, v_current_version
    FROM public.family_trees
    WHERE id = p_tree_id;

    IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'Family tree not found'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_current_status <> 'deleted' THEN
        RETURN true;
    END IF;

    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Family tree version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

    UPDATE public.family_trees
    SET
        status = 'active',
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_tree_id
      AND status = 'deleted'
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Failed to restore family tree due to concurrency conflict'
            USING ERRCODE = '40001';
    END IF;

    -- Ghi Audit Log trong cùng transaction (P18-T11)
    PERFORM _system.write_audit_log(
        p_tree_id,
        'family_tree',
        p_tree_id,
        'restore',
        jsonb_build_object('status', 'deleted', 'version', v_current_version),
        jsonb_build_object('status', 'active', 'version', v_current_version + 1),
        ARRAY['status', 'deleted_at', 'deleted_by', 'version'],
        'Khôi phục cây gia phả từ thùng rác',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 7. CẬP NHẬT CÁC RPCS P12 ĐỂ GHI AUDIT LOG
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
    v_full_name TEXT;
    v_tree_deleted boolean;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore a person'
            USING ERRCODE = '42501';
    END IF;

    SELECT tree_id, (deleted_at IS NOT NULL), version, full_name
    INTO v_tree_id, v_is_deleted, v_current_version, v_full_name
    FROM public.persons
    WHERE id = p_person_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Person not found'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra Tree có bị xóa không (P18-T14 invariant)
    SELECT (status = 'deleted' OR deleted_at IS NOT NULL)
    INTO v_tree_deleted
    FROM public.family_trees
    WHERE id = v_tree_id;

    IF v_tree_deleted THEN
        RAISE EXCEPTION 'Cannot restore person while family tree is deleted. Please restore the tree first.'
            USING ERRCODE = '22023';
    END IF;

    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can restore this person'
            USING ERRCODE = '42501';
    END IF;

    IF NOT v_is_deleted THEN
        RETURN true;
    END IF;

    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Person version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

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

    -- Ghi Audit Log trong cùng transaction (P18-T14)
    PERFORM _system.write_audit_log(
        v_tree_id,
        'person',
        p_person_id,
        'restore',
        jsonb_build_object('full_name', v_full_name, 'deleted', true, 'version', v_current_version),
        jsonb_build_object('full_name', v_full_name, 'deleted', false, 'version', v_current_version + 1),
        ARRAY['deleted_at', 'deleted_by', 'version'],
        'Khôi phục nhân vật từ thùng rác',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 8. CẬP NHẬT CÁC RPCS P13 ĐỂ GHI AUDIT LOG
-- ------------------------------------------------------------------------------

-- 8.1. Create person with parent relationship
CREATE OR REPLACE FUNCTION public.create_person_with_parent_relationship(
    p_tree_id UUID,
    p_child_id UUID,
    p_full_name TEXT,
    p_gender gender_type DEFAULT 'unknown',
    p_living_status living_status_type DEFAULT 'unknown',
    p_birth_date DATE DEFAULT NULL,
    p_birth_year SMALLINT DEFAULT NULL,
    p_birth_date_precision date_precision_type DEFAULT 'unknown',
    p_birth_is_estimated BOOLEAN DEFAULT false,
    p_death_date DATE DEFAULT NULL,
    p_death_year SMALLINT DEFAULT NULL,
    p_death_date_precision date_precision_type DEFAULT 'unknown',
    p_death_is_estimated BOOLEAN DEFAULT false,
    p_birth_place_text TEXT DEFAULT NULL,
    p_death_place_text TEXT DEFAULT NULL,
    p_hometown_text TEXT DEFAULT NULL,
    p_burial_place_text TEXT DEFAULT NULL,
    p_occupation_text TEXT DEFAULT NULL,
    p_biography TEXT DEFAULT NULL,
    p_parent_role parent_role_type DEFAULT 'unspecified',
    p_relationship_kind relationship_kind_type DEFAULT 'biological',
    p_verification_status verification_status_type DEFAULT 'unverified',
    p_confirm_warnings BOOLEAN DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_can_write BOOLEAN;
    v_child_exists BOOLEAN;
    v_new_person_id UUID;
    v_rel_id UUID;
    v_parent_role parent_role_type;
    v_auto_role parent_role_type;
    v_has_father BOOLEAN;
    v_has_mother BOOLEAN;
    v_bio_fathers_count INT;
    v_bio_mothers_count INT;
    v_similar_candidates JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    v_can_write := _system.can_write_tree(p_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Tree write permission required' USING ERRCODE = '42501';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.persons
        WHERE id = p_child_id AND tree_id = p_tree_id AND deleted_at IS NULL
    ) INTO v_child_exists;

    IF NOT v_child_exists THEN
        RAISE EXCEPTION 'Target child person not found or inactive in this tree' USING ERRCODE = 'P0002';
    END IF;

    v_parent_role := p_parent_role;
    IF v_parent_role = 'unspecified' THEN
        IF p_gender = 'male' THEN
            v_auto_role := 'father';
        ELSIF p_gender = 'female' THEN
            v_auto_role := 'mother';
        ELSE
            v_auto_role := 'unspecified';
        END IF;

        IF v_auto_role = 'father' THEN
            SELECT EXISTS (
                SELECT 1 FROM public.parent_child_relationships
                WHERE tree_id = p_tree_id AND child_id = p_child_id AND parent_role = 'father' AND deleted_at IS NULL
            ) INTO v_has_father;
            IF NOT v_has_father THEN
                v_parent_role := 'father';
            END IF;
        ELSIF v_auto_role = 'mother' THEN
            SELECT EXISTS (
                SELECT 1 FROM public.parent_child_relationships
                WHERE tree_id = p_tree_id AND child_id = p_child_id AND parent_role = 'mother' AND deleted_at IS NULL
            ) INTO v_has_mother;
            IF NOT v_has_mother THEN
                v_parent_role := 'mother';
            END IF;
        END IF;
    END IF;

    IF p_relationship_kind = 'biological' THEN
        IF v_parent_role = 'father' THEN
            SELECT COUNT(*) INTO v_bio_fathers_count
            FROM public.parent_child_relationships
            WHERE tree_id = p_tree_id AND child_id = p_child_id AND parent_role = 'father'
              AND relationship_kind = 'biological' AND deleted_at IS NULL;
            IF v_bio_fathers_count >= 1 THEN
                RAISE EXCEPTION 'BIOLOGICAL_PARENT_EXISTS: Child already has an active biological father' USING ERRCODE = '23505';
            END IF;
        ELSIF v_parent_role = 'mother' THEN
            SELECT COUNT(*) INTO v_bio_mothers_count
            FROM public.parent_child_relationships
            WHERE tree_id = p_tree_id AND child_id = p_child_id AND parent_role = 'mother'
              AND relationship_kind = 'biological' AND deleted_at IS NULL;
            IF v_bio_mothers_count >= 1 THEN
                RAISE EXCEPTION 'BIOLOGICAL_PARENT_EXISTS: Child already has an active biological mother' USING ERRCODE = '23505';
            END IF;
        END IF;
    END IF;

    IF NOT p_confirm_warnings THEN
        SELECT jsonb_agg(jsonb_build_object(
            'id', id, 'fullName', full_name, 'gender', gender, 'birthYear', birth_year
        )) INTO v_similar_candidates
        FROM public.persons
        WHERE tree_id = p_tree_id AND deleted_at IS NULL
          AND normalized_name = _system.normalize_person_name(p_full_name)
          AND (p_birth_year IS NULL OR birth_year IS NULL OR abs(birth_year - p_birth_year) <= 2);

        IF v_similar_candidates IS NOT NULL AND jsonb_array_length(v_similar_candidates) > 0 THEN
            RETURN jsonb_build_object(
                'status', 'warning',
                'warningCode', 'SIMILAR_PROFILE_WARNING',
                'candidates', v_similar_candidates
            );
        END IF;
    END IF;

    -- 1. Insert Person
    INSERT INTO public.persons (
        tree_id, full_name, normalized_name, gender, living_status,
        birth_date, birth_year, birth_date_precision, birth_is_estimated,
        death_date, death_year, death_date_precision, death_is_estimated,
        birth_place_text, death_place_text, hometown_text, burial_place_text,
        occupation_text, biography, verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, trim(p_full_name), _system.normalize_person_name(p_full_name), p_gender, p_living_status,
        p_birth_date, p_birth_year, p_birth_date_precision, p_birth_is_estimated,
        p_death_date, p_death_year, p_death_date_precision, p_death_is_estimated,
        p_birth_place_text, p_death_place_text, p_hometown_text, p_burial_place_text,
        p_occupation_text, p_biography, p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_new_person_id;

    -- 2. Insert Relationship
    INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind,
        verification_status, created_by, updated_by
    ) VALUES (
        p_tree_id, v_new_person_id, p_child_id, v_parent_role, p_relationship_kind,
        p_verification_status, v_user_id, v_user_id
    ) RETURNING id INTO v_rel_id;

    -- Ghi Audit Log cho Person (P18-T07)
    PERFORM _system.write_audit_log(
        p_tree_id,
        'person',
        v_new_person_id,
        'create',
        NULL,
        jsonb_build_object('full_name', trim(p_full_name), 'gender', p_gender, 'living_status', p_living_status),
        ARRAY['full_name', 'gender', 'living_status'],
        'Tạo nhân vật mới trong luồng thêm cha/mẹ',
        'relationship_flow',
        NULL,
        v_user_id
    );

    -- Ghi Audit Log cho Relationship (P18-T09)
    PERFORM _system.write_audit_log(
        p_tree_id,
        'parent_child_relationship',
        v_rel_id,
        'create',
        NULL,
        jsonb_build_object(
            'parent_id', v_new_person_id,
            'child_id', p_child_id,
            'parent_role', v_parent_role,
            'relationship_kind', p_relationship_kind,
            'verification_status', p_verification_status
        ),
        ARRAY['parent_id', 'child_id', 'parent_role', 'relationship_kind', 'verification_status'],
        'Tạo quan hệ cha/mẹ - con',
        'relationship_flow',
        NULL,
        v_user_id
    );

    RETURN jsonb_build_object(
        'status', 'success',
        'personId', v_new_person_id,
        'relationshipId', v_rel_id
    );
END;
$$;

-- 8.2. Soft delete parent-child relationship
CREATE OR REPLACE FUNCTION public.soft_delete_parent_child_relationship(
    p_relationship_id UUID,
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
    v_parent_id UUID;
    v_child_id UUID;
    v_role parent_role_type;
    v_kind relationship_kind_type;
    v_current_version INTEGER;
    v_is_deleted BOOLEAN;
    v_can_write BOOLEAN;
    v_rows_updated INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
    END IF;

    SELECT tree_id, parent_id, child_id, parent_role, relationship_kind, version, (deleted_at IS NOT NULL)
    INTO v_tree_id, v_parent_id, v_child_id, v_role, v_kind, v_current_version, v_is_deleted
    FROM public.parent_child_relationships
    WHERE id = p_relationship_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Relationship not found' USING ERRCODE = 'P0002';
    END IF;

    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Tree write permission required' USING ERRCODE = '42501';
    END IF;

    IF v_is_deleted THEN
        RETURN true;
    END IF;

    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Relationship version conflict: current is %, expected %',
            v_current_version, p_expected_version USING ERRCODE = '40001';
    END IF;

    UPDATE public.parent_child_relationships
    SET
        deleted_at = timezone('utc'::text, now()),
        deleted_by = v_user_id,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_relationship_id
      AND deleted_at IS NULL
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Concurrency conflict when deleting relationship' USING ERRCODE = '40001';
    END IF;

    -- Ghi Audit Log trong cùng transaction (P18-T10)
    PERFORM _system.write_audit_log(
        v_tree_id,
        'parent_child_relationship',
        p_relationship_id,
        'soft_delete',
        jsonb_build_object(
            'parent_id', v_parent_id,
            'child_id', v_child_id,
            'parent_role', v_role,
            'relationship_kind', v_kind,
            'version', v_current_version
        ),
        jsonb_build_object(
            'deleted', true,
            'version', v_current_version + 1
        ),
        ARRAY['deleted_at', 'deleted_by', 'version'],
        'Xóa quan hệ cha/mẹ - con',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 9. TẠO MỚI RECOVERY RPCS CHO QUAN HỆ VÀ HÔN NHÂN (P18-T15, P18-T16)
-- ------------------------------------------------------------------------------

-- 9.1. Khôi phục quan hệ Cha/Mẹ - Con có kiểm tra chu trình và trùng lặp
CREATE OR REPLACE FUNCTION public.restore_parent_child_relationship(
    p_relationship_id UUID,
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
    v_parent_id UUID;
    v_child_id UUID;
    v_parent_role parent_role_type;
    v_rel_kind relationship_kind_type;
    v_current_version INTEGER;
    v_is_deleted BOOLEAN;
    v_can_write BOOLEAN;
    v_tree_deleted BOOLEAN;
    v_parent_active BOOLEAN;
    v_child_active BOOLEAN;
    v_has_cycle BOOLEAN;
    v_duplicate_exists BOOLEAN;
    v_bio_parent_count INT;
    v_rows_updated INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore a relationship'
            USING ERRCODE = '42501';
    END IF;

    -- 1. Tra cứu thông tin quan hệ
    SELECT tree_id, parent_id, child_id, parent_role, relationship_kind, version, (deleted_at IS NOT NULL)
    INTO v_tree_id, v_parent_id, v_child_id, v_parent_role, v_rel_kind, v_current_version, v_is_deleted
    FROM public.parent_child_relationships
    WHERE id = p_relationship_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Relationship not found'
            USING ERRCODE = 'P0002';
    END IF;

    -- 2. Kiểm tra quyền ghi
    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can restore this relationship'
            USING ERRCODE = '42501';
    END IF;

    -- 3. Idempotent: nếu quan hệ đang active thì trả về true
    IF NOT v_is_deleted THEN
        RETURN true;
    END IF;

    -- 4. Kiểm tra Tree có bị xóa không
    SELECT (status = 'deleted' OR deleted_at IS NOT NULL)
    INTO v_tree_deleted
    FROM public.family_trees
    WHERE id = v_tree_id;

    IF v_tree_deleted THEN
        RAISE EXCEPTION 'Cannot restore relationship while family tree is deleted'
            USING ERRCODE = '22023';
    END IF;

    -- 5. Kiểm tra Parent và Child có active không (Blocking Dependency Conflict)
    SELECT (deleted_at IS NULL) INTO v_parent_active
    FROM public.persons WHERE id = v_parent_id AND tree_id = v_tree_id;

    SELECT (deleted_at IS NULL) INTO v_child_active
    FROM public.persons WHERE id = v_child_id AND tree_id = v_tree_id;

    IF v_parent_active IS NOT TRUE OR v_child_active IS NOT TRUE THEN
        RAISE EXCEPTION 'DEPENDENCY_DELETED: Cannot restore relationship because parent or child is deleted. Please restore the person first.'
            USING ERRCODE = '23503';
    END IF;

    -- 6. Kiểm tra Self-link
    IF v_parent_id = v_child_id THEN
        RAISE EXCEPTION 'SELF_LINK_CONFLICT: Parent and child cannot be the same person'
            USING ERRCODE = '22023';
    END IF;

    -- 7. Kiểm tra trùng lặp quan hệ active
    SELECT EXISTS (
        SELECT 1 FROM public.parent_child_relationships
        WHERE tree_id = v_tree_id
          AND parent_id = v_parent_id
          AND child_id = v_child_id
          AND deleted_at IS NULL
          AND id <> p_relationship_id
    ) INTO v_duplicate_exists;

    IF v_duplicate_exists THEN
        RAISE EXCEPTION 'DUPLICATE_RELATIONSHIP: An active parent-child relationship already exists between these two people'
            USING ERRCODE = '23505';
    END IF;

    -- 8. Kiểm tra Chu trình (Cycle Conflict)
    v_has_cycle := _system.check_parent_child_cycle(v_tree_id, v_parent_id, v_child_id);
    IF v_has_cycle THEN
        RAISE EXCEPTION 'CYCLE_CONFLICT: Restoring this relationship would create an ancestor-descendant cycle'
            USING ERRCODE = '22023';
    END IF;

    -- 9. Kiểm tra giới hạn cha/mẹ sinh học
    IF v_rel_kind = 'biological' AND v_parent_role IN ('father', 'mother') THEN
        SELECT COUNT(*) INTO v_bio_parent_count
        FROM public.parent_child_relationships
        WHERE tree_id = v_tree_id
          AND child_id = v_child_id
          AND parent_role = v_parent_role
          AND relationship_kind = 'biological'
          AND deleted_at IS NULL
          AND id <> p_relationship_id;

        IF v_bio_parent_count >= 1 THEN
            RAISE EXCEPTION 'BIOLOGICAL_PARENT_EXISTS: Child already has an active biological %', v_parent_role
                USING ERRCODE = '23505';
        END IF;
    END IF;

    -- 10. Kiểm tra Optimistic Concurrency
    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Relationship version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

    -- 11. Cập nhật khôi phục
    UPDATE public.parent_child_relationships
    SET
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_relationship_id
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Failed to restore relationship due to concurrency conflict'
            USING ERRCODE = '40001';
    END IF;

    -- 12. Ghi Audit Log trong cùng transaction (P18-T15)
    PERFORM _system.write_audit_log(
        v_tree_id,
        'parent_child_relationship',
        p_relationship_id,
        'restore',
        jsonb_build_object(
            'parent_id', v_parent_id,
            'child_id', v_child_id,
            'parent_role', v_parent_role,
            'relationship_kind', v_rel_kind,
            'deleted', true,
            'version', v_current_version
        ),
        jsonb_build_object(
            'parent_id', v_parent_id,
            'child_id', v_child_id,
            'parent_role', v_parent_role,
            'relationship_kind', v_rel_kind,
            'deleted', false,
            'version', v_current_version + 1
        ),
        ARRAY['deleted_at', 'deleted_by', 'version'],
        'Khôi phục quan hệ cha/mẹ - con từ thùng rác',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.restore_parent_child_relationship(UUID, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_parent_child_relationship(UUID, INTEGER) TO authenticated, service_role;

-- 9.2. Khôi phục Hôn nhân (Union)
CREATE OR REPLACE FUNCTION public.restore_union(
    p_union_id UUID,
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
    v_union_status union_status_type;
    v_current_version INTEGER;
    v_is_deleted BOOLEAN;
    v_can_write BOOLEAN;
    v_tree_deleted BOOLEAN;
    v_inactive_members_count INT;
    v_rows_updated INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to restore union'
            USING ERRCODE = '42501';
    END IF;

    SELECT tree_id, status, version, (deleted_at IS NOT NULL)
    INTO v_tree_id, v_union_status, v_current_version, v_is_deleted
    FROM public.unions
    WHERE id = p_union_id;

    IF v_tree_id IS NULL THEN
        RAISE EXCEPTION 'Union not found'
            USING ERRCODE = 'P0002';
    END IF;

    v_can_write := _system.can_write_tree(v_tree_id, v_user_id);
    IF NOT v_can_write THEN
        RAISE EXCEPTION 'Forbidden: Only tree writers can restore this union'
            USING ERRCODE = '42501';
    END IF;

    IF NOT v_is_deleted THEN
        RETURN true;
    END IF;

    -- Kiểm tra Tree có bị xóa không
    SELECT (status = 'deleted' OR deleted_at IS NOT NULL)
    INTO v_tree_deleted
    FROM public.family_trees
    WHERE id = v_tree_id;

    IF v_tree_deleted THEN
        RAISE EXCEPTION 'Cannot restore union while family tree is deleted'
            USING ERRCODE = '22023';
    END IF;

    -- Kiểm tra các thành viên trong hôn nhân có ai bị xóa không
    SELECT COUNT(*) INTO v_inactive_members_count
    FROM public.union_members um
    JOIN public.persons p ON um.person_id = p.id
    WHERE um.union_id = p_union_id
      AND (p.deleted_at IS NOT NULL OR um.deleted_at IS NOT NULL);

    IF v_inactive_members_count > 0 THEN
        RAISE EXCEPTION 'DEPENDENCY_DELETED: Cannot restore union because one or more spouse persons are deleted'
            USING ERRCODE = '23503';
    END IF;

    IF p_expected_version IS NOT NULL AND v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'Union version conflict: current version is %, expected %',
            v_current_version, p_expected_version
            USING ERRCODE = '40001';
    END IF;

    UPDATE public.unions
    SET
        deleted_at = NULL,
        deleted_by = NULL,
        version = version + 1,
        updated_at = timezone('utc'::text, now()),
        updated_by = v_user_id
    WHERE id = p_union_id
      AND (p_expected_version IS NULL OR version = p_expected_version);

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Failed to restore union due to concurrency conflict'
            USING ERRCODE = '40001';
    END IF;

    -- Ghi Audit Log trong cùng transaction
    PERFORM _system.write_audit_log(
        v_tree_id,
        'union',
        p_union_id,
        'restore',
        jsonb_build_object('status', v_union_status, 'deleted', true, 'version', v_current_version),
        jsonb_build_object('status', v_union_status, 'deleted', false, 'version', v_current_version + 1),
        ARRAY['deleted_at', 'deleted_by', 'version'],
        'Khôi phục quan hệ hôn nhân từ thùng rác',
        'direct_rpc',
        NULL,
        v_user_id
    );

    RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.restore_union(UUID, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_union(UUID, INTEGER) TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 10. RLS POLICIES TRUY CẬP THÙNG RÁC CHO QUAN HỆ (TRASH ACCESS)
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS relationships_select_deleted_writers ON public.parent_child_relationships;
CREATE POLICY relationships_select_deleted_writers ON public.parent_child_relationships
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NOT NULL
        AND _system.can_write_tree(tree_id, auth.uid())
    );

DROP POLICY IF EXISTS unions_select_deleted_writers ON public.unions;
CREATE POLICY unions_select_deleted_writers ON public.unions
    FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NOT NULL
        AND _system.can_write_tree(tree_id, auth.uid())
    );

/*******************************************************************************
 * [12/14] MIGRATION: 20260830170000_p19_add_json_backup_import.sql
 *******************************************************************************/

-- ==============================================================================
-- MIGRATION: Phase P19 - Versioned JSON Backup Export & Atomic Import RPC
-- ==============================================================================
-- Description:
--   1. Function public.export_family_tree_backup: Consistent snapshot projection for backup export.
--   2. Function public.import_family_tree_backup: Atomic transactional import for GenViet backup JSON.
-- ==============================================================================

-- 1. EXPORT FUNCTION
CREATE OR REPLACE FUNCTION public.export_family_tree_backup(
    p_tree_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_is_member BOOLEAN;
    v_tree_data JSONB;
    v_persons_data JSONB;
    v_rels_data JSONB;
    v_unions_data JSONB;
    v_members_data JSONB;
    v_media_data JSONB;
    v_result JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHENTICATED' USING ERRCODE = '42501';
    END IF;

    -- Kiểm tra quyền: Phải là thành viên có quyền (Owner/Admin/Editor) của cây gia phả
    SELECT EXISTS (
        SELECT 1 FROM public.tree_memberships
        WHERE tree_id = p_tree_id
          AND user_id = v_user_id
          AND status = 'active'
          AND role IN ('owner', 'admin', 'editor')
    ) INTO v_is_member;

    IF NOT v_is_member THEN
        RAISE EXCEPTION 'BACKUP_EXPORT_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    -- 1. Snapshot Family Tree
    SELECT jsonb_build_object(
        'sourceId', id,
        'name', name,
        'description', description,
        'privacyLevel', privacy_level,
        'generationAnchorPersonId', generation_anchor_person_id,
        'defaultPersonId', default_person_id
    ) INTO v_tree_data
    FROM public.family_trees
    WHERE id = p_tree_id AND deleted_at IS NULL;

    IF v_tree_data IS NULL THEN
        RAISE EXCEPTION 'BACKUP_TREE_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    -- 2. Snapshot Persons
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'fullName', full_name,
            'gender', gender,
            'livingStatus', living_status,
            'birthDate', birth_date,
            'birthYear', birth_year,
            'birthDatePrecision', birth_date_precision,
            'birthIsEstimated', birth_is_estimated,
            'deathDate', death_date,
            'deathYear', death_year,
            'deathDatePrecision', death_date_precision,
            'deathIsEstimated', death_is_estimated,
            'birthPlaceText', birth_place_text,
            'deathPlaceText', death_place_text,
            'hometownText', hometown_text,
            'burialPlaceText', burial_place_text,
            'occupationText', occupation_text,
            'biography', biography,
            'verificationStatus', verification_status,
            'avatarPath', NULL -- Không export direct avatar path
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_persons_data
    FROM public.persons
    WHERE tree_id = p_tree_id AND deleted_at IS NULL;

    -- 3. Snapshot Parent-Child Relationships
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'parentId', parent_id,
            'childId', child_id,
            'parentRole', parent_role,
            'relationshipKind', relationship_kind,
            'verificationStatus', verification_status
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_rels_data
    FROM public.parent_child_relationships
    WHERE tree_id = p_tree_id AND deleted_at IS NULL;

    -- 4. Snapshot Unions
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'status', status,
            'startDate', start_date,
            'startYear', start_year,
            'startDatePrecision', start_date_precision,
            'startIsEstimated', start_is_estimated,
            'endDate', end_date,
            'endYear', end_year,
            'endDatePrecision', end_date_precision,
            'endIsEstimated', end_is_estimated,
            'notes', notes,
            'verificationStatus', verification_status
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_unions_data
    FROM public.unions
    WHERE tree_id = p_tree_id AND deleted_at IS NULL;

    -- 5. Snapshot Union Members
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'unionId', union_id,
            'personId', person_id,
            'memberRole', member_role
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_members_data
    FROM public.union_members
    WHERE tree_id = p_tree_id AND deleted_at IS NULL;

    -- 6. Snapshot Media Metadata (Metadata-only, no binary)
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'sourceId', id,
            'personId', person_id,
            'mimeType', mime_type,
            'fileSizeBytes', file_size_bytes,
            'binaryIncluded', false,
            'availability', 'metadata_only'
        ) ORDER BY created_at ASC, id ASC
    ), '[]'::jsonb) INTO v_media_data
    FROM public.person_avatars
    WHERE tree_id = p_tree_id AND deleted_at IS NULL AND status = 'active';

    -- 7. Compose Root Document
    v_result := jsonb_build_object(
        'schemaVersion', 1,
        'exportedAt', timezone('utc'::text, now()),
        'generator', jsonb_build_object(
            'name', 'GenViet',
            'version', '0.1.0'
        ),
        'tree', v_tree_data,
        'persons', v_persons_data,
        'parentChildRelationships', v_rels_data,
        'unions', v_unions_data,
        'unionMembers', v_members_data,
        'mediaMetadata', v_media_data,
        'manifest', jsonb_build_object(
            'personCount', jsonb_array_length(v_persons_data),
            'relationshipCount', jsonb_array_length(v_rels_data),
            'unionCount', jsonb_array_length(v_unions_data),
            'mediaCount', jsonb_array_length(v_media_data)
        )
    );

    RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.export_family_tree_backup(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.export_family_tree_backup(UUID) TO authenticated, service_role;


-- 2. ATOMIC TRANSACTIONAL IMPORT FUNCTION
CREATE OR REPLACE FUNCTION public.import_family_tree_backup(
    p_backup_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_new_tree_id UUID;
    v_tree_obj JSONB;
    v_persons_arr JSONB;
    v_rels_arr JSONB;
    v_unions_arr JSONB;
    v_members_arr JSONB;
    v_item JSONB;
    v_person_count INT := 0;
    v_rel_count INT := 0;
    v_union_count INT := 0;
    v_anchor_id UUID;
    v_default_person_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHENTICATED' USING ERRCODE = '42501';
    END IF;

    -- Validate input structure
    v_tree_obj := p_backup_data->'tree';
    IF v_tree_obj IS NULL OR (v_tree_obj->>'id') IS NULL THEN
        RAISE EXCEPTION 'BACKUP_SCHEMA_INVALID: Missing tree object' USING ERRCODE = '22023';
    END IF;

    v_new_tree_id := (v_tree_obj->>'id')::uuid;
    v_persons_arr := COALESCE(p_backup_data->'persons', '[]'::jsonb);
    v_rels_arr := COALESCE(p_backup_data->'parentChildRelationships', '[]'::jsonb);
    v_unions_arr := COALESCE(p_backup_data->'unions', '[]'::jsonb);
    v_members_arr := COALESCE(p_backup_data->'unionMembers', '[]'::jsonb);

    -- 1. Insert Family Tree (Always Private, Current User is Owner)
    INSERT INTO public.family_trees (
        id,
        name,
        description,
        status,
        privacy_level,
        created_by,
        updated_by
    ) VALUES (
        v_new_tree_id,
        COALESCE(v_tree_obj->>'name', 'Cây gia phả mới'),
        v_tree_obj->>'description',
        'active',
        'private', -- Luôn luôn private khi import
        v_user_id,
        v_user_id
    );

    -- 2. Insert Owner Membership
    INSERT INTO public.tree_memberships (
        tree_id,
        user_id,
        role,
        status,
        created_by,
        updated_by
    ) VALUES (
        v_new_tree_id,
        v_user_id,
        'owner',
        'active',
        v_user_id,
        v_user_id
    );

    -- 3. Insert Persons
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_persons_arr)
    LOOP
        INSERT INTO public.persons (
            id,
            tree_id,
            full_name,
            normalized_name,
            gender,
            living_status,
            birth_date,
            birth_year,
            birth_date_precision,
            birth_is_estimated,
            death_date,
            death_year,
            death_date_precision,
            death_is_estimated,
            birth_place_text,
            death_place_text,
            hometown_text,
            burial_place_text,
            occupation_text,
            biography,
            verification_status,
            avatar_path,
            created_by,
            updated_by
        ) VALUES (
            (v_item->>'id')::uuid,
            v_new_tree_id,
            v_item->>'fullName',
            _system.normalize_person_name(v_item->>'fullName'),
            (v_item->>'gender')::public.gender_type,
            (v_item->>'livingStatus')::public.living_status_type,
            NULLIF(v_item->>'birthDate', '')::date,
            (v_item->>'birthYear')::int,
            COALESCE((v_item->>'birthDatePrecision')::public.date_precision_type, 'unknown'),
            COALESCE((v_item->>'birthIsEstimated')::boolean, false),
            NULLIF(v_item->>'deathDate', '')::date,
            (v_item->>'deathYear')::int,
            COALESCE((v_item->>'deathDatePrecision')::public.date_precision_type, 'unknown'),
            COALESCE((v_item->>'deathIsEstimated')::boolean, false),
            v_item->>'birthPlaceText',
            v_item->>'deathPlaceText',
            v_item->>'hometownText',
            v_item->>'burialPlaceText',
            v_item->>'occupationText',
            v_item->>'biography',
            COALESCE((v_item->>'verificationStatus')::public.verification_status_type, 'unverified'),
            NULL, -- Không trỏ tới file Storage cũ
            v_user_id,
            v_user_id
        );
        v_person_count := v_person_count + 1;
    END LOOP;

    -- 4. Insert Parent-Child Relationships
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_rels_arr)
    LOOP
        -- Kiểm tra tự liên kết
        IF (v_item->>'parentId')::uuid = (v_item->>'childId')::uuid THEN
            RAISE EXCEPTION 'BACKUP_CYCLE_DETECTED: Self-link parent and child' USING ERRCODE = '23514';
        END IF;

        INSERT INTO public.parent_child_relationships (
            id,
            tree_id,
            parent_id,
            child_id,
            parent_role,
            relationship_kind,
            verification_status,
            created_by,
            updated_by
        ) VALUES (
            (v_item->>'id')::uuid,
            v_new_tree_id,
            (v_item->>'parentId')::uuid,
            (v_item->>'childId')::uuid,
            COALESCE((v_item->>'parentRole')::public.parent_role_type, 'unspecified'),
            COALESCE((v_item->>'relationshipKind')::public.relationship_kind_type, 'biological'),
            COALESCE((v_item->>'verificationStatus')::public.verification_status_type, 'unverified'),
            v_user_id,
            v_user_id
        );
        v_rel_count := v_rel_count + 1;
    END LOOP;

    -- 5. Insert Unions
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_unions_arr)
    LOOP
        INSERT INTO public.unions (
            id,
            tree_id,
            status,
            start_date,
            start_year,
            start_date_precision,
            start_is_estimated,
            end_date,
            end_year,
            end_date_precision,
            end_is_estimated,
            notes,
            verification_status,
            created_by,
            updated_by
        ) VALUES (
            (v_item->>'id')::uuid,
            v_new_tree_id,
            (v_item->>'status')::public.union_status_type,
            NULLIF(v_item->>'startDate', '')::date,
            (v_item->>'startYear')::int,
            COALESCE((v_item->>'startDatePrecision')::public.date_precision_type, 'unknown'),
            COALESCE((v_item->>'startIsEstimated')::boolean, false),
            NULLIF(v_item->>'endDate', '')::date,
            (v_item->>'endYear')::int,
            COALESCE((v_item->>'endDatePrecision')::public.date_precision_type, 'unknown'),
            COALESCE((v_item->>'endIsEstimated')::boolean, false),
            v_item->>'notes',
            COALESCE((v_item->>'verificationStatus')::public.verification_status_type, 'unverified'),
            v_user_id,
            v_user_id
        );
        v_union_count := v_union_count + 1;
    END LOOP;

    -- 6. Insert Union Members
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_members_arr)
    LOOP
        INSERT INTO public.union_members (
            id,
            tree_id,
            union_id,
            person_id,
            member_role,
            created_by
        ) VALUES (
            (v_item->>'id')::uuid,
            v_new_tree_id,
            (v_item->>'unionId')::uuid,
            (v_item->>'personId')::uuid,
            COALESCE((v_item->>'memberRole')::public.union_member_role_type, 'unspecified'),
            v_user_id
        );
    END LOOP;

    -- 7. Update Tree Generation Anchor & Default Person
    v_anchor_id := (v_tree_obj->>'generationAnchorPersonId')::uuid;
    v_default_person_id := (v_tree_obj->>'defaultPersonId')::uuid;

    IF v_anchor_id IS NOT NULL OR v_default_person_id IS NOT NULL THEN
        UPDATE public.family_trees
        SET generation_anchor_person_id = v_anchor_id,
            default_person_id = v_default_person_id,
            updated_by = v_user_id
        WHERE id = v_new_tree_id;
    END IF;

    -- 8. Ghi Audit Log cho sự kiện Import
    PERFORM _system.write_audit_log(
        p_tree_id => v_new_tree_id,
        p_actor_user_id => v_user_id,
        p_actor_name_cached => 'Chủ sở hữu (Bản nhập)',
        p_entity_type => 'family_tree',
        p_entity_id => v_new_tree_id,
        p_action_type => 'create',
        p_before_data => NULL,
        p_after_data => jsonb_build_object(
            'name', v_tree_obj->>'name',
            'person_count', v_person_count,
            'relationship_count', v_rel_count,
            'union_count', v_union_count
        ),
        p_changed_fields => ARRAY['name', 'person_count', 'relationship_count', 'union_count'],
        p_reason => 'Tạo cây gia phả từ tệp sao lưu JSON',
        p_source => 'backup_import'
    );

    RETURN jsonb_build_object(
        'success', true,
        'treeId', v_new_tree_id,
        'treeName', v_tree_obj->>'name',
        'personCount', v_person_count,
        'relationshipCount', v_rel_count,
        'unionCount', v_union_count
    );
END;
$$;

REVOKE ALL ON FUNCTION public.import_family_tree_backup(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.import_family_tree_backup(JSONB) TO authenticated, service_role;

/*******************************************************************************
 * [13/14] MIGRATION: 20260830180000_p21_add_system_heartbeats.sql
 *******************************************************************************/

-- Migration: 20260830180000_p21_add_system_heartbeats.sql
-- Description: Tạo bảng kỹ thuật system_heartbeats với ràng buộc singleton (id = 'primary'), RLS và restricted writer function (Phase P21)

-- 1. Tạo bảng kỹ thuật system_heartbeats
create table if not exists public.system_heartbeats (
  id text primary key default 'primary',
  last_heartbeat_at timestamptz not null default clock_timestamp(),
  last_source text not null default 'manual',
  last_run_id text null,
  last_status text not null default 'success',
  last_duration_ms integer null,
  last_error_code text null,
  consecutive_failures integer not null default 0,
  last_success_at timestamptz null,
  last_failure_at timestamptz null,
  updated_at timestamptz not null default clock_timestamp(),
  constraint system_heartbeats_singleton_check check (id = 'primary'),
  constraint system_heartbeats_source_check check (last_source in ('github_actions', 'manual', 'cron', 'cli', 'migration', 'test')),
  constraint system_heartbeats_status_check check (last_status in ('success', 'failure', 'degraded')),
  constraint system_heartbeats_duration_check check (last_duration_ms is null or last_duration_ms >= 0),
  constraint system_heartbeats_failures_check check (consecutive_failures >= 0)
);

comment on table public.system_heartbeats is 'Bảng kỹ thuật ghi nhận nhịp tim hệ thống và vận hành định kỳ (Singleton table - chỉ 1 dòng duy nhất id=primary)';
comment on column public.system_heartbeats.id is 'Khóa chính cố định giá trị primary để đảm bảo duy nhất 1 dòng bản ghi';
comment on column public.system_heartbeats.last_heartbeat_at is 'Thời điểm ghi nhận nhịp tim gần nhất (UTC)';
comment on column public.system_heartbeats.last_source is 'Nguồn kích hoạt nhịp tim (github_actions, manual, cron, cli, migration, test)';
comment on column public.system_heartbeats.last_run_id is 'Mã định danh lần chạy (ví dụ GitHub Action Run ID)';
comment on column public.system_heartbeats.last_status is 'Trạng thái lần chạy gần nhất (success, failure, degraded)';
comment on column public.system_heartbeats.last_duration_ms is 'Thời gian thực thi của nhịp tim tính bằng mili-giây';
comment on column public.system_heartbeats.last_error_code is 'Mã lỗi an toàn nếu lần chạy gần nhất thất bại';
comment on column public.system_heartbeats.consecutive_failures is 'Số lần thất bại liên tiếp ghi nhận được';
comment on column public.system_heartbeats.last_success_at is 'Thời điểm thành công gần nhất';
comment on column public.system_heartbeats.last_failure_at is 'Thời điểm thất bại gần nhất';
comment on column public.system_heartbeats.updated_at is 'Thời điểm cập nhật bản ghi';

-- 2. Khởi tạo bản ghi singleton ban đầu
insert into public.system_heartbeats (
  id,
  last_heartbeat_at,
  last_source,
  last_status,
  consecutive_failures,
  last_success_at,
  updated_at
)
values (
  'primary',
  clock_timestamp(),
  'migration',
  'success',
  0,
  clock_timestamp(),
  clock_timestamp()
)
on conflict (id) do nothing;

-- 3. Bật RLS và thu hồi quyền từ client roles
alter table public.system_heartbeats enable row level security;
alter table public.system_heartbeats force row level security;

revoke all on public.system_heartbeats from anon, authenticated, public;
grant select, insert, update on public.system_heartbeats to service_role;

-- 4. Tạo restricted database function để ghi nhận heartbeat an toàn
create or replace function public.record_system_heartbeat(
  p_source text default 'manual',
  p_run_id text default null,
  p_duration_ms integer default null,
  p_status text default 'success',
  p_error_code text default null
)
returns public.system_heartbeats
language plpgsql
security definer
set search_path = public, pg_catalog, pg_temp
as $$
declare
  v_result public.system_heartbeats;
  v_source text := coalesce(nullif(trim(p_source), ''), 'manual');
  v_status text := coalesce(nullif(trim(p_status), ''), 'success');
  v_duration integer := p_duration_ms;
begin
  -- Validate source allowlist
  if v_source not in ('github_actions', 'manual', 'cron', 'cli', 'migration', 'test') then
    v_source := 'manual';
  end if;

  -- Validate status allowlist
  if v_status not in ('success', 'failure', 'degraded') then
    v_status := 'success';
  end if;

  -- Validate duration
  if v_duration is not null and v_duration < 0 then
    v_duration := 0;
  end if;

  if v_status = 'success' then
    insert into public.system_heartbeats (
      id,
      last_heartbeat_at,
      last_source,
      last_run_id,
      last_status,
      last_duration_ms,
      last_error_code,
      consecutive_failures,
      last_success_at,
      updated_at
    )
    values (
      'primary',
      clock_timestamp(),
      v_source,
      p_run_id,
      v_status,
      v_duration,
      null,
      0,
      clock_timestamp(),
      clock_timestamp()
    )
    on conflict (id) do update set
      last_heartbeat_at = clock_timestamp(),
      last_source = excluded.last_source,
      last_run_id = excluded.last_run_id,
      last_status = excluded.last_status,
      last_duration_ms = excluded.last_duration_ms,
      last_error_code = null,
      consecutive_failures = 0,
      last_success_at = clock_timestamp(),
      updated_at = clock_timestamp()
    returning * into v_result;
  else
    insert into public.system_heartbeats (
      id,
      last_heartbeat_at,
      last_source,
      last_run_id,
      last_status,
      last_duration_ms,
      last_error_code,
      consecutive_failures,
      last_failure_at,
      updated_at
    )
    values (
      'primary',
      clock_timestamp(),
      v_source,
      p_run_id,
      v_status,
      v_duration,
      p_error_code,
      1,
      clock_timestamp(),
      clock_timestamp()
    )
    on conflict (id) do update set
      last_heartbeat_at = clock_timestamp(),
      last_source = excluded.last_source,
      last_run_id = excluded.last_run_id,
      last_status = excluded.last_status,
      last_duration_ms = excluded.last_duration_ms,
      last_error_code = excluded.last_error_code,
      consecutive_failures = system_heartbeats.consecutive_failures + 1,
      last_failure_at = clock_timestamp(),
      updated_at = clock_timestamp()
    returning * into v_result;
  end if;

  return v_result;
end;
$$;

comment on function public.record_system_heartbeat is 'Hàm nội bộ privileged ghi nhận nhịp tim hệ thống singleton, cập nhật atomic counter thất bại/thành công';

-- Thu hồi quyền execute từ public/client và chỉ cấp cho service_role
revoke all on function public.record_system_heartbeat(text, text, integer, text, text) from public, anon, authenticated;
grant execute on function public.record_system_heartbeat(text, text, integer, text, text) to service_role;

/*******************************************************************************
 * [14/14] MIGRATION: 20260830190000_p23_optimize_graph_queries.sql
 *******************************************************************************/

-- Migration: 20260830190000_p23_optimize_graph_queries.sql
-- Description: Composite covering indexes for high-speed recursive CTE graph traversals (P23-T06, P23-T07)

-- 1. Index bao phủ cho việc quét quan hệ Cha/Mẹ -> Con (Descendant Traversal)
CREATE INDEX IF NOT EXISTS idx_parent_child_parent_child_covering
ON public.parent_child_relationships (tree_id, parent_id, child_id)
WHERE deleted_at IS NULL;

-- 2. Index bao phủ cho việc quét quan hệ Con -> Cha/Mẹ (Ancestor Traversal)
CREATE INDEX IF NOT EXISTS idx_parent_child_child_parent_covering
ON public.parent_child_relationships (tree_id, child_id, parent_id)
WHERE deleted_at IS NULL;

-- 3. Index bao phủ cho việc tra cứu thành viên hôn nhân (Union Members Lookup)
CREATE INDEX IF NOT EXISTS idx_union_members_person_union_covering
ON public.union_members (tree_id, person_id, union_id)
WHERE deleted_at IS NULL;

-- 4. Cập nhật phân tích thống kê bảng (ANALYZE)
ANALYZE public.family_trees;
ANALYZE public.persons;
ANALYZE public.parent_child_relationships;
ANALYZE public.unions;
ANALYZE public.union_members;

-- ==============================================================================
-- HOÀN TẤT TRIỂN KHAI TOÀN BỘ SCHEMA GENVIET
-- ==============================================================================
