-- ==============================================================================
-- Test Suite: 01700_cross_tree_rls.test.sql
-- Phase: P08 (Comprehensive Cross-Tree Isolation Tests)
-- ==============================================================================

BEGIN;
SELECT plan(8);

-- Setup 2 distinct family trees
INSERT INTO public.family_trees (id, name, created_by)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tree Alpha', '11111111-1111-1111-1111-111111111111'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tree Beta',  '22222222-2222-2222-2222-222222222222');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner', 'active'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'owner', 'active');

INSERT INTO public.persons (id, tree_id, full_name)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alpha Person'),
    ('b1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Beta Person');

-- 1. Alice (Owner of Alpha) Session
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';

-- Test 1: Alice cannot SELECT Beta Tree by ID
SELECT is(
    (SELECT count(*)::integer FROM public.family_trees WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    0,
    'Owner Alice querying Beta Tree by exact UUID must return 0 rows'
);

-- Test 2: Alice cannot SELECT Beta Person by ID
SELECT is(
    (SELECT count(*)::integer FROM public.persons WHERE id = 'b1111111-1111-1111-1111-111111111111'),
    0,
    'Owner Alice querying Beta Person by exact UUID must return 0 rows'
);

-- Test 3: Alice cannot UPDATE Beta Person
UPDATE public.persons
SET full_name = 'Beta Person Infiltrated'
WHERE id = 'b1111111-1111-1111-1111-111111111111';

RESET ROLE;
SELECT is(
    (SELECT full_name FROM public.persons WHERE id = 'b1111111-1111-1111-1111-111111111111'),
    'Beta Person',
    'Beta Person name must remain unchanged after Alice attempted update'
);

-- Test 4: Alice cannot create Relationship linking Alpha Person and Beta Person
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';

SELECT throws_ok(
    $$ INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id
    ) VALUES (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'a1111111-1111-1111-1111-111111111111',
        'b1111111-1111-1111-1111-111111111111'
    ) $$,
    '23503',
    NULL,
    'Cross-tree relationship insertion must fail at composite foreign key check (23503)'
);

-- Test 5: Alice (even if given owner in both trees) cannot mutate tree_id to move a person
-- Let us simulate a user Charlie who is Owner in both Tree Alpha and Tree Beta
RESET ROLE;
INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'owner', 'active'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'owner', 'active');

SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '33333333-3333-3333-3333-333333333333';

SELECT throws_ok(
    $$ UPDATE public.persons SET tree_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' WHERE id = 'a1111111-1111-1111-1111-111111111111' $$,
    '42501',
    NULL,
    'User who is owner of both trees still cannot mutate tree_id across trees (42501)'
);

-- Test 6: Count does not leak cross-tree records
SELECT is(
    (SELECT count(*)::integer FROM public.persons),
    2,
    'User Charlie (owner of both) sees 2 persons total across both trees'
);

-- Test 7: Single-tree owner sees only 1 person
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';

SELECT is(
    (SELECT count(*)::integer FROM public.persons),
    1,
    'Alice sees exactly 1 person (belonging to Tree Alpha)'
);

-- Test 8: Anonymous user sees 0 records
SET LOCAL ROLE anon;
RESET "request.jwt.claim.sub";

SELECT is(
    (SELECT count(*)::integer FROM public.persons),
    0,
    'Anonymous user sees 0 persons'
);

SELECT * FROM finish();
ROLLBACK;
