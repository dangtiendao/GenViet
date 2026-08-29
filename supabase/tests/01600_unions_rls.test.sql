-- ==============================================================================
-- Test Suite: 01600_unions_rls.test.sql
-- Phase: P08 (Unions and Union Members RLS Verification)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Setup test fixtures
INSERT INTO public.family_trees (id, name, created_by)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Alpha Tree', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner', 'active'),
    ('11111111-1111-1111-1111-111111111111', 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'viewer', 'active');

INSERT INTO public.persons (id, tree_id, full_name)
VALUES
    ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Alpha Spouse 1'),
    ('p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Alpha Spouse 2');

-- 1. Alice (Owner of Alpha) creates Union and Union Members
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Test 1: Owner creates Union
SELECT lives_ok(
    $$ INSERT INTO public.unions (id, tree_id)
       VALUES ('u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111') $$,
    'Owner Alice must be able to insert Union in Alpha Tree'
);

-- Test 2: Owner creates Union Members
SELECT lives_ok(
    $$ INSERT INTO public.union_members (id, tree_id, union_id, person_id)
       VALUES
           ('um111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111'),
           ('um222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222') $$,
    'Owner Alice must be able to insert Union Members in Alpha Tree'
);

-- Test 3: Viewer reads Unions and Union Members
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv';

SELECT is(
    (SELECT count(*)::integer FROM public.unions WHERE tree_id = '11111111-1111-1111-1111-111111111111'),
    1,
    'Viewer Victor must be able to read Unions in Alpha Tree'
);

SELECT is(
    (SELECT count(*)::integer FROM public.union_members WHERE tree_id = '11111111-1111-1111-1111-111111111111'),
    2,
    'Viewer Victor must be able to read Union Members in Alpha Tree'
);

-- Test 4: Viewer cannot insert Union
SELECT throws_ok(
    $$ INSERT INTO public.unions (tree_id) VALUES ('11111111-1111-1111-1111-111111111111') $$,
    '42501',
    NULL,
    'Viewer Victor must NOT be able to insert Union (42501)'
);

-- Test 5: Cannot mutate tree_id on unions
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT throws_ok(
    $$ UPDATE public.unions SET tree_id = '22222222-2222-2222-2222-222222222222' WHERE id = 'u1111111-1111-1111-1111-111111111111' $$,
    '42501',
    NULL,
    'Mutating tree_id on unions must be blocked by immutable trigger (42501)'
);

SELECT * FROM finish();
ROLLBACK;
