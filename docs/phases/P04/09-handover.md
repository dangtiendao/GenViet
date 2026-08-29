# Tài liệu Bàn giao Kỹ thuật: Phase P04 sang các Phase Thi công (Handover - Cổng G7)

- **Phase Bàn giao:** `P04: Thiết kế kiến trúc (System Architecture)` - Trạng thái: `IMPLEMENTATION_COMPLETE_AWAITING_ARCHITECTURE_APPROVAL`
- **Các Phase Tiếp nhận:** `Phase P05 đến P25`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Principal Software Architect, Security Architect & Technical Lead (P04)

---

## 1. Gói Hướng dẫn Kỹ thuật cho Từng Phase Thi công Tiếp theo

### 1.1. Bàn giao cho Phase P05 (Khởi tạo Mã nguồn Next.js & Setup Dự án)
- **Tài liệu bắt buộc đọc:** [`rendering-architecture.md`](../../architecture/rendering-architecture.md), [`server-client-boundaries.md`](../../architecture/server-client-boundaries.md), [`platform-portability.md`](../../architecture/platform-portability.md), [`ADR-0001`](../../decisions/ADR-0001-app-router.md), [`ADR-0002`](../../decisions/ADR-0002-server-client-boundaries.md), [`ADR-0014`](../../decisions/ADR-0014-zero-vercel-data-services-lock-in.md).
- **Yêu cầu triển khai:** Khởi tạo Next.js với App Router, Tailwind CSS, TypeScript strict mode; thiết lập cấu trúc thư mục phân tầng (`src/app`, `src/services`, `src/repositories`, `src/domain`, `src/adapters`); cấu hình cấm import `@vercel/*` trong service layer.

### 1.2. Bàn giao cho Phase P06 (Thiết lập Supabase & Môi trường Ban đầu)
- **Tài liệu bắt buộc đọc:** [`authentication-architecture.md`](../../architecture/authentication-architecture.md), [`data-ownership.md`](../../architecture/data-ownership.md), [`ADR-0004`](../../decisions/ADR-0004-supabase-auth.md), [`ADR-0005`](../../decisions/ADR-0005-postgresql-source-of-truth.md).
- **Yêu cầu triển khai:** Cấu hình biến môi trường `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` và `SUPABASE_SERVICE_ROLE_KEY` (server-only); thiết lập kết nối Supabase Local CLI cho phát triển.

### 1.3. Bàn giao cho Phase P07 & P08 (CSDL Lõi & Row Level Security)
- **Tài liệu bắt buộc đọc:** [`data-ownership.md`](../../architecture/data-ownership.md), [`authorization-architecture.md`](../../architecture/authorization-architecture.md), [`transaction-boundaries.md`](../../architecture/transaction-boundaries.md), [`ADR-0005`](../../decisions/ADR-0005-postgresql-source-of-truth.md), [`ADR-0006`](../../decisions/ADR-0006-rls-authorization-boundary.md).
- **Yêu cầu triển khai:** Viết DDL Migration tạo các bảng `trees`, `memberships`, `persons`, `relationships`, `marriages`, `media_metadata`, `audit_logs`; kích hoạt 100% RLS với policy `owner_id = auth.uid()`.

### 1.4. Bàn giao cho Phase P09 (Xác thực & Quản lý Phiên)
- **Tài liệu bắt buộc đọc:** [`authentication-architecture.md`](../../architecture/authentication-architecture.md), [`actions-and-route-handlers.md`](../../architecture/actions-and-route-handlers.md), [`ADR-0004`](../../decisions/ADR-0004-supabase-auth.md).
- **Yêu cầu triển khai:** Triển khai luồng Đăng ký, Đăng nhập, Quên/Đặt lại mật khẩu sử dụng `@supabase/ssr` lưu JWT trong HTTP-Only Cookie.

### 1.5. Bàn giao cho Phase P14 & P15 (Visualization Engine & Tree View)
- **Tài liệu bắt buộc đọc:** [`graph-architecture.md`](../../architecture/graph-architecture.md), [`server-client-boundaries.md`](../../architecture/server-client-boundaries.md), [`ADR-0008`](../../decisions/ADR-0008-react-flow-presentation.md), [`ADR-0009`](../../decisions/ADR-0009-elkjs-layout-engine.md), [`ADR-0010`](../../decisions/ADR-0010-domain-presentation-graph-separation.md).
- **Yêu cầu triển khai:** Tích hợp React Flow (Canvas) và ELK.js (Web Worker layout); thực hiện chuyển đổi 4 lớp đồ thị (Domain $\rightarrow$ Query Slice $\rightarrow$ Layout $\rightarrow$ Presentation); xây dựng giao diện thay thế cho Screen Reader.

### 1.6. Bàn giao cho Phase P17, P18 & P21 (Storage, Audit, Heartbeat)
- **Tài liệu bắt buộc đọc:** [`storage-architecture.md`](../../architecture/storage-architecture.md), [`audit-architecture.md`](../../architecture/audit-architecture.md), [`adapter-architecture.md`](../../architecture/adapter-architecture.md), [`ADR-0007`](../../decisions/ADR-0007-supabase-storage-for-mvp.md), [`ADR-0016`](../../decisions/ADR-0016-audit-architecture.md).
- **Yêu cầu triển khai:** Triển khai `SupabaseStorageAdapter`, ký URL upload ảnh $< 5\text{MB}$; ghi nhật ký kiểm toán vào `audit_logs` trong cùng transaction; cấu hình Route Handler `/api/healthz`.

### 1.7. Bàn giao cho Phase P22 & P23 (Kiểm thử Tích hợp & Tối ưu Hiệu năng)
- **Tài liệu bắt buộc đọc:** [`docs/security/threat-model.md`](../../security/threat-model.md), [`runtime-profile.md`](../../architecture/runtime-profile.md), [`cloudflare-readiness.md`](../../architecture/cloudflare-readiness.md).
- **Yêu cầu triển khai:** Kiểm thử 14 mối đe dọa STRIDE (chống IDOR chéo cây, chống leak service-role); benchmark hiệu năng React Flow $\ge 45\text{ FPS}$ trên mobile.

---

## 2. Những Điều các Phase Kỹ thuật KHÔNG ĐƯỢC Giả định

- **KHÔNG** import `@vercel/blob`, `@vercel/kv` hay `@vercel/postgres` vào mã nguồn.
- **KHÔNG** đưa `SUPABASE_SERVICE_ROLE_KEY` vào bất kỳ Client Component nào.
- **KHÔNG** ghi tọa độ `(x, y)` vào bảng dữ liệu quan hệ trong PostgreSQL.
- **KHÔNG** thực hiện mutation đa bước mà không có Database Transaction bọc ngoài.
- **KHÔNG** cache công khai dữ liệu gia phả cá nhân lên Public CDN.

---

## 3. Khuyến nghị Hành động Tiếp theo

1. Project Owner xem xét và phê duyệt 16 ADRs tại `docs/decisions/` và 5 câu hỏi mở tại `docs/architecture/open-questions.md`.
2. Maintainer merge nhánh `phase/p04-system-architecture` vào `master` trên GitHub sau khi nghiệm thu.
3. Khởi tạo Phase P05 trên nhánh mới `phase/p05-project-scaffolding-setup` từ `master`.
