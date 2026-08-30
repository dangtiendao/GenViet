BEGIN;
SELECT plan(5);

-- Setup 2 trees, 2 users (Owner Tree 1, Viewer Tree 1, Outsider Tree 2)
SELECT _test.create_test_user('u1111111-1111-4111-a111-111111111111', 'owner1@example.com');
SELECT _test.create_test_user('u2222222-2222-4222-a222-222222222222', 'viewer1@example.com');
SELECT _test.create_test_user('u3333333-3333-4333-a333-333333333333', 'outsider@example.com');

INSERT INTO public.family_trees (id, name, created_by, updated_by) VALUES
('t1111111-1111-4111-a111-111111111111', 'Cây 1', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t2222222-2222-4222-a222-222222222222', 'Cây 2', 'u3333333-3333-4333-a333-333333333333', 'u3333333-3333-4333-a333-333333333333');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by) VALUES
('t1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111', 'owner', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'u2222222-2222-4222-a222-222222222222', 'viewer', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t2222222-2222-4222-a222-222222222222', 'u3333333-3333-4333-a333-333333333333', 'owner', 'active', 'u3333333-3333-4333-a333-333333333333', 'u3333333-3333-4333-a333-333333333333');

INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by) VALUES
('p1111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'Người Cây 1', 'nguoi cay 1', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('p2222222-2222-4222-a222-222222222222', 't2222222-2222-4222-a222-222222222222', 'Người Cây 2', 'nguoi cay 2', 'female', 'living', 'u3333333-3333-4333-a333-333333333333', 'u3333333-3333-4333-a333-333333333333');

-- Test 1: Owner Tree 1 truy van Cay 1 thanh cong
SELECT _test.authenticate_as('u1111111-1111-4111-a111-111111111111');
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 2, 2, false, true)->'persons'),
    1,
    'Owner Cây 1 phai truy van duoc Graph Cay 1'
);

-- Test 2: Viewer Tree 1 truy van Cay 1 thanh cong (Read-only access)
SELECT _test.authenticate_as('u2222222-2222-4222-a222-222222222222');
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 2, 2, false, true)->'persons'),
    1,
    'Viewer Cây 1 phai doc duoc Graph Cay 1'
);

-- Test 3: Outsider khong duoc phep truy van Cay 1 -> Throws 42501
SELECT _test.authenticate_as('u3333333-3333-4333-a333-333333333333');
SELECT throws_ok(
    $$ SELECT public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 2, 2) $$,
    '42501',
    NULL,
    'Outsider bi tu choi khi truy van Cay 1'
);

-- Test 4: Truy van Cay 1 voi Center Person cua Cay 2 -> Throws 40003 (Tree Mismatch)
SELECT _test.authenticate_as('u1111111-1111-4111-a111-111111111111');
SELECT throws_ok(
    $$ SELECT public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p2222222-2222-4222-a222-222222222222', 2, 2) $$,
    '40003',
    NULL,
    'Cross-tree center person phai bi tu choi TREE_GRAPH_TREE_MISMATCH'
);

-- Test 5: Unauthenticated user bi tu choi -> Throws 42501
SELECT _test.clear_auth();
SELECT throws_ok(
    $$ SELECT public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 2, 2) $$,
    '42501',
    NULL,
    'Unauthenticated user phai bi tu choi'
);

SELECT * FROM finish();
ROLLBACK;
