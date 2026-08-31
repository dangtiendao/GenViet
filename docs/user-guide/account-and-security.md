# Hướng Dẫn Tài Khoản & Bảo Mật (Account & Security)

## 1. Phương Thức Đăng Nhập
GenViet hỗ trợ hai phương thức xác thực an toàn và bảo mật:
- **Đăng nhập bằng Google OAuth:** Nhấn nút **Tiếp tục với Google** để đăng nhập nhanh chóng thông qua tài khoản Google của bạn.
- **Đăng nhập bằng Email và Mật khẩu:** Nhập địa chỉ email và mật khẩu đã đăng ký.

## 2. Quản Lý Tài Khoản
- **Đổi mật khẩu:** Truy cập mục **Tài khoản** $\rightarrow$ chọn **Đổi mật khẩu** (áp dụng cho tài khoản sử dụng Email/Password).
- **Quên mật khẩu:** Sử dụng chức năng [Quên mật khẩu](/forgot-password) để nhận liên kết đặt lại mật khẩu qua email.

## 3. Bảo Mật & Quyền Riêng Tư
- **Phân tách quyền hạn:** Việc đăng nhập bằng Google chỉ phục vụ mục đích chứng thực danh tính; không tự động cấp quyền truy cập vào các cây phả hệ riêng tư của người khác.
- **Bảo vệ dữ liệu phân tầng:** Toàn bộ dữ liệu cây gia phả của bạn được bảo vệ bởi cơ chế bảo mật PostgreSQL Row Level Security (RLS). Người dùng khác không thể xem hoặc chỉnh sửa dữ liệu nếu không có quyền thành viên (Owner, Editor, Viewer).
