# Hướng Dẫn Cấu Hình Google Cloud Console & Supabase Dashboard (Setup Runbook)

- **Mã tài liệu:** `RUNBOOK-GOOGLE-AUTH-01`
- **Phiên bản:** `v1.0`
- **Trạng thái thực thi:** `MANUAL_ACTION_REQUIRED`

---

## 1. Hướng Dẫn Cấu Hình Google Cloud Console

### Bước 1: Chọn hoặc tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Chọn dự án chính thức của tổ chức (ví dụ: `genviet-production`).

### Bước 2: Cấu hình OAuth Consent Screen
1. Vào mục **APIs & Services** -> **OAuth consent screen**.
2. Chọn **User Type**: `External` (Người dùng bên ngoài).
3. Nhập thông tin ứng dụng:
   - **App name:** `GenViet`
   - **User support email:** `<support-email>`
   - **Developer contact information:** `<admin-email>`
4. Phần **Scopes**: Chọn `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`.
5. Nhấn **Save and Continue**.

### Bước 3: Tạo OAuth 2.0 Client ID
1. Vào mục **APIs & Services** -> **Credentials**.
2. Nhấn **Create Credentials** -> **OAuth client ID**.
3. **Application type:** `Web application`.
4. **Name:** `GenViet Web App`.
5. **Authorized JavaScript origins:**
   - `http://localhost:3000`
   - `https://genviet.vn`
6. **Authorized redirect URIs (QUAN TRỌNG):**
   - Thêm URL Supabase Auth Callback: `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
   - *(Dành cho Local Supabase nếu dùng)*: `http://127.0.0.1:54321/auth/v1/callback`
7. Nhấn **Create**. Sao chép **Client ID** và **Client Secret** an toàn.

---

## 2. Hướng Dẫn Cấu Hình Supabase Dashboard

### Bước 1: Kích hoạt Google Provider
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard).
2. Chọn dự án GenViet.
3. Điều hướng tới mục **Authentication** -> **Providers**.
4. Tìm và chọn **Google**.
5. Bật tùy chọn **Enable Google provider**.
6. Dán **Client ID** và **Client Secret** đã nhận từ Google Cloud Console.
7. Nhấn **Save**.

### Bước 2: Cấu hình URL Configuration
1. Điều hướng tới mục **Authentication** -> **URL Configuration**.
2. **Site URL:** Nhập `https://genviet.vn` (hoặc `http://localhost:3000` đối với môi trường dev cục bộ).
3. **Redirect URLs:** Thêm danh sách sau:
   - `http://localhost:3000/**`
   - `http://127.0.0.1:3000/**`
   - `https://genviet.vn/**`
   - `https://*.vercel.app/**`
4. Nhấn **Save**.

---

## 3. Kế Hoạch Rollback (Rollback Plan)
Nếu phát sinh sự cố từ phía Google Cloud hoặc Supabase:
1. Vào **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Google** -> Tắt **Enable Google provider**.
2. Hệ thống GenViet sẽ tự động fallback về đăng nhập Email/Password mà không làm gián đoạn người dùng hiện tại.
