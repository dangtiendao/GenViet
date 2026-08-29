# Chi tiết Danh mục Task: Phase P05 (Task Breakdown)

Tài liệu này theo dõi chi tiết 22 tasks (`P05-T01` đến `P05-T22`) và ma trận các tệp tin kỹ thuật tương ứng trong Phase P05.

---

## Bảng Phân bổ 22 Tasks Phase P05

| Mã Task | Tên Task Kỹ thuật | Gói công việc | Trạng thái | Tệp tin Đầu ra Chính |
| :--- | :--- | :---: | :---: | :--- |
| **`P05-T01`** | Tạo Next.js project (App Router, `src/`) | `WP02` | `IN_PROGRESS` | `package.json`, `src/app/page.tsx`, `src/app/layout.tsx` |
| **`P05-T02`** | Bật TypeScript strict mode & script `typecheck` | `WP02` | `IN_PROGRESS` | `tsconfig.json`, `package.json` |
| **`P05-T03`** | Cấu hình Package Manager `npm` & `.nvmrc` | `WP02` | `IN_PROGRESS` | `package.json`, `.nvmrc`, `package-lock.json` |
| **`P05-T04`** | Cấu hình Tailwind CSS & Global CSS | `WP03` | `IN_PROGRESS` | `src/app/globals.css`, `postcss.config.mjs` |
| **`P05-T05`** | Cài shadcn/ui & Smoke Component `Button` | `WP03` | `IN_PROGRESS` | `components.json`, `src/components/ui/button.tsx` |
| **`P05-T06`** | Cấu hình ESLint & Script `lint` | `WP04` | `IN_PROGRESS` | `eslint.config.mjs`, `package.json` |
| **`P05-T07`** | Cấu hình Prettier, `.prettierignore` & Scripts | `WP04` | `IN_PROGRESS` | `.prettierrc`, `.prettierignore`, `package.json` |
| **`P05-T08`** | Cấu hình Import Alias `@/*` $\rightarrow$ `src/*` | `WP02` | `IN_PROGRESS` | `tsconfig.json`, `src/lib/utils.ts` |
| **`P05-T09`** | Cấu hình Environment Validation với Zod | `WP05` | `IN_PROGRESS` | `src/lib/env/index.ts` |
| **`P05-T10`** | Cài đặt React Hook Form | `WP05` | `IN_PROGRESS` | `package.json` |
| **`P05-T11`** | Cài đặt Zod Schema Validator | `WP05` | `IN_PROGRESS` | `package.json` |
| **`P05-T12`** | Cài đặt Supabase Client (`@supabase/supabase-js`, `@supabase/ssr`)| `WP05` | `IN_PROGRESS` | `package.json`, `src/lib/supabase/` |
| **`P05-T13`** | Đánh giá TanStack Query (Deferred theo P04) | `WP05` | `IN_PROGRESS` | Ghi nhận trong Dependency Inventory |
| **`P05-T14`** | Cài đặt React Flow (`@xyflow/react`) | `WP05` | `IN_PROGRESS` | `package.json` |
| **`P05-T15`** | Cài đặt ELK.js (`elkjs`) | `WP05` | `IN_PROGRESS` | `package.json` |
| **`P05-T16`** | Cấu hình Vitest & Viết Unit Smoke Tests | `WP06` | `IN_PROGRESS` | `vitest.config.ts`, `tests/unit/` |
| **`P05-T17`** | Cấu hình Playwright & Viết E2E Smoke Tests | `WP06` | `IN_PROGRESS` | `playwright.config.ts`, `tests/e2e/` |
| **`P05-T18`** | Tạo Route Handler Health Check `/api/health` | `WP07` | `IN_PROGRESS` | `src/app/api/health/route.ts` |
| **`P05-T19`** | Tạo File Mẫu Biến Môi trường An toàn `.env.example` | `WP07` | `IN_PROGRESS` | `.env.example`, `.gitignore` |
| **`P05-T20`** | Tạo CI Workflow Kiểm tra Lint, Type, Test, Build | `WP07` | `IN_PROGRESS` | `.github/workflows/ci.yml` |
| **`P05-T21`** | Tạo Cấu trúc Thư mục Feature-Based theo P04 | `WP07` | `IN_PROGRESS` | `src/features/`, `docs/architecture/source-structure.md` |
| **`P05-T22`** | Kiểm tra Bản vá Bảo mật Framework & `npm audit` | `WP08` | `IN_PROGRESS` | `docs/security/dependency-security-baseline.md` |
