# Kiến trúc Render & Định tuyến Next.js (Rendering & Routing Architecture)

- **Mã tài liệu:** `ARCH-RENDER-01`
- **Mã Kiến trúc liên quan:** `AR-005`, `CMP-003`, `ADR-0001`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Lựa chọn Kiến trúc Định tuyến: Next.js App Router

Hệ thống GenViet v0.1 chuẩn hóa sử dụng **Next.js App Router** (`app/` directory) làm mô hình định tuyến và render cốt lõi.

### Cấu trúc Thư mục Định tuyến Khái niệm (App Router Structure)

```text
src/app/
├── (auth)/                    # Route Group cho phân hệ xác thực
│   ├── login/page.tsx         # SCR-001: Đăng nhập (Server Component)
│   ├── signup/page.tsx        # SCR-002: Đăng ký (Server Component)
│   ├── forgot-password/page.tsx # SCR-003: Quên mật khẩu
│   └── reset-password/page.tsx  # SCR-004: Đặt lại mật khẩu
├── (dashboard)/               # Route Group cho phân hệ quản trị
│   ├── page.tsx               # SCR-005: Trang chủ Dashboard & Danh sách cây
│   ├── trees/
│   │   ├── new/page.tsx       # SCR-007: Tạo cây gia phả mới
│   │   └── [treeId]/
│   │       ├── page.tsx       # SCR-009: Khung nhìn Cây Canvas chính
│   │       ├── settings/page.tsx # SCR-019: Cài đặt cây & Xuất sao lưu
│   │       └── search/page.tsx   # SCR-010: Tra cứu thành viên toàn diện
│   └── account/page.tsx       # SCR-022: Quản lý tài khoản cá nhân
├── api/                       # Route Handlers cho HTTP endpoints
│   ├── auth/callback/route.ts # Supabase Auth PKCE Callback
│   ├── media/sign-upload/route.ts # Ký URL upload ảnh chân dung
│   ├── tree/[treeId]/export/route.ts # Stream file xuất sao lưu JSON
│   └── healthz/route.ts       # Endpoint kiểm tra sức khỏe hệ thống (Heartbeat)
├── layout.tsx                 # Root Layout: HTML, Font, Theme Provider
├── error.tsx                  # Global Error Boundary (Fallback an toàn)
└── not-found.tsx              # SCR-023: Màn hình 404 trang không tồn tại
```

---

## 2. Chiến lược Render Server-First (Server-First Rendering Strategy)

1. **Mặc định Server Component (RSC):** Mọi `layout.tsx` và `page.tsx` đều là Server Components. Dữ liệu cây gia phả, danh sách thành viên, thông tin người dùng được truy vấn trực tiếp tại server qua Service Layer trước khi render HTML.
2. **Không Gửi Mã Nguồn Dư thừa xuống Trình duyệt:** Các thư viện nghiệp vụ nặng như DAG cycle detection, Zod schema validation, Supabase postgREST SDK chỉ chạy trên server, giúp giảm kích thước gói bundle tải về trên mobile xuống mức tối thiểu ($< 150\text{KB}$ First Load JS).
3. **Phân tách Độc lập Giao diện Tương tác:** Chỉ các thành phần thực sự cần tương tác DOM động (React Flow canvas, Bottom Sheet vuốt chạm, hộp thoại Modal) mới được gắn cờ `'use client'`.
