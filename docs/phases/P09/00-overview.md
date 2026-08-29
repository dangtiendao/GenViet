# Phase Overview: P09 - Xác thực Người dùng (User Authentication)

- **Mã Phase:** `P09`
- **Tên Phase:** Xác thực người dùng (User Authentication)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE`
- **Nhánh Git thi công:** `phase/p09-user-authentication`
- **Starting Commit:** `8627d78` (Merge PR #8 for P08)
- **Vai trò thi công:** Principal Authentication Engineer, Next.js App Router Engineer & Supabase Auth Specialist
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase P09

1. Triển khai toàn diện quy trình Đăng ký tài khoản (Sign-Up) bằng Email & Mật khẩu.
2. Triển khai quy trình Xác minh Email (Email Confirmation) với PKCE và OTP callback an toàn.
3. Triển khai quy trình Đăng nhập (Sign-In) bằng Email & Mật khẩu, thiết lập phiên HTTP-Only Secure Cookie.
4. Triển khai quy trình Đăng xuất (Sign-Out) thông qua POST Server Action.
5. Triển khai quy trình Quên mật khẩu (Forgot Password) và Đặt lại mật khẩu mới (Update Password).
6. Đồng bộ phiên làm việc (Session Synchronization) tự động giữa trình duyệt và server với `@supabase/ssr` và Next.js 16 Proxy.
7. Xây dựng Dashboard Shell được bảo vệ nhiều lớp (`Edge Proxy` -> `requireUser Server Guard` -> `PostgreSQL RLS`).
8. Khởi tạo Profile tự động (Profile Provisioning) khi người dùng đăng ký tài khoản qua Database Trigger `_system.handle_new_user()`.
9. Cung cấp trang Cài đặt tài khoản (`/account`) cho phép cập nhật tên hiển thị và đổi mật khẩu khi đang đăng nhập.
10. Xử lý triệt để các tình huống ngoại lệ: liên kết email hỏng/hết hạn, phiên làm việc hết hạn, chống tấn công Open-Redirect.
11. Xây dựng bộ test suites toàn diện (Unit tests, Security tests, Database tests, Playwright E2E tests).

---

## 2. Ranh giới Kỹ thuật Nghiêm ngặt (Strict Boundaries)

- ❌ **Không triển khai quản lý cây gia phả hoặc Person Node** (Thuộc Phase P11 - P13).
- ❌ **Không triển khai tính năng tải lên Avatar / Storage Bucket** (Thuộc Phase P14).
- ❌ **Không tự push code lên Git remote, merge hoặc tạo Pull Request.**
