# Phase Overview: P08 - RLS và Phân quyền (Row Level Security & Authorization)

- **Mã Phase:** `P08`
- **Tên Phase:** RLS và Phân quyền (Row Level Security & Authorization)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE`
- **Nhánh Git thi công:** `phase/p08-rls-authorization`
- **Starting Commit:** `ef25d32` (Merge PR #7 for P07)
- **Vai trò thi công:** Principal Database Security Engineer, PostgreSQL RLS Specialist & Authorization Lead
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase P08

1. Bật và thiết lập các chính sách Row Level Security (RLS) bảo vệ toàn diện 7 bảng CSDL cốt lõi (`profiles`, `family_trees`, `tree_memberships`, `persons`, `parent_child_relationships`, `unions`, `union_members`).
2. Cách ly dữ liệu tuyệt đối giữa các cây gia phả (`Cross-Tree Isolation`).
3. Phân quyền truy cập dựa trên membership hiện hành trong cây (`owner`, `admin`, `editor`, `viewer`).
4. Bảo vệ hồ sơ cá nhân (`profiles`): chỉ người sở hữu được đọc và cập nhật.
5. Cưỡng chế các thao tác dành riêng cho Chủ sở hữu (`Owner-Only Actions`): quản lý thành viên, cấu hình cây, xóa mềm cây.
6. Ngăn chặn triệt để hành vi Viewer ghi dữ liệu nghiệp vụ.
7. Ngăn chặn thay đổi các cột bất biến (`tree_id`, `id`, `user_id`, `created_by`, `created_at`) qua trigger bảo vệ.
8. Áp dụng nguyên tắc đặc quyền tối thiểu (Least Privilege) cho Table Grants: revoke toàn bộ từ `anon`, revoke hard `DELETE` trên bảng soft-delete.
9. Xây dựng bộ test suites kiểm thử RLS toàn diện (Owner, Viewer, Outsider, Cross-Tree, Privilege Escalation, Service-Role Isolation).
10. Hoàn thiện bộ tài liệu bảo mật, authorization matrix, grants matrix, policy catalogue.

---

## 2. Ranh giới Kỹ thuật Nghiêm ngặt (Strict Boundaries)

- ❌ **Không triển khai Auth UI / Session flow** (Thuộc phạm vi Phase P09).
- ❌ **Không triển khai CRUD ứng dụng / Business RPC** (Thuộc phạm vi Phase P11 - P13).
- ❌ **Không tự push code hoặc migration lên Git Remote.**
