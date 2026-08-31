-- ==============================================================================
-- Migration: 20260831200000_p30_public_guest_view.sql
-- Phase: P30 (Public Guest View & Privacy Projection)
-- Description: Adds tree publication model, public slug, living-person redaction,
--              CUT_BRANCH private topology, PATERNAL_LINE public graph RPCs,
--              and least-privilege anon role access controls.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Schema Extensions on family_trees and persons
-- ------------------------------------------------------------------------------

-- Add publication and privacy projection metadata columns to family_trees
ALTER TABLE public.family_trees
    ADD COLUMN IF NOT EXISTS public_slug TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS public_updated_at TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS publication_version INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS privacy_projection_version INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS search_engine_visibility TEXT NOT NULL DEFAULT 'NOINDEX',
    ADD COLUMN IF NOT EXISTS living_person_policy TEXT NOT NULL DEFAULT 'REDACTED';

-- Add search_engine_visibility check constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_family_trees_search_engine_visibility'
    ) THEN
        ALTER TABLE public.family_trees
            ADD CONSTRAINT chk_family_trees_search_engine_visibility
            CHECK (search_engine_visibility IN ('NOINDEX', 'INDEX'));
    END IF;
END $$;

-- Add living_person_policy check constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_family_trees_living_person_policy'
    ) THEN
        ALTER TABLE public.family_trees
            ADD CONSTRAINT chk_family_trees_living_person_policy
            CHECK (living_person_policy IN ('REDACTED', 'STRICT'));
    END IF;
END $$;

-- Add public_slug format constraint (3-60 chars, lowercase alphanumeric & hyphens, no consecutive hyphens)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_family_trees_public_slug_format'
    ) THEN
        ALTER TABLE public.family_trees
            ADD CONSTRAINT chk_family_trees_public_slug_format
            CHECK (
                public_slug IS NULL OR (
                    length(public_slug) >= 3 AND length(public_slug) <= 60
                    AND public_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
                )
            );
    END IF;
END $$;

-- Add public_visibility column to persons (override individual visibility)
ALTER TABLE public.persons
    ADD COLUMN IF NOT EXISTS public_visibility TEXT NOT NULL DEFAULT 'INHERIT_TREE';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_persons_public_visibility'
    ) THEN
        ALTER TABLE public.persons
            ADD CONSTRAINT chk_persons_public_visibility
            CHECK (public_visibility IN ('INHERIT_TREE', 'PRIVATE', 'PUBLIC_REDACTED', 'PUBLIC'));
    END IF;
END $$;

-- Index for public slug lookup
CREATE INDEX IF NOT EXISTS idx_family_trees_public_slug
    ON public.family_trees (public_slug)
    WHERE deleted_at IS NULL AND privacy_level = 'public'::tree_privacy_level;

