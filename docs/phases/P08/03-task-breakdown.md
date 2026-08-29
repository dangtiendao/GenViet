# Chi tiết Danh mục Task: Phase P08 (Task Breakdown)

Tài liệu này theo dõi chi tiết 25 tasks (`P08-T01` đến `P08-T25`) trong Phase P08.

---

## Bảng Phân bổ 25 Tasks Phase P08

| Mã Task | Tên Task Kỹ thuật | Gói công việc | Trạng thái | Tệp tin Đầu ra Chính |
| :--- | :--- | :---: | :---: | :--- |
| **`P08-T01`** | Bật RLS trên toàn bộ bảng expose | `WP02` | `DONE` | `20260829160221_p08_add_rls_authorization_policies.sql` |
| **`P08-T02`** | Policy đọc profiles | `WP02` | `DONE` | `profiles_select_own` Policy |
| **`P08-T03`** | Policy cập nhật profiles | `WP02` | `DONE` | `profiles_update_own` Policy |
| **`P08-T04`** | Policy tạo gia phả | `WP03` | `DONE` | `family_trees_insert_authenticated` Policy |
| **`P08-T05`** | Policy đọc gia phả | `WP03` | `DONE` | `family_trees_select_members` Policy |
| **`P08-T06`** | Policy sửa gia phả | `WP03` | `DONE` | `family_trees_update_owners` Policy |
| **`P08-T07`** | Policy xóa gia phả | `WP03` | `DONE` | Soft delete via UPDATE Policy |
| **`P08-T08`** | Policy đọc membership | `WP03` | `DONE` | `tree_memberships_select_members` Policy |
| **`P08-T09`** | Policy quản lý membership | `WP03` | `DONE` | `tree_memberships_insert/update/delete_owners` |
| **`P08-T10`** | Policy đọc nhân vật | `WP04` | `DONE` | `persons_select_members` Policy |
| **`P08-T11`** | Policy tạo nhân vật | `WP04` | `DONE` | `persons_insert_writers` Policy |
| **`P08-T12`** | Policy sửa nhân vật | `WP04` | `DONE` | `persons_update_writers` Policy |
| **`P08-T13`** | Policy xóa mềm nhân vật | `WP04` | `DONE` | Soft delete via UPDATE Policy |
| **`P08-T14`** | Policy quan hệ cha mẹ và con | `WP05` | `DONE` | `parent_child_relationships_*` Policies |
| **`P08-T15`** | Policy hôn nhân | `WP05` | `DONE` | `unions_*` & `union_members_*` Policies |
| **`P08-T16`** | Ngăn đổi tree_id trái phép | `WP06` | `DONE` | `_system.prevent_immutable_columns_mutation()` |
| **`P08-T17`** | Ngăn người cây A truy cập cây B | `WP06` | `DONE` | [`docs/security/cross-tree-isolation.md`](../../security/cross-tree-isolation.md) |
| **`P08-T18`** | Ngăn viewer ghi dữ liệu | `WP06` | `DONE` | `_system.can_write_tree()` Policy Enforcements |
| **`P08-T19`** | Giới hạn owner-only action | `WP06` | `DONE` | [`docs/security/owner-only-actions.md`](../../security/owner-only-actions.md) |
| **`P08-T20`** | Viết test owner | `WP07` | `DONE` | `supabase/tests/01200_*.sql` & `01800_*.sql` |
| **`P08-T21`** | Viết test viewer | `WP07` | `DONE` | `supabase/tests/01200_*.sql` & `01400_*.sql` |
| **`P08-T22`** | Viết test người ngoài | `WP07` | `DONE` | `supabase/tests/01700_cross_tree_rls.test.sql` |
| **`P08-T23`** | Viết test cross-tree | `WP07` | `DONE` | `supabase/tests/01700_cross_tree_rls.test.sql` |
| **`P08-T24`** | Kiểm tra service-role không lộ client | `WP07` | `DONE` | `tests/security/service-role-exposure.test.ts` |
| **`P08-T25`** | Review hiệu năng policy | `WP08` | `DONE` | [`docs/security/rls-performance-review.md`](../../security/rls-performance-review.md) |
