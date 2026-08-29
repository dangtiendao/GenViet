-- ==============================================================================
-- Test Suite: 01000_rls_helpers.test.sql
-- Phase: P08 (RLS Authorization Helper Functions Verification)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Setup test fixtures
INSERT INTO public.family_trees (id, name) VALUES ('11111111-1111-1111-1111-111111111111', 'Helper Test Tree');

-- Insert memberships for test users
INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner', 'active'),
    ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'viewer', 'active'),
    ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'editor', 'suspended');

-- Test 1: Active Member check for Owner
SELECT is(
    _system.is_active_tree_member('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    true,
    'Owner with active status must be recognized as active tree member'
);

-- Test 2: Active Member check for Viewer
SELECT is(
    _system.is_active_tree_member('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    true,
    'Viewer with active status must be recognized as active tree member'
);

-- Test 3: Suspended Member check
SELECT is(
    _system.is_active_tree_member('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
    false,
    'Suspended member must NOT be recognized as active tree member'
);

-- Test 4: Outsider check
SELECT is(
    _system.is_active_tree_member('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
    false,
    'Outsider user must NOT be recognized as active tree member'
);

-- Test 5: Owner check
SELECT is(
    _system.is_tree_owner('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    true,
    'Owner role must be recognized by is_tree_owner'
);

SELECT is(
    _system.is_tree_owner('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    false,
    'Viewer role must NOT be recognized by is_tree_owner'
);

SELECT * FROM finish();
ROLLBACK;
