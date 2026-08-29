-- ==============================================================================
-- Test Suite: 01900_rls_performance.test.sql
-- Phase: P08 (RLS Performance & Index Utilization Verification)
-- ==============================================================================

BEGIN;
SELECT plan(4);

-- 1. Verify Supporting RLS Indexes
SELECT has_index(
    'public',
    'tree_memberships',
    'idx_tree_memberships_auth_lookup',
    'Index idx_tree_memberships_auth_lookup must exist for fast membership resolution'
);

SELECT has_index(
    'public',
    'tree_memberships',
    'idx_tree_memberships_tree_owner_lookup',
    'Index idx_tree_memberships_tree_owner_lookup must exist for fast owner authorization'
);

-- 2. Verify STABLE property of RLS helper functions
SELECT is(
    (SELECT provolatile FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = '_system' AND p.proname = 'is_active_tree_member'),
    's'::"char",
    '_system.is_active_tree_member must be marked STABLE (s) for query-plan optimization'
);

SELECT is(
    (SELECT provolatile FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = '_system' AND p.proname = 'is_tree_owner'),
    's'::"char",
    '_system.is_tree_owner must be marked STABLE (s) for query-plan optimization'
);

SELECT * FROM finish();
ROLLBACK;
