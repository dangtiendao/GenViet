BEGIN;
SELECT plan(4);

-- Setup fixtures
SELECT _test.create_test_user('u1111111-1111-4111-a111-111111111111', 'owner@example.com');

INSERT INTO public.family_trees (id, name, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'Cây Giới Hạn', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111', 'owner', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by)
VALUES ('p1111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'Nhân Vật Gốc', 'nhan vat goc', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

SELECT _test.authenticate_as('u1111111-1111-4111-a111-111111111111');

-- Test 1: Requested depth = 10 -> applied depth clamp xuong 5
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 10, 10, false, true)->'limits'->>'appliedAncestorDepth')::int,
    5,
    'appliedAncestorDepth phai bi clamp xuong toi da la 5'
);

SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 10, 10, false, true)->'limits'->>'appliedDescendantDepth')::int,
    5,
    'appliedDescendantDepth phai bi clamp xuong toi da la 5'
);

-- Test 2: Negative depth throws error
SELECT throws_ok(
    $$ SELECT public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', -1, 2) $$,
    '22023',
    NULL,
    'Negative depth phai bi tu choi'
);

-- Test 3: Limits metadata reports correct budget
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 2, 2, false, true)->'limits'->>'maxPersonsBudget')::int,
    250,
    'maxPersonsBudget phai la 250'
);

SELECT * FROM finish();
ROLLBACK;