-- ------------------------------------------------------------------------------
-- 2. Helper Functions for Reserved Slugs & Publication
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.is_reserved_public_slug(p_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT LOWER(TRIM(p_slug)) IN (
        'admin', 'api', 'auth', 'dashboard', 'public', 'trees', 'person', 'people',
        'settings', 'account', 'login', 'signup', 'sign-up', 'logout', 'help',
        'terms', 'privacy', 'legal', 'root', 'health', 'heartbeat', 'backup',
        'search', 'graph', 'media', 'storage', 'system', 'null', 'undefined'
    );
$$;

-- ------------------------------------------------------------------------------
-- 3. Owner-Guarded Publish & Unpublish RPCs
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.publish_family_tree(
    p_tree_id UUID,
    p_slug TEXT,
    p_living_person_policy TEXT DEFAULT 'REDACTED',
    p_search_engine_visibility TEXT DEFAULT 'NOINDEX',
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_is_owner BOOLEAN;
    v_clean_slug TEXT;
    v_curr_version INTEGER;
    v_pub_version INTEGER;
    v_tree RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'PUBLISH_TREE_UNAUTHORIZED' USING ERRCODE = '42501';
    END IF;

    -- Verify Ownership
    SELECT _system.is_tree_owner(p_tree_id, v_user_id) INTO v_is_owner;
    IF NOT COALESCE(v_is_owner, false) THEN
        RAISE EXCEPTION 'PUBLISH_TREE_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    -- Normalize slug
    v_clean_slug := LOWER(TRIM(p_slug));
    IF v_clean_slug IS NULL OR length(v_clean_slug) < 3 OR length(v_clean_slug) > 60 OR NOT (v_clean_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$') THEN
        RAISE EXCEPTION 'PUBLIC_TREE_SLUG_INVALID' USING ERRCODE = '22023';
    END IF;

    IF _system.is_reserved_public_slug(v_clean_slug) THEN
        RAISE EXCEPTION 'PUBLIC_TREE_SLUG_RESERVED' USING ERRCODE = '22023';
    END IF;

    -- Check slug conflict
    IF EXISTS (
        SELECT 1 FROM public.family_trees
        WHERE public_slug = v_clean_slug
          AND id <> p_tree_id
          AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'PUBLIC_TREE_SLUG_CONFLICT' USING ERRCODE = '23505';
    END IF;

    -- Validate policy options
    IF p_living_person_policy NOT IN ('REDACTED', 'STRICT') THEN
        RAISE EXCEPTION 'PUBLIC_TREE_POLICY_INVALID' USING ERRCODE = '22023';
    END IF;

    IF p_search_engine_visibility NOT IN ('NOINDEX', 'INDEX') THEN
        RAISE EXCEPTION 'PUBLIC_TREE_SEO_INVALID' USING ERRCODE = '22023';
    END IF;

    -- Check optimistic locking if provided
    SELECT version, publication_version INTO v_curr_version, v_pub_version
    FROM public.family_trees
    WHERE id = p_tree_id AND deleted_at IS NULL;

    IF v_curr_version IS NULL THEN
        RAISE EXCEPTION 'PUBLIC_TREE_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    IF p_expected_version IS NOT NULL AND v_curr_version <> p_expected_version THEN
        RAISE EXCEPTION 'PUBLIC_TREE_VERSION_CONFLICT' USING ERRCODE = '40001';
    END IF;

    -- Perform publication update
    UPDATE public.family_trees
    SET privacy_level = 'public'::tree_privacy_level,
        public_slug = v_clean_slug,
        living_person_policy = p_living_person_policy,
        search_engine_visibility = p_search_engine_visibility,
        published_at = COALESCE(published_at, NOW()),
        public_updated_at = NOW(),
        publication_version = v_pub_version + 1,
        version = v_curr_version + 1,
        updated_by = v_user_id,
        updated_at = NOW()
    WHERE id = p_tree_id
    RETURNING * INTO v_tree;

    -- Record Audit Event
    PERFORM _system.write_audit_log(
        p_tree_id,
        'family_tree',
        p_tree_id,
        'privacy_change',
        jsonb_build_object('privacy_level', 'private'),
        jsonb_build_object('privacy_level', 'public', 'public_slug', v_clean_slug, 'publication_version', v_tree.publication_version),
        ARRAY['privacy_level', 'public_slug', 'published_at', 'publication_version'],
        'Family tree published to public guest view',
        'web'
    );

    RETURN jsonb_build_object(
        'treeId', v_tree.id,
        'publicSlug', v_tree.public_slug,
        'privacyLevel', v_tree.privacy_level,
        'publicationVersion', v_tree.publication_version,
        'publishedAt', v_tree.published_at,
        'searchEngineVisibility', v_tree.search_engine_visibility,
        'livingPersonPolicy', v_tree.living_person_policy,
        'version', v_tree.version
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.unpublish_family_tree(
    p_tree_id UUID,
    p_expected_version INTEGER DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_is_owner BOOLEAN;
    v_curr_version INTEGER;
    v_pub_version INTEGER;
    v_tree RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNPUBLISH_TREE_UNAUTHORIZED' USING ERRCODE = '42501';
    END IF;

    -- Verify Ownership
    SELECT _system.is_tree_owner(p_tree_id, v_user_id) INTO v_is_owner;
    IF NOT COALESCE(v_is_owner, false) THEN
        RAISE EXCEPTION 'UNPUBLISH_TREE_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    -- Fetch current version
    SELECT version, publication_version INTO v_curr_version, v_pub_version
    FROM public.family_trees
    WHERE id = p_tree_id AND deleted_at IS NULL;

    IF v_curr_version IS NULL THEN
        RAISE EXCEPTION 'PUBLIC_TREE_NOT_FOUND' USING ERRCODE = 'P0002';
    END IF;

    IF p_expected_version IS NOT NULL AND v_curr_version <> p_expected_version THEN
        RAISE EXCEPTION 'PUBLIC_TREE_VERSION_CONFLICT' USING ERRCODE = '40001';
    END IF;

    -- Perform unpublish update
    UPDATE public.family_trees
    SET privacy_level = 'private'::tree_privacy_level,
        public_updated_at = NOW(),
        publication_version = v_pub_version + 1,
        version = v_curr_version + 1,
        updated_by = v_user_id,
        updated_at = NOW()
    WHERE id = p_tree_id
    RETURNING * INTO v_tree;

    -- Record Audit Event
    PERFORM _system.write_audit_log(
        p_tree_id,
        'family_tree',
        p_tree_id,
        'privacy_change',
        jsonb_build_object('privacy_level', 'public'),
        jsonb_build_object('privacy_level', 'private', 'publication_version', v_tree.publication_version),
        ARRAY['privacy_level', 'publication_version'],
        'Family tree unpublished to private',
        'web'
    );

    RETURN jsonb_build_object(
        'treeId', v_tree.id,
        'privacyLevel', v_tree.privacy_level,
        'publicationVersion', v_tree.publication_version,
        'version', v_tree.version
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. Dedicated Public Read-Only RPCs (Security Definer, Allowlisted Projections)
-- ------------------------------------------------------------------------------

-- 4.1. Public Tree Summary
CREATE OR REPLACE FUNCTION public.get_public_tree_summary(
    p_slug TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_clean_slug TEXT;
    v_tree RECORD;
    v_root_person_id UUID;
BEGIN
    v_clean_slug := LOWER(TRIM(p_slug));
    IF v_clean_slug IS NULL OR length(v_clean_slug) < 3 THEN
        RETURN NULL;
    END IF;

    SELECT id, name, description, privacy_level, generation_anchor_person_id,
           public_slug, published_at, public_updated_at, publication_version,
           privacy_projection_version, search_engine_visibility, living_person_policy
    INTO v_tree
    FROM public.family_trees
    WHERE public_slug = v_clean_slug
      AND privacy_level = 'public'::tree_privacy_level
      AND status = 'active'::tree_status
      AND deleted_at IS NULL;

    IF v_tree.id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Determine default root / center person (Anchor person or highest root ancestor)
    IF v_tree.generation_anchor_person_id IS NOT NULL THEN
        SELECT id INTO v_root_person_id
        FROM public.persons
        WHERE id = v_tree.generation_anchor_person_id
          AND tree_id = v_tree.id
          AND deleted_at IS NULL
          AND COALESCE(public_visibility, 'INHERIT_TREE') <> 'PRIVATE';
    END IF;

    IF v_root_person_id IS NULL THEN
        SELECT p.id INTO v_root_person_id
        FROM public.persons p
        WHERE p.tree_id = v_tree.id
          AND p.deleted_at IS NULL
          AND COALESCE(p.public_visibility, 'INHERIT_TREE') <> 'PRIVATE'
          AND NOT EXISTS (
              SELECT 1 FROM public.parent_child_relationships r
              WHERE r.child_id = p.id
                AND r.tree_id = v_tree.id
                AND r.deleted_at IS NULL
          )
        ORDER BY 
          CASE WHEN p.gender = 'male' THEN 0 ELSE 1 END,
          p.birth_year ASC NULLS LAST,
          p.created_at ASC
        LIMIT 1;
    END IF;

    IF v_root_person_id IS NULL THEN
        SELECT id INTO v_root_person_id
        FROM public.persons
        WHERE tree_id = v_tree.id
          AND deleted_at IS NULL
          AND COALESCE(public_visibility, 'INHERIT_TREE') <> 'PRIVATE'
        ORDER BY created_at ASC
        LIMIT 1;
    END IF;

    RETURN jsonb_build_object(
        'id', v_tree.id,
        'slug', v_tree.public_slug,
        'name', v_tree.name,
        'description', v_tree.description,
        'rootPersonId', v_root_person_id,
        'generationAnchorPersonId', v_tree.generation_anchor_person_id,
        'publicationVersion', v_tree.publication_version,
        'privacyProjectionVersion', v_tree.privacy_projection_version,
        'searchEngineVisibility', v_tree.search_engine_visibility,
        'livingPersonPolicy', v_tree.living_person_policy,
        'publishedAt', v_tree.published_at,
        'publicUpdatedAt', v_tree.public_updated_at
    );
END;
$$;

-- 4.2. Public Tree Graph Slice (PATERNAL_LINE, CUT_BRANCH, Living Redaction)
CREATE OR REPLACE FUNCTION public.get_public_tree_graph_slice(
    p_slug TEXT,
    p_center_person_id UUID DEFAULT NULL,
    p_ancestor_depth INTEGER DEFAULT 15,
    p_descendant_depth INTEGER DEFAULT 15,
    p_include_spouses BOOLEAN DEFAULT true,
    p_include_unverified BOOLEAN DEFAULT true,
    p_descendant_traversal_mode TEXT DEFAULT 'PATERNAL_LINE',
    p_branch_boundary_person_id UUID DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_clean_slug TEXT;
    v_tree RECORD;
    v_center_id UUID;
    v_max_ancestor_depth CONSTANT INTEGER := 25;
    v_max_descendant_depth CONSTANT INTEGER := 25;
    v_max_persons_budget CONSTANT INTEGER := 500;
    v_applied_ancestor_depth INTEGER;
    v_applied_descendant_depth INTEGER;
    v_traversal_mode TEXT;
    
    v_ancestor_person_ids UUID[] := ARRAY[]::UUID[];
    v_descendant_person_ids UUID[] := ARRAY[]::UUID[];
    v_spouse_person_ids UUID[] := ARRAY[]::UUID[];
    v_slice_person_ids UUID[];
    v_union_ids UUID[] := ARRAY[]::UUID[];
    
    v_persons_json jsonb;
    v_relationships_json jsonb;
    v_unions_json jsonb;
    v_union_members_json jsonb;
    v_expansion_json jsonb := '{}'::jsonb;
    v_hidden_reasons_json jsonb := '{}'::jsonb;
    v_person_count INTEGER := 0;
BEGIN
    v_clean_slug := LOWER(TRIM(p_slug));
    IF v_clean_slug IS NULL THEN
        RAISE EXCEPTION 'PUBLIC_TREE_NOT_AVAILABLE' USING ERRCODE = 'P0002';
    END IF;

    -- 1. Validate Tree
    SELECT id, name, description, privacy_level, publication_version, privacy_projection_version,
           generation_anchor_person_id, living_person_policy
    INTO v_tree
    FROM public.family_trees
    WHERE public_slug = v_clean_slug
      AND privacy_level = 'public'::tree_privacy_level
      AND status = 'active'::tree_status
      AND deleted_at IS NULL;

    IF v_tree.id IS NULL THEN
        RAISE EXCEPTION 'PUBLIC_TREE_NOT_AVAILABLE' USING ERRCODE = 'P0002';
    END IF;

    -- 2. Resolve Center Person ID (prioritize generation_anchor or highest root ancestor)
    v_center_id := p_center_person_id;
    IF v_center_id IS NULL THEN
        IF v_tree.generation_anchor_person_id IS NOT NULL THEN
            v_center_id := v_tree.generation_anchor_person_id;
        ELSE
            SELECT p.id INTO v_center_id
            FROM public.persons p
            WHERE p.tree_id = v_tree.id
              AND p.deleted_at IS NULL
              AND COALESCE(p.public_visibility, 'INHERIT_TREE') <> 'PRIVATE'
              AND NOT EXISTS (
                  SELECT 1 FROM public.parent_child_relationships r
                  WHERE r.child_id = p.id
                    AND r.tree_id = v_tree.id
                    AND r.deleted_at IS NULL
              )
            ORDER BY 
              CASE WHEN p.gender = 'male' THEN 0 ELSE 1 END,
              p.birth_year ASC NULLS LAST,
              p.created_at ASC
            LIMIT 1;
        END IF;
    END IF;

    IF v_center_id IS NULL THEN
        SELECT id INTO v_center_id
        FROM public.persons
        WHERE tree_id = v_tree.id
          AND deleted_at IS NULL
          AND COALESCE(public_visibility, 'INHERIT_TREE') <> 'PRIVATE'
        ORDER BY created_at ASC
        LIMIT 1;
    END IF;

    IF v_center_id IS NULL THEN
        -- Empty tree representation
        RETURN jsonb_build_object(
            'schemaVersion', 1,
            'tree', jsonb_build_object(
                'id', v_tree.id,
                'slug', v_clean_slug,
                'name', v_tree.name,
                'publicationVersion', v_tree.publication_version,
                'privacyProjectionVersion', v_tree.privacy_projection_version
            ),
            'centerPersonId', NULL,
            'persons', '[]'::jsonb,
            'parentChildRelationships', '[]'::jsonb,
            'unions', '[]'::jsonb,
            'unionMembers', '[]'::jsonb,
            'expansion', '{}'::jsonb,
            'hiddenReasons', '{}'::jsonb,
            'limits', jsonb_build_object('returnedPersonCount', 0, 'truncated', false)
        );
    END IF;

    -- Verify center belongs to tree and is not private
    IF NOT EXISTS (
        SELECT 1 FROM public.persons
        WHERE id = v_center_id
          AND tree_id = v_tree.id
          AND deleted_at IS NULL
          AND public_visibility <> 'PRIVATE'
    ) THEN
        RAISE EXCEPTION 'PUBLIC_GRAPH_CENTER_INVALID' USING ERRCODE = '22023';
    END IF;

    -- 3. Traversal mode & Depth bounds
    v_traversal_mode := COALESCE(NULLIF(TRIM(p_descendant_traversal_mode), ''), 'PATERNAL_LINE');
    v_applied_ancestor_depth := LEAST(GREATEST(p_ancestor_depth, 0), v_max_ancestor_depth);
    v_applied_descendant_depth := LEAST(GREATEST(p_descendant_depth, 0), v_max_descendant_depth);

    -- 4. CTE 1: Ancestors Traversal (Stop at PRIVATE persons via CUT_BRANCH)
    WITH RECURSIVE ancestor_cte AS (
        SELECT 
            v_center_id AS person_id,
            0 AS depth,
            ARRAY[v_center_id] AS visited_path
        
        UNION ALL
        
        SELECT 
            r.parent_id AS person_id,
            a.depth + 1 AS depth,
            a.visited_path || r.parent_id
        FROM ancestor_cte a
        JOIN public.parent_child_relationships r 
            ON r.child_id = a.person_id 
            AND r.tree_id = v_tree.id 
            AND r.deleted_at IS NULL
            AND (p_include_unverified OR r.verification_status = 'verified')
        JOIN public.persons p 
            ON p.id = r.parent_id 
            AND p.tree_id = v_tree.id 
            AND p.deleted_at IS NULL
            AND p.public_visibility <> 'PRIVATE' -- CUT_BRANCH for private ancestor
        WHERE a.depth < v_applied_ancestor_depth
          AND NOT (r.parent_id = ANY(a.visited_path))
    )
    SELECT COALESCE(ARRAY_AGG(DISTINCT person_id), ARRAY[]::UUID[]) INTO v_ancestor_person_ids
    FROM ancestor_cte;

    -- 5. CTE 2: Descendants Traversal (PATERNAL_LINE, CUT_BRANCH for private nodes)
    WITH RECURSIVE descendant_cte AS (
        SELECT 
            v_center_id AS person_id,
            0 AS depth,
            ARRAY[v_center_id] AS visited_path,
            (SELECT gender FROM public.persons WHERE id = v_center_id) AS gender,
            true AS is_center_or_paternal
        
        UNION ALL
        
        SELECT 
            r.child_id AS person_id,
            d.depth + 1 AS depth,
            d.visited_path || r.child_id,
            child_p.gender,
            CASE 
                WHEN v_traversal_mode = 'ALL_DESCENDANTS' THEN true
                WHEN child_p.gender = 'male' THEN true
                WHEN child_p.gender = 'female' THEN true
                ELSE true -- Unknown continuation
            END AS is_center_or_paternal
        FROM descendant_cte d
        JOIN public.parent_child_relationships r 
            ON r.parent_id = d.person_id 
            AND r.tree_id = v_tree.id 
            AND r.deleted_at IS NULL
            AND (p_include_unverified OR r.verification_status = 'verified')
        JOIN public.persons child_p 
            ON child_p.id = r.child_id 
            AND child_p.tree_id = v_tree.id 
            AND child_p.deleted_at IS NULL
            AND child_p.public_visibility <> 'PRIVATE' -- CUT_BRANCH for private descendant
        WHERE d.depth < v_applied_descendant_depth
          AND NOT (r.child_id = ANY(d.visited_path))
          -- PATERNAL_LINE Rule: only expand descendants if parent is male OR parent is center person
          AND (
              v_traversal_mode = 'ALL_DESCENDANTS'
              OR d.person_id = v_center_id
              OR d.gender = 'male'
              OR d.gender = 'unknown'
          )
    )
    SELECT COALESCE(ARRAY_AGG(DISTINCT person_id), ARRAY[]::UUID[]) INTO v_descendant_person_ids
    FROM descendant_cte;

    -- Combine slice IDs
    v_slice_person_ids := ARRAY(
        SELECT DISTINCT unnest(v_ancestor_person_ids || v_descendant_person_ids)
    );

    -- 6. Include Spouses if enabled
    IF p_include_spouses AND array_length(v_slice_person_ids, 1) > 0 THEN
        SELECT COALESCE(ARRAY_AGG(DISTINCT um2.person_id), ARRAY[]::UUID[]) INTO v_spouse_person_ids
        FROM public.unions u
        JOIN public.union_members um1 ON um1.union_id = u.id AND um1.tree_id = v_tree.id AND um1.deleted_at IS NULL
        JOIN public.union_members um2 ON um2.union_id = u.id AND um2.tree_id = v_tree.id AND um2.deleted_at IS NULL AND um2.person_id <> um1.person_id
        JOIN public.persons sp ON sp.id = um2.person_id AND sp.tree_id = v_tree.id AND sp.deleted_at IS NULL AND sp.public_visibility <> 'PRIVATE'
        WHERE u.tree_id = v_tree.id
          AND u.deleted_at IS NULL
          AND um1.person_id = ANY(v_slice_person_ids);

        v_slice_person_ids := ARRAY(
            SELECT DISTINCT unnest(v_slice_person_ids || v_spouse_person_ids)
        );
    END IF;

    -- Apply slice size limit
    v_person_count := COALESCE(array_length(v_slice_person_ids, 1), 0);

    -- 7. Query Redacted Persons
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', p.id,
            'displayName', CASE 
                WHEN p.living_status = 'living' OR p.living_status = 'unknown' THEN
                    CASE 
                        WHEN v_tree.living_person_policy = 'STRICT' THEN 'Thành viên gia đình'
                        ELSE COALESCE(p.full_name, 'Hậu duệ')
                    END
                ELSE p.full_name
            END,
            'gender', p.gender,
            'livingState', UPPER(p.living_status::TEXT),
            'birthYear', CASE 
                WHEN p.living_status = 'living' AND v_tree.living_person_policy = 'STRICT' THEN NULL
                ELSE p.birth_year
            END,
            'deathYear', CASE 
                WHEN p.living_status = 'deceased' THEN p.death_year
                ELSE NULL
            END,
            'isEstimated', CASE 
                WHEN p.living_status = 'deceased' THEN COALESCE(p.birth_is_estimated OR p.death_is_estimated, false)
                ELSE false
            END,
            'isCenter', (p.id = v_center_id),
            'visibility', CASE 
                WHEN p.living_status = 'living' OR p.living_status = 'unknown' THEN 'PUBLIC_REDACTED'
                ELSE 'PUBLIC'
            END
        )
    ), '[]'::jsonb) INTO v_persons_json
    FROM public.persons p
    WHERE p.id = ANY(v_slice_person_ids);

    -- 8. Query Parent-Child Relationships within slice
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', r.id,
            'parentId', r.parent_id,
            'childId', r.child_id,
            'parentRole', r.parent_role,
            'relationshipKind', r.relationship_kind,
            'verificationStatus', r.verification_status
        )
    ), '[]'::jsonb) INTO v_relationships_json
    FROM public.parent_child_relationships r
    WHERE r.tree_id = v_tree.id
      AND r.deleted_at IS NULL
      AND r.parent_id = ANY(v_slice_person_ids)
      AND r.child_id = ANY(v_slice_person_ids);

    -- 9. Query Unions & Members within slice
    SELECT COALESCE(ARRAY_AGG(DISTINCT u.id), ARRAY[]::UUID[]) INTO v_union_ids
    FROM public.unions u
    JOIN public.union_members um ON um.union_id = u.id AND um.tree_id = v_tree.id AND um.deleted_at IS NULL
    WHERE u.tree_id = v_tree.id
      AND u.deleted_at IS NULL
      AND um.person_id = ANY(v_slice_person_ids);

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', u.id,
            'status', u.status,
            'verificationStatus', u.verification_status
        )
    ), '[]'::jsonb) INTO v_unions_json
    FROM public.unions u
    WHERE u.id = ANY(v_union_ids);

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'unionId', um.union_id,
            'personId', um.person_id,
            'memberRole', um.member_role
        )
    ), '[]'::jsonb) INTO v_union_members_json
    FROM public.union_members um
    WHERE um.union_id = ANY(v_union_ids)
      AND um.deleted_at IS NULL
      AND um.person_id = ANY(v_slice_person_ids);

    -- 10. Build expansion & hidden reason metadata for slice boundary nodes
    SELECT jsonb_object_agg(
        p.id::text,
        jsonb_build_object(
            'hasMoreAncestors', EXISTS (
                SELECT 1 FROM public.parent_child_relationships r2
                JOIN public.persons anc ON anc.id = r2.parent_id AND anc.tree_id = v_tree.id AND anc.deleted_at IS NULL
                WHERE r2.child_id = p.id AND r2.tree_id = v_tree.id AND r2.deleted_at IS NULL
                  AND anc.public_visibility <> 'PRIVATE'
                  AND NOT (r2.parent_id = ANY(v_slice_person_ids))
            ),
            'hasMoreDescendants', EXISTS (
                SELECT 1 FROM public.parent_child_relationships r3
                JOIN public.persons desc_p ON desc_p.id = r3.child_id AND desc_p.tree_id = v_tree.id AND desc_p.deleted_at IS NULL
                WHERE r3.parent_id = p.id AND r3.tree_id = v_tree.id AND r3.deleted_at IS NULL
                  AND desc_p.public_visibility <> 'PRIVATE'
                  AND NOT (r3.child_id = ANY(v_slice_person_ids))
            ),
            'hiddenReason', CASE 
                WHEN EXISTS (
                    SELECT 1 FROM public.parent_child_relationships r_priv
                    JOIN public.persons priv_p ON priv_p.id = r_priv.child_id
                    WHERE r_priv.parent_id = p.id AND priv_p.public_visibility = 'PRIVATE' AND priv_p.deleted_at IS NULL
                ) THEN 'PRIVACY'
                WHEN p.gender = 'female' AND p.id <> v_center_id AND v_traversal_mode = 'PATERNAL_LINE' AND EXISTS (
                    SELECT 1 FROM public.parent_child_relationships r_fem
                    WHERE r_fem.parent_id = p.id AND r_fem.deleted_at IS NULL
                ) THEN 'PATERNAL_LINE'
                ELSE NULL
            END
        )
    ) INTO v_expansion_json
    FROM public.persons p
    WHERE p.id = ANY(v_slice_person_ids);

    RETURN jsonb_build_object(
        'schemaVersion', 1,
        'tree', jsonb_build_object(
            'id', v_tree.id,
            'slug', v_clean_slug,
            'name', v_tree.name,
            'publicationVersion', v_tree.publication_version,
            'privacyProjectionVersion', v_tree.privacy_projection_version
        ),
        'centerPersonId', v_center_id,
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
            'returnedPersonCount', v_person_count,
            'traversalMode', v_traversal_mode,
            'truncated', (v_person_count >= v_max_persons_budget)
        )
    );
