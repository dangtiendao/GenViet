-- ==============================================================================
-- Test Suite: 01200_family_trees_rls.test.sql
-- Phase: P08 (Family Trees RLS Policy Verification)
-- ==============================================================================

BEGIN;
SELECT plan(8);

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

-- 1. Alice (Owner of Alpha) Session
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Test 1: Owner reads own tree
SELECT is(
    (SELECT name FROM public.family_trees WHERE id = '11111111-1111-1111-1111-111111111111'),
    'Alpha Tree',
    'Owner Alice must be able to read Alpha Tree'
);

-- Test 2: Owner cannot read Beta tree
SELECT is(
    (SELECT count(*)::integer FROM public.family_trees WHERE id = '22222222-2222-2222-2222-222222222222'),
    0,
    'Owner Alice must NOT be able to read Beta Tree'
);

-- Test 3: Owner updates Alpha tree
UPDATE public.family_trees
SET name = 'Alpha Tree Renamed'
WHERE id = '11111111-1111-1111-1111-111111111111';

SELECT is(
    (SELECT name FROM public.family_trees WHERE id = '11111111-1111-1111-1111-111111111111'),
    'Alpha Tree Renamed',
    'Owner Alice must be able to update Alpha Tree'
);

-- Test 4: Viewer (Victor) reads Alpha tree
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv';

SELECT is(
    (SELECT name FROM public.family_trees WHERE id = '11111111-1111-1111-1111-111111111111'),
    'Alpha Tree Renamed',
    'Viewer Victor must be able to read Alpha Tree'
);

-- Test 5: Viewer cannot update Alpha tree
UPDATE public.family_trees
SET name = 'Alpha Hacked by Viewer'
WHERE id = '11111111-1111-1111-1111-111111111111';

RESET ROLE;
SELECT is(
    (SELECT name FROM public.family_trees WHERE id = '11111111-1111-1111-1111-111111111111'),
    'Alpha Tree Renamed',
    'Alpha Tree name must remain unchanged after Viewer attempted update'
);

-- Test 6: Outsider cannot read any private tree
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

SELECT is(
    (SELECT count(*)::integer FROM public.family_trees),
    0,
    'Outsider must see 0 trees'
);

-- Test 7: Owner soft-deletes Alpha tree
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

UPDATE public.family_trees
SET deleted_at = timezone('utc', now()),
    deleted_by = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- After soft delete, normal query returns 0 rows
SELECT is(
    (SELECT count(*)::integer FROM public.family_trees WHERE id = '11111111-1111-1111-1111-111111111111'),
    0,
    'Soft-deleted family tree must not appear in normal SELECT'
);

-- Test 8: Direct hard DELETE is rejected (no grant / revoking delete)
SELECT throws_ok(
    $$ DELETE FROM public.family_trees WHERE id = '11111111-1111-1111-1111-111111111111' $$,
    '42501',
    NULL,
    'Direct hard DELETE on family_trees must be denied by grants (42501)'
);

SELECT * FROM finish();
ROLLBACK;
