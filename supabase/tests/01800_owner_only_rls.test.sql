-- ==============================================================================
-- Test Suite: 01800_owner_only_rls.test.sql
-- Phase: P08 (Owner-Only Operations Verification)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Setup test fixtures
INSERT INTO public.family_trees (id, name, created_by)
VALUES ('11111111-1111-1111-1111-111111111111', 'Owner Scope Tree', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

INSERT INTO public.tree_memberships (id, tree_id, user_id, role, status)
VALUES
    ('m1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner', 'active'),
    ('m2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'editor', 'active'),
    ('m3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'viewer', 'active');

-- Test 1: Editor cannot soft-delete family tree (Owner-only)
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

UPDATE public.family_trees
SET deleted_at = timezone('utc', now()),
    deleted_by = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
WHERE id = '11111111-1111-1111-1111-111111111111';

RESET ROLE;
SELECT is(
    (SELECT deleted_at FROM public.family_trees WHERE id = '11111111-1111-1111-1111-111111111111'),
    NULL,
    'Family tree must NOT be soft deleted by Editor'
);

-- Test 2: Editor cannot manage memberships (Owner-only)
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

SELECT throws_ok(
    $$ INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
       VALUES ('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'viewer', 'active') $$,
    '42501',
    NULL,
    'Editor cannot insert memberships in Tree (42501)'
);

-- Test 3: Viewer cannot manage memberships (Owner-only)
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv';

SELECT throws_ok(
    $$ DELETE FROM public.tree_memberships WHERE id = 'm2222222-2222-2222-2222-222222222222' $$,
    '42501',
    NULL,
    'Viewer cannot delete memberships in Tree (42501)'
);

-- Test 4: Owner can delete membership of Editor
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM public.tree_memberships WHERE id = 'm2222222-2222-2222-2222-222222222222';

RESET ROLE;
SELECT is(
    (SELECT count(*)::integer FROM public.tree_memberships WHERE id = 'm2222222-2222-2222-2222-222222222222'),
    0,
    'Owner Alice must be able to delete Editor membership'
);

-- Test 5: Owner can soft-delete Family Tree
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

UPDATE public.family_trees
SET deleted_at = timezone('utc', now()),
    deleted_by = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
WHERE id = '11111111-1111-1111-1111-111111111111';

RESET ROLE;
SELECT isnt(
    (SELECT deleted_at FROM public.family_trees WHERE id = '11111111-1111-1111-1111-111111111111'),
    NULL,
    'Owner Alice must be able to soft-delete Family Tree'
);

-- Test 6: Verify active row predicates
SELECT is(
    (SELECT count(*)::integer FROM public.family_trees WHERE deleted_at IS NULL AND id = '11111111-1111-1111-1111-111111111111'),
    0,
    'Active-row predicate excludes soft-deleted family tree'
);

SELECT * FROM finish();
ROLLBACK;
