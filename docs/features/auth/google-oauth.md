# Tài Liệu Kỹ Thuật: Đăng Nhập Bằng Google OAuth (Google OAuth Integration)

- **Mã tài liệu:** `FEAT-AUTH-GOOGLE-01`
- **Phiên bản:** `v1.0`
- **Phạm vi triển khai:** Phase P29

---

## 1. Kiến Trúc & Luồng Xác Thực (PKCE Flow)
GenViet sử dụng Supabase Auth SSR với cơ chế Proof Key for Code Exchange (PKCE) nhằm đảm bảo an toàn tuyệt đối cho ứng dụng web hiện đại:

```
[ Người dùng ] -> Click "Tiếp tục với Google"
      │
      ▼
[ Client Browser ] -> `startOAuthSignIn({ provider: 'google', next })`
      │              (Khởi tạo PKCE code_challenge, lưu verifier vào cookie)
      ▼
[ Google Accounts ] -> Đăng nhập & Xác nhận đồng ý phạm vi (openid, email, profile)
      │
      ▼
[ Supabase Auth Server ] -> Nhận callback từ Google (`/auth/v1/callback`)
      │                     (Tạo mã authorization code nội bộ)
      ▼
[ GenViet App Callback ] -> `/auth/callback?code=...&next=...`
      │                     (`handleOAuthCallback` trao đổi code -> Session Cookies)
      ▼
[ GenViet Dashboard ] -> Điều hướng an toàn tới trang đích nội bộ
```

## 2. Các Ranh Giới Bảo Mật Bất Biến
1. **Chỉ dùng Supabase Auth:** Không tạo thêm bảng lưu password hay bảng trung gian người dùng.
2. **Không tự cấp quyền (Zero Auto-Membership):** Tài khoản mới từ Google phải được Owner mời vào cây phả hệ hoặc tạo cây mới.
3. **Không tự liên kết Person:** Thông tin từ Google không tự động map với bất kỳ nhân vật nào trong gia phả.
4. **Không rò rỉ secret:** Google Client Secret được bảo vệ hoàn toàn phía Supabase backend.
