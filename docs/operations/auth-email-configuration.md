# Cấu hình Mẫu Email & Dịch vụ SMTP (Auth Email Configuration)

- **Mã tài liệu:** `OPS-EMAIL-AUTH-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Mẫu Email Xác thực & Khôi phục

1. **Email Xác nhận Đăng ký (Confirm Email):**
   - Tiêu đề: `Xác thực tài khoản GenViet của bạn`
   - Nội dung liên kết: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
2. **Email Đặt lại Mật khẩu (Reset Password):**
   - Tiêu đề: `Yêu cầu đặt lại mật khẩu GenViet`
   - Nội dung liên kết: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=%2Fupdate-password`

## 2. Lưu ý Vận hành SMTP
- Mặc định Supabase cung cấp máy chủ gửi email thử nghiệm giới hạn số lượng thấp.
- Đối với môi trường Production, bắt buộc cấu hình Custom SMTP (Resend / SendGrid / Amazon SES) để bảo đảm tỷ lệ vào hộp thư chính (Inbox) cao nhất.
