# Nhật ký Quyết định Kỹ thuật: Phase P11 (Phase Decisions)

Tài liệu này ghi nhận các quyết định kỹ thuật cốt lõi trong Phase P11.

---

## 1. Danh sách Quyết định Kỹ thuật Phase P11

| Mã Quyết định | Tiêu đề Quyết định | Trạng thái | Tóm tắt Nội dung |
| :--- | :--- | :---: | :--- |
| **`P11-DEC-001`** | **Atomic RPC `create_family_tree`:** | `ACCEPTED` | Sử dụng PostgreSQL function với `SECURITY DEFINER` để tạo Tree và Owner Membership trong một transaction nguyên tử, ngăn chặn hoàn toàn orphan tree. |
| **`P11-DEC-002`** | **Safe Restore RPC & Trash Policy:** | `ACCEPTED` | Triển khai RPC `restore_family_tree` và chính sách RLS `family_trees_select_deleted_owners` cho phép chỉ Chủ sở hữu truy cập và khôi phục cây đã xóa mềm. |
| **`P11-DEC-003`** | **Permanent Purge Deferral:** | `ACCEPTED` | Đánh dấu `DEFERRED_FOR_SAFETY` cho tính năng Xóa vĩnh viễn (Hard Purge) do chưa hoàn thiện Reauthentication mật khẩu và Audit log P18. |
| **`P11-DEC-004`** | **Optimistic Concurrency Control:** | `ACCEPTED` | Mọi thao tác cập nhật (Sửa tên, mô tả, mốc số đời, privacy, soft delete) đều kiểm tra cột `version` để bảo vệ tính toàn vẹn dữ liệu khi có nhiều phiên sửa đổi đồng thời. |
| **`P11-DEC-005`** | **Generation Anchor Alignment:** | `ACCEPTED` | Hỗ trợ cấu hình `generation_anchor_person_id` (Mốc số đời) theo đúng schema P07, không nhầm lẫn với khái niệm Center Person của client. |
