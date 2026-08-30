# Deletion & Replacement: Relationship Management

## 1. Xóa Mềm Quan Hệ (Soft Deletion)
- **RPC:** `soft_delete_parent_child_relationship` và `soft_delete_union`.
- **Nguyên tắc an toàn:**
  - Gán `deleted_at = now()`, `deleted_by = auth.uid()`, `version = version + 1`.
  - Tuyệt đối không xóa hồ sơ Person liên quan.
  - Xóa Union không làm xóa quan hệ con cái.

## 2. Thay Thế Nguyên Tử Quan Hệ (Atomic Replacement)
- **RPC:** `replace_parent_relationship(p_tree_id, p_old_rel_id, p_old_version, p_new_parent_id, p_child_id, ...)`
- **Quy trình:**
  1. Kiểm tra quyền và version quan hệ cũ.
  2. Xóa mềm quan hệ cũ.
  3. Kiểm tra chu trình và tạo quan hệ mới.
  4. Nếu bước 3 thất bại $\rightarrow$ Toàn bộ transaction rollback và quan hệ cũ vẫn được giữ nguyên.
