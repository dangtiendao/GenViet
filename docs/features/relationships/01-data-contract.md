# Data Contract: Relationship Management

## 1. Schema Bảng `public.parent_child_relationships`

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mặc Định | Ràng Buộc / Ghi Chú |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | NO | `gen_random_uuid()` | Khóa chính |
| `tree_id` | `UUID` | NO | - | FK tới `family_trees(id)` |
| `parent_id` | `UUID` | NO | - | FK tới `persons(tree_id, id)` |
| `child_id` | `UUID` | NO | - | FK tới `persons(tree_id, id)` |
| `parent_role` | `parent_role_type` | NO | `'unspecified'` | `'father'`, `'mother'`, `'unspecified'` |
| `relationship_kind` | `relationship_kind_type` | NO | `'biological'` | `'biological'`, `'adoptive'`, `'step'`, `'foster'` |
| `verification_status`| `verification_status_type` | NO | `'unverified'` | `'unverified'`, `'verified'`, `'disputed'` |
| `notes` | `TEXT` | YES | `NULL` | Ghi chú tư liệu |
| `version` | `INTEGER` | NO | `1` | Optimistic Concurrency version |
| `created_at` | `TIMESTAMPTZ` | NO | `now()` | Thời điểm tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `now()` | Thời điểm sửa |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm xóa mềm |

**Ràng buộc mức bảng:**
- `CONSTRAINT chk_parent_child_not_self CHECK (parent_id <> child_id)`: Chặn tuyệt đối self-parent.
- `UNIQUE INDEX idx_parent_child_active_unique ON (tree_id, parent_id, child_id, relationship_kind, parent_role) WHERE deleted_at IS NULL`: Chặn quan hệ trùng lặp chính xác.

---

## 2. Schema Bảng `public.unions` & `public.union_members`

### Bảng `public.unions`
| Tên Cột | Kiểu Dữ Liệu | Nullable | Mặc Định | Ghi Chú |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | NO | `gen_random_uuid()` | Khóa chính |
| `tree_id` | `UUID` | NO | - | FK tới `family_trees(id)` |
| `status` | `union_status_type` | NO | `'active'` | `'active'`, `'separated'`, `'divorced'`, `'widowed'`, `'former'` |
| `start_date` / `start_year` | `DATE` / `SMALLINT` | YES | `NULL` | Ngày/Năm bắt đầu hôn nhân |
| `end_date` / `end_year` | `DATE` / `SMALLINT` | YES | `NULL` | Ngày/Năm kết thúc hôn nhân |
| `version` | `INTEGER` | NO | `1` | Số phiên bản Optimistic Concurrency |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm xóa mềm |

### Bảng `public.union_members`
| Tên Cột | Kiểu Dữ Liệu | Nullable | Mặc Định | Ghi Chú |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | NO | `gen_random_uuid()` | Khóa chính |
| `tree_id` | `UUID` | NO | - | FK tới `family_trees(id)` |
| `union_id` | `UUID` | NO | - | FK tới `unions(tree_id, id)` |
| `person_id` | `UUID` | NO | - | FK tới `persons(tree_id, id)` |
| `member_role` | `union_member_role_type` | NO | `'spouse'` | `'spouse'`, `'partner'`, `'unspecified'` |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Thời điểm xóa mềm |
