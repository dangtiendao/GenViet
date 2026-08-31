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
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
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

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (id = (select auth.uid()));

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
