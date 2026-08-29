# Phase Overview: P04 - Thiết kế Kiến trúc Hệ thống (System Architecture)

- **Mã Phase:** `P04`
- **Tên Phase:** Thiết kế kiến trúc (System Architecture)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE_AWAITING_ARCHITECTURE_APPROVAL`
- **Nhánh Git thi công:** `phase/p04-system-architecture`
- **Vai trò thi công:** Principal Software Architect, Application Architect, Security Architect & Technical Lead
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase

1. Chuyển hóa toàn bộ yêu cầu sản phẩm (P01), quy tắc nghiệp vụ phả hệ & DAG invariants (P02) và cấu trúc trải nghiệm người dùng (P03) thành **Kiến trúc Kỹ thuật Tổng thể** cho GenViet v0.1.
2. Xác định ranh giới giữa Trình duyệt (Browser), Next.js Server, Supabase và các Dịch vụ bên ngoài thông qua mô hình C4 (Context Diagram, Container Diagram).
3. Chốt Next.js App Router làm mô hình định tuyến và render Server-First.
4. Quy định rõ ranh giới giữa Server Components và Client Components theo 25 màn hình P03.
5. Phân định rõ ràng giữa Server Actions (Form Mutations) và Route Handlers (HTTP APIs / File Streaming).
6. Chốt Supabase Auth làm nền tảng định danh với phiên làm việc SSR Cookie an toàn.
7. Chốt PostgreSQL (Supabase) là Nguồn Sự Thật Duy Nhất (Single Source of Truth) của dữ liệu nghiệp vụ.
8. Chốt Row Level Security (RLS) là lớp cưỡng chế phân quyền dữ liệu cuối cùng tại CSDL.
9. Chốt Supabase Storage Private Bucket cho lưu trữ ảnh chân dung (Avatar) trong MVP v0.1.
10. Chốt React Flow cho hiển thị đồ thị và ELK.js cho thuật toán tính toán bố cục phân tầng.
11. Phân tách triệt để 4 lớp đồ thị: Domain Graph, Query Graph, Layout Graph, Presentation Graph.
12. Thiết kế tầng Repository Layer và Service Layer độc lập hoàn toàn khỏi UI framework.
13. Thiết kế Storage Adapter và Email Adapter Seams để cô lập các nhà cung cấp đám mây bên thứ ba.
14. Thiết lập Chiến lược Bộ nhớ đệm (Caching) cách ly dữ liệu riêng tư theo người dùng và cây.
15. Thiết lập Chiến lược Xử lý lỗi (Error Taxonomy) với mã lỗi chuẩn và mã truy vết `correlationId`.
16. Thiết kế Kiến trúc Kiểm toán Nghiệp vụ (Audit Logging) thực thi trong cùng Transaction.
17. Xác định Giới hạn Runtime Phi trạng thái (Stateless Request Processing).
18. Ban hành chính sách Không Phụ thuộc vào Dịch vụ Dữ liệu Độc quyền của Vercel (Blob, KV, Postgres).
19. Đánh giá tính khả thi và quy trình 10 bước chuyển dịch sang Cloudflare Workers và R2.
20. Xây dựng Mô hình Đe dọa An ninh (STRIDE Threat Model) và 10 Yêu cầu An ninh Bắt buộc.
21. Thiết lập đầy đủ 16 Architecture Decision Records (ADRs) từ `ADR-0001` đến `ADR-0016`.
22. Xây dựng Ma trận Truy vết Kiến trúc Khép kín và Gói Bàn giao Kỹ thuật chi tiết cho các Phase P05 đến P25.
23. **Tuyệt đối không triển khai mã nguồn ứng dụng production, không viết SQL DDL hay migration trong phase này.**

---

## 2. Phạm vi Thi công (Scope of Work)

### Trong phạm vi (In-Scope):
- Soạn thảo và hoàn thiện 28 tài liệu kiến trúc tại `docs/architecture/`.
- Soạn thảo và hoàn thiện 3 tài liệu an ninh tại `docs/security/`.
- Thiết lập 16 bản ghi quyết định kiến trúc tại `docs/decisions/` (`ADR-0001` đến `ADR-0016`).
- Hoàn thiện bộ hồ sơ 10 tài liệu phase P04 tại `docs/phases/P04/`.
- Cập nhật `CHANGELOG.md`, `decision-log.md` và `docs/phases/README.md`.

### Ngoài phạm vi (Out-of-Scope):
- ❌ Không khởi tạo Next.js project scaffold thật.
- ❌ Không cài đặt dependency hoặc sửa đổi `package.json`.
- ❌ Không viết source code production, không tạo React component thật.
- ❌ Không tạo database schema vật lý, SQL hay migration.
- ❌ Không cấu hình Vercel, Supabase project hay Cloudflare project thật.
- ❌ Không push Git lên remote repository.

---

## 3. Sản phẩm Bàn giao Chính (Key Deliverables)

- **Phân hệ Tài liệu Kiến trúc Hệ thống:** 28 tài liệu tại `docs/architecture/` (System Overview, Principles, Context, Containers, Boundaries, Data Flow, Rendering, Server/Client, Actions/Handlers, Auth, Data Ownership, RLS, Storage, Graph 4-Tier, Repositories, Services, Adapters, Email, Cache, Errors, Audit, Transactions, Runtime, Portability, Cloudflare, Traceability, Assumptions, Open Questions).
- **Phân hệ Tài liệu An ninh:** 3 tài liệu tại `docs/security/` (`threat-model.md`, `trust-boundaries.md`, `security-requirements.md`).
- **Phân hệ Architecture Decision Records:** 16 tệp tin `ADR-0001.md` đến `ADR-0016.md` tại `docs/decisions/`.
- **Hồ sơ Nghiệm thu Phase P04:** Bộ 10 tài liệu chuẩn và 3 file issue tracking tại `docs/phases/P04/`.
- **Gói Bàn giao Chi tiết cho các Phase Kỹ thuật Kế tiếp:** `docs/phases/P04/09-handover.md` (P05, P06, P07, P08, P09, P14, P15, P17, P18, P21, P22, P23).
