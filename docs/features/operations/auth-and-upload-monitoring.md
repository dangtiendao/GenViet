# Giám Sát Luồng Xác Thực & Tải Lên Media (P25-T08, P25-T09)

## 1. Giám Sát Xác Thực (Auth Monitoring)
- Phân biệt giữa thông tin đăng nhập sai thông thường (`auth.login_rejected` - log `warn`) và sự cố hệ thống (`auth.system_failure` - log `error`).
- Tuyệt đối không lưu lại email, mật khẩu hay token xác thực trong log.

## 2. Giám Sát Tải Lên Media (Upload Monitoring)
- Theo dõi theo từng chặng: `validation` $\rightarrow$ `prepare` $\rightarrow$ `transfer` $\rightarrow$ `finalize` $\rightarrow$ `cleanup`.
- Tuyệt đối không log dữ liệu ảnh nhị phân, Base64 hay URL có chứa token ký duyệt (Signed URLs).
