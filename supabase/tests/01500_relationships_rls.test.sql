-- ==============================================================================
-- Test Suite: 01500_relationships_rls.test.sql
-- Phase: P08 (Parent-Child Relationships RLS Verification)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Setup test fixtures
INSERT INTO public.family_trees (id, name, created_by)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alpha Tree', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('22222222-2222-2222-2222-222222222222', 'Beta Tree', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner', 'active'),
    ('11111111-1111-1111-1111-111111111111', 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'viewer', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'owner', 'active');

INSERT INTO public.persons (id, tree_id, full_name)
VALUES
    ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Alpha Parent'),
    ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Alpha Child'),
    ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Beta Parent');

-- 1. Alice (Owner of Alpha) creates Relationship
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Test 1: Owner creates parent-child relationship in Alpha Tree
SELECT lives_ok(
    $$ INSERT INTO public.parent_child_relationships (
        id, tree_id, parent_id, child_id, parent_role, relationship_kind
    ) VALUES (
        'r1111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'a2222222-2222-2222-2222-222222222222',
        'father',
        'biological'
    ) $$,
    'Owner Alice must be able to insert parent_child_relationships in Alpha Tree'
);

-- Test 2: Viewer reads Relationship in Alpha Tree
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv';

SELECT is(
    (SELECT count(*)::integer FROM public.parent_child_relationships WHERE tree_id = '11111111-1111-1111-1111-111111111111'),
    1,
    'Viewer Victor must be able to read relationships in Alpha Tree'
);

-- Test 3: Viewer cannot insert relationship
SELECT throws_ok(
    $$ INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind
    ) VALUES (
        '11111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'a2222222-2222-2222-2222-222222222222',
        'mother',
        'biological'
    ) $$,
    '42501',
    NULL,
    'Viewer Victor must NOT be able to insert relationships (42501)'
);

-- Test 4: Cannot mutate tree_id on parent_child_relationships
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT throws_ok(
    $$ UPDATE public.parent_child_relationships SET tree_id = '22222222-2222-2222-2222-222222222222' WHERE id = 'r1111111-1111-1111-1111-111111111111' $$,
    '42501',
    NULL,
    'Mutating tree_id on parent_child_relationships must be blocked by immutable trigger (42501)'
);

-- Test 5: Owner soft deletes relationship
UPDATE public.parent_child_relationships
SET deleted_at = timezone('utc', now()),
    deleted_by = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
WHERE id = 'r1111111-1111-1111-1111-111111111111';

SELECT is(
    (SELECT count(*)::integer FROM public.parent_child_relationships WHERE id = 'r1111111-1111-1111-1111-111111111111'),
    0,
    'Soft-deleted relationship must not appear in normal query'
);

-- Test 6: Outsider cannot read relationships
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

SELECT is(
    (SELECT count(*)::integer FROM public.parent_child_relationships),
    0,
    'Outsider must see 0 relationships'
);

SELECT * FROM finish();
ROLLBACK;
