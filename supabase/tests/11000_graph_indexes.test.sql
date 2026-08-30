-- Test Suite 11000: Kiểm tra sự tồn tại và tính hợp lệ của Covering Indexes phục vụ Recursive CTE (P23-T07)
BEGIN;
SELECT plan(3);

-- 1. Kiểm tra index cho quan hệ Cha -> Con
SELECT has_index(
    'public',
    'parent_child_relationships',
    'idx_parent_child_parent_child_covering',
    'Index idx_parent_child_parent_child_covering phải tồn tại để tối ưu quét con cháu'
);

-- 2. Kiểm tra index cho quan hệ Con -> Cha Mẹ
SELECT has_index(
    'public',
    'parent_child_relationships',
    'idx_parent_child_child_parent_covering',
    'Index idx_parent_child_child_parent_covering phải tồn tại để tối ưu quét tổ tiên'
);

-- 3. Kiểm tra index cho thành viên hôn nhân
SELECT has_index(
    'public',
    'union_members',
    'idx_union_members_person_union_covering',
    'Index idx_union_members_person_union_covering phải tồn tại để tối ưu quét hôn nhân'
);

SELECT * FROM finish();
ROLLBACK;
