# Chi tiết Danh mục Task: Phase P11 (Task Breakdown)

Tài liệu này theo dõi chi tiết 18 tasks (`P11-T01` đến `P11-T18`) trong Phase P11.

---

## Bảng Phân bổ 18 Tasks Phase P11

| Mã Task | Tên Task Kỹ thuật | Gói công việc | Trạng thái | Tệp tin Đầu ra Chính |
| :--- | :--- | :---: | :---: | :--- |
| **`P11-T01`** | Trang danh sách gia phả | `WP03` | `DONE` | `src/app/(dashboard)/trees/page.tsx` & `family-tree-list.tsx` |
| **`P11-T02`** | Form tạo gia phả | `WP03` | `DONE` | `src/app/(dashboard)/trees/new/page.tsx` & `family-tree-form.tsx` |
| **`P11-T03`** | Validation tên gia phả | `WP02` | `DONE` | `src/features/family-trees/schemas/family-tree.schema.ts` |
| **`P11-T04`** | Transaction tạo gia phả | `WP02` | `DONE` | `supabase/migrations/..._create_family_tree.sql` |
| **`P11-T05`** | Tự tạo owner membership | `WP02` | `DONE` | RPC `public.create_family_tree` |
| **`P11-T06`** | Trang tổng quan gia phả | `WP04` | `DONE` | `src/app/(dashboard)/trees/[treeId]/page.tsx` & `overview.tsx` |
| **`P11-T07`** | Sửa tên cây gia phả | `WP05` | `DONE` | `src/features/family-trees/services/family-tree.service.ts` |
| **`P11-T08`** | Sửa mô tả cây gia phả | `WP05` | `DONE` | `src/features/family-trees/services/family-tree.service.ts` |
| **`P11-T09`** | Cấu hình quyền riêng tư | `WP05` | `DONE` | `src/features/family-trees/services/family-tree.service.ts` |
| **`P11-T10`** | Chọn người mặc định | `WP05` | `DEFERRED` | Phân định với Mốc số đời (Không có cột `default_person_id` trong P07) |
| **`P11-T11`** | Chọn mốc số đời | `WP05` | `DONE` | `generation_anchor_person_id` trong settings form |
| **`P11-T12`** | Chuyển đổi giữa các gia phả | `WP04` | `DONE` | `src/features/family-trees/components/family-tree-switcher.tsx` |
| **`P11-T13`** | Xóa mềm gia phả | `WP06` | `DONE` | `src/features/family-trees/components/delete-family-tree-dialog.tsx` |
| **`P11-T14`** | Khôi phục gia phả | `WP06` | `DONE` | `public.restore_family_tree` & `src/app/(dashboard)/trees/trash/` |
| **`P11-T15`** | Xóa vĩnh viễn có xác thực lại | `WP07` | `DEFERRED_FOR_SAFETY` | Ghi nhận an toàn dữ liệu, yêu cầu Reauth/Backup/Audit |
| **`P11-T16`** | Empty state khi chưa có gia phả | `WP03` | `DONE` | `src/features/family-trees/components/family-tree-empty-state.tsx` |
| **`P11-T17`** | Kiểm thử quyền owner | `WP08` | `DONE` | `tests/unit/family-trees/`, `supabase/tests/`, Playwright E2E |
| **`P11-T18`** | Kiểm thử cross-tree | `WP08` | `DONE` | `tests/unit/family-trees/`, `supabase/tests/`, Playwright E2E |
