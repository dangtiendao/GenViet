# Chi tiết Danh mục Task: Phase P07 (Task Breakdown)

Tài liệu này theo dõi chi tiết 32 tasks (`P07-T01` đến `P07-T32`) trong Phase P07.

---

## Bảng Phân bổ 32 Tasks Phase P07

| Mã Task | Tên Task Kỹ thuật | Gói công việc | Trạng thái | Tệp tin Đầu ra Chính |
| :--- | :--- | :---: | :---: | :--- |
| **`P07-T01`** | Tạo profiles | `WP02` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T02`** | Tạo family_trees | `WP02` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T03`** | Tạo tree_memberships | `WP02` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T04`** | Tạo trạng thái gia phả (tree_status) | `WP02` | `DONE` | [`docs/database/enum-and-lookup-decisions.md`](../../database/enum-and-lookup-decisions.md) |
| **`P07-T05`** | Tạo cấu hình quyền riêng tư (tree_privacy_level)| `WP02` | `DONE` | [`docs/database/enum-and-lookup-decisions.md`](../../database/enum-and-lookup-decisions.md) |
| **`P07-T06`** | Tạo mốc đánh số đời (Generation Anchor) | `WP02` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T07`** | Tạo persons | `WP03` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T08`** | Thêm tên chuẩn hóa (normalized_name) | `WP03` | `DONE` | `_system.maintain_person_normalized_name()` |
| **`P07-T09`** | Thêm trạng thái còn sống (living_status) | `WP03` | `DONE` | `living_status_type` Enum |
| **`P07-T10`** | Thêm ngày sinh (birth_date, birth_year) | `WP03` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T11`** | Thêm độ chính xác ngày sinh (birth_date_precision) | `WP03` | `DONE` | `date_precision_type` Enum & Check Constraints |
| **`P07-T12`** | Thêm ngày mất (death_date, death_year) | `WP03` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T13`** | Thêm độ chính xác ngày mất (death_date_precision) | `WP03` | `DONE` | `date_precision_type` Enum & Check Constraints |
| **`P07-T14`** | Thêm thông tin địa điểm dạng text | `WP03` | `DONE` | `birth_place_text`, `death_place_text`, `hometown_text`, `burial_place_text` |
| **`P07-T15`** | Thêm tiểu sử (biography) | `WP03` | `DONE` | `biography TEXT NULL` |
| **`P07-T16`** | Thêm trạng thái xác minh (verification_status) | `WP03` | `DONE` | `verification_status_type` Enum |
| **`P07-T17`** | Thêm xóa mềm (deleted_at, deleted_by) | `WP03` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T18`** | Thêm version chống ghi đè lạc quan | `WP03` | `DONE` | `version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0)` |
| **`P07-T19`** | Tạo parent_child_relationships | `WP04` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T20`** | Tạo unions | `WP04` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T21`** | Tạo union_members | `WP04` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T22`** | Chốt enum hoặc lookup table | `WP05` | `DONE` | [`docs/database/enum-and-lookup-decisions.md`](../../database/enum-and-lookup-decisions.md) |
| **`P07-T23`** | Tạo foreign keys | `WP05` | `DONE` | [`docs/database/referential-actions.md`](../../database/referential-actions.md) |
| **`P07-T24`** | Tạo check constraints | `WP05` | `DONE` | `20260829154907_p07_create_core_genealogy_schema.sql` |
| **`P07-T25`** | Tạo unique indexes | `WP05` | `DONE` | [`docs/database/indexing-strategy.md`](../../database/indexing-strategy.md) |
| **`P07-T26`** | Tạo index theo tree_id | `WP05` | `DONE` | [`docs/database/indexing-strategy.md`](../../database/indexing-strategy.md) |
| **`P07-T27`** | Tạo index truy vấn graph | `WP05` | `DONE` | [`docs/database/indexing-strategy.md`](../../database/indexing-strategy.md) |
| **`P07-T28`** | Tạo timestamp và actor fields | `WP05` | `DONE` | [`docs/database/timestamp-and-actor-policy.md`](../../database/timestamp-and-actor-policy.md) |
| **`P07-T29`** | Tạo trigger cập nhật updated_at | `WP05` | `DONE` | `_system.set_updated_at()` |
| **`P07-T30`** | Kiểm thử cascade và restrict | `WP06` | `DONE` | `supabase/tests/00300_referential_actions.test.sql` |
| **`P07-T31`** | Tạo sơ đồ ERD | `WP07` | `DONE` | [`docs/database/erd.md`](../../database/erd.md) |
| **`P07-T32`** | Tạo data dictionary | `WP07` | `DONE` | [`docs/database/data-dictionary.md`](../../database/data-dictionary.md) |
