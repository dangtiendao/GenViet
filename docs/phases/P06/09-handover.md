# Tài liệu Bàn giao Kỹ thuật: Phase P06 sang Phase P07 (Handover - Cổng G7)

- **Phase Bàn giao:** `P06: Thiết lập Supabase & Môi trường Ban đầu` - Trạng thái: `IMPLEMENTATION_COMPLETE_WITH_MANUAL_CLOUD_ACTION`
- **Phase Tiếp nhận:** `P07: CSDL Lõi & DDL Schema`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Principal Backend Engineer & Supabase Platform Lead (P06)

---

## 1. Tóm tắt Hiện trạng Kỹ thuật Bàn giao cho Phase P07

1. **Hạ tầng CSDL & CLI:**
   - Supabase CLI: Đã khóa phiên bản `supabase@^2.116.0` trong `package.json`.
   - Local Configuration: `supabase/config.toml` đã cấu hình sẵn sàng.
   - Migration Policy: Mọi file migration phải đặt tên theo định dạng `YYYYMMDDHHMMSS_<action>_<entity>.sql` ([`docs/database/migration-policy.md`](../../database/migration-policy.md)).
   - Hiện hữu: 1 file migration nền tảng `20260829152230_p06_initialize_supabase_foundation.sql`.
2. **TypeScript Database Types:**
   - File types: `src/lib/supabase/database.types.ts`.
   - Lệnh sinh lại types sau khi tạo bảng mới: `npm run supabase:types`.
   - Lệnh kiểm tra tính hợp lệ: `npm run supabase:types:check`.
3. **Clients Sẵn sàng:**
   - `src/lib/supabase/client.ts` (Browser Client).
   - `src/lib/supabase/server.ts` (Server Client).
   - `src/lib/supabase/admin.ts` (Admin Client).

---

## 2. Các Lệnh Kỹ thuật Phase P07 Nên Chạy Đầu Tiên

```bash
# 1. Kiểm tra trạng thái migration và types hiện tại
npm run supabase:check

# 2. Tạo file migration mới cho DDL Core Schema
npm run supabase:migrations:new p07_create_core_genealogy_schema

# 3. Chạy reset CSDL và sinh types sau khi viết SQL
npm run supabase:reset
npm run supabase:types
npm run check
```

---

## 3. Những Việc Phase P07 Được Phép & Không Được Phép Làm

### Được phép làm trong Phase P07:
- Tạo DDL Schema cho các bảng nghiệp vụ: `profiles`, `family_trees`, `tree_members`, `persons`, `relationships`, `unions`, `media_records`, `audit_logs`.
- Thêm các CHECK constraints, Foreign Keys, Unique Indexes, và Composite Indexes theo đặc tả P02 và P04.
- Bổ sung dữ liệu hạt giống kiểm thử vào `supabase/seed.sql`.
- Sinh lại `src/lib/supabase/database.types.ts` và viết unit tests cho schema.

### KHÔNG ĐƯỢC Giả định Đã Hoàn thành:
- ❌ KHÔNG giả định RLS policies nghiệp vụ đã được bật và test đầy đủ (RLS chi tiết thuộc Phase P08).
- ❌ KHÔNG tự ý chỉnh sửa schema bằng Supabase Dashboard SQL Editor ngoài file migration.
- ❌ KHÔNG commit file `.env.local` chứa secret.
