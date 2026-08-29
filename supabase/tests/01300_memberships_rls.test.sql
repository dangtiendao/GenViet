-- ==============================================================================
-- Test Suite: 01300_memberships_rls.test.sql
-- Phase: P08 (Tree Memberships RLS & Privilege Escalation Tests)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Setup test fixtures
INSERT INTO public.family_trees (id, name, created_by)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alpha Tree', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('22222222-2222-2222-2222-222222222222', 'Beta Tree', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

INSERT INTO public.tree_memberships (id, tree_id, user_id, role, status)
VALUES
    ('m1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner', 'active'),
    ('m2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'viewer', 'active'),
    ('m3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'owner', 'active');

-- 1. Alice (Owner of Alpha) Session
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Test 1: Owner adds new member to Alpha tree
SELECT lives_ok(
    $$ INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
       VALUES ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'editor', 'active') $$,
    'Owner Alice must be able to invite/add an editor to Alpha Tree'
);

-- Test 2: Owner cannot add member to Beta tree
SELECT throws_ok(
    $$ INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
       VALUES ('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'editor', 'active') $$,
    '42501',
    NULL,
    'Owner Alice must NOT be able to add member to Beta Tree (42501)'
);

-- Test 3: Viewer cannot add member or escalate role
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv';

SELECT throws_ok(
    $$ INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
       VALUES ('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'viewer', 'active') $$,
    '42501',
    NULL,
    'Viewer Victor must NOT be able to insert memberships'
);

-- Test 4: Viewer cannot escalate own role to owner
UPDATE public.tree_memberships
SET role = 'owner'
WHERE id = 'm2222222-2222-2222-2222-222222222222';

RESET ROLE;
SELECT is(
    (SELECT role::text FROM public.tree_memberships WHERE id = 'm2222222-2222-2222-2222-222222222222'),
    'viewer',
    'Viewer Victor role must remain viewer after attempted self-escalation'
);

-- Test 5: Cannot mutate user_id on tree_memberships (Immutable column)
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT throws_ok(
    $$ UPDATE public.tree_memberships SET user_id = '99999999-9999-9999-9999-999999999999' WHERE id = 'm1111111-1111-1111-1111-111111111111' $$,
    '42501',
    NULL,
    'Mutating user_id on tree_memberships must be blocked by immutable trigger (42501)'
);

-- Test 6: Cannot mutate tree_id on tree_memberships (Immutable column)
SELECT throws_ok(
    $$ UPDATE public.tree_memberships SET tree_id = '22222222-2222-2222-2222-222222222222' WHERE id = 'm1111111-1111-1111-1111-111111111111' $$,
    '42501',
    NULL,
    'Mutating tree_id on tree_memberships must be blocked by immutable trigger (42501)'
);

SELECT * FROM finish();
ROLLBACK;
