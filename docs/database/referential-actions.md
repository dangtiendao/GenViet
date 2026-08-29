# Ma trận Hành vi Khóa ngoại & Toàn vẹn Dữ liệu (Referential Actions Matrix)

- **Mã tài liệu:** `DB-REF-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `LOCKED`

---

## 1. Ma trận Hành vi Khóa ngoại (Foreign Key Actions)

| Bảng Nguồn (Child) | Cột Khóa ngoại | Bảng Đích (Parent) | Hành vi `ON DELETE` | Lý do & Bảo vệ Toàn vẹn |
| :--- | :--- | :--- | :---: | :--- |
| **`profiles`** | `id` | `auth.users(id)` | **`CASCADE`** | Xóa tài khoản auth sẽ tự động xóa profile ứng dụng. |
| **`tree_memberships`** | `tree_id` | `family_trees(id)` | **`CASCADE`** | Xóa Family Tree sẽ xóa toàn bộ danh sách thành viên liên kết. |
| **`tree_memberships`** | `user_id` | `auth.users(id)` | **`CASCADE`** | Xóa tài khoản người dùng sẽ giải phóng membership. |
| **`persons`** | `tree_id` | `family_trees(id)` | **`RESTRICT`** | Chặn xóa vật lý Family Tree khi vẫn còn dữ liệu Persons bên trong. |
| **`family_trees`** | `(id, generation_anchor_person_id)`| `persons(tree_id, id)` | **`SET NULL`** | Nếu Person làm mốc Đời 1 bị xóa, mốc anchor trở về NULL (an toàn). |
| **`parent_child_relationships`** | `(tree_id, parent_id)` | `persons(tree_id, id)` | **`RESTRICT`** | Chặn xóa vật lý Person cha/mẹ khi còn liên kết huyết thống. |
| **`parent_child_relationships`** | `(tree_id, child_id)` | `persons(tree_id, id)` | **`RESTRICT`** | Chặn xóa vật lý Person con khi còn liên kết huyết thống. |
| **`unions`** | `tree_id` | `family_trees(id)` | **`RESTRICT`** | Chặn xóa Family Tree khi còn quan hệ hôn nhân. |
| **`union_members`** | `(tree_id, union_id)` | `unions(tree_id, id)` | **`CASCADE`** | Xóa Union aggregate sẽ tự động dọn dẹp các bản ghi liên kết thành viên. |
| **`union_members`** | `(tree_id, person_id)` | `persons(tree_id, id)` | **`RESTRICT`** | Chặn xóa Person khi vẫn đang nằm trong Union active. |
| **Mọi bảng nghiệp vụ** | `created_by`, `updated_by`, `deleted_by` | `auth.users(id)` | **`SET NULL`** | Xóa tài khoản người dùng không làm mất hoặc cascade xóa dữ liệu gia phả lịch sử. |

---

## 2. Nguyên tắc Cô lập Cùng Cây (Same-Tree Isolation Enforcement)
Mọi liên kết giữa Person $\rightarrow$ Person (trong `parent_child_relationships`), Union $\rightarrow$ Person (trong `union_members`), và Family Tree $\rightarrow$ Person (trong `generation_anchor_person_id`) đều sử dụng **Composite Foreign Keys kết hợp `tree_id`**. Điều này bảo đảm 100% CSDL từ chối các thao tác vô tình liên kết nhân vật thuộc Cây A với nhân vật thuộc Cây B.
