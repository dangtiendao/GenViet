# Sơ đồ Khối Ứng dụng (Container Diagram - C4 Level 2)

- **Mã tài liệu:** `ARCH-CONTAINER-01`
- **Mã Kiến trúc liên quan:** `CNT-001..008`, `TB-001..005`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Sơ đồ Container C4 Diagram (Mermaid)

```mermaid
flowchart TD
    User([👤 Chủ sở hữu Gia phả])
    HeartbeatTrigger([⏰ GitHub Actions Scheduler])

    subgraph ClientBoundary [Ranh giới Máy khách - Client Side]
        CNT01["📱 Trình duyệt / Installed PWA\n[CNT-001]\n• UI React / DOM\n• React Flow Canvas\n• ELK.js Layout Engine\n• Local State & Forms"]
    end

    subgraph AppBoundary [Ranh giới Máy chủ Ứng dụng - Next.js App Router]
        CNT02["▲ Next.js Web Application\n[CNT-002]\n• Server Components (SSR)\n• Server Actions (Mutations)\n• Route Handlers (API / Files)\n• Domain Services & Validators\n• Repositories & Adapters"]
    end

    subgraph SupabaseBoundary [Ranh giới Nền tảng Dữ liệu - Supabase Managed]
        CNT03["🔐 Supabase Auth\n[CNT-003]\n• Quản lý Identity & Phiên JWT\n• Email/Password & Reset"]
        CNT04["🐘 PostgreSQL Database\n[CNT-004]\n• NGUỒN SỰ THẬT DUY NHẤT\n• Row Level Security (RLS)\n• Transactions & Bất biến\n• Audit & Metadata"]
        CNT05["📦 Supabase Storage\n[CNT-005]\n• Private Bucket (Avatar Media)\n• Signed Access & Upload URLs"]
    end

    subgraph ExternalFutureBoundary [Khối Dự phòng & Chuyển dịch Tương lai]
        CNT06["⏰ Heartbeat Endpoint\n[CNT-006]\n• Kiểm tra trạng thái hệ thống\n• Không tạo bản ghi Person giả"]
        CNT07["📧 Email Adapter Seam\n[CNT-007 - Tương lai]\n• Resend / Postmark Interface"]
        CNT08["☁️ Cloudflare Workers / R2\n[CNT-008 - Đích Chuyển dịch]\n• Zero-lock-in Runtime Target"]
    end

    User -->|1. Tương tác UI, chạm canvas, nhập form| CNT01
    CNT01 -->|2. HTTPS / WSS: Gửi Server Actions & Fetch Route Handlers| CNT02
    CNT01 -.->|3. HTTPS: Tải/Gửi trực tiếp ảnh Avatar qua Signed URL| CNT05
    CNT01 -.->|4. HTTPS: Đăng nhập trực tiếp lấy JWT phiên| CNT03

    CNT02 -->|5. HTTPS: Xác thực phiên SSR với Cookie/JWT| CNT03
    CNT02 -->|6. SQL/PostgREST qua HTTPS/SSL: Truy vấn dữ liệu có RLS| CNT04
    CNT02 -->|7. S3/Storage API: Ký upload URL & quản lý avatar| CNT05
    CNT02 -.->|8. Tùy chọn tương lai: Gửi email giao dịch| CNT07

    HeartbeatTrigger -->|9. HTTPS GET /api/healthz (Không ghi dữ liệu)| CNT02
```

---

## 2. Đặc tả Chi tiết Toàn bộ 8 Containers

### `CNT-001`: Trình duyệt / Installed PWA (Client Runtime)
- **Trách nhiệm:** Render DOM, quản lý tương tác đồ thị React Flow, tính toán bố cục ELK.js (trong Web Worker khi cây lớn), hiển thị Bottom Sheet di động và bắt lỗi form tức thì.
- **Công nghệ:** HTML5, CSS/Tailwind, TypeScript, React Flow, ELK.js.
- **Dữ liệu xử lý:** ViewModel hiển thị, slice cây thu gọn (30-50 node), form state chưa submit.
- **Mức độ tin cậy:** `UNTRUSTED` (Client không nắm giữ quyền quản trị, không chứa `SUPABASE_SERVICE_ROLE_KEY`).
- **Giao tiếp:** HTTPS tới Next.js Server (`CNT-002`) và Supabase (`CNT-003`, `CNT-005`).

