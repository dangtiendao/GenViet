# Chiến lược Callback Xác thực trên Preview Deployment (Preview Auth Callbacks)

- **Mã tài liệu:** `OPS-PREVIEW-AUTH-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Chiến lược Định tuyến Callback trên Vercel Preview

1. **Vấn đề Đặt ra:** Mỗi Pull Request hoặc branch deployment trên Vercel sẽ tự động sinh ra một URL dạng `https://genviet-<hash>-<team>.vercel.app`.
2. **Giải pháp Phân quyền Wildcard Hẹp:**
   - Trong Supabase Dashboard, chỉ đăng ký pattern hẹp: `https://genviet-*-<team>.vercel.app/**`.
   - Tuyệt đối **không mở wildcard toàn bộ** `https://*.vercel.app/**` nhằm ngăn chặn kẻ xấu sử dụng project Vercel của bên thứ ba để trộm mã xác thực PKCE.
3. **Phát hiện Origin Động trong Server Actions:**
   - Code Server Action tại `src/features/auth/actions/index.ts` trích xuất `x-forwarded-host` và `x-forwarded-proto` từ request headers để cấu hình `emailRedirectTo` động và chính xác tới đúng môi trường Preview tương ứng.
