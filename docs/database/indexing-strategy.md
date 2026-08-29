# Chiến lược Đánh Chỉ mục CSDL (Indexing Strategy)

- **Mã tài liệu:** `DB-INDEX-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `LOCKED`

---

## 1. Danh mục Chỉ mục CSDL Lõi (Index Inventory)

| Bảng | Tên Index | Các Cột Chỉ mục | Loại Index & Predicate | Mẫu Truy vấn Được Tối ưu |
| :--- | :--- | :--- | :--- | :--- |
| **`tree_memberships`** | `idx_tree_memberships_active_user` | `(tree_id, user_id)` | **Unique Partial** (`WHERE deleted_at IS NULL`) | Đảm bảo 1 user chỉ có 1 active role/tree |
| **`tree_memberships`** | `idx_tree_memberships_tree_id` | `(tree_id)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Lấy danh sách thành viên của 1 cây |
| **`tree_memberships`** | `idx_tree_memberships_user_id` | `(user_id)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Lấy danh sách cây mà user tham gia |
| **`persons`** | `idx_persons_tree_active` | `(tree_id)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Nạp toàn bộ danh sách nhân vật trong 1 cây |
| **`persons`** | `idx_persons_tree_search_name` | `(tree_id, normalized_name)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Tìm kiếm nhân vật theo tên chuẩn hóa |
| **`parent_child_relationships`** | `idx_parent_child_active_unique` | `(tree_id, parent_id, child_id, relationship_kind, parent_role)` | **Unique Partial** (`WHERE deleted_at IS NULL`) | Chống tạo trùng lặp quan hệ cha/mẹ - con active |
| **`parent_child_relationships`** | `idx_parent_child_parent_lookup` | `(tree_id, parent_id)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Truy vấn graph: Tìm con của 1 nhân vật |
| **`parent_child_relationships`** | `idx_parent_child_child_lookup` | `(tree_id, child_id)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Truy vấn graph: Tìm cha/mẹ của 1 nhân vật |
| **`unions`** | `idx_unions_tree_active` | `(tree_id)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Nạp toàn bộ quan hệ hôn nhân trong cây |
| **`union_members`** | `idx_union_members_active_unique` | `(union_id, person_id)` | **Unique Partial** (`WHERE deleted_at IS NULL`) | Chống trùng lặp thành viên trong cùng union |
| **`union_members`** | `idx_union_members_union_lookup` | `(tree_id, union_id)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Lấy các bạn đời thuộc 1 union |
| **`union_members`** | `idx_union_members_person_lookup`| `(tree_id, person_id)` | **B-Tree Partial** (`WHERE deleted_at IS NULL`) | Lấy danh sách các cuộc hôn nhân của 1 person |
