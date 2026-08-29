-- ==============================================================================
-- Test Suite: 01400_persons_rls.test.sql
-- Phase: P08 (Persons RLS Policies & Immutable Column Enforcement)
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

INSERT INTO public.persons (id, tree_id, full_name)
VALUES
    ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Alpha Person 1'),
    ('p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Beta Person 1');

-- 1. Alice (Owner of Alpha) creates Person in Alpha Tree
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Test 1: Owner creates person in own tree
SELECT lives_ok(
    $$ INSERT INTO public.persons (tree_id, full_name)
       VALUES ('11111111-1111-1111-1111-111111111111', 'Alpha Person 2') $$,
    'Owner Alice must be able to insert Person into Alpha Tree'
);

-- Test 2: Owner reads person in own tree
SELECT is(
    (SELECT count(*)::integer FROM public.persons WHERE tree_id = '11111111-1111-1111-1111-111111111111'),
    2,
    'Owner Alice must be able to read 2 persons in Alpha Tree'
);

-- Test 3: Owner cannot create person in Beta tree
SELECT throws_ok(
    $$ INSERT INTO public.persons (tree_id, full_name)
       VALUES ('22222222-2222-2222-2222-222222222222', 'Beta Illegal Person') $$,
    '42501',
    NULL,
    'Owner Alice must NOT be able to insert Person into Beta Tree (42501)'
);

-- Test 4: Viewer (Victor) can read persons in Alpha Tree
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv';

SELECT is(
    (SELECT count(*)::integer FROM public.persons WHERE tree_id = '11111111-1111-1111-1111-111111111111'),
    2,
    'Viewer Victor must be able to read persons in Alpha Tree'
);

-- Test 5: Viewer cannot create Person
SELECT throws_ok(
    $$ INSERT INTO public.persons (tree_id, full_name)
       VALUES ('11111111-1111-1111-1111-111111111111', 'Viewer Illegal Person') $$,
    '42501',
    NULL,
    'Viewer Victor must NOT be able to insert Person into Alpha Tree (42501)'
);

-- Test 6: Viewer cannot update Person
UPDATE public.persons
SET full_name = 'Alpha Person Hacked'
WHERE id = 'p1111111-1111-1111-1111-111111111111';

RESET ROLE;
SELECT is(
    (SELECT full_name FROM public.persons WHERE id = 'p1111111-1111-1111-1111-111111111111'),
    'Alpha Person 1',
    'Person full_name must remain unchanged after Viewer attempted update'
);

-- Test 7: Cannot mutate tree_id on persons (P08-T16)
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT throws_ok(
    $$ UPDATE public.persons SET tree_id = '22222222-2222-2222-2222-222222222222' WHERE id = 'p1111111-1111-1111-1111-111111111111' $$,
    '42501',
    NULL,
    'Mutating tree_id on persons must be blocked by immutable trigger (42501)'
);

-- Test 8: Owner soft-deletes Person
UPDATE public.persons
SET deleted_at = timezone('utc', now()),
    deleted_by = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
WHERE id = 'p1111111-1111-1111-1111-111111111111';

SELECT is(
    (SELECT count(*)::integer FROM public.persons WHERE id = 'p1111111-1111-1111-1111-111111111111'),
    0,
    'Soft-deleted Person must not appear in normal SELECT query'
);

SELECT * FROM finish();
ROLLBACK;
