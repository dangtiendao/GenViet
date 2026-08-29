# Nhật ký Quyết định Kỹ thuật: Phase P07 (Phase Decisions)

Tài liệu này ghi nhận 32 quyết định kỹ thuật cốt lõi phát sinh trong quá trình thiết kế DDL Schema cho Phase P07.

---

## 1. Danh sách Quyết định Kỹ thuật Phase P07

| Mã Quyết định | Tiêu đề Quyết định | Trạng thái | Tóm tắt Nội dung |
| :--- | :--- | :---: | :--- |
| **`P07-DEC-001`** | **UUID Defaults:** | `ACCEPTED` | Sử dụng hàm chuẩn PostgreSQL `gen_random_uuid()` cho tất cả các bảng. |
| **`P07-DEC-002`** | **Actor FK Target:** | `ACCEPTED` | `created_by`, `updated_by`, `deleted_by` tham chiếu trực tiếp `auth.users(id)`. |
| **`P07-DEC-003`** | **Actor FK Action:** | `ACCEPTED` | Sử dụng `ON DELETE SET NULL` để không làm mất dữ liệu gia phả lịch sử khi xóa tài khoản user. |
| **`P07-DEC-004`** | **Family Tree Delete:** | `ACCEPTED` | `persons`, `unions`, `parent_child_relationships` sử dụng `ON DELETE RESTRICT` với `family_trees`. |
| **`P07-DEC-005`** | **Tree Membership PK:** | `ACCEPTED` | Sử dụng surrogate `UUID PRIMARY KEY` kết hợp Partial Unique Index `(tree_id, user_id) WHERE deleted_at IS NULL`. |
| **`P07-DEC-006`** | **Membership Role:** | `ACCEPTED` | Sử dụng PostgreSQL Enum `membership_role` (`owner`, `admin`, `editor`, `viewer`). |
| **`P07-DEC-007`** | **Membership Status:** | `ACCEPTED` | Sử dụng PostgreSQL Enum `membership_status` (`active`, `invited`, `suspended`). |
| **`P07-DEC-008`** | **Tree Status:** | `ACCEPTED` | Sử dụng PostgreSQL Enum `tree_status` (`active`, `archived`). |
| **`P07-DEC-009`** | **Privacy Level:** | `ACCEPTED` | Sử dụng PostgreSQL Enum `tree_privacy_level` (`private`, `public`), mặc định `private`. |
| **`P07-DEC-010`** | **Generation Anchor Delete:** | `ACCEPTED` | Khóa ngoại anchor sử dụng `ON DELETE SET NULL` trên `family_trees`. |
| **`P07-DEC-011`** | **Person Gender:** | `ACCEPTED` | Sử dụng PostgreSQL Enum `gender_type` (`male`, `female`, `other`, `unknown`). |
| **`P07-DEC-012`** | **Living Status:** | `ACCEPTED` | Sử dụng PostgreSQL Enum `living_status_type` (`living`, `deceased`, `unknown`). |
| **`P07-DEC-013`** | **Verification Status:** | `ACCEPTED` | Sử dụng PostgreSQL Enum `verification_status_type` (`unverified`, `verified`, `disputed`). |
| **`P07-DEC-014`** | **Partial Date Model:** | `ACCEPTED` | Phân tách `birth_date` (exact), `birth_year` (smallint), `birth_date_precision`, `birth_is_estimated`. |
| **`P07-DEC-015`** | **Estimated Flag:** | `ACCEPTED` | Tách cờ `is_estimated` độc lập khỏi `date_precision_type`. |
| **`P07-DEC-016`** | **Month Precision:** | `ACCEPTED` | v0.1 hỗ trợ `exact`, `year`, `unknown`; định dạng tháng mở rộng qua service tương lai. |
| **`P07-DEC-017`** | **Normalized Name:** | `ACCEPTED` | Duy trì tự động qua Trigger `_system.maintain_person_normalized_name()` (lowercase, trim space). |
| **`P07-DEC-018`** | **Search Extensions:** | `ACCEPTED` | Không bật `pg_trgm`/`unaccent` sớm trong P07; chuyển giao cho Phase P16. |
| **`P07-DEC-019`** | **Parent Role & Kind:** | `ACCEPTED` | Enums `parent_role_type` (`father`, `mother`, `unspecified`) và `relationship_kind_type` (`biological`, `adoptive`, `step`, `foster`). |
| **`P07-DEC-020`** | **Same-Tree Enforcement:** | `ACCEPTED` | Cưỡng chế 100% CSDL bằng Composite FKs `(tree_id, parent_id)` và `(tree_id, child_id)`. |
| **`P07-DEC-021`** | **Self-Parent Check:** | `ACCEPTED` | Check constraint `chk_parent_child_not_self (parent_id <> child_id)`. |
| **`P07-DEC-022`** | **Cycle Detection:** | `ACCEPTED` | Cấm self-link ở database; Cycle Detection toàn graph được ghi `DEFERRED_INVARIANT` cho Phase P13. |
| **`P07-DEC-023`** | **Union Status:** | `ACCEPTED` | Enum `union_status_type` (`active`, `separated`, `divorced`, `widowed`, `former`). |
| **`P07-DEC-024`** | **Union Dates:** | `ACCEPTED` | Hỗ trợ start/end date & year kèm check `end_date >= start_date`. |
| **`P07-DEC-025`** | **Union Member Role:** | `ACCEPTED` | Enum `union_member_role_type` (`spouse`, `partner`, `unspecified`). |
| **`P07-DEC-026`** | **Union Members Max:** | `ACCEPTED` | Unique partial `(union_id, person_id)`; quy tắc giới hạn tối đa 2 người ghi `DEFERRED_INVARIANT` cho Phase P13. |
| **`P07-DEC-027`** | **Soft Delete Semantics:** | `ACCEPTED` | Cột `deleted_at`, `deleted_by` trên tất cả các bảng nghiệp vụ. |
| **`P07-DEC-028`** | **Optimistic Concurrency:**| `ACCEPTED` | Cột `version integer NOT NULL DEFAULT 1 CHECK (version > 0)` do application service tăng. |
| **`P07-DEC-029`** | **RLS Baseline:** | `ACCEPTED` | Bật `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` deny-by-default, không tạo business policy trong P07. |
| **`P07-DEC-030`** | **Trigger Schema:** | `ACCEPTED` | Helper function `set_updated_at` và `normalize_person_name` đặt trong schema `_system`. |
| **`P07-DEC-031`** | **Database Tests:** | `ACCEPTED` | Xây dựng 5 pgTAP suites trong `supabase/tests/` và TypeScript type tests trong Vitest. |
| **`P07-DEC-032`** | **Cloud Migration Push:** | `ACCEPTED` | Không push migration tự động lên Cloud; sẵn sàng áp dụng qua P06 runbook khi cần. |
