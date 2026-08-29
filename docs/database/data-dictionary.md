# Từ điển Dữ liệu Cơ sở Dữ liệu Lõi (Data Dictionary)

- **Mã tài liệu:** `DB-DICT-01`
- **Phiên bản:** `v0.1-baseline`
- **Migration nguồn:** `20260829154907_p07_create_core_genealogy_schema.sql`
- **Ngày cập nhật:** 2026-08-29

---

## 1. Danh mục 7 Bảng CSDL Lõi

### 1.1. Bảng `public.profiles`
- **Mục đích:** Lưu trữ thông tin mở rộng của tài khoản người dùng đăng nhập (`auth.users`).
- **Primary Key:** `id UUID` (Maps 1:1 tới `auth.users(id)`).
- **Foreign Keys:** `id` $\rightarrow$ `auth.users(id)` (`ON DELETE CASCADE`).
- **RLS Status:** Bật (`deny-by-default` cho P07).
- **Soft Delete:** Không (Vòng đời gắn liền với tài khoản `auth.users`).

| Tên Cột | Kiểu Dữ liệu | Nullable | Mặc định | Ý nghĩa & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | ❌ | | Khóa chính, tham chiếu 1:1 `auth.users(id)` |
| `display_name` | `TEXT` | ❌ | | Tên hiển thị người dùng (Không được rỗng sau trim) |
| `avatar_path` | `TEXT` | ✅ | `NULL` | Đường dẫn file avatar trong Supabase Storage Bucket |
| `created_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm tạo bản ghi (UTC) |
| `updated_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm cập nhật cuối cùng (UTC, Trigger) |

---

### 1.2. Bảng `public.family_trees`
- **Mục đích:** Thực thể gốc quản lý không gian một cây gia phả và ranh giới quyền riêng tư.
- **Primary Key:** `id UUID`.
- **Foreign Keys:**
  - `generation_anchor_person_id` $\rightarrow$ `persons(tree_id, id)` (`ON DELETE SET NULL`)
  - `created_by`, `updated_by`, `deleted_by` $\rightarrow$ `auth.users(id)` (`ON DELETE SET NULL`)
- **RLS Status:** Bật (`deny-by-default` cho P07).
- **Soft Delete:** Có (`deleted_at`, `deleted_by`).

| Tên Cột | Kiểu Dữ liệu | Nullable | Mặc định | Ý nghĩa & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | ❌ | `gen_random_uuid()` | Khóa chính duy nhất của cây gia phả |
| `name` | `TEXT` | ❌ | | Tên cây gia phả (Không được rỗng sau trim) |
| `description` | `TEXT` | ✅ | `NULL` | Mô tả chi tiết về dòng họ / nguồn gốc |
| `status` | `tree_status` | ❌ | `'active'` | Trạng thái: `active`, `archived` |
| `privacy_level` | `tree_privacy_level` | ❌ | `'private'` | Mức độ riêng tư: `private`, `public` |
| `generation_anchor_person_id`| `UUID` | ✅ | `NULL` | Khóa ngoại trỏ tới Person làm mốc Đời 1 (cùng tree) |
| `created_by` | `UUID` | ✅ | `NULL` | Người tạo bản ghi (`auth.users(id)`) |
| `updated_by` | `UUID` | ✅ | `NULL` | Người cập nhật bản ghi (`auth.users(id)`) |
| `deleted_by` | `UUID` | ✅ | `NULL` | Người thực hiện xóa mềm (`auth.users(id)`) |
| `created_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm tạo bản ghi (UTC) |
| `updated_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm cập nhật cuối cùng (UTC, Trigger) |
| `deleted_at` | `TIMESTAMPTZ` | ✅ | `NULL` | Thời điểm xóa mềm (NULL = đang hoạt động) |
| `version` | `INTEGER` | ❌ | `1` | Phiên bản khóa lạc quan (CHECK `version > 0`) |

---

### 1.3. Bảng `public.tree_memberships`
- **Mục đích:** Quản lý quyền truy cập và vai trò của người dùng trên từng cây gia phả.
- **Primary Key:** `id UUID`.
- **Foreign Keys:**
  - `tree_id` $\rightarrow$ `family_trees(id)` (`ON DELETE CASCADE`)
  - `user_id` $\rightarrow$ `auth.users(id)` (`ON DELETE CASCADE`)
- **Indexes:** Partial unique index trên `(tree_id, user_id)` WHERE `deleted_at IS NULL`.

