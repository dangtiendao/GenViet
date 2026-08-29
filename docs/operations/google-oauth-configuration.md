# Hướng dẫn Tích hợp Google OAuth (Google OAuth Configuration Checklist)

- **Mã tài liệu:** `OPS-GOOGLE-AUTH-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái Task P09-T15:** `DEFERRED / MANUAL_ACTION_REQUIRED`

---

## 1. Điều kiện Kích hoạt Google OAuth
Theo thỏa thuận phạm vi Phase P01 và kế hoạch P09, Google OAuth là tính năng tùy chọn (`Should`), chỉ kích hoạt khi quy trình Email/Password đã hoạt động ổn định và có Client ID/Secret chính thức từ Google Cloud Console.

## 2. Các Bước Cấu hình Thủ công trên Google Cloud Console
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo mới hoặc chọn dự án Google Cloud tương ứng của tổ chức.
3. Cấu hình **OAuth consent screen** (User Type: External, Tên ứng dụng: GenViet, Email hỗ trợ).
4. Tạo **OAuth 2.0 Client ID** (Loại ứng dụng: Web Application).
5. Thêm **Authorized redirect URIs**:
   - `https://<supabase-project-id>.supabase.co/auth/v1/callback`
6. Sao chép Client ID và Client Secret vào Supabase Dashboard -> Authentication -> Providers -> Google.
