# Kiến trúc Schema Cơ sở Dữ liệu Lõi (Core Database Schema Architecture)

- **Mã tài liệu:** `DB-SCHEMA-CORE-01`
- **Phiên bản:** `v0.1-baseline`
- **Migration nguồn:** `20260829154907_p07_create_core_genealogy_schema.sql`
- **Trạng thái:** `LOCKED`

---

## 1. Tổng quan Thiết kế (Design Principles)

1. **PostgreSQL là Nguồn Sự thật Duy nhất (Single Source of Truth):** Toàn bộ dữ liệu thành viên, liên kết huyết thống và hôn nhân được bảo toàn tính toàn vẹn thông qua các ràng buộc khóa ngoại và check constraints ở tầng database.
2. **Phân biệt Rõ ràng User và Person (`INV-001`):**
   - `auth.users` & `profiles`: Tài khoản đăng nhập hệ thống, quyền truy cập.
   - `persons`: Nhân vật lịch sử / thành viên trong cây gia phả. Một Person không bắt buộc phải có User account.
3. **Cô lập Dữ liệu theo Cây Gia phả (Same-Tree Isolation / `INV-005`):**
   - Mọi thực thể nghiệp vụ (`persons`, `parent_child_relationships`, `unions`, `union_members`) đều chứa `tree_id`.
   - Các khóa ngoại liên kết giữa các nhân vật đều dùng **Composite Foreign Keys `(tree_id, foreign_id)`** trỏ tới `(tree_id, id)` để ngăn chặn triệt để liên kết chéo giữa các cây khác nhau ở tầng CSDL.
4. **Hỗ trợ Dữ liệu Không Đầy đủ (Partial Dates / `INV-019`, `INV-020`):**
   - Hỗ trợ lưu trữ độ chính xác ngày sinh/mất (`exact`, `year`, `unknown`) và cờ ước tính (`birth_is_estimated`, `death_is_estimated`).
   - Tuyệt đối không tự sinh ngày giả `01/01` khi người dùng chỉ biết năm sinh.
5. **Mô hình Quan hệ Phân tách Rõ Ràng:**
   - Quan hệ cha/mẹ - con lưu tại `parent_child_relationships` (không lưu `father_id`/`mother_id` trực tiếp trong bảng `persons`).
   - Quan hệ hôn nhân/kết đôi lưu tại `unions` và `union_members` (không lưu `spouse_id` trực tiếp).
6. **Xóa Mềm (Soft Deletion) & Optimistic Concurrency:**
   - Mọi bảng nghiệp vụ cốt lõi đều hỗ trợ `deleted_at`, `deleted_by` và trường `version integer NOT NULL DEFAULT 1`.
