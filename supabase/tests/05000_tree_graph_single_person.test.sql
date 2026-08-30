BEGIN;
SELECT plan(6);

-- Setup test fixtures
SELECT _test.create_test_user('u1111111-1111-4111-a111-111111111111', 'owner@example.com');
SELECT _test.create_test_user('u2222222-2222-4222-a222-222222222222', 'outsider@example.com');

INSERT INTO public.family_trees (id, name, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'Cây Đơn Nhân Vật', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111', 'owner', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by)
VALUES ('p1111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'Nguyễn Đơn Thân', 'nguyen don than', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

-- Test 1: Đăng nhập owner và gọi RPC
SELECT _test.authenticate_as('u1111111-1111-4111-a111-111111111111');

SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111')->>'schemaVersion')::int,
    1,
    'Schema version phai la 1'
);

SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111')->'persons'),
    1,
    'Graph don nhan vat phai co dung 1 person'
);

SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111')->'parentChildRelationships'),
    0,
    'Graph don nhan vat phai co 0 quan he cha con'
);

SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111')->'unions'),
    0,
    'Graph don nhan vat phai co 0 union'
);

SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111')->'expansion'->'p1111111-1111-4111-a111-111111111111'->>'hasMoreAncestors')::boolean,
    false,
    'hasMoreAncestors phai la false'
);

SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111')->'expansion'->'p1111111-1111-4111-a111-111111111111'->>'canAddFather')::boolean,
    true,
    'canAddFather phai la true khi chua co cha'
);

SELECT * FROM finish();
ROLLBACK;
