-- ==============================================================================
-- Test Suite: 00300_referential_actions.test.sql
-- Phase: P07 (Referential Actions & Same-Tree Isolation Tests)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Setup 2 distinct family trees
INSERT INTO public.family_trees (id, name) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tree Alpha');
INSERT INTO public.family_trees (id, name) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tree Beta');

-- Setup Persons in Tree Alpha
INSERT INTO public.persons (id, tree_id, full_name)
VALUES ('a1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alpha Father');

INSERT INTO public.persons (id, tree_id, full_name)
VALUES ('a2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alpha Child');

-- Setup Person in Tree Beta
INSERT INTO public.persons (id, tree_id, full_name)
VALUES ('b1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Beta Stranger');

-- Test 1: Same-Tree Parent-Child Succeeded
SELECT lives_ok(
    $$ INSERT INTO public.parent_child_relationships (
        tree_id, parent_id, child_id, parent_role, relationship_kind
    ) VALUES (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'a1111111-1111-1111-1111-111111111111',
        'a2222222-2222-2222-2222-222222222222',
        'father',
        'biological'
    ) $$,
    'Same-tree parent-child relationship creation must succeed'
);

-- Test 2: Cross-Tree Parent-Child Rejected by Composite FK
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
    'Cross-tree parent-child relationship (child in Tree Beta, relation in Tree Alpha) must be rejected by foreign key'
);

-- Test 3: Hard-Delete Person with active relationship is RESTRICTed
SELECT throws_ok(
    $$ DELETE FROM public.persons WHERE id = 'a1111111-1111-1111-1111-111111111111' $$,
    '23503',
    NULL,
    'Hard deleting a person with active parent_child_relationships must be RESTRICTed'
);

-- Test 4: Union & Union Members Same-Tree Validation
INSERT INTO public.unions (id, tree_id)
VALUES ('u1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

SELECT lives_ok(
    $$ INSERT INTO public.union_members (tree_id, union_id, person_id)
       VALUES (
           'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
           'u1111111-1111-1111-1111-111111111111',
           'a1111111-1111-1111-1111-111111111111'
       ) $$,
    'Binding person in same tree to union must succeed'
);

-- Test 5: Cross-Tree Union Member Rejected
SELECT throws_ok(
    $$ INSERT INTO public.union_members (tree_id, union_id, person_id)
       VALUES (
           'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
           'u1111111-1111-1111-1111-111111111111',
           'b1111111-1111-1111-1111-111111111111'
       ) $$,
    '23503',
    NULL,
    'Binding person from Tree Beta to Union in Tree Alpha must be rejected by foreign key'
);

-- Test 6: Generation Anchor SET NULL on Anchor Hard Delete
INSERT INTO public.persons (id, tree_id, full_name)
VALUES ('a3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Anchor Candidate');

UPDATE public.family_trees
SET generation_anchor_person_id = 'a3333333-3333-3333-3333-333333333333'
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

DELETE FROM public.persons WHERE id = 'a3333333-3333-3333-3333-333333333333';

SELECT is(
    (SELECT generation_anchor_person_id FROM public.family_trees WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    NULL,
    'Hard deleting generation anchor person must trigger ON DELETE SET NULL on family_trees'
);

SELECT * FROM finish();
ROLLBACK;
