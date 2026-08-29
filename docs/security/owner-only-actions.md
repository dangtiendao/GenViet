# Danh mục Thao tác Dành riêng cho Owner (Owner-Only Actions Catalogue)

- **Mã tài liệu:** `SEC-OWNER-ACTIONS-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Danh sách Hành động Dành riêng cho Chủ sở hữu (Owner)

| Hành động Nghiệp vụ | Bảng Dữ liệu | Cơ chế Cưỡng chế Bảo mật | Trạng thái Nghiệm thu |
| :--- | :--- | :--- | :---: |
| **Quản lý Thành viên (Thêm/Sửa/Thu hồi)** | `tree_memberships` | RLS Policy `_system.is_tree_owner(tree_id)` | `ENFORCED` |
| **Cập nhật Thông tin & Quyền riêng tư Cây** | `family_trees` | RLS Policy `_system.is_tree_owner(id)` | `ENFORCED` |
| **Xóa mềm Cây Gia phả** | `family_trees` | RLS Policy `_system.is_tree_owner(id)` | `ENFORCED` |
| **Thiết lập Mốc Đánh số Đời (Anchor)** | `family_trees` | RLS Policy `_system.is_tree_owner(id)` | `ENFORCED` |
| **Chuyển quyền Sở hữu Cây (Transfer)** | `tree_memberships` | Transactional Service RPC (Phase P11) | `DEFERRED` |
| **Xóa vĩnh viễn (Hard Purge)** | Tất cả bảng | Không expose qua Data API (Service role only) | `ENFORCED` |
