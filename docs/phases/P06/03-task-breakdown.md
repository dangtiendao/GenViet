# Chi tiết Danh mục Task: Phase P06 (Task Breakdown)

Tài liệu này theo dõi chi tiết 18 tasks (`P06-T01` đến `P06-T18`) trong Phase P06.

---

## Bảng Phân bổ 18 Tasks Phase P06

| Mã Task | Tên Task Kỹ thuật | Gói công việc | Trạng thái | Tệp tin Đầu ra Chính |
| :--- | :--- | :---: | :---: | :--- |
| **`P06-T01`** | Tạo Supabase Cloud Development Project | `WP06` | `MANUAL_ACTION_REQUIRED` | [`docs/database/supabase-cloud-setup.md`](../../database/supabase-cloud-setup.md) |
| **`P06-T02`** | Cài đặt Supabase CLI cục bộ | `WP02` | `DONE` | `package.json` (`supabase@^2.116.0`) |
| **`P06-T03`** | Khởi tạo Supabase Local Development | `WP02` | `DONE` | `supabase/config.toml`, `supabase/.gitignore` |
| **`P06-T04`** | Tạo Migration nền tảng đầu tiên | `WP03` | `DONE` | `supabase/migrations/20260829152230_p06_initialize_supabase_foundation.sql` |
| **`P06-T05`** | Chốt Quy tắc Đặt tên & Quản lý Migration | `WP03` | `DONE` | [`docs/database/migration-policy.md`](../../database/migration-policy.md) |
| **`P06-T06`** | Tạo Seed Development An toàn | `WP03` | `DONE` | `supabase/seed.sql` |
| **`P06-T07`** | Phân tách Môi trường Dev, Preview, Prod | `WP06` | `DONE` | [`docs/database/environment-strategy.md`](../../database/environment-strategy.md) |
| **`P06-T08`** | Cấu hình Database URL Server-Only | `WP04` | `DONE` | `src/lib/env/index.ts`, `.env.example` |
| **`P06-T09`** | Cấu hình Publishable Key cho Client | `WP04` | `DONE` | `src/lib/env/index.ts`, `.env.example` |
| **`P06-T10`** | Cấu hình Service-Role Key Phía Server | `WP04` | `DONE` | `src/lib/supabase/admin.ts`, `src/lib/env/index.ts` |
| **`P06-T11`** | Tạo Browser Supabase Client Typed | `WP04` | `DONE` | `src/lib/supabase/client.ts` |
| **`P06-T12`** | Tạo Server Supabase Client Typed với Cookies | `WP04` | `DONE` | `src/lib/supabase/server.ts` |
| **`P06-T13`** | Tạo Cơ chế Sinh TypeScript Database Types | `WP05` | `DONE` | `src/lib/supabase/database.types.ts`, `docs/database/type-generation.md` |
| **`P06-T14`** | Tạo Script Reset Database Local | `WP05` | `DONE` | `package.json` (`npm run supabase:reset`) |
| **`P06-T15`** | Tạo Script Guarded Push Migration | `WP05` | `DONE` | `package.json` (`npm run supabase:db:push:dev`) |
| **`P06-T16`** | Tạo Script Kiểm tra Tính hợp lệ Migration | `WP05` | `DONE` | `scripts/supabase/check-migrations.mjs` |
| **`P06-T17`** | Ban hành Chính sách Cấm Sửa Schema Thủ công | `WP07` | `DONE` | [`docs/database/schema-change-policy.md`](../../database/schema-change-policy.md) |
| **`P06-T18`** | Thiết lập Quy trình Sao lưu & Cẩm nang Production | `WP07` | `DONE` | [`docs/database/backup-before-migration.md`](../../database/backup-before-migration.md), [`production-migration-runbook.md`](../../database/production-migration-runbook.md) |
