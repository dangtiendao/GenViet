BEGIN;
SELECT plan(4);

-- Setup test fixtures: Cha (p1) -> 2 Con (p2, p3) -> Cháu (p4)
SELECT _test.create_test_user('u1111111-1111-4111-a111-111111111111', 'owner@example.com');

INSERT INTO public.family_trees (id, name, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'Cây Hậu Duệ', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111', 'owner', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by) VALUES
('p1111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'Ông Tổ', 'ong to', 'male', 'deceased', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('p2222222-2222-4222-a222-222222222222', 't1111111-1111-4111-a111-111111111111', 'Con Trưởng', 'con truong', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('p3333333-3333-4333-a333-333333333333', 't1111111-1111-4111-a111-111111111111', 'Con Thứ', 'con thu', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('p4444444-4444-4444-a444-444444444444', 't1111111-1111-4111-a111-111111111111', 'Cháu Đích Tôn', 'chau dich ton', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

-- p1 -> p2, p1 -> p3
INSERT INTO public.parent_child_relationships (tree_id, parent_id, child_id, parent_role, relationship_kind, verification_status, created_by, updated_by) VALUES
('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 'p2222222-2222-4222-a222-222222222222', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 'p3333333-3333-4333-a333-333333333333', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

-- p2 -> p4
INSERT INTO public.parent_child_relationships (tree_id, parent_id, child_id, parent_role, relationship_kind, verification_status, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'p2222222-2222-4222-a222-222222222222', 'p4444444-4444-4444-a444-444444444444', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

SELECT _test.authenticate_as('u1111111-1111-4111-a111-111111111111');

-- Test 1: Query center p1 voi descendant_depth = 1 -> Tra ve 3 persons (p1, p2, p3)
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 1, false, true)->'persons'),
    3,
    'Depth 1 hau due phai tra ve dung 3 nguoi (Ong va 2 Con)'
);

-- Test 2: p2 tai boundary depth 1 phai co hasMoreDescendants = true (vi p4 chua load)
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 1, false, true)->'expansion'->'p2222222-2222-4222-a222-222222222222'->>'hasMoreDescendants')::boolean,
    true,
    'Con truong p2 phai co hasMoreDescendants = true'
);

-- Test 3: p3 khong co con -> hasMoreDescendants = false
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 1, false, true)->'expansion'->'p3333333-3333-4333-a333-333333333333'->>'hasMoreDescendants')::boolean,
    false,
    'Con thu p3 phai co hasMoreDescendants = false vi khong co con'
);

-- Test 4: Query voi descendant_depth = 2 -> Tra ve ca 4 persons
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 2, false, true)->'persons'),
    4,
    'Depth 2 hau due phai tra ve du ca 4 nguoi'
);

SELECT * FROM finish();
ROLLBACK;
