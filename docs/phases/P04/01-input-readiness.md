# Báo cáo Sẵn sàng Đầu vào: Phase P04 (Input Readiness - Cổng G0)

- **Mã Phase:** `P04`
- **Tên Phase:** Thiết kế kiến trúc (System Architecture)
- **Dự án:** GenViet (v0.1)
- **Ngày thực hiện:** 2026-08-29
- **Nhánh thi công:** `phase/p04-system-architecture`
- **Starting Commit:** `d0f0dc97ecb8fcf6ebda5cfdb7a7ebcfbc00072b` (Merge PR #3 for P03)
- **Người đánh giá:** Principal Software Architect & Technical Lead

---

## 1. Bảng Đánh giá Tiêu chuẩn Sẵn sàng (Definition of Ready - DoR Verification)

| STT | Tiêu chí Kiểm tra DoR | Trạng thái | Bằng chứng & Ghi chú |
| :---: | :--- | :---: | :--- |
| **1** | Hồ sơ Phase P00 (Quản trị dự án) hoàn chỉnh và đã bàn giao | `PASS` | [`docs/phases/P00/09-handover.md`](../P00/09-handover.md), các quyết định nền tảng `DEC-001` đến `DEC-008` đã khóa. |
| **2** | Hồ sơ Phase P01 (Phạm vi sản phẩm & PRD) hoàn chỉnh | `PASS` | [`docs/product/prd-mvp.md`](../../product/prd-mvp.md), [`v0.1-scope-baseline.md`](../../product/v0.1-scope-baseline.md) với 12 nhóm Must-have và 30 Out-of-scope. |
| **3** | Hồ sơ Phase P02 (Nghiệp vụ phả hệ & Invariants) hoàn chỉnh | `PASS` | [`docs/product/domain/invariants.md`](../../product/domain/invariants.md) (20 Invariants `INV-001..020`), phân định User vs Person, Partial Date. |
| **4** | Hồ sơ Phase P03 (UX, Flows, Wireframes) hoàn chỉnh | `PASS` | [`docs/phases/P03/09-handover.md`](../P03/09-handover.md), 25 màn hình, 12 flows, 10 wireframes, Touch target $\ge 44\text{px}$, WCAG 2.2 AA baseline. |
| **5** | Ranh giới Scope v0.1 rõ ràng (Single-owner MVP, 1.000 nodes/tree) | `PASS` | Mục tiêu quy mô 1.000 người/cây, hiển thị 30-50 node trên mobile, xuất backup JSON. |
| **6** | Quy tắc bất biến DAG và chống chu trình được xác định | `PASS` | `INV-004` cấm chu trình thế hệ, `ERR-001..008` blocking, `WARN-001..007` warning xác nhận. |
| **7** | Ranh giới danh tính User vs Person và 4 loại mốc đã chốt | `PASS` | `INV-001`, `P02-DEC-001` (Initial, Center, Founding Ancestor, Generation Anchor). |
| **8** | Danh mục 25 Màn hình (Screen Inventory) và 12 User Flows đầy đủ | `PASS` | [`docs/ux/screen-inventory.md`](../../ux/screen-inventory.md), [`docs/ux/flows/`](../../ux/flows/authentication.md). |
| **9** | Ranh giới dữ liệu riêng tư (Privacy Baseline) rõ ràng | `PASS` | [`docs/product/privacy-baseline.md`](../../product/privacy-baseline.md), ẩn SĐT/CCCD/Email trên node đồ thị. |
| **10**| Môi trường triển khai mục tiêu ban đầu và tương lai được xác định | `PASS` | Deployment ban đầu: Vercel + Supabase + Cloudflare DNS; Đường chuyển tương lai: Cloudflare Workers + R2. |
| **11**| Quy tắc cấm phụ thuộc Vercel data services đã hiểu rõ | `PASS` | Không dùng Vercel Blob, KV, Postgres; domain logic không import Vercel SDK. |
| **12**| Các tài liệu kỹ thuật chính thức hiện hành đã được tra cứu | `PASS` | Next.js App Router, Supabase SSR, React Flow, ELK.js, Web Crypto, Cloudflare Workers node-compat. |
| **13**| Quy tắc An toàn Git được cam kết tuân thủ 100% | `PASS` | Nhánh `phase/p04-system-architecture`, cấm push, cấm merge, cấm tạo PR. |
| **14**| Ranh giới không viết source code production và không DDL SQL được hiểu rõ | `PASS` | 100% tài liệu kiến trúc đặc tả dạng Markdown/Mermaid/ADR, không tạo code hay migration. |

---

## 2. Danh mục Tài liệu Kỹ thuật Chính thức Hiện hành Tham chiếu (Official Sources Register)

| Công nghệ / Thành phần | Nguồn Tài liệu Chính thức | Ngày đối soát | Nội dung Kiến trúc Được Hỗ trợ |
| :--- | :--- | :---: | :--- |
| **Next.js App Router** | [Next.js Official Docs: Routing & Rendering](https://nextjs.org/docs/app) | 2026-08-29 | App Router, Server Components by default, Client Components leaf-level, Server Actions, Route Handlers. |
| **Next.js Server Actions** | [Next.js Official Docs: Data Fetching & Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) | 2026-08-29 | Server Functions cho form mutations, CSRF protection, cache revalidation (`revalidatePath`, `revalidateTag`). |
| **Supabase SSR / Auth** | [Supabase Official Docs: SSR with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) | 2026-08-29 | `@supabase/ssr` package, cookie-based session management, Server Component client, Client Component client, Middleware refresh. |
| **Supabase RLS & Storage** | [Supabase Official Docs: Row Level Security & Storage](https://supabase.com/docs/guides/database/postgres/row-level-security) | 2026-08-29 | Postgres RLS policies, Private buckets, Signed URLs for private avatar retrieval. |
| **React Flow (xyflow)** | [React Flow Documentation](https://reactflow.dev/docs) | 2026-08-29 | Interactive canvas, custom nodes/edges, viewport management (fitView, setCenter), client-side only component. |
| **ELK.js** | [Eclipse Layout Kernel (ELK) / elkjs](https://github.com/kieler/elkjs) | 2026-08-29 | Layered graph layout algorithm (`elk.layered`), standalone calculation, Web Worker execution capability. |
| **Cloudflare Workers / Next** | [Cloudflare OpenNext / Workers Docs](https://developers.cloudflare.com/workers/) | 2026-08-29 | Edge runtime constraints, Node.js compatibility flags (`nodejs_compat`), R2 object storage compatibility. |

---

## 3. Kết luận Đánh giá Sẵn sàng Đầu vào (Gate G0 Result)

- **Trạng thái:** **`READY`**
- **Đánh giá:** 14/14 tiêu chí DoR đạt `PASS`. Toàn bộ hồ sơ đầu vào từ P00, P01, P02 và P03 đã được tích hợp đầy đủ, không có mâu thuẫn hoặc blocker nào cản trở việc thiết kế kiến trúc kỹ thuật tổng thể cho Phase P04.
