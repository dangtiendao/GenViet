# Báo cáo Sẵn sàng Đầu vào: Phase P05 (Input Readiness - Cổng G0)

- **Mã Phase:** `P05`
- **Tên Phase:** Khởi tạo mã nguồn (Source Bootstrap & Project Scaffolding)
- **Dự án:** GenViet (v0.1)
- **Ngày thực hiện:** 2026-08-29
- **Nhánh thi công:** `phase/p05-source-bootstrap`
- **Starting Commit:** `b1aaa9f55e5331ec41e1762193b22e1b12b591ae` (Merge PR #4 for P04)
- **Người đánh giá:** Principal Frontend Engineer, DevEx & Test Infrastructure Engineer

---

## 1. Bảng Đánh giá Tiêu chuẩn Sẵn sàng (Definition of Ready - DoR Verification)

| STT | Tiêu chí Kiểm tra DoR | Trạng thái | Bằng chứng & Ghi chú |
| :--- | :--- | :---: | :--- |
| **1** | Hồ sơ Phase P00 (Quản trị dự án) hoàn chỉnh và đã bàn giao | `PASS` | [`docs/phases/P00/09-handover.md`](../P00/09-handover.md), các quyết định nền tảng `DEC-001` đến `DEC-008` đã khóa. |
| **2** | Hồ sơ Phase P01 (Phạm vi sản phẩm & PRD) hoàn chỉnh | `PASS` | [`docs/product/prd-mvp.md`](../../product/prd-mvp.md), [`v0.1-scope-baseline.md`](../../product/v0.1-scope-baseline.md). |
| **3** | Hồ sơ Phase P02 (Nghiệp vụ phả hệ & Invariants) hoàn chỉnh | `PASS` | [`docs/product/domain/invariants.md`](../../product/domain/invariants.md) (20 Invariants `INV-001..020`). |
| **4** | Hồ sơ Phase P03 (UX, Flows, Wireframes) hoàn chỉnh | `PASS` | [`docs/phases/P03/09-handover.md`](../P03/09-handover.md), 25 màn hình, Sitemap, Responsive mobile-first. |
| **5** | Hồ sơ Phase P04 (Thiết kế Kiến trúc Hệ thống) hoàn chỉnh | `PASS` | [`docs/phases/P04/09-handover.md`](../P04/09-handover.md), C4 diagrams, 16 ADRs, ranh giới Server/Client. |
| **6** | Quyết định Kiến trúc Next.js App Router rõ ràng | `PASS` | `ADR-0001` đã chốt Next.js App Router, Server-First SSR, thư mục `src/app`. |
| **7** | Ranh giới Server Components vs Client Components rõ ràng | `PASS` | `ADR-0002`, `docs/architecture/server-client-boundaries.md`. |
| **8** | Ranh giới Server Actions vs Route Handlers rõ ràng | `PASS` | `ADR-0003`, `docs/architecture/actions-and-route-handlers.md`. |
| **9** | Quyết định Identity Supabase Auth & SSR rõ ràng | `PASS` | `ADR-0004`, `docs/architecture/authentication-architecture.md` (Cookie-based `@supabase/ssr`). |
| **10**| Quyết định PostgreSQL Single Source of Truth & RLS rõ ràng | `PASS` | `ADR-0005`, `ADR-0006`, `docs/architecture/data-ownership.md`. |
| **11**| Quyết định React Flow & ELK.js Visualization rõ ràng | `PASS` | `ADR-0008`, `ADR-0009`, `ADR-0010` (Tách 4 lớp đồ thị độc lập). |
| **12**| Chính sách Chống Khóa Vercel Data Services rõ ràng | `PASS` | `ADR-0014`, `docs/architecture/platform-portability.md` (Cấm Vercel Blob/KV/Postgres). |
| **13**| Môi trường Runtime đáp ứng yêu cầu framework | `PASS` | Node.js `v24.19.0`, npm `12.0.2` đáp ứng đầy đủ yêu cầu của Next.js 16 Active LTS. |
| **14**| Quy tắc An toàn Git được cam kết tuân thủ 100% | `PASS` | Nhánh `phase/p05-source-bootstrap`, cấm push, cấm merge, cấm tạo PR. |
| **15**| Ranh giới Không Viết Business Logic & Không Database trong P05 | `PASS` | P05 chỉ scaffold nền tảng, công cụ chất lượng và test suite, không tạo CRUD gia phả. |

---

## 2. Danh mục Gói Thư viện Nền tảng Đã Được Kiểm Tra (Dependency Inventory Baseline)

| Tên Package | Phiên bản Kiểm tra | Phân loại | Mục đích Sử dụng | Nguồn Đối soát |
| :--- | :---: | :---: | :--- | :---: |
| **`next`** | `^16.3.3` | Runtime | Framework React Server Components & App Router | npm registry (Active LTS) |
| **`react` & `react-dom`** | `^19.2.8` | Runtime | Core UI Library tương thích Next.js 16 | npm registry |
| **`typescript`** | `^5.9.0` | Dev | TypeScript strict mode compilation | npm registry |
| **`tailwindcss`** | `^4.3.3` | Dev | Styling engine theo chuẩn Next.js hiện hành | npm registry |
| **`zod`** | `^4.5.2` / `^3.24.2` | Runtime | Environment validation & Schema parsing | npm registry |
| **`react-hook-form`** | `^7.86.0` | Runtime | Form state management foundation | npm registry |
| **`@supabase/supabase-js`** | `^2.112.4`| Runtime | Supabase JavaScript SDK Client | npm registry |
| **`@supabase/ssr`** | `^0.12.5` | Runtime | Supabase SSR Cookie session integration | npm registry |
| **`@xyflow/react`** | `^12.11.5`| Runtime | React Flow canvas presentation library | npm registry |
| **`elkjs`** | `^0.12.0` | Runtime | Eclipse Layout Kernel layout calculation | npm registry |
| **`vitest`** | `^4.1.11` | Dev | Unit test framework siêu tốc chạy native ESM | npm registry |
| **`@playwright/test`** | `^1.62.1` | Dev | End-to-End browser smoke testing framework | npm registry |
| **`eslint` & `eslint-config-next`**| `^9.x` | Dev | Static analysis & code linting | npm registry |
| **`prettier`** | `^3.5.0` | Dev | Code formatting tool | npm registry |

---

## 3. Quyết định Package Manager cho Dự án

- **Package Manager được chốt:** **`npm`** (Phiên bản `12.0.2` native trên môi trường Node.js `v24.19.0`).
- **Lý do lựa chọn:** `npm` có sẵn nguyên bản, hoạt động ổn định trên cả môi trường Windows phát triển cục bộ và Linux GitHub Actions CI mà không phát sinh lỗi phân quyền `EPERM` như Corepack pnpm trên Windows; tạo duy nhất 1 lockfile `package-lock.json` chuẩn.
- **Ràng buộc:** Cấm tạo song song `pnpm-lock.yaml`, `yarn.lock` hay `bun.lock`. Cài đặt trên CI sử dụng lệnh đóng băng `npm ci`.

---

## 4. Kết luận Đánh giá Sẵn sàng Đầu vào (Gate G0 Result)

- **Trạng thái:** **`READY`**
- **Đánh giá:** 15/15 tiêu chí DoR đạt `PASS`. Toàn bộ hồ sơ kiến trúc từ P04 và các phase tiền nhiệm đã sẵn sàng để tiến hành khởi tạo mã nguồn dự án GenViet.
