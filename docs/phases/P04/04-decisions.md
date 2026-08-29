# Nhật ký Quyết định Kiến trúc: Phase P04 (Phase Decisions)

Tài liệu này tổng hợp 16 quyết định kiến trúc cốt lõi được thiết lập trong Phase P04 và trạng thái đề xuất tương ứng.

---

## 1. Bảng Tổng hợp 16 Quyết định Kiến trúc (ADRs Summary)

| Mã ADR | Tiêu đề Quyết định Kiến trúc | Trạng thái | Tệp tin Chi tiết |
| :--- | :--- | :---: | :--- |
| **`ADR-0001`** | Sử dụng Next.js App Router làm Kiến trúc Định tuyến & Render chính | `PROPOSED` | [`docs/decisions/ADR-0001-app-router.md`](../../decisions/ADR-0001-app-router.md) |
| **`ADR-0002`** | Quy tắc Server-First Rendering và Phân định Ranh giới Client Components | `PROPOSED` | [`docs/decisions/ADR-0002-server-client-boundaries.md`](../../decisions/ADR-0002-server-client-boundaries.md) |
| **`ADR-0003`** | Phân định Rạch ròi giữa Server Actions và Route Handlers | `PROPOSED` | [`docs/decisions/ADR-0003-server-actions-and-route-handlers.md`](../../decisions/ADR-0003-server-actions-and-route-handlers.md) |
| **`ADR-0004`** | Sử dụng Supabase Auth làm Nền tảng Định danh cho MVP v0.1 | `PROPOSED` | [`docs/decisions/ADR-0004-supabase-auth.md`](../../decisions/ADR-0004-supabase-auth.md) |
| **`ADR-0005`** | PostgreSQL là Nguồn Sự Thật Duy Nhất của Dữ liệu Nghiệp vụ | `PROPOSED` | [`docs/decisions/ADR-0005-postgresql-source-of-truth.md`](../../decisions/ADR-0005-postgresql-source-of-truth.md) |
| **`ADR-0006`** | Row Level Security (RLS) là Lớp Cưỡng chế Phân quyền Cuối cùng | `PROPOSED` | [`docs/decisions/ADR-0006-rls-authorization-boundary.md`](../../decisions/ADR-0006-rls-authorization-boundary.md) |
| **`ADR-0007`** | Sử dụng Supabase Storage Private Bucket cho Avatar & Media MVP v0.1 | `PROPOSED` | [`docs/decisions/ADR-0007-supabase-storage-for-mvp.md`](../../decisions/ADR-0007-supabase-storage-for-mvp.md) |
| **`ADR-0008`** | Sử dụng React Flow làm Thư viện Trình bày Đồ thị Tương tác | `PROPOSED` | [`docs/decisions/ADR-0008-react-flow-presentation.md`](../../decisions/ADR-0008-react-flow-presentation.md) |
| **`ADR-0009`** | Sử dụng ELK.js làm Thuật toán Tính toán Bố cục Phân tầng Tự động | `PROPOSED` | [`docs/decisions/ADR-0009-elkjs-layout-engine.md`](../../decisions/ADR-0009-elkjs-layout-engine.md) |
| **`ADR-0010`** | Phân tách Triệt để 4 Lớp Đồ thị Phả hệ (Domain, Query, Layout, Presentation) | `PROPOSED` | [`docs/decisions/ADR-0010-domain-presentation-graph-separation.md`](../../decisions/ADR-0010-domain-presentation-graph-separation.md) |
| **`ADR-0011`** | Kiến trúc Phân tầng Ứng dụng: Repository Layer và Service Layer | `PROPOSED` | [`docs/decisions/ADR-0011-repository-and-service-layers.md`](../../decisions/ADR-0011-repository-and-service-layers.md) |
| **`ADR-0012`** | Thiết kế Adapter Seams cho Lưu trữ Media và Gửi Email | `PROPOSED` | [`docs/decisions/ADR-0012-storage-and-email-adapters.md`](../../decisions/ADR-0012-storage-and-email-adapters.md) |
| **`ADR-0013`** | Chiến lược Bộ nhớ Đệm (Caching) Cách ly Dữ liệu Riêng tư | `PROPOSED` | [`docs/decisions/ADR-0013-cache-strategy-private-data.md`](../../decisions/ADR-0013-cache-strategy-private-data.md) |
| **`ADR-0014`** | Nguyên tắc Không Phụ thuộc vào Dịch vụ Dữ liệu Độc quyền của Vercel | `PROPOSED` | [`docs/decisions/ADR-0014-zero-vercel-data-services-lock-in.md`](../../decisions/ADR-0014-zero-vercel-data-services-lock-in.md) |
| **`ADR-0015`** | Giữ Vững Tính Linh động Runtime và Sẵn sàng Chuyển sang Cloudflare | `PROPOSED` | [`docs/decisions/ADR-0015-runtime-portability-cloudflare-readiness.md`](../../decisions/ADR-0015-runtime-portability-cloudflare-readiness.md) |
| **`ADR-0016`** | Kiến trúc Ghi nhận Nhật ký Kiểm toán Nghiệp vụ (Audit Architecture) | `PROPOSED` | [`docs/decisions/ADR-0016-audit-architecture.md`](../../decisions/ADR-0016-audit-architecture.md) |

---

## 2. Ghi chú Quản trị (Governance Note)
Toàn bộ 16 ADRs trên được gắn cờ `PROPOSED` để chờ Project Owner / Maintainer phê duyệt chính thức theo quy trình quản trị dự án P00 trước khi chuyển sang trạng thái `ACCEPTED`.