### `CNT-002`: Next.js Web Application (Server Runtime)
- **Trách nhiệm:** Định tuyến App Router, Server-First SSR, thực thi Server Actions có xác thực, kiểm tra bất biến phả hệ (DAG Invariant `INV-004`, niên đại), điều phối transaction và kiểm toán.
- **Công nghệ:** Next.js (App Router), React Server Components, TypeScript.
- **Dữ liệu xử lý:** Dữ liệu phả hệ nguyên vẹn, User Session, Audit payload.
- **Mức độ tin cậy:** `TRUSTED_APPLICATION_CORE`.
- **Giao tiếp:** Gọi Supabase Auth (`CNT-003`), PostgreSQL (`CNT-004`) và Storage (`CNT-005`).

### `CNT-003`: Supabase Auth (Identity Container)
- **Trách nhiệm:** Cấp phát và xác thực JWT token, mã hóa mật khẩu (`bcrypt`/`argon2`), gửi email đặt lại mật khẩu.
- **Công nghệ:** GoTrue / Supabase Auth Engine.
- **Dữ liệu xử lý:** Email đăng nhập, Password hash, JWT Claims.
- **Mức độ tin cậy:** `MANAGED_SECURITY_SERVICE`.

### `CNT-004`: PostgreSQL Database (Data Core Container)
- **Trách nhiệm:** **Nguồn Sự Thật duy nhất** lưu trữ Trees, Memberships, Persons, Relationships, Unverified Data, Audit Logs. Cưỡng chế phân quyền dữ liệu bằng Row Level Security (RLS).
- **Công nghệ:** PostgreSQL 15+ (Supabase Managed).
- **Dữ liệu xử lý:** 100% dữ liệu nghiệp vụ của toàn bộ người dùng.
- **Mức độ tin cậy:** `HIGHEST_TRUST_DATA_STORE`.

### `CNT-005`: Supabase Storage (Binary Media Container)
- **Trách nhiệm:** Lưu trữ nhị phân file ảnh chân dung thành viên (Avatar) trong các Private Buckets được bảo vệ bằng Signed URL ngắn hạn (5-15 phút).
- **Công nghệ:** Supabase Storage (S3-compatible API).
- **Dữ liệu xử lý:** Binary image files (JPG, PNG, WebP $\le 5\text{MB}$).
- **Mức độ tin cậy:** `MANAGED_OBJECT_STORE`.

### `CNT-006`: External Scheduler / Health Check Probe
- **Trách nhiệm:** Bắn tín hiệu heartbeat HTTP định kỳ để giữ ấm dịch vụ và kiểm tra tình trạng kết nối CSDL.
- **Quy tắc an toàn:** **Tuyệt đối không tạo dữ liệu Person/Tree giả trong CSDL**.
- **Công nghệ:** GitHub Actions Workflow / Cloudflare Cron.

### `CNT-007`: Email Adapter Seam (Future Container)
- **Trách nhiệm:** Cung cấp interface gửi email thông báo khi dự án nâng cấp lên v0.2+ (chưa kích hoạt trong v0.1).
- **Công nghệ:** Resend / Postmark Adapter Interface.

### `CNT-008`: Cloudflare Workers & R2 (Migration Target Container)
- **Trách nhiệm:** Đích đến dự phòng kiến trúc. Toàn bộ mã nguồn ở `CNT-002` và `CNT-005` được thiết kế tuân thủ Web APIs để có thể chuyển sang Cloudflare mà không phải refactor logic nghiệp vụ.
