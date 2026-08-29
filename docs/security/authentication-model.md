# Mô hình Định danh & Xác thực Người dùng (Authentication Model)

- **Mã tài liệu:** `SEC-AUTH-MODEL-01`
- **Phiên bản:** `v0.1-baseline`
- **Phase thực thi:** `P09`
- **Trạng thái:** `LOCKED`

---

## 1. Nguyên tắc Định danh Cốt lõi (Core Identity Principles)

1. **Supabase Auth as Central IdP:**
   - Schema `auth.users` là nguồn chân lý duy nhất lưu trữ tài khoản đăng nhập (Email, Encrypted Password, Verification Status, JWT Claims).
2. **Phân tách Tuyệt đối giữa User Account và Person Node (`INV-001`):**
   - User Account (`auth.users`) đại diện cho người dùng đăng nhập hệ thống.
   - Person Node (`public.persons`) đại diện cho nhân vật trong cây phả hệ dòng họ.
   - Việc đăng ký tài khoản User **tuyệt đối không tự động tạo Person Node**.
   - Việc xóa tài khoản User **không làm ảnh hưởng đến dữ liệu Person Node** trong cây gia phả.
3. **Cơ chế Khởi tạo Hồ sơ Tự động (Profile Provisioning):**
   - Thực thi thông qua Database Trigger `on_auth_user_created` gắn trên `auth.users`, gọi hàm `_system.handle_new_user()`.
   - Bảo đảm quan hệ 1:1 giữa `auth.users.id` và `public.profiles.id`.
   - Có tính lũy kế (idempotent - `ON CONFLICT (id) DO NOTHING`).

---

## 2. Các Luồng Xác thực Hỗ trợ trong v0.1

1. **Đăng ký Email/Mật khẩu (Email/Password Sign-Up):**
   - Mật khẩu tối thiểu 6 ký tự.
   - Gửi email xác thực kèm liên kết kích hoạt PKCE.
2. **Xác minh Email (Email Confirmation Callback):**
   - Xử lý mã xác thực PKCE qua `/auth/callback` hoặc OTP qua `/auth/confirm`.
   - Kích hoạt tài khoản và chuyển hướng an toàn tới `/dashboard`.
3. **Đăng nhập Email/Mật khẩu (Email/Password Sign-In):**
   - Kiểm tra thông tin đăng nhập, thiết lập phiên làm việc HTTP-Only Secure Cookie.
   - Chống tấn công dò tài khoản (Account Enumeration Prevention) qua thông báo lỗi đồng nhất.
4. **Quên & Đặt lại Mật khẩu (Password Recovery):**
   - Yêu cầu liên kết recovery gửi về email với thông báo trung tính.
   - Xác thực phiên khôi phục và cho phép cập nhật mật khẩu mới qua `/update-password`.
5. **Đăng xuất (Sign-Out):**
   - Gọi `signOut()` qua Server Action (POST mutation), hủy phiên cookie và chuyển về `/login`.
