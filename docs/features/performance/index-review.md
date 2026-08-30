# Đánh Giá Chỉ Mục Cơ Sở Dữ Liệu (Index Review - P23-T07)

## 1. Danh Mục Chỉ Mục Hiện Hữu & Bổ Sung
1. `idx_parent_child_parent_child_covering` (tree_id, parent_id, child_id WHERE deleted_at IS NULL): Phục vụ quét con cháu (Index Only Scan).
2. `idx_parent_child_child_parent_covering` (tree_id, child_id, parent_id WHERE deleted_at IS NULL): Phục vụ quét tổ tiên (Index Only Scan).
3. `idx_union_members_person_union_covering` (tree_id, person_id, union_id WHERE deleted_at IS NULL): Phục vụ tra cứu hôn phối.
4. `idx_persons_tree_active` (tree_id, id WHERE deleted_at IS NULL): Phục vụ tra cứu chi tiết nhân vật.
