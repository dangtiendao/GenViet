# Phase Overview: P05 - Khởi tạo Mã nguồn (Source Bootstrap & Project Scaffolding)

- **Mã Phase:** `P05`
- **Tên Phase:** Khởi tạo mã nguồn (Source Bootstrap & Project Scaffolding)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE`
- **Nhánh Git thi công:** `phase/p05-source-bootstrap`
- **Vai trò thi công:** Principal Frontend Engineer, DevEx & Test Infrastructure Engineer
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase

1. Khởi tạo ứng dụng Next.js chạy được trên môi trường local với cấu hình App Router theo kiến trúc P04.
2. Bật chế độ TypeScript strict mode và thiết lập script kiểm tra kiểu độc lập `npm run typecheck`.
3. Chốt một Package Manager duy nhất (`npm` v12 với lockfile `package-lock.json`).
4. Thiết lập Tailwind CSS và tích hợp thư viện shadcn/ui.
5. Cấu hình ESLint 9 Flat Config và Prettier code formatting.
6. Cấu hình Import Alias `@/*` trỏ tới `src/*`.
7. Thiết lập lớp kiểm tra tính hợp lệ của biến môi trường bằng Zod (`src/lib/env/`).
8. Cài đặt đầy đủ các thư viện nền tảng được kiến trúc phê duyệt (React Hook Form, Zod, Supabase SDK, React Flow `@xyflow/react`, ELK.js `elkjs`).
9. Thiết lập Vitest cho Unit Tests với ít nhất một smoke test có ý nghĩa.
10. Thiết lập Playwright cho End-to-End Tests với smoke test kiểm tra trang chủ và health endpoint.
11. Tạo Route Handler Health Check `/api/health` trả về JSON trạng thái.
12. Tạo tệp tin mẫu biến môi trường an toàn `.env.example`.
13. Xây dựng quy trình CI GitHub Actions kiểm tra format, lint, type, test và build.
14. Thiết lập cấu trúc thư mục feature-based theo đúng đặc tả P04.
15. Kiểm tra và ghi nhận tình trạng bảo mật của framework và dependency (`npm audit`).
16. **Tuyệt đối không triển khai chức năng nghiệp vụ, không tạo database schema hay cấu hình Supabase project.**

---

## 2. Phạm vi Thi công (Scope of Work)

### Trong phạm vi (In-Scope):
- Khởi tạo Next.js App Router scaffold, Tailwind CSS, shadcn/ui base.
- Cài đặt và cấu hình chất lượng mã nguồn (ESLint, Prettier, TypeScript strict).
- Cài đặt các runtime dependencies và dev dependencies nền tảng.
- Thiết lập Vitest unit tests và Playwright E2E smoke tests.
- Xây dựng Route Handler `/api/health` và schema validation biến môi trường.
- Thiết lập CI workflow `.github/workflows/ci.yml`.
- Tạo cấu trúc thư mục phân tầng và feature-based dưới `src/`.
- Cập nhật hướng dẫn thiết lập local trong `README.md` và `docs/development/local-setup.md`.
- Hoàn thiện bộ hồ sơ 10 tài liệu phase P05 tại `docs/phases/P05/`.

### Ngoài phạm vi (Out-of-Scope):
- ❌ Không triển khai tính năng nghiệp vụ gia phả (CRUD cây, thành viên, quan hệ).
- ❌ Không tạo database schema, SQL DDL hay migration.
- ❌ Không chạy `supabase init` hay cấu hình Supabase cloud project.
- ❌ Không triển khai màn hình Auth đầy đủ hay đăng nhập thật.
- ❌ Không vẽ cây gia phả React Flow thật.
- ❌ Không cấu hình triển khai live lên Vercel hay Cloudflare.
- ❌ Không push Git lên remote repository.