| Tên Cột | Kiểu Dữ liệu | Nullable | Mặc định | Ý nghĩa & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | ❌ | `gen_random_uuid()` | Khóa chính duy nhất của quan hệ thành viên |
| `tree_id` | `UUID` | ❌ | | Tham chiếu cây gia phả (`family_trees(id)`) |
| `user_id` | `UUID` | ❌ | | Tham chiếu tài khoản người dùng (`auth.users(id)`) |
| `role` | `membership_role`| ❌ | `'viewer'` | Vai trò: `owner`, `admin`, `editor`, `viewer` |
| `status` | `membership_status`| ❌| `'active'` | Trạng thái: `active`, `invited`, `suspended` |
| `created_by` | `UUID` | ✅ | `NULL` | Người tạo bản ghi |
| `updated_by` | `UUID` | ✅ | `NULL` | Người cập nhật bản ghi |
| `deleted_by` | `UUID` | ✅ | `NULL` | Người xóa mềm |
| `created_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm tạo |
| `updated_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | ✅ | `NULL` | Thời điểm xóa mềm |
| `version` | `INTEGER` | ❌ | `1` | Phiên bản lạc quan (`> 0`) |

---

### 1.4. Bảng `public.persons`
- **Mục đích:** Lưu trữ hồ sơ nhân vật / thành viên gia phả trong cây.
- **Primary Key:** `id UUID`.
- **Composite Unique:** `(tree_id, id)` (Bắt buộc để phục vụ Same-tree Composite Foreign Keys).
- **Constraints:**
  - `death_date >= birth_date` (khi cả 2 đều exact).
  - `death_year >= birth_year` (khi không ước tính).
  - Ràng buộc nhất quán giữa precision và dữ liệu ngày tháng.

| Tên Cột | Kiểu Dữ liệu | Nullable | Mặc định | Ý nghĩa & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | ❌ | `gen_random_uuid()` | Khóa chính định danh nhân vật |
| `tree_id` | `UUID` | ❌ | | Cây gia phả sở hữu nhân vật |
| `full_name` | `TEXT` | ❌ | | Họ và tên đầy đủ |
| `normalized_name` | `TEXT` | ❌ | | Tên chuẩn hóa (chữ thường, trim space) |
| `gender` | `gender_type` | ❌ | `'unknown'` | Giới tính: `male`, `female`, `other`, `unknown` |
| `living_status` | `living_status_type`| ❌ | `'unknown'` | Trạng thái: `living`, `deceased`, `unknown` |
| `birth_date` | `DATE` | ✅ | `NULL` | Ngày sinh chính xác |
| `birth_year` | `SMALLINT` | ✅ | `NULL` | Năm sinh (100 - 2500) |
| `birth_date_precision`| `date_precision_type`| ❌| `'unknown'`| Độ chính xác ngày sinh: `exact`, `year`, `unknown` |
| `birth_is_estimated` | `BOOLEAN` | ❌ | `false` | Cờ đánh dấu ngày sinh ước tính |
| `death_date` | `DATE` | ✅ | `NULL` | Ngày mất chính xác |
| `death_year` | `SMALLINT` | ✅ | `NULL` | Năm mất (100 - 2500) |
| `death_date_precision`| `date_precision_type`| ❌| `'unknown'`| Độ chính xác ngày mất: `exact`, `year`, `unknown` |
| `death_is_estimated` | `BOOLEAN` | ❌ | `false` | Cờ đánh dấu ngày mất ước tính |
| `birth_place_text` | `TEXT` | ✅ | `NULL` | Nơi sinh (text tự do) |
| `death_place_text` | `TEXT` | ✅ | `NULL` | Nơi mất (text tự do) |
| `hometown_text` | `TEXT` | ✅ | `NULL` | Quê quán / Nguyên quán |
| `burial_place_text` | `TEXT` | ✅ | `NULL` | Nơi an táng / Mộ phần |
| `occupation_text` | `TEXT` | ✅ | `NULL` | Nghề nghiệp / Chức vị |
| `biography` | `TEXT` | ✅ | `NULL` | Tiểu sử tóm tắt (Plain text) |
| `verification_status` | `verification_status_type`| ❌| `'unverified'`| Trạng thái xác minh: `unverified`, `verified`, `disputed` |
| `created_by` | `UUID` | ✅ | `NULL` | Người tạo bản ghi |
| `updated_by` | `UUID` | ✅ | `NULL` | Người cập nhật |
| `deleted_by` | `UUID` | ✅ | `NULL` | Người xóa mềm |
| `created_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm tạo |
| `updated_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm cập nhật (Trigger) |
| `deleted_at` | `TIMESTAMPTZ` | ✅ | `NULL` | Thời điểm xóa mềm |
| `version` | `INTEGER` | ❌ | `1` | Phiên bản lạc quan (`> 0`) |

---

### 1.5. Bảng `public.parent_child_relationships`
- **Mục đích:** Lưu trữ cạnh đồ thị huyết thống cha/mẹ - con.
- **Foreign Keys:**
  - `(tree_id, parent_id)` $\rightarrow$ `persons(tree_id, id)` (`ON DELETE RESTRICT`)
  - `(tree_id, child_id)` $\rightarrow$ `persons(tree_id, id)` (`ON DELETE RESTRICT`)
- **Check Constraint:** `parent_id <> child_id` (Cấm tự liên kết làm cha/mẹ chính mình).

