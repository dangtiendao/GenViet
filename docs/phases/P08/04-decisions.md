# Nhật ký Quyết định Kỹ thuật: Phase P08 (Phase Decisions)

Tài liệu này ghi nhận 15 quyết định kỹ thuật phân quyền RLS trong Phase P08.

---

## 1. Danh sách Quyết định Kỹ thuật Phase P08

| Mã Quyết định | Tiêu đề Quyết định | Trạng thái | Tóm tắt Nội dung |
| :--- | :--- | :---: | :--- |
| **`P08-DEC-001`** | **Explicit Role Specification:** | `ACCEPTED` | Mọi RLS policy đều chỉ định tường minh `TO authenticated` (không dùng `TO public`). |
| **`P08-DEC-002`** | **InitPlan Wrapping for `auth.uid()`:** | `ACCEPTED` | Bọc `(select auth.uid())` trong tất cả biểu thức policy để query planner optimize hằng số. |
| **`P08-DEC-003`** | **Security Definer Helpers:** | `ACCEPTED` | Tạo `is_active_tree_member`, `is_tree_owner`, `can_write_tree` trong `_system` để tránh policy recursion trên `tree_memberships`. |
| **`P08-DEC-004`** | **Fixed Search Path:** | `ACCEPTED` | Helper functions cố định `SET search_path = public, _system, pg_temp;` để chặn Search Path hijacking. |
| **`P08-DEC-005`** | **Trigger for Immutable Columns:** | `ACCEPTED` | Cưỡng chế chặn đổi `tree_id`, `id`, `user_id`, `created_by`, `created_at` bằng trigger `_system.prevent_immutable_columns_mutation()`. |
| **`P08-DEC-006`** | **Grants Least Privilege:** | `ACCEPTED` | Revoke toàn bộ từ `anon`; revoke hard `DELETE` trên tất cả bảng trừ `tree_memberships`. |
| **`P08-DEC-007`** | **Soft Delete via UPDATE:** | `ACCEPTED` | Xóa mềm trong CSDL là lệnh `UPDATE SET deleted_at = ...`, được bảo vệ bởi policy UPDATE. |
| **`P08-DEC-008`** | **Initial Owner Membership Rule:** | `ACCEPTED` | Cho phép creator của một cây mới tạo bản ghi `owner` membership đầu tiên cho chính mình. |
| **`P08-DEC-009`** | **Viewer Write Denial:** | `ACCEPTED` | Viewer chỉ được gán role `viewer`, bị từ chối 100% tại `_system.can_write_tree(tree_id)`. |
| **`P08-DEC-010`** | **Same-Tree Enforcement at RLS:** | `ACCEPTED` | RLS kết hợp cùng Composite Foreign Keys tạo nên mô hình phòng thủ 2 lớp cho cô lập cây. |
| **`P08-DEC-011`** | **RLS Supporting Indexes:** | `ACCEPTED` | Tạo 2 partial indexes chuyên dụng trên `tree_memberships` để tra cứu membership sub-millisecond. |
| **`P08-DEC-012`** | **Service-Role Isolation Guard:** | `ACCEPTED` | Đảm bảo `admin.ts` có `import "server-only";`, không bao giờ đưa `service_role` vào client. |
| **`P08-DEC-013`** | **No Business Policies for Anon:** | `ACCEPTED` | Phase v0.1 không hỗ trợ cây công khai unauthenticated, toàn bộ bảng nghiệp vụ deny `anon`. |
| **`P08-DEC-014`** | **Deferred Owner Transfer:** | `ACCEPTED` | Nghiệp vụ chuyển quyền sở hữu cây và kiểm tra Owner cuối cùng được ghi nhận cho Phase P11 RPC. |
| **`P08-DEC-015`** | **Test Transaction Sandbox:** | `ACCEPTED` | 100% database tests chạy trong transaction với `ROLLBACK;`, mô phỏng authenticated user bằng `request.jwt.claim.sub`. |
