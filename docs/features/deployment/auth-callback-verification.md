# Quy Trình Kiểm Tra Auth Callback Đa Môi Trường (P24-T11)

## 1. Kịch Bản Kiểm Tra Preview Deployment
1. Truy cập liên kết đăng nhập từ URL Preview (`https://genviet-git-*.vercel.app/login`).
2. Tiến hành đăng nhập bằng tài khoản thử nghiệm.
3. Sau khi xác thực thành công, kiểm tra URL chuyển hướng có giữ đúng domain của bản Preview đó hay không (không được nhảy nhầm về localhost hay production).

## 2. Kịch Bản Kiểm Tra Production
1. Truy cập `https://genviet.vn/login`.
2. Đăng nhập và xác minh cookie session `sb-*-auth-token` được thiết lập với cờ `Secure` và `SameSite=Lax`.
3. Kiểm tra tính năng Đăng xuất và điều hướng trang an toàn.
