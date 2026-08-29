# Nhật ký Quyết định Kỹ thuật: Phase P09 (Phase Decisions)

Tài liệu này ghi nhận các quyết định kỹ thuật về kiến trúc xác thực trong Phase P09.

---

## 1. Danh sách Quyết định Kỹ thuật Phase P09

| Mã Quyết định | Tiêu đề Quyết định | Trạng thái | Tóm tắt Nội dung |
| :--- | :--- | :---: | :--- |
| **`P09-DEC-001`** | **Database Trigger for Profile Provisioning:** | `ACCEPTED` | Sử dụng database trigger `_system.handle_new_user()` trên `auth.users` để bảo đảm tạo Profile ngay lập tức, nguyên tử và bao phủ mọi nguồn đăng ký. |
| **`P09-DEC-002`** | **Strict Safe Redirect Helper:** | `ACCEPTED` | Toàn bộ URL chuyển hướng phải qua `getSafeRedirectUrl()`, loại bỏ triệt để Open-Redirect và CRLF injection. |
| **`P09-DEC-003`** | **Next.js 16 Proxy Session Refresh:** | `ACCEPTED` | Tận dụng convention `src/proxy.ts` (Next.js 16) để tự động làm mới cookie phiên trên mọi incoming request mà không thực hiện query nghiệp vụ nặng. |
| **`P09-DEC-004`** | **Neutral Responses for Password Recovery:** | `ACCEPTED` | Yêu cầu quên mật khẩu luôn trả về thông báo trung tính thành công để chống tấn công dò tài khoản (Account Enumeration). |
| **`P09-DEC-005`** | **Server Actions for Auth Mutations:** | `ACCEPTED` | Mọi thao tác Auth (login, signup, signout, change password) thực hiện qua Server Actions, bảo đảm mã nguồn an toàn trên server. |
| **`P09-DEC-006`** | **Deferred Google OAuth Checklist:** | `ACCEPTED` | Tách Google OAuth thành tài liệu hướng dẫn thủ công (`MANUAL_ACTION_REQUIRED`), không đưa client secret vào repo hoặc chặn merge MVP. |
