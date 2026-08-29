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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

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