| Tên Cột | Kiểu Dữ liệu | Nullable | Mặc định | Ý nghĩa & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | ❌ | `gen_random_uuid()` | Khóa chính |
| `tree_id` | `UUID` | ❌ | | Cây gia phả sở hữu |
| `parent_id` | `UUID` | ❌ | | ID của cha hoặc mẹ (cùng cây) |
| `child_id` | `UUID` | ❌ | | ID của con (cùng cây) |
| `parent_role` | `parent_role_type` | ❌ | `'unspecified'` | Vai trò: `father`, `mother`, `unspecified` |
| `relationship_kind`| `relationship_kind_type`| ❌ | `'biological'` | Loại quan hệ: `biological`, `adoptive`, `step`, `foster` |
| `verification_status`| `verification_status_type`| ❌| `'unverified'`| Trạng thái xác minh |
| `notes` | `TEXT` | ✅ | `NULL` | Ghi chú thêm về quan hệ |
| `created_by` | `UUID` | ✅ | `NULL` | Người tạo |
| `updated_by` | `UUID` | ✅ | `NULL` | Người cập nhật |
| `deleted_by` | `UUID` | ✅ | `NULL` | Người xóa mềm |
| `created_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm tạo |
| `updated_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | ✅ | `NULL` | Thời điểm xóa mềm |
| `version` | `INTEGER` | ❌ | `1` | Phiên bản lạc quan (`> 0`) |

---

### 1.6. Bảng `public.unions`
- **Mục đích:** Thực thể đại diện cho một mối quan hệ hôn nhân hoặc kết đôi.
- **Composite Unique:** `(tree_id, id)`.

| Tên Cột | Kiểu Dữ liệu | Nullable | Mặc định | Ý nghĩa & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | ❌ | `gen_random_uuid()` | Khóa chính quan hệ hôn nhân |
| `tree_id` | `UUID` | ❌ | | Cây gia phả sở hữu |
| `status` | `union_status_type`| ❌ | `'active'` | Trạng thái: `active`, `separated`, `divorced`, `widowed`, `former` |
| `start_date` | `DATE` | ✅ | `NULL` | Ngày bắt đầu hôn nhân |
| `start_year` | `SMALLINT` | ✅ | `NULL` | Năm bắt đầu hôn nhân |
| `start_date_precision`| `date_precision_type`| ❌| `'unknown'`| Độ chính xác ngày bắt đầu |
| `end_date` | `DATE` | ✅ | `NULL` | Ngày kết thúc hôn nhân |
| `end_year` | `SMALLINT` | ✅ | `NULL` | Năm kết thúc hôn nhân |
| `end_date_precision`| `date_precision_type`| ❌| `'unknown'`| Độ chính xác ngày kết thúc |
| `notes` | `TEXT` | ✅ | `NULL` | Ghi chú |
| `verification_status`| `verification_status_type`| ❌| `'unverified'`| Trạng thái xác minh |
| `created_by` | `UUID` | ✅ | `NULL` | Người tạo |
| `updated_by` | `UUID` | ✅ | `NULL` | Người cập nhật |
| `deleted_by` | `UUID` | ✅ | `NULL` | Người xóa mềm |
| `created_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm tạo |
| `updated_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | ✅ | `NULL` | Thời điểm xóa mềm |
| `version` | `INTEGER` | ❌ | `1` | Phiên bản lạc quan (`> 0`) |

---

### 1.7. Bảng `public.union_members`
- **Mục đích:** Liên kết thành viên Person với Union aggregate.
- **Foreign Keys:**
  - `(tree_id, union_id)` $\rightarrow$ `unions(tree_id, id)` (`ON DELETE CASCADE`)
  - `(tree_id, person_id)` $\rightarrow$ `persons(tree_id, id)` (`ON DELETE RESTRICT`)
- **Indexes:** Partial unique index trên `(union_id, person_id)` WHERE `deleted_at IS NULL`.

| Tên Cột | Kiểu Dữ liệu | Nullable | Mặc định | Ý nghĩa & Ràng buộc |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | ❌ | `gen_random_uuid()` | Khóa chính |
| `tree_id` | `UUID` | ❌ | | Cây gia phả sở hữu |
| `union_id` | `UUID` | ❌ | | ID quan hệ hôn nhân (`unions(tree_id, id)`) |
| `person_id` | `UUID` | ❌ | | ID nhân vật kết đôi (`persons(tree_id, id)`) |
| `member_role` | `union_member_role_type`| ❌ | `'spouse'` | Vai trò: `spouse`, `partner`, `unspecified` |
| `created_by` | `UUID` | ✅ | `NULL` | Người tạo |
| `created_at` | `TIMESTAMPTZ` | ❌ | `timezone('utc', now())` | Thời điểm tạo |
| `deleted_at` | `TIMESTAMPTZ` | ✅ | `NULL` | Thời điểm xóa mềm |
| `deleted_by` | `UUID` | ✅ | `NULL` | Người xóa mềm |
