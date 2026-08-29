# Mô hình Phân quyền Row Level Security (RLS Authorization Model)

- **Mã tài liệu:** `SEC-RLS-MODEL-01`
- **Phiên bản:** `v0.1-baseline`
- **Phase thực thi:** `P08`
- **Trạng thái:** `LOCKED`

---

## 1. Nguyên tắc Cốt lõi (Core Security Principles)

1. **Defense-in-Depth (Phòng thủ Chiều sâu):**
   - **Tầng Grants:** Chỉ grant các thao tác SELECT, INSERT, UPDATE cho `authenticated`; revoke toàn bộ quyền của `anon` trên bảng nghiệp vụ phả hệ; revoke hard `DELETE` trên các bảng dùng soft delete.
   - **Tầng RLS:** RLS là lớp rào chắn dữ liệu cuối cùng, độc lập với các kiểm tra ở frontend UI hay server logic.
2. **Membership-Based Authorization (Phân quyền theo Thành viên Hiện hành):**
   - Quyền truy cập vào một Family Tree và toàn bộ thực thể bên trong (`persons`, `relationships`, `unions`) được xác định bởi bản ghi trong bảng `public.tree_memberships` với điều kiện:
     `user_id = (select auth.uid()) AND status = 'active' AND deleted_at IS NULL`.
   - Không dựa vào role claim tĩnh trong JWT nếu membership có thể thay đổi tức thời.
3. **Same-Tree Isolation & Immutability:**
   - Ngăn chặn triệt để hành vi đổi `tree_id` hoặc di chuyển nhân vật/quan hệ giữa các cây gia phả thông qua Trigger `_system.prevent_immutable_columns_mutation()`.
4. **Helper Functions Security Definer Tối thiểu:**
   - Các hàm helper phân quyền (`_system.is_active_tree_member`, `_system.is_tree_owner`, `_system.can_write_tree`) được đánh dấu `STABLE`, `SECURITY DEFINER` với `SET search_path = public, _system, pg_temp;` để tránh hiện tượng đệ quy vô hạn (infinite recursion) trên bảng `tree_memberships` và tối ưu hóa hiệu năng query planner.

---

## 2. Phân cấp Vai trò (Role Hierarchy)

- **`owner`:** Chủ sở hữu cây gia phả. Có toàn quyền quản lý thành viên, cấu hình cây, xóa mềm cây, và tạo/sửa/xóa mềm mọi thực thể phả hệ trong cây.
- **`admin` / `editor`:** Người đóng góp nội dung. Có quyền đọc, tạo, sửa và xóa mềm dữ liệu phả hệ (`persons`, `relationships`, `unions`). Không được quản lý membership, không được xóa mềm cây gia phả.
- **`viewer`:** Người xem. Chỉ có quyền đọc (SELECT) dữ liệu phả hệ và thông tin cây gia phả đang hoạt động. Bị từ chối 100% mọi thao tác ghi (INSERT, UPDATE, DELETE).
- **`outsider` (Người ngoài):** Người dùng đã xác thực nhưng không có membership trong cây. Bị từ chối 100% mọi thao tác đọc và ghi.
- **`anon` (Chưa đăng nhập):** Bị từ chối 100% mọi thao tác trên các bảng nghiệp vụ phả hệ.
