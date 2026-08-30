# Ma trận Phân quyền & Bảo mật Cây Gia phả (Authorization) - Phase P11

- **Mã tài liệu:** `FT-AUTH-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Ma trận Phân quyền Thao tác (Permission Matrix)

| Thao tác Nghiệp vụ | Owner | Admin | Editor | Viewer | Outsider / Anon | Lớp RLS & Cơ chế Bảo vệ |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Xem danh sách cây** | ✅ | ✅ | ✅ | ✅ | ❌ | `tree_memberships_select_members` |
| **Xem trang tổng quan** | ✅ | ✅ | ✅ | ✅ | ❌ | `family_trees_select_members` |
| **Tạo cây mới** | ✅ | ✅ | ✅ | ✅ | ❌ | `public.create_family_tree` RPC (Auth only) |
| **Sửa Tên & Mô tả** | ✅ | ❌ | ❌ | ❌ | ❌ | `family_trees_update_owners` |
| **Sửa Quyền riêng tư** | ✅ | ❌ | ❌ | ❌ | ❌ | `family_trees_update_owners` |
| **Chọn Mốc số đời** | ✅ | ❌ | ❌ | ❌ | ❌ | `family_trees_update_owners` |
| **Xóa mềm (Soft Delete)** | ✅ | ❌ | ❌ | ❌ | ❌ | `family_trees_update_owners` |
| **Khôi phục (Restore)** | ✅ | ❌ | ❌ | ❌ | ❌ | `public.restore_family_tree` RPC (`_system.is_tree_owner`) |
| **Xóa vĩnh viễn (Purge)**| ⛔ | ⛔ | ⛔ | ⛔ | ❌ | `DEFERRED_FOR_SAFETY` |

---

## 2. Nguyên tắc Cách ly Tuyệt đối giữa các Cây (Cross-Tree Isolation)

- **RLS là rào chắn cuối cùng:** Cho dù kẻ tấn công có được UUID của một cây gia phả khác, các truy vấn SQL trực tiếp qua API Data của Supabase đều bị lọc bỏ bởi hàm `_system.is_active_tree_member(id)`.
- **Validation cùng cây:** Khi gán `generation_anchor_person_id`, hệ thống bắt buộc kiểm tra nhân vật phải có `tree_id` trùng khớp với cây gia phả hiện tại.
