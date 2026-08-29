# Kế hoạch Kiểm thử & Xác minh Hạ tầng: Phase P06 (Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các hạng mục kiểm tra, kịch bản đối soát chất lượng hạ tầng Supabase và kết quả thực thi cho Phase P06.

---

## 1. Kịch bản Kiểm thử Hạ tầng Supabase (Test Matrix)

### Nhóm 1: CLI & Cấu hình Local (CLI & Local Configuration)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **CLI-01** | Cài đặt và khóa phiên bản Supabase CLI | `supabase@^2.116.0` trong `package.json` | `npx supabase --version` | `PASS` |
| **CLI-02** | Khởi tạo file cấu hình Supabase | File `supabase/config.toml` tồn tại và hợp lệ | `npm run supabase:init` | `PASS` |
| **CLI-03** | Khởi tạo `.gitignore` cho Supabase | Bỏ qua `.branches/`, `.temp/`, `.backups/` | Kiểm tra `.gitignore` | `PASS` |

### Nhóm 2: Migration & Seed Workflow (Migration & Seed)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **MIG-01** | Tạo file migration nền tảng đầu tiên | File `20260829152230_*.sql` đúng format timestamp | `npm run supabase:migrations:check` | `PASS` |
| **MIG-02** | Kiểm tra cú pháp và an toàn migration | 0 secret, 0 fake data, 0 bảng nghiệp vụ P07 | `node scripts/supabase/check-migrations.mjs` | `PASS` |
| **MIG-03** | Tạo file seed development | File `supabase/seed.sql` tồn tại, an toàn, không PII | Đối soát `supabase/seed.sql` | `PASS` |

### Nhóm 3: Clients & TypeScript Type Generation (Clients & Types)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **TYP-01** | Kiểm tra file Database Types tự sinh | File `database.types.ts` tồn tại, có export `Database` | `npm run supabase:types:check` | `PASS` |
| **TYP-02** | Unit test Supabase Client Factories | Browser & Server clients typed Database, bắt lỗi thiếu env | `npm run test:run` | `PASS` |
| **TYP-03** | Kiểm tra Server-Only Boundary Admin Client | File `admin.ts` được bảo vệ bởi `import 'server-only'` | Đối soát `admin.ts` | `PASS` |

### Nhóm 4: Quality Gates & Full Regression (Application Regression)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **REG-01** | Kiểm tra định dạng mã nguồn (Prettier) | 0 lỗi định dạng | `npm run format:check` | `PASS` |
| **REG-02** | Phân tích tĩnh mã nguồn (ESLint 9) | 0 lỗi lint | `npm run lint` | `PASS` |
| **REG-03** | Kiểm tra kiểu dữ liệu nghiêm ngặt (Typecheck) | 0 lỗi TypeScript strict mode | `npm run typecheck` | `PASS` |
| **REG-04** | Chạy toàn bộ Unit Tests (Vitest) | 100% tests PASS (4 files, 11 tests) | `npm run test:run` | `PASS` |
| **REG-05** | Đóng gói Ứng dụng Next.js (Build) | Production build thành công | `npm run build` | `PASS` |
| **REG-06** | Quét lỗ hổng dependency tự động | 0 vulnerabilities | `npm audit` | `PASS` |

---

## 2. Kết luận Kiểm thử
Toàn bộ các bài kiểm thử chất lượng và an toàn hạ tầng đều đạt **`PASS`**, đủ điều kiện nghiệm thu Phase P06.
