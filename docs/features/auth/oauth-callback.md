# Tài Liệu Kỹ Thuật: Xử Lý Callback Xác Thực (OAuth Callback Route)

- **Mã tài liệu:** `FEAT-AUTH-CALLBACK-01`
- **Route Handler:** `src/app/auth/callback/route.ts`
- **Service Handler:** `src/features/auth/services/handle-oauth-callback.ts`

---

## 1. Cơ Chế Xử Lý & Bảo Mật Route Handler
Route Handler tiếp nhận yêu cầu `GET /auth/callback` với các tham số:
- `code`: Mã authorization code tạm thời được sinh bởi Supabase Auth.
- `next`: Đường dẫn đích mà người dùng muốn truy cập trước khi đăng nhập.
- `error` / `error_description`: Thông tin lỗi trả về nếu người dùng từ chối cấp quyền hoặc có sự cố từ provider.

## 2. Tiêu Chuẩn Phản Hồi HTTP
Để ngăn chặn các proxy trung gian hoặc trình duyệt (Service Worker / PWA) lưu cache các tham số nhạy cảm trong URL callback:
```http
HTTP/1.1 307 Temporary Redirect
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
Pragma: no-cache
Expires: 0
Location: /dashboard
```

## 3. Quy Trình Xử Lý Lỗi Phân Cấp
- **Người dùng hủy (`error=access_denied`):** Ghi log cảnh báo `auth.login_rejected` (không kèm dữ liệu nhạy cảm) và điều hướng về `/auth-error?code=AUTH_OAUTH_CANCELLED`.
- **Thiếu mã `code`:** Điều hướng về `/auth-error?code=AUTH_OAUTH_CALLBACK_CODE_MISSING`.
- **Lỗi trao đổi mã (`exchangeCodeForSession`):** Ghi log `auth.callback_failed` và điều hướng về `/auth-error?code=AUTH_OAUTH_SESSION_EXCHANGE_FAILED`.
