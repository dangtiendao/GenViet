BEGIN;
SELECT plan(5);

-- Setup test fixtures: Ông Nội (p1) -> Cha (p2) -> Con (p3)
SELECT _test.create_test_user('u1111111-1111-4111-a111-111111111111', 'owner@example.com');

INSERT INTO public.family_trees (id, name, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'Cây Tổ Tiên', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111', 'owner', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by) VALUES
('p1111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'Ông Nội', 'ong noi', 'male', 'deceased', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('p2222222-2222-4222-a222-222222222222', 't1111111-1111-4111-a111-111111111111', 'Người Cha', 'nguoi cha', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('p3333333-3333-4333-a333-333333333333', 't1111111-1111-4111-a111-111111111111', 'Người Con', 'nguoi con', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

-- Quan hệ: p1 -> p2 (p1 là cha của p2)
INSERT INTO public.parent_child_relationships (tree_id, parent_id, child_id, parent_role, relationship_kind, verification_status, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 'p2222222-2222-4222-a222-222222222222', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

-- Quan hệ: p2 -> p3 (p2 là cha của p3)
INSERT INTO public.parent_child_relationships (tree_id, parent_id, child_id, parent_role, relationship_kind, verification_status, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'p2222222-2222-4222-a222-222222222222', 'p3333333-3333-4333-a333-333333333333', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

SELECT _test.authenticate_as('u1111111-1111-4111-a111-111111111111');

-- Test 1: Query với center là p3 (Người Con) và ancestor_depth = 1 -> Chi tra ve p3 va p2 (2 persons)
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p3333333-3333-4333-a333-333333333333', 1, 0, false, true)->'persons'),
    2,
    'Depth 1 phai tra ve dung 2 nguoi (Con va Cha)'
);

-- Test 2: p2 tai boundary depth 1 phai co hasMoreAncestors = true (vi p1 chua duoc load)
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p3333333-3333-4333-a333-333333333333', 1, 0, false, true)->'expansion'->'p2222222-2222-4222-a222-222222222222'->>'hasMoreAncestors')::boolean,
    true,
    'Cha p2 phai co hasMoreAncestors = true khi depth = 1'
);

-- Test 3: Query voi ancestor_depth = 2 -> Tra ve ca 3 persons (p3, p2, p1)
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p3333333-3333-4333-a333-333333333333', 2, 0, false, true)->'persons'),
    3,
    'Depth 2 phai tra ve ca 3 nguoi (Con, Cha, Ong)'
);

-- Test 4: p1 o depth 2 khong con to tien nao -> hasMoreAncestors = false
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p3333333-3333-4333-a333-333333333333', 2, 0, false, true)->'expansion'->'p1111111-1111-4111-a111-111111111111'->>'hasMoreAncestors')::boolean,
    false,
    'Ong p1 phai co hasMoreAncestors = false khi da load het'
);

-- Test 5: p3 da co verified biological father -> canAddFather = false
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p3333333-3333-4333-a333-333333333333', 1, 0, false, true)->'expansion'->'p3333333-3333-4333-a333-333333333333'->>'canAddFather')::boolean,
    false,
    'canAddFather phai la false vi p3 da co cha ruot duoc xac minh'
);

SELECT * FROM finish();
ROLLBACK;
