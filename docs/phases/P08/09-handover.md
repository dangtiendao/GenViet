# Tài liệu Bàn giao Kỹ thuật: Phase P08 sang Phase P09 & CRUD Phases (Handover - Cổng G7)

- **Phase Bàn giao:** `P08: RLS và Phân quyền` - Trạng thái: `IMPLEMENTATION_COMPLETE`
- **Phase Tiếp nhận Trực tiếp:** `P09: Thiết kế Xác thực (Authentication System)`
- **Các Phase Tiếp nhận Gián tiếp:** `P11: Quản trị Cây Gia phả`, `P12: Quản trị Nhân vật`, `P13: Quản trị Quan hệ`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Principal Database Security Engineer & Authorization Lead (P08)

---

## 1. Hướng dẫn Kỹ thuật Dành riêng cho Phase P09 (Authentication)

1. **Quan hệ 1:1 giữa `auth.users` và `public.profiles`:**
   - Người dùng đăng nhập được xác thực thông qua Supabase Auth Cookie (`@supabase/ssr`).
   - `public.profiles` có RLS policy `profiles_select_own` và `profiles_update_own` chỉ cho phép truy cập khi `id = auth.uid()`.
   - Phase P09 chịu trách nhiệm xây dựng flow tạo bản ghi `profiles` tương ứng khi người dùng đăng ký tài khoản mới (thông qua database trigger trên `auth.users` hoặc server-side flow an toàn).
2. **Quy tắc Trọng yếu cho Session & Roles:**
   - Quyền hạn của người dùng đối với các cây gia phả không được lấy từ custom metadata hay static claims trong JWT mà được CSDL tự động kiểm tra thời gian thực thông qua bảng `public.tree_memberships`.
3. **Quyền của `anon`:**
   - Toàn bộ các bảng nghiệp vụ (`family_trees`, `persons`, `relationships`, `unions`, `memberships`, `profiles`) đã bị `REVOKE ALL` đối với vai trò `anon`. Không có dữ liệu nào bị rò rỉ trước khi đăng nhập.

---

## 2. Hướng dẫn Kỹ thuật Dành riêng cho Phase P11 - P13 (Genealogy CRUD)

1. **Quyền Tạo Cây Gia phả Mới (P11):**
   - Khi gọi `INSERT INTO public.family_trees`, bắt buộc phải gán `created_by = (select auth.uid())`.
   - Ngay sau khi tạo cây mới thành công, ứng dụng cần tạo bản ghi `tree_memberships` với `role = 'owner'` cho creator.
2. **Quyền Thao tác Dữ liệu Phả hệ (P12 & P13):**
   - Người dùng có vai trò `owner`, `admin`, hoặc `editor` trong cây được phép thực hiện `INSERT`, `UPDATE` (bao gồm soft delete) trên `persons`, `parent_child_relationships`, `unions`, `union_members`.
   - Người dùng có vai trò `viewer` chỉ có quyền `SELECT`.
3. **Các Cột Bất biến (Immutable Columns):**
   - Tuyệt đối không thực hiện lệnh UPDATE thay đổi các cột `tree_id`, `id`, `user_id`, `created_by`, `created_at`. Mọi hành vi sửa đổi sẽ bị CSDL từ chối với lỗi SQLSTATE `42501`.
4. **Xóa Mềm (Soft Deletion):**
   - Mọi thao tác xóa trong ứng dụng phải là lệnh `UPDATE SET deleted_at = timezone('utc', now()), deleted_by = auth.uid()`. Không sử dụng lệnh `DELETE` vật lý.