END;
$$;

-- 4.3. Public Person Profile
CREATE OR REPLACE FUNCTION public.get_public_person_profile(
    p_slug TEXT,
    p_person_id UUID
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_clean_slug TEXT;
    v_tree RECORD;
    v_person RECORD;
    v_father RECORD;
    v_mother RECORD;
    v_spouses jsonb;
    v_children jsonb;
BEGIN
    v_clean_slug := LOWER(TRIM(p_slug));
    IF v_clean_slug IS NULL THEN
        RETURN NULL;
    END IF;

    -- Verify public tree
    SELECT id, name, public_slug, living_person_policy, publication_version
    INTO v_tree
    FROM public.family_trees
    WHERE public_slug = v_clean_slug
      AND privacy_level = 'public'::tree_privacy_level
      AND status = 'active'::tree_status
      AND deleted_at IS NULL;

    IF v_tree.id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Query Person
    SELECT id, tree_id, full_name, gender, living_status,
           birth_year, birth_is_estimated,
           death_year, death_is_estimated, public_visibility, verification_status
    INTO v_person
    FROM public.persons
    WHERE id = p_person_id
      AND tree_id = v_tree.id
      AND deleted_at IS NULL
      AND public_visibility <> 'PRIVATE';

    IF v_person.id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Query Father (if public)
    SELECT p.id, p.full_name, p.living_status, p.birth_year, p.death_year INTO v_father
    FROM public.parent_child_relationships r
    JOIN public.persons p ON p.id = r.parent_id AND p.deleted_at IS NULL AND p.public_visibility <> 'PRIVATE'
    WHERE r.child_id = v_person.id
      AND r.tree_id = v_tree.id
      AND r.deleted_at IS NULL
      AND r.parent_role = 'father'
    LIMIT 1;

    -- Query Mother (if public)
    SELECT p.id, p.full_name, p.living_status, p.birth_year, p.death_year INTO v_mother
    FROM public.parent_child_relationships r
    JOIN public.persons p ON p.id = r.parent_id AND p.deleted_at IS NULL AND p.public_visibility <> 'PRIVATE'
    WHERE r.child_id = v_person.id
      AND r.tree_id = v_tree.id
      AND r.deleted_at IS NULL
      AND r.parent_role = 'mother'
    LIMIT 1;

    -- Query Spouses (if public)
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', sp.id,
            'displayName', CASE 
                WHEN sp.living_status = 'living' AND v_tree.living_person_policy = 'STRICT' THEN 'Bạn đời'
                ELSE sp.full_name
            END,
            'gender', sp.gender,
            'livingState', UPPER(sp.living_status::TEXT)
        )
    ), '[]'::jsonb) INTO v_spouses
    FROM public.unions u
    JOIN public.union_members um1 ON um1.union_id = u.id AND um1.tree_id = v_tree.id AND um1.deleted_at IS NULL AND um1.person_id = v_person.id
    JOIN public.union_members um2 ON um2.union_id = u.id AND um2.tree_id = v_tree.id AND um2.deleted_at IS NULL AND um2.person_id <> v_person.id
    JOIN public.persons sp ON sp.id = um2.person_id AND sp.tree_id = v_tree.id AND sp.deleted_at IS NULL AND COALESCE(sp.public_visibility, 'INHERIT_TREE') <> 'PRIVATE'
    WHERE u.tree_id = v_tree.id AND u.deleted_at IS NULL;

    -- Query Children (if public)
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', ch.id,
            'displayName', CASE 
                WHEN ch.living_status = 'living' AND v_tree.living_person_policy = 'STRICT' THEN 'Con'
                ELSE ch.full_name
            END,
            'gender', ch.gender,
            'livingState', UPPER(ch.living_status::TEXT),
            'birthYear', CASE WHEN ch.living_status = 'deceased' THEN ch.birth_year ELSE NULL END
        )
    ), '[]'::jsonb) INTO v_children
    FROM public.parent_child_relationships r
    JOIN public.persons ch ON ch.id = r.child_id AND ch.tree_id = v_tree.id AND ch.deleted_at IS NULL AND COALESCE(ch.public_visibility, 'INHERIT_TREE') <> 'PRIVATE'
    WHERE r.parent_id = v_person.id AND r.tree_id = v_tree.id AND r.deleted_at IS NULL;

    RETURN jsonb_build_object(
        'id', v_person.id,
        'treeSlug', v_clean_slug,
        'treeName', v_tree.name,
        'displayName', CASE 
            WHEN v_person.living_status = 'living' OR v_person.living_status = 'unknown' THEN
                CASE 
                    WHEN v_tree.living_person_policy = 'STRICT' THEN 'Thành viên gia đình'
                    ELSE COALESCE(v_person.full_name, 'Hậu duệ')
                END
            ELSE v_person.full_name
        END,
        'gender', v_person.gender,
        'livingState', UPPER(v_person.living_status::TEXT),
        'birthYear', CASE 
            WHEN v_person.living_status = 'living' AND v_tree.living_person_policy = 'STRICT' THEN NULL
            ELSE v_person.birth_year
        END,
        'deathYear', CASE WHEN v_person.living_status = 'deceased' THEN v_person.death_year ELSE NULL END,
        'isEstimated', CASE WHEN v_person.living_status = 'deceased' THEN COALESCE(v_person.birth_is_estimated OR v_person.death_is_estimated, false) ELSE false END,
        'father', CASE WHEN v_father.id IS NOT NULL THEN jsonb_build_object('id', v_father.id, 'displayName', v_father.full_name) ELSE NULL END,
        'mother', CASE WHEN v_mother.id IS NOT NULL THEN jsonb_build_object('id', v_mother.id, 'displayName', v_mother.full_name) ELSE NULL END,
        'spouses', v_spouses,
        'children', v_children,
        'visibility', CASE WHEN v_person.living_status = 'living' OR v_person.living_status = 'unknown' THEN 'PUBLIC_REDACTED' ELSE 'PUBLIC' END
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. GRANT and RLS Hardening (Least-Privilege Baseline)
-- ------------------------------------------------------------------------------

-- Ensure anon has NO direct access to tables
REVOKE ALL ON TABLE public.family_trees FROM anon;
REVOKE ALL ON TABLE public.persons FROM anon;
REVOKE ALL ON TABLE public.parent_child_relationships FROM anon;
REVOKE ALL ON TABLE public.unions FROM anon;
REVOKE ALL ON TABLE public.union_members FROM anon;
REVOKE ALL ON TABLE public.tree_memberships FROM anon;
REVOKE ALL ON TABLE public.profiles FROM anon;

-- Grant EXECUTE ONLY on dedicated public read functions
GRANT EXECUTE ON FUNCTION public.get_public_tree_summary(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_tree_graph_slice(TEXT, UUID, INTEGER, INTEGER, BOOLEAN, BOOLEAN, TEXT, UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_person_profile(TEXT, UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.list_public_trees(INTEGER, INTEGER) TO anon, authenticated, service_role;

-- Grant EXECUTE on Owner publication functions ONLY to authenticated
GRANT EXECUTE ON FUNCTION public.publish_family_tree(UUID, TEXT, TEXT, TEXT, INTEGER) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.publish_family_tree(UUID, TEXT, TEXT, TEXT, INTEGER) FROM anon;

GRANT EXECUTE ON FUNCTION public.unpublish_family_tree(UUID, INTEGER) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.unpublish_family_tree(UUID, INTEGER) FROM anon;

-- 4.4. List Public Trees (Discovery on Landing Page)
CREATE OR REPLACE FUNCTION public.list_public_trees(
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_result jsonb;
BEGIN
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', t.id,
            'name', t.name,
            'description', t.description,
            'slug', t.public_slug,
            'publishedAt', t.published_at,
            'livingPersonPolicy', t.living_person_policy,
            'searchEngineVisibility', t.search_engine_visibility,
            'personCount', (
                SELECT COUNT(*) 
                FROM public.persons p 
                WHERE p.tree_id = t.id 
                  AND p.deleted_at IS NULL 
                  AND COALESCE(p.public_visibility, 'INHERIT_TREE') <> 'PRIVATE'
            )
        ) ORDER BY t.published_at DESC NULLS LAST, t.created_at DESC
    ), '[]'::jsonb) INTO v_result
    FROM public.family_trees t
    WHERE t.privacy_level = 'public'::tree_privacy_level
      AND t.status = 'active'::tree_status
      AND t.deleted_at IS NULL
      AND t.public_slug IS NOT NULL
    LIMIT LEAST(GREATEST(p_limit, 1), 50)
    OFFSET GREATEST(p_offset, 0);

    RETURN v_result;
END;
$$;
