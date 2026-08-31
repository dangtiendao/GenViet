# Nhật Ký Thao Tác Thủ Công Yêu Cầu Phê Duyệt (Manual Actions Register)

- **Mã phase:** P29
- **Phạm vi:** Remote Mutation Actions

| ID | Hành Động | Nền Tảng | Trạng Thái | Lý Do / Ghi Chú |
| :--- | :--- | :--- | :--- | :--- |
| `MA-P29-01` | Tạo OAuth 2.0 Client ID (Web Application) | Google Cloud Console | `MANUAL_ACTION_REQUIRED` | Cần quyền chủ sở hữu Google Cloud Project |
| `MA-P29-02` | Cấu hình Consent Screen & Branding | Google Cloud Console | `MANUAL_ACTION_REQUIRED` | Khai báo tên app GenViet, logo và email hỗ trợ |
| `MA-P29-03` | Thêm Authorized Redirect URI | Google Cloud Console | `MANUAL_ACTION_REQUIRED` | Thêm URL Supabase callback `https://<project-ref>.supabase.co/auth/v1/callback` |
| `MA-P29-04` | Kích hoạt Google Provider & Nhập Secret | Supabase Dashboard | `MANUAL_ACTION_REQUIRED` | Nhập Client ID và Client Secret vào Supabase Auth |
| `MA-P29-05` | Khai báo Redirect URLs Allowlist | Supabase Dashboard | `MANUAL_ACTION_REQUIRED` | Khai báo `https://genviet.vn/**`, `https://*.vercel.app/**` |
