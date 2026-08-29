# Hệ thống Tài liệu Kiến trúc Kỹ thuật GenViet (System Architecture Documentation)

Thư mục này chứa toàn bộ hệ thống tài liệu đặc tả kiến trúc kỹ thuật tổng thể, ranh giới phân tầng, mô hình C4 (Context, Containers), phân định Server/Client, phân quyền RLS, kiến trúc đồ thị 4 lớp, các adapter seams, chiến lược cache, lỗi, audit và đánh giá tính linh động runtime của dự án **GenViet (v0.1)**.

---

## 1. Bản đồ Chỉ mục Tài liệu Kiến trúc

| Tên tài liệu | Mã tài liệu | Mục đích sử dụng & Ranh giới kỹ thuật |
| :--- | :--- | :--- |
| 📋 **[Tổng quan Kiến trúc](./system-overview.md)** | `ARCH-OVERVIEW-01` | Sơ đồ ngăn xếp kiến trúc phân tầng từ Trình duyệt tới Hạ tầng CSDL. |
| ⚖️ **[Nguyên tắc Kiến trúc](./architecture-principles.md)** | `ARCH-PRINCIPLES-01` | 12 nguyên tắc vàng định hướng thiết kế và phát triển kỹ thuật. |
| 🌐 **[Sơ đồ Bối cảnh Hệ thống (C4 Context)](./context-diagram.md)** | `ARCH-CONTEXT-01` | Xác định Tác nhân (`ACTOR-001..003`), Hệ thống đích và Dịch vụ bên ngoài. |
| 📦 **[Sơ đồ Khối Ứng dụng (C4 Containers)](./container-diagram.md)** | `ARCH-CONTAINER-01` | Chi tiết 8 containers: Browser, Next.js, Supabase Auth/DB/Storage, Cloudflare. |
| 🧱 **[Ranh giới Thành phần Kiến trúc](./component-boundaries.md)** | `ARCH-BOUNDARIES-01` | Phân định ranh giới 4 tầng (Client, Entry, Service, Persistence). |
| 🔄 **[Luồng Xử lý Yêu cầu & Dữ liệu](./request-and-data-flow.md)** | `ARCH-FLOW-01` | 6 Sequence Diagrams chi tiết: Auth, View Tree, Add Parent Tx, Upload Avatar, Export, RLS Error. |
| 🖥️ **[Kiến trúc Render & Định tuyến](./rendering-architecture.md)** | `ARCH-RENDER-01` | Cấu trúc App Router Next.js, Server-First SSR, bố cục Route Groups. |
| 🔀 **[Ranh giới Server vs Client Components](./server-client-boundaries.md)** | `ARCH-BOUNDARY-SC-01` | Ma trận phân chia Server Component vs Client Component theo 25 màn hình P03. |
| ⚡ **[Server Actions & Route Handlers](./actions-and-route-handlers.md)** | `ARCH-ACTIONS-RH-01` | Ma trận quyết định: Server Actions cho form mutation, Route Handlers cho HTTP/Files. |
| 🔐 **[Kiến trúc Định danh & Xác thực](./authentication-architecture.md)** | `ARCH-AUTH-01` | Supabase Auth, SSR Cookie Session, phân định User Account vs Person Node. |
| 🐘 **[Quyền Sở hữu & Nguồn Dữ liệu](./data-ownership.md)** | `ARCH-DATAOWN-01` | PostgreSQL là Nguồn Sự Thật duy nhất; cấm lưu binary vào CSDL; derived copies. |
| 🛡️ **[Kiến trúc Phân quyền RLS](./authorization-architecture.md)** | `ARCH-AUTHZ-01` | Ma trận phân quyền RLS CSDL, phòng chống tấn công IDOR và truy cập chéo cây. |
| 🖼️ **[Kiến trúc Lưu trữ Media](./storage-architecture.md)** | `ARCH-STORAGE-01` | Supabase Storage Private Bucket, Signed Upload/Read URLs, dọn dẹp file rác. |
| 🌳 **[Kiến trúc Đồ thị Phả hệ 4 Lớp](./graph-architecture.md)** | `ARCH-GRAPH-01` | Tách biệt Domain Graph, Query Graph, Layout Graph (ELK.js) và Presentation Graph (React Flow). |
| 🗄️ **[Thiết kế Tầng Repositories](./repository-layer.md)** | `ARCH-REPO-01` | 7 Repository Interfaces chuẩn hóa truy vấn CSDL, kiểm soát scope theo cây. |
| ⚙️ **[Thiết kế Tầng Services](./service-layer.md)** | `ARCH-SERVICE-01` | 8 Domain Service Interfaces điều phối use cases, kiểm tra DAG Invariant. |
| 🔌 **[Kiến trúc Lớp Adapters](./adapter-architecture.md)** | `ARCH-ADAPTER-01` | Hợp đồng `IStorageAdapter` cô lập Supabase Storage / Cloudflare R2. |
| 📧 **[Kiến trúc Gửi Email Dự phòng](./email-architecture.md)** | `ARCH-EMAIL-01` | Hợp đồng `IEmailAdapter` chuẩn bị cho thông báo trong tương lai (Post-MVP). |
| ⚡ **[Chiến lược Quản lý Cache](./caching-strategy.md)** | `ARCH-CACHE-01` | 5 cấp độ Caching, cách ly dữ liệu riêng tư, hủy cache mục tiêu (`revalidateTag`). |
| ⚠️ **[Chiến lược Phân loại & Xử lý Lỗi](./error-strategy.md)** | `ARCH-ERROR-01` | Cấu trúc `ApplicationErrorResponse`, mã lỗi ổn định, gắn mã truy vết `correlationId`. |
| 📜 **[Kiến trúc Nhật ký Kiểm toán](./audit-architecture.md)** | `ARCH-AUDIT-01` | Ghi nhận thay đổi phả hệ vào bảng `audit_logs` cùng Transaction nghiệp vụ. |
| 🔒 **[Ranh giới Giao dịch Transaction](./transaction-boundaries.md)** | `ARCH-TX-01` | 6 thao tác bắt buộc nguyên tử trong PostgreSQL; chiến lược bù trừ upload storage. |
| ⏱️ **[Hồ sơ Thực thi & Giới hạn Runtime](./runtime-profile.md)** | `ARCH-RUNTIME-01` | Stateless request, không lưu state RAM, không writable disk, timeout bounds. |
| 🚫 **[Chính sách Chống Khóa Vercel](./platform-portability.md)** | `ARCH-PORTABILITY-01` | Cấm dùng Vercel Blob/KV/Postgres; cấm import `@vercel/*` trong Service Layer. |
| ☁️ **[Đánh giá Sẵn sàng Cloudflare](./cloudflare-readiness.md)** | `ARCH-CLOUDFLARE-01` | Ma trận tương thích OpenNext, quy trình 10 bước chuyển sang Cloudflare Workers. |
| 🔗 **[Ma trận Truy vết Kiến trúc](./architecture-traceability-matrix.md)** | `ARCH-TRACE-01` | Chuỗi truy vết: P01 Objective $\rightarrow$ P02 Invariant $\rightarrow$ P03 Screen $\rightarrow$ P04 Architecture $\rightarrow$ ADR. |
| 💡 **[Danh mục Giả định Kiến trúc](./assumptions.md)** | `ARCH-ASSUMPTIONS-01` | 5 giả định kỹ thuật áp dụng cho phiên bản v0.1. |
| ❓ **[Danh mục Câu hỏi Mở Kiến trúc](./open-questions.md)** | `ARCH-OPENQUESTIONS-01` | 5 câu hỏi mở chờ Project Owner xem xét và phê duyệt. |

---

## 2. Các Phân hệ Tài liệu Liên quan

- 🔐 **[`docs/security/`](../security/threat-model.md):** Chứa Mô hình đe dọa an ninh (STRIDE Threat Model), Ranh giới tin cậy (Trust Boundaries) và Yêu cầu kỹ thuật an ninh (Security Requirements).
- 📜 **[`docs/decisions/`](../decisions/decision-log.md):** Chứa toàn bộ 16 Architecture Decision Records (`ADR-0001` đến `ADR-0016`).
- 📁 **[`docs/phases/P04/`](../phases/P04/00-overview.md):** Hồ sơ nghiệm thu và bàn giao kỹ thuật của Phase P04.
