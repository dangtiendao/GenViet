# Quy trình Xóa mềm & Khôi phục (Deletion & Restore) - Phase P11

- **Mã tài liệu:** `FT-DEL-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Xóa mềm (Soft Delete)

- **Cơ chế:** Gán `deleted_at = timezone('utc'::text, now())`, `deleted_by = auth.uid()`, và tăng `version = version + 1`.
- **Bảo toàn dữ liệu con:** Toàn bộ nhân vật (`persons`), quan hệ cha con (`parent_child_relationships`), hôn nhân (`unions`) và thành viên (`tree_memberships`) được **giữ nguyên vẹn 100% trong CSDL**.
- **Loại trừ khỏi danh sách thường:** Chính sách RLS `family_trees_select_members` tự động loại bỏ các cây có `deleted_at IS NOT NULL`.

---

## 2. Khôi phục (Restore)

- **Cơ chế:** Hàm `public.restore_family_tree` cho phép Chủ sở hữu (Owner) đặt lại `deleted_at = NULL` và `deleted_by = NULL`.
- **Thùng rác (Trash Access):** Chủ sở hữu truy cập danh sách cây đã xóa tại `/trees/trash` qua chính sách RLS `family_trees_select_deleted_owners`.

---

## 3. Quyết định An toàn về Xóa Vĩnh viễn (Hard Purge - `DEFERRED_FOR_SAFETY`)

Theo quy tắc an toàn dữ liệu:
- Do hệ thống hiện tại chưa triển khai các thành phần bảo vệ phụ trợ:
  1. Reauthentication mật khẩu thời gian thực (Supabase Password Verification API).
  2. Cơ chế sao lưu/xuất dữ liệu trước khi xóa (Backup/Export trước khi Purge).
  3. Phân hệ Nhật ký kiểm toán toàn diện (Audit Log P18).
  4. Cơ chế dọn dẹp Storage Media an toàn.
- **Quyết định:** Tính năng Xóa vĩnh viễn (Hard Purge) được đánh dấu **`DEFERRED_FOR_SAFETY`**. Không có mã lệnh xóa cứng (hard delete) nào được cấp cho người dùng trong Phase P11.
