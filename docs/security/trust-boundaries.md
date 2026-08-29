# Ranh giới Tin cậy & Kiểm soát An ninh (Trust Boundaries)

- **Mã tài liệu:** `SEC-TRUST-01`
- **Mã Kiến trúc liên quan:** `TB-001..005`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Bản đồ Ranh giới Tin cậy Hệ thống (System Trust Boundaries)

```mermaid
flowchart TD
    subgraph ZoneUntrusted [Vùng 1: Ngoài Ranh giới An ninh - UNTRUSTED]
        BrowserClient["Trình duyệt Người dùng / Public Internet"]
        AttackerNode["Kẻ tấn công / Bot quét mạng"]
    end

    subgraph ZoneEdge [Vùng 2: Cổng Bảo vệ & Định tuyến - EDGE GATEWAY]
        CloudflareEdge["Cloudflare WAF / DNS / SSL Termination"]
    end

    subgraph ZoneAppServer [Vùng 3: Máy chủ Ứng dụng - TRUSTED APP SERVER]
        NextJSServer["Next.js App Router Server (Node.js / Edge Runtime)\n• Input Validation\n• Business Rules Enforcement\n• CSRF Protection"]
    end

    subgraph ZoneDataCore [Vùng 4: Lõi Dữ liệu & An ninh CSDL - HIGHEST TRUST]
        PostgreSQLCore["PostgreSQL Database Engine\n• Row Level Security (RLS Enforcement)\n• Foreign Key & Check Constraints\n• Atomic Transaction Engine"]
        PrivateStorage["Supabase Private Media Storage\n• Signed Access URLs\n• Opaque UUID Paths"]
    end

    BrowserClient -->|TB-001: HTTPS / Public Web Traffic| CloudflareEdge
    AttackerNode -.->|Bị chặn bởi WAF / Rate Limit| CloudflareEdge
    CloudflareEdge -->|TB-002: Authenticated Web Traffic| NextJSServer
    NextJSServer -->|TB-003: SQL over SSL (User JWT Session)| PostgreSQLCore
    NextJSServer -->|TB-004: S3 API (Signed Uploads)| PrivateStorage
    BrowserClient -.->|TB-005: Direct Binary Upload via Signed URL| PrivateStorage
```

---

## 2. Chi tiết 5 Ranh giới Tin cậy (Trust Boundaries)

| Mã Ranh giới | Vị trí Ranh giới | Nguy cơ Chính | Cơ chế Kiểm soát & Bảo vệ (Mitigation Controls) |
| :--- | :--- | :--- | :--- |
| **`TB-001`** | **Browser ↔ Edge Gateway** | DDoS, Bot quét lỗ hổng, Man-in-the-Middle. | • Ép buộc HTTPS/TLS 1.3.<br>• Cloudflare Web Application Firewall (WAF).<br>• Rate Limiting bảo vệ các trang đăng nhập. |
| **`TB-002`** | **Edge ↔ Next.js Server** | Giả mạo dữ liệu form, XSS, CSRF. | • Xác thực User JWT Cookie trong mọi Server Action/Route Handler.<br>• Validate schema dữ liệu bằng Zod trước khi xử lý.<br>• CSRF token tự động của Next.js Server Actions. |
| **`TB-003`** | **Next.js ↔ PostgreSQL** | IDOR (truy cập chéo cây), SQL Injection, vi phạm chu trình DAG. | • **Row Level Security (RLS)** trên 100% bảng nghiệp vụ.<br>• Sử dụng Parametrized Queries qua Supabase PostgREST Client.<br>• Service Layer kiểm tra DAG Invariant trước khi commit. |
| **`TB-004`** | **Next.js ↔ Storage** | Lộ khóa quản trị, ghi đè file của người khác. | • Khóa bucket ở chế độ **Private**.<br>• Đường dẫn file tạo bằng UUID ngẫu nhiên (`/avatars/:treeId/:uuid.ext`).<br>• Cấp Signed URL thời hạn ngắn ($\le 15$ phút). |
| **`TB-005`** | **Browser ↔ Storage** | Tải file độc hại (EXE/Script), tải file quá dung lượng. | • Kiểm tra MIME type (chỉ JPG, PNG, WebP) và dung lượng ($< 5\text{MB}$) tại bước ký URL và tại Storage Policy. |
