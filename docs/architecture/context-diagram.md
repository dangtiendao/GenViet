# Sơ đồ Bối cảnh Hệ thống (System Context Diagram - C4 Level 1)

- **Mã tài liệu:** `ARCH-CONTEXT-01`
- **Mã Kiến trúc liên quan:** `SYS-001`, `ACTOR-001..003`, `EXT-001..006`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Sơ đồ Bối cảnh C4 Context Diagram (Mermaid)

```mermaid
flowchart TD
    subgraph Actors [Tác nhân Người dùng & Vận hành]
        Owner["👤 Chủ sở hữu Cây Gia phả\n[ACTOR-001]\nNgười dùng đã đăng ký & xác thực"]
        Guest["👤 Người dùng Chưa xác thực\n[ACTOR-002]\nKhách vãng lai, truy cập trang Login"]
        Admin["🛠️ Quản trị viên Kỹ thuật\n[ACTOR-003]\nMaintainer vận hành hệ thống"]
    end

    subgraph SystemOfInterest [Hệ thống Đích]
        GenViet["🌳 Hệ thống GenViet Web App\n[SYS-001]\nQuản lý và vẽ cây gia phả cá nhân riêng tư"]
    end

    subgraph ExternalActive [Dịch vụ Bên ngoài Đang Hoạt động trong MVP v0.1]
        Supabase["⚡ Nền tảng Supabase\n[EXT-001]\nCung cấp Auth, PostgreSQL & Storage"]
        Vercel["▲ Nền tảng Vercel\n[EXT-002]\nHosting ứng dụng Next.js App Router"]
        CloudflareDNS["☁️ Cloudflare DNS & Proxy\n[EXT-003]\nQuản lý tên miền, SSL & Chống DDoS"]
        Scheduler["⏰ GitHub Actions / Scheduler\n[EXT-004]\nGửi heartbeat giám sát kỹ thuật định kỳ"]
    end

    subgraph ExternalFuture [Dịch vụ Định hướng Tương lai - Post-MVP]
        EmailService["📧 Dịch vụ Email Giao dịch\n[EXT-005 - Tương lai]\nResend / Postmark gửi thông báo phả hệ"]
        CloudflareWorkers["⚡ Cloudflare Workers & R2\n[EXT-006 - Đích chuyển dịch]\nThay thế Vercel và Supabase Storage khi mở rộng"]
    end

    Owner -->|Đăng nhập, quản trị gia phả, vẽ cây, sao lưu JSON| GenViet
    Guest -->|Truy cập trang giới thiệu, đăng nhập, quên mật khẩu| GenViet
    Admin -->|Theo dõi tình trạng kỹ thuật, quản trị cấu hình| GenViet

    GenViet -->|Xác thực JWT, truy vấn dữ liệu SQL qua RLS, tải avatar| Supabase
    GenViet -->|Được đóng gói và phục vụ người dùng qua| Vercel
    GenViet -->|Định tuyến tên miền qua| CloudflareDNS
    Scheduler -.->|Gửi heartbeat định kỳ không tạo dữ liệu rác| GenViet
    GenViet -.->|Tùy chọn tương lai: Gửi email giao dịch| EmailService
    GenViet -.->|Đích chuyển dịch kiến trúc tương lai| CloudflareWorkers
```

---

## 2. Bảng Danh mục Tác nhân & Hệ thống Bên ngoài

| Mã Thực thể | Tên Tác nhân / Hệ thống | Vai trò & Trách nhiệm trong Kiến trúc | Trạng thái MVP | Cấp độ Tin cậy (Trust Level) |
| :--- | :--- | :--- | :---: | :--- |
| **`ACTOR-001`** | **Chủ sở hữu Gia phả (Tree Owner)** | Quản trị tài khoản, tạo cây, thêm/sửa thành viên, xuất sao lưu JSON. | `ACTIVE` | `AUTHENTICATED_USER` (Được cấp quyền theo JWT) |
| **`ACTOR-002`** | **Người dùng Chưa xác thực (Guest)** | Xem trang đăng nhập, đăng ký, quên mật khẩu. | `ACTIVE` | `UNAUTHENTICATED` (Không có quyền đọc dữ liệu phả hệ) |
| **`ACTOR-003`** | **Quản trị viên Kỹ thuật (Maintainer)** | Giám sát vận hành, kiểm tra lỗi hệ thống và bảo trì hạ tầng. | `ACTIVE` | `INFRA_ADMIN` (Chỉ truy cập telemetry, không đọc trộm cây riêng tư) |
| **`SYS-001`** | **Hệ thống GenViet Web App** | Ứng dụng Next.js xử lý nghiệp vụ phả hệ, vẽ đồ thị và bảo vệ dữ liệu. | `ACTIVE` | `CORE_SYSTEM` (Vùng tin cậy ứng dụng) |
| **`EXT-001`** | **Supabase Platform** | Quản lý định danh (Auth), lưu trữ dữ liệu (Postgres RLS) và media (Storage). | `ACTIVE` | `TRUSTED_BACKEND_SERVICE` |
| **`EXT-002`** | **Vercel Platform** | Hạ tầng tính toán Serverless chạy Next.js App Router ban đầu. | `ACTIVE` | `HOSTING_PLATFORM` (Không lưu trữ dữ liệu bền vững) |
| **`EXT-003`** | **Cloudflare DNS & WAF** | Quản lý bản ghi DNS `genviet.app`, chứng chỉ SSL và bộ lọc an ninh mạng. | `ACTIVE` | `NETWORK_GATEWAY` |
| **`EXT-004`** | **GitHub Actions Scheduler** | Bắn request heartbeat kỹ thuật giữ ấm dịch vụ, không tạo dữ liệu giả. | `ACTIVE` | `AUTOMATED_HEALTH_PROBE` |
| **`EXT-005`** | **Email Provider (Resend/Postmark)**| Gửi email giao dịch (thông báo lời mời trong tương lai). | `FUTURE` | `EXTERNAL_ADAPTER` (Chưa kích hoạt trong v0.1) |
| **`EXT-006`** | **Cloudflare Workers & R2** | Đích đến chuyển dịch hạ tầng khi cần giảm chi phí và tối ưu hóa toàn cầu. | `FUTURE` | `MIGRATION_TARGET` (Được chuẩn bị qua adapter seams) |

---

## 3. Ranh giới Tin cậy Cốt lõi (Core Trust Boundaries)
1. **`TB-001` (Ranh giới Trình duyệt ↔ Next.js Server):** Người dùng gửi request qua Internet. Mọi dữ liệu đầu vào đều bị coi là chưa tin cậy và phải qua validation.
2. **`TB-002` (Ranh giới Next.js Server ↔ Supabase):** Giao tiếp qua kết nối HTTPS bảo mật bằng API Key và User JWT Session.
3. **`TB-003` (Ranh giới PostgreSQL ↔ RLS Engine):** Tầng cưỡng chế an ninh dữ liệu nội tại CSDL. Dù application layer có lỗi thì RLS vẫn ngăn chặn truy cập trái phép chéo giữa các cây gia phả.
