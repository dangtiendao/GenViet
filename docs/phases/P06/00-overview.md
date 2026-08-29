# Phase Overview: P06 - Thiết lập Supabase (Supabase Setup & Environment Foundation)

- **Mã Phase:** `P06`
- **Tên Phase:** Thiết lập Supabase & Môi trường Ban đầu
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE_WITH_MANUAL_CLOUD_ACTION`
- **Nhánh Git thi công:** `phase/p06-supabase-foundation`
- **Starting Commit:** `a2a3657` (Merge PR #5 for P05)
- **Vai trò thi công:** Principal Backend Engineer, Supabase Platform & Database DevOps Lead
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase P06

1. Khởi tạo cấu hình Supabase Local Development (`supabase init`, `supabase/config.toml`).
2. Cài đặt và khóa phiên bản Supabase CLI cục bộ trong `package.json` (`supabase@^2.116.0`).
3. Tạo migration nền tảng đầu tiên mang tính idempotent (`20260829152230_p06_initialize_supabase_foundation.sql`).
4. Ban hành quy tắc đặt tên và quản lý tính bất biến của migration ([`docs/database/migration-policy.md`](../../database/migration-policy.md)).
5. Tạo tệp tin `supabase/seed.sql` an toàn, không chứa dữ liệu giả mạo.
6. Thiết lập chiến lược phân tách 4 môi trường CSDL ([`docs/database/environment-strategy.md`](../../database/environment-strategy.md)).
7. Bảo vệ database credentials, phân định biến môi trường public vs server-only trong Zod schema.
8. Xây dựng browser client (`src/lib/supabase/client.ts`), server client (`src/lib/supabase/server.ts`) và admin client (`src/lib/supabase/admin.ts`).
9. Thiết lập cơ chế tự động sinh TypeScript Database Types (`src/lib/supabase/database.types.ts`).
10. Xây dựng bộ script kiểm tra migration, sinh types, reset CSDL và guarded migration push.
11. Ban hành chính sách cấm sửa schema ngoài migration và cẩm nang sao lưu / triển khai production.
12. Hướng dẫn thiết lập và liên kết Supabase Cloud Development Project (`genviet-dev`).
13. **Tuyệt đối không triển khai schema nghiệp vụ P07, RLS P08, Auth flow P09.**

---

## 2. Phạm vi Thi công (Scope of Work)

### Trong phạm vi (In-Scope):
- Cấu hình Supabase local CLI và template `config.toml`.
- Migration nền tảng `_system` metadata và `seed.sql`.
- Client factories `@supabase/ssr` cho App Router (Browser, Server, Admin).
- Generated TypeScript types và scripts tự động hóa.
- 10 tài liệu quản trị CSDL tại `docs/database/`.
- Hoàn thiện bộ hồ sơ 10 tài liệu phase P06 tại `docs/phases/P06/`.

### Ngoài phạm vi (Out-of-Scope):
- ❌ Không tạo schema bảng nghiệp vụ P07 (`profiles`, `family_trees`, `persons`, `relationships`).
- ❌ Không tạo policies phân quyền RLS nghiệp vụ P08.
- ❌ Không triển khai màn hình đăng nhập hoặc Auth callback P09.
- ❌ Không tạo Cloudflare/Vercel live deployment.
- ❌ Không push Git lên remote repository.
