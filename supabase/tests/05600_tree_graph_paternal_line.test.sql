BEGIN;
SELECT plan(10);

-- Setup test fixtures: 
-- A (Nam, Center)
-- A -> B (Nam), A -> D (Nữ), A -> U (Unknown), A -> G (Nữ không con)
-- B -> C (Nam)
-- D -> E (Nam) -> F (Nữ)
-- U -> V (Nam)

SELECT _test.create_test_user('u1111111-1111-4111-a111-111111111111', 'owner_p28@example.com');
SELECT _test.create_test_user('u2222222-2222-4222-a222-222222222222', 'outsider_p28@example.com');

INSERT INTO public.family_trees (id, name, created_by, updated_by)
VALUES 
('t1111111-1111-4111-a111-111111111111', 'Cây Phả Hệ P28', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t2222222-2222-4222-a222-222222222222', 'Cây Phả Hệ Khác', 'u2222222-2222-4222-a222-222222222222', 'u2222222-2222-4222-a222-222222222222');

INSERT INTO public.tree_memberships (tree_id, user_id, role, status, created_by, updated_by)
VALUES 
('t1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111', 'owner', 'active', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

INSERT INTO public.persons (id, tree_id, full_name, normalized_name, gender, living_status, created_by, updated_by) VALUES
('paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 't1111111-1111-4111-a111-111111111111', 'A (Cụ Tổ - Nam)', 'a', 'male', 'deceased', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('pbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', 't1111111-1111-4111-a111-111111111111', 'B (Con Trai - Nam)', 'b', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('pccccccc-cccc-4ccc-cccc-cccccccccccc', 't1111111-1111-4111-a111-111111111111', 'C (Cháu Nội - Nam)', 'c', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('pddddddd-dddd-4ddd-dddd-dddddddddddd', 't1111111-1111-4111-a111-111111111111', 'D (Con Gái - Nữ)', 'd', 'female', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('peeeeeee-eeee-4eee-eeee-eeeeeeeeeeee', 't1111111-1111-4111-a111-111111111111', 'E (Cháu Ngoại - Nam)', 'e', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('pfffffff-ffff-4fff-ffff-ffffffffffff', 't1111111-1111-4111-a111-111111111111', 'F (Chắt Ngoại - Nữ)', 'f', 'female', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('puuuuuuu-uuuu-4uuu-uuuu-uuuuuuuuuuuu', 't1111111-1111-4111-a111-111111111111', 'U (Con Chưa Rõ Giới Tính)', 'u', 'unknown', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('pvvvvvvv-vvvv-4vvv-vvvv-vvvvvvvvvvvv', 't1111111-1111-4111-a111-111111111111', 'V (Cháu của U - Nam)', 'v', 'male', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('pggggggg-gggg-4ggg-gggg-gggggggggggg', 't1111111-1111-4111-a111-111111111111', 'G (Con Gái Chưa Chồng Con)', 'g', 'female', 'living', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('pxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx', 't2222222-2222-4222-a222-222222222222', 'X (Người thuộc Cây Khác)', 'x', 'male', 'living', 'u2222222-2222-4222-a222-222222222222', 'u2222222-2222-4222-a222-222222222222');

-- Quan hệ Cha Mẹ - Con
INSERT INTO public.parent_child_relationships (tree_id, parent_id, child_id, parent_role, relationship_kind, verification_status, created_by, updated_by) VALUES
('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'pbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'pddddddd-dddd-4ddd-dddd-dddddddddddd', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'puuuuuuu-uuuu-4uuu-uuuu-uuuuuuuuuuuu', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'pggggggg-gggg-4ggg-gggg-gggggggggggg', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'pbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', 'pccccccc-cccc-4ccc-cccc-cccccccccccc', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'pddddddd-dddd-4ddd-dddd-dddddddddddd', 'peeeeeee-eeee-4eee-eeee-eeeeeeeeeeee', 'mother', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'peeeeeee-eeee-4eee-eeee-eeeeeeeeeeee', 'pfffffff-ffff-4fff-ffff-ffffffffffff', 'father', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111'),
('t1111111-1111-4111-a111-111111111111', 'puuuuuuu-uuuu-4uuu-uuuu-uuuuuuuuuuuu', 'pvvvvvvv-vvvv-4vvv-vvvv-vvvvvvvvvvvv', 'unspecified', 'biological', 'verified', 'u1111111-1111-4111-a111-111111111111', 'u1111111-1111-4111-a111-111111111111');

SELECT _test.authenticate_as('u1111111-1111-4111-a111-111111111111');

-- Test 1: Chế độ mặc định PATERNAL_LINE từ Center A với depth=3
-- Kỳ vọng: A, B, C, D, U, V, G (7 người). E và F không xuất hiện.
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true, 'PATERNAL_LINE')->'persons'),
    7,
    'PATERNAL_LINE: Tra ve 7 nguoi (A, B, C, D, U, V, G) - E va F bi dung tai node nu D'
);

-- Test 2: Node con gái D phải có hasHiddenDescendants = true và truncationReason = PATERNAL_LINE
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true, 'PATERNAL_LINE')->'expansion'->'pddddddd-dddd-4ddd-dddd-dddddddddddd'->>'hasHiddenDescendants')::boolean,
    true,
    'PATERNAL_LINE: Node con gai D phai co hasHiddenDescendants = true'
);

