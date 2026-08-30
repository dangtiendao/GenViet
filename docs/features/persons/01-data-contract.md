# Data Contract: Person Management

## 1. Schema Bảng `public.persons`

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mặc Định | Ràng Buộc / Ghi Chú |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | NO | `gen_random_uuid()` | Khóa chính (Primary Key) |
| `tree_id` | `UUID` | NO | - | Khóa ngoại tới `family_trees(id)` |
| `full_name` | `TEXT` | NO | - | `char_length(trim(full_name)) > 0`, max 100 |
| `normalized_name` | `TEXT` | NO | - | Duy trì tự động qua DB Trigger |
| `gender` | `gender_type` | NO | `'unknown'` | `'male'`, `'female'`, `'other'`, `'unknown'` |
| `living_status` | `living_status_type` | NO | `'unknown'` | `'living'`, `'deceased'`, `'unknown'` |
| `birth_date` | `DATE` | YES | `NULL` | Định dạng `YYYY-MM-DD` khi `precision = 'exact'` |
| `birth_year` | `SMALLINT` | YES | `NULL` | `100 <= birth_year <= 2500` khi `precision = 'year'` |
| `birth_date_precision` | `date_precision_type` | NO | `'unknown'` | `'exact'`, `'year'`, `'unknown'` |
| `birth_is_estimated` | `BOOLEAN` | NO | `false` | Cờ ước tính ngày sinh |
| `death_date` | `DATE` | YES | `NULL` | Định dạng `YYYY-MM-DD` khi `precision = 'exact'` |
| `death_year` | `SMALLINT` | YES | `NULL` | `100 <= death_year <= 2500` khi `precision = 'year'` |
| `death_date_precision` | `date_precision_type` | NO | `'unknown'` | `'exact'`, `'year'`, `'unknown'` |
| `death_is_estimated` | `BOOLEAN` | NO | `false` | Cờ ước tính ngày mất |
| `birth_place_text` | `TEXT` | YES | `NULL` | Nơi sinh |
| `death_place_text` | `TEXT` | YES | `NULL` | Nơi mất |
| `hometown_text` | `TEXT` | YES | `NULL` | Quê quán / Nguyên quán |
| `burial_place_text` | `TEXT` | YES | `NULL` | Nơi an táng / Mộ phần |
| `occupation_text` | `TEXT` | YES | `NULL` | Nghề nghiệp / Chức vị |
| `biography` | `TEXT` | YES | `NULL` | Tiểu sử phả ký (Plain text an toàn) |
| `verification_status` | `verification_status_type` | NO | `'unverified'` | `'unverified'`, `'verified'`, `'disputed'` |
| `created_by` | `UUID` | YES | `NULL` | `auth.users(id)` |
| `updated_by` | `UUID` | YES | `NULL` | `auth.users(id)` |
| `deleted_by` | `UUID` | YES | `NULL` | `auth.users(id)` |
| `created_at` | `TIMESTAMPTZ` | NO | `now()` | Thời điểm tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `now()` | Thời điểm sửa |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm xóa mềm |
| `version` | `INTEGER` | NO | `1` | Số phiên bản Optimistic Concurrency |
