# Phase Overview: P11 - Quản lý Gia phả (Family Tree Management)

- **Mã Phase:** `P11`
- **Tên Phase:** Quản lý gia phả (Family Tree Management)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE`
- **Nhánh Git thi công:** `phase/p11-family-tree-management`
- **Starting Commit:** `3727f07` (Merge PR #10 for P10)
- **Vai trò thi công:** Principal Full-stack Engineer, Next.js App Router Engineer, Supabase/PostgreSQL Engineer, Application Security Reviewer
- **Thời gian thực hiện:** 2026-08-30

---

## 1. Mục tiêu của Phase P11

1. Triển khai trang danh sách cây gia phả người dùng có quyền truy cập (`/trees`).
2. Triển khai form tạo cây gia phả (`/trees/new`) với validation tên tiếng Việt ở client và server.
3. Tạo Family Tree và Owner Membership trong một giao dịch cơ sở dữ liệu nguyên tử qua PostgreSQL RPC `create_family_tree`.
4. Triển khai trang tổng quan cây gia phả (`/trees/[treeId]`).
5. Triển khai trang cài đặt cây gia phả (`/trees/[treeId]/settings`): Cho phép Owner sửa tên, mô tả, quyền riêng tư, và chọn mốc số đời (`generation_anchor_person_id`).
6. Triển khai Family Tree Switcher component để chuyển đổi qua lại giữa các cây gia phả.
7. Triển khai quy trình Xóa mềm (Soft delete) và Khôi phục (Restore) an toàn.
8. Đánh giá an toàn xóa vĩnh viễn và ghi nhận trạng thái `DEFERRED_FOR_SAFETY`.
9. Hiển thị Empty State chuẩn mực khi chưa có cây gia phả nào.
10. Kiểm thử phân quyền Owner, cách ly dữ liệu giữa các cây (Cross-tree isolation) và kiểm thử hồi quy bảo mật.

---

## 2. Ranh giới Nghiêm ngặt

- ❌ **Không triển khai Person CRUD** (Thuộc Phase P12).
- ❌ **Không triển khai Relationship CRUD** (Thuộc Phase P13).
- ❌ **Không triển khai đồ thị Canvas React Flow** (Thuộc Phase P15).
- ❌ **Không push Git remote, không merge, không deploy và không tạo Pull Request.**