SELECT is(
    public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true, 'PATERNAL_LINE')->'expansion'->'pddddddd-dddd-4ddd-dddd-dddddddddddd'->>'truncationReason',
    'PATERNAL_LINE',
    'PATERNAL_LINE: Node D phai co truncationReason = PATERNAL_LINE'
);

-- Test 3: Node con gái G không có con -> hasHiddenDescendants = false
SELECT is(
    (public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true, 'PATERNAL_LINE')->'expansion'->'pggggggg-gggg-4ggg-gggg-gggggggggggg'->>'hasHiddenDescendants')::boolean,
    false,
    'PATERNAL_LINE: Node G khong co con phai co hasHiddenDescendants = false'
);

-- Test 4: Center-Female Exception: Khi Center là D (Nữ), con cháu của D (E, F) vẫn xuất hiện
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'pddddddd-dddd-4ddd-dddd-dddddddddddd', 0, 3, false, true, 'PATERNAL_LINE')->'persons'),
    3,
    'Center-Female Exception: Center D (Nu) phai tra ve du 3 nguoi (D, E, F)'
);

-- Test 5: Chế độ ALL_DESCENDANTS từ Center A -> Trả về đủ cả 9 người (A, B, C, D, E, F, U, V, G)
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true, 'ALL_DESCENDANTS')->'persons'),
    9,
    'ALL_DESCENDANTS: Tra ve day du ca 9 nguoi qua ca nhanh nu'
);

-- Test 6: Unknown Gender (U) tiếp tục duyệt con (V xuất hiện)
SELECT ok(
    EXISTS (
        SELECT 1 FROM jsonb_array_elements(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true, 'PATERNAL_LINE')->'persons') AS elem
        WHERE elem->>'id' = 'pvvvvvvv-vvvv-4vvv-vvvv-vvvvvvvvvvvv'
    ),
    'Unknown gender U van duyet con V trong PATERNAL_LINE'
);

-- Test 7: Mặc định không truyền traversal_mode vẫn hoạt động như PATERNAL_LINE
SELECT is(
    jsonb_array_length(public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true)->'persons'),
    7,
    'Khong truyen traversal_mode mac dinh la PATERNAL_LINE (7 nguoi)'
);

-- Test 8: Traversal mode không hợp lệ ném lỗi GRAPH_TRAVERSAL_MODE_INVALID
SELECT throws_ok(
    $$ SELECT public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true, 'INVALID_MODE') $$,
    '22023',
    'GRAPH_TRAVERSAL_MODE_INVALID',
    'Traversal mode khong hop le phai nem loi 22023'
);

-- Test 9: Branch boundary cross-tree ném lỗi GRAPH_BRANCH_BOUNDARY_CROSS_TREE
SELECT throws_ok(
    $$ SELECT public.get_tree_graph_slice('t1111111-1111-4111-a111-111111111111', 'paaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 0, 3, false, true, 'PATERNAL_LINE', 'pxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx') $$,
    '42501',
    'GRAPH_BRANCH_BOUNDARY_CROSS_TREE',
    'Boundary khac tree phai nem loi 42501'
);

SELECT * FROM finish();
ROLLBACK;
