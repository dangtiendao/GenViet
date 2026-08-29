# Kiến trúc Định danh & Xác thực (Authentication Architecture)

- **Mã tài liệu:** `ARCH-AUTH-01`
- **Mã Kiến trúc liên quan:** `AR-004`, `CNT-003`, `ADR-0004`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Nền tảng Định danh Mục tiêu: Supabase Auth

GenViet v0.1 sử dụng **Supabase Auth** làm Nhà cung cấp Định danh (Identity Provider - IdP) chính thức.

```mermaid
graph TD
    User([Người dùng]) --> LoginUI[Giao diện Đăng nhập / Đăng ký]
    LoginUI -->|Email & Password| SupaAuthServer[Supabase Auth Engine]
    SupaAuthServer -->|Mã hóa & Lưu| AuthSchema[(Schema: auth.users)]
    SupaAuthServer -->|Phát hành| JWTToken[Signed JWT Token\n(sub: User ID, exp, role)]
    JWTToken --> NextSSR[Next.js SSR Middleware & Server Client]
    NextSSR --> PostgresRLS[PostgreSQL RLS: auth.uid()]
```

---

## 2. Các Quy chuẩn Kỹ thuật Xác thực Bắt buộc

1. **Phương thức Xác thực Cốt lõi:** Email và Mật khẩu (theo đúng phạm vi MVP v0.1 tại P01). Hỗ trợ quy trình Đăng ký, Đăng nhập, Quên mật khẩu và Đặt lại mật khẩu an toàn.
2. **Cơ chế Phiên làm việc (Session Management) với `@supabase/ssr`:**
   - Phiên đăng nhập được lưu trữ an toàn trong **HTTP-Only, Secure Cookies** (không lưu trong `localStorage` để chống tấn công đánh cắp phiên qua XSS).
   - Middleware nhẹ của Next.js thực hiện kiểm tra và làm mới token (Token Refresh) tự động khi cookie sắp hết hạn.
3. **Phân định Tuyệt đối giữa User Account và Person Node (`INV-001`):**
   - Bảng `auth.users` chỉ chứa tài khoản đăng nhập (Email, Password Hash, Metadata kỹ thuật).
   - Bảng `public.persons` chứa các nhân vật trong cây gia phả.
   - **Xóa tài khoản User không tự động xóa các nhân vật Person** nếu gia phả đã được chuyển giao hoặc lưu trữ lịch sử dòng họ.
4. **Không Dùng Quyền Quản trị `service_role` Bừa bãi:**
   - Client Component tuyệt đối không chứa khóa `SUPABASE_SERVICE_ROLE_KEY`.
   - Mọi truy vấn từ Server Actions mặc định sử dụng client gắn kèm `User JWT Context` để CSDL tự động áp dụng RLS.
