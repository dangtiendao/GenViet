BEGIN;
SELECT plan(5);

-- Setup test fixtures: Chồng (p1) kết hôn với Vợ 1 (p2, status ended) và Vợ 2 (p3, status active)
SELECT _test.create_test_user('u1111111-1111-4111-a111-111111111111', 'owner@example.com');

INSERT INTO public.family_trees (id, name, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'Cây Hôn Nhân', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
VALUES ('t1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111', 'owner', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by) VALUES
('p1111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'Người Chồng', 'nguoi chong', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('p2222222-2222-4222-a222-222222222222', 't1111111-1111-4111-a111-111111111111', 'Vợ Cả (Đã Ly Hôn)', 'vo ca', 'female', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('p3333333-3333-4333-a333-333333333333', 't1111111-1111-4111-a111-111111111111', 'Vợ Hai (Hiện Tại)', 'vo hai', 'female', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

-- Union 1 (p1 + p2, divorced)
INSERT INTO public.unions (id, tree_id, status, created_by, updated_by)
VALUES ('un111111-1111-4111-a111-111111111111', 't1111111-1111-4111-a111-111111111111', 'divorced', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by) VALUES
('t1111111-1111-4111-a111-111111111111', 'un111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 'spouse', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'un111111-1111-4111-a111-111111111111', 'p2222222-2222-4222-a222-222222222222', 'spouse', 'u1111111-1111-4111-a111-111111111111');

-- Union 2 (p1 + p3, active)
INSERT INTO public.unions (id, tree_id, status, created_by, updated_by)
VALUES ('un222222-2222-4222-a222-222222222222', 't1111111-1111-4111-a111-111111111111', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.union_members (tree_id, union_id, person_id, member_role, created_by) VALUES
('t1111111-1111-4111-a111-111111111111', 'un222222-2222-4222-a222-222222222222', 'p1111111-1111-4111-a111-111111111111', 'spouse', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'un222222-2222-4222-a222-222222222222', 'p3333333-3333-4333-a333-333333333333', 'spouse', 'u1111111-1111-4111-a111-111111111111');

SELECT _test.authenticate_as('u1111111-1111-4111-a111-111111111111');

-- Test 1: include_spouses = true tra ve du 3 persons (p1, p2, p3)
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 0, true, true)->'persons'),
    3,
    'include_spouses = true phai tra ve ca 2 nguoi vo'
);

-- Test 2: Tra ve dung 2 unions rieng biet
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 0, true, true)->'unions'),
    2,
    'Phai tra ve 2 Unions rieng biet cho 2 cuoc hon nhan'
);

-- Test 3: Tra ve du 4 union members
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 0, true, true)->'unionMembers'),
    4,
    'Phai tra ve 4 union members (2 nguoi moi union)'
);

-- Test 4: include_spouses = false chi tra ve 1 person (p1)
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 0, false, true)->'persons'),
    1,
    'include_spouses = false chi tra ve dung nguoi trung tam'
);

-- Test 5: include_spouses = false tra ve 0 unions
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-a111-111111111111', 0, 0, false, true)->'unions'),
    0,
    'include_spouses = false phai tra ve 0 unions'
);

SELECT * FROM finish();
ROLLBACK;
