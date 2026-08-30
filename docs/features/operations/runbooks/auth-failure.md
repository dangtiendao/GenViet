# Sổ Tay Xử Lý Sự Cố: Xác Thực Auth Lỗi (Auth Failure Runbook - P25-T13)

- **Mức độ sự cố:** `SEV-2`.
- **Người chịu trách nhiệm chính:** Application Security Engineer / Auth Specialist.
- **Ngày rà soát gần nhất:** 30/08/2026.

## 1. Dấu Hiệu Nhận Biết
- Người dùng không thể đăng nhập hoặc bị kẹt trong vòng lặp chuyển hướng (Redirect loop) tại `/auth/callback`.
- Tỷ lệ lỗi `auth.callback_failed` hoặc `auth.session_refresh_failed` tăng đột biến.
- Cookie session `sb-*-auth-token` bị từ chối hoặc hết hạn bất thường.

## 2. Các Hành Động Nghiêm Cấm Tuyệt Đối
- **CẤM:** Mở rộng wildcard redirect URL (ví dụ: `https://*`) trên Supabase Dashboard.
- **CẤM:** Ghi lại mật khẩu người dùng, OTP hay Session Token vào log để debug.
- **CẤM:** Tắt tính năng xác minh email nếu không có phê duyệt chính thức.

## 3. Quy Trình Khắc Phục Chuẩn
1. **Kiểm tra Site URL & Redirect URLs:** Xác minh trên Supabase Dashboard mục Auth URL Configuration đã khai báo chính xác `https://genviet.vn` và `https://genviet-*.vercel.app/**`.
2. **Kiểm tra Cookie SameSite/Secure:** Đảm bảo toàn bộ request chạy trên giao thức HTTPS và cookie có cờ `SameSite=Lax`.
3. **Kiểm tra trạng thái Supabase Auth Service:** Xác minh GoTrue service trên Supabase Status Page.
