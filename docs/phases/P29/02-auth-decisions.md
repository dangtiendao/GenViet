# Các Quyết Định Kiến Trúc & Nghiệp Vụ Phase P29 (Auth Decisions)

## 1. Quyết Định Kiến Trúc Đã Khóa
- **ADR-P29-01: Supabase Auth làm Identity Provider duy nhất**
  - Không xây dựng authorization server nội bộ thứ hai.
  - Không tạo bảng user tùy biến độc lập với Supabase `auth.users`.
  - Giữ cookie-based session management thông qua `@supabase/ssr`.

- **ADR-P29-02: Phân tách rạch ròi giữa Xác thực (Authentication) và Phân quyền (Authorization)**
  - Đăng nhập Google thành công chỉ xác nhận tính hợp lệ của tài khoản.
  - Mọi quyền truy cập dữ liệu gia phả tiếp tục do bảng `tree_memberships` và chính sách PostgreSQL RLS kiểm soát 100%.
  - Không tự nâng quyền cho user Google.

- **ADR-P29-03: Tách biệt thực thể Tài khoản (Account) và Nhân vật phả hệ (Person)**
  - Tài khoản người dùng (Auth User) và Hồ sơ nhân vật (Person) là hai thực thể hoàn toàn độc lập.
  - Không tự động liên kết tài khoản Google với Person dù có cùng email hoặc họ tên.
  - Không tự gán avatar Google thành ảnh đại diện của Person trong cây gia phả.

- **ADR-P29-04: Quy trình Lời mời (Invitation) độc lập**
  - Người dùng đăng nhập bằng Google vẫn phải trải qua quy trình xác nhận token lời mời (P27) để nhận quyền vào cây phả hệ.
  - Không tự động accept invitation chỉ vì email Google trùng khớp.

- **ADR-P29-05: Phạm vi quyền tối thiểu (Least Privilege Scopes)**
  - Chỉ yêu cầu các scope cơ bản: `openid`, `email`, `profile`.
  - Tuyệt đối không yêu cầu quyền Google Drive, Calendar, Contacts, Gmail.

- **ADR-P29-06: Chống Open-Redirect & Caching Callback**
  - Callback Route Handler áp dụng `Cache-Control: no-store`.
  - Tham số `next` bắt buộc phải qua bộ lọc `getSafeRedirectUrl` (từ chối URL ngoại vi, protocol-relative, CRLF injection).
