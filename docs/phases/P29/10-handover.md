# Biên Bản Bàn Giao Kỹ Thuật Phase P29 (Handover Report)

- **Mã phase:** P29
- **Tên phase:** Đăng nhập bằng Google OAuth
- **Trạng thái:** `HOÀN TẤT THI CÔNG LOCAL / CHỜ CẤU HÌNH REMOTE`
- **Nhánh git làm việc:** `phase/p29-google-oauth`
- **P30 đã bắt đầu chưa:** `KHÔNG (P30 CHƯA BẮT ĐẦU)`

## 1. Danh Mục Hạng Mục Đã Bàn Giao
1. **Module mã nguồn:**
   - `src/features/auth/contracts/auth-provider.ts`: Allowlist và types.
   - `src/features/auth/contracts/oauth-return-path.ts`: Return path validator.
   - `src/features/auth/services/start-oauth-sign-in.ts`: Dịch vụ khởi tạo PKCE Google OAuth client.
   - `src/features/auth/services/handle-oauth-callback.ts`: Dịch vụ xử lý trao đổi PKCE code server.
   - `src/features/auth/components/google-sign-in-button.tsx`: Component nút Google chuẩn a11y.
   - `src/features/auth/components/oauth-error-message.tsx`: Hiển thị thông báo lỗi OAuth.
   - `src/features/auth/errors/index.ts`: Bổ sung 20 mã lỗi P29 taxonomy.
   - `src/lib/auth/session-cleanup.ts`: Dọn dẹp phiên và cache riêng tư.
   - `src/app/auth/callback/route.ts`: Handler callback với no-store header.
   - `src/app/(auth)/login/page.tsx`: Giao diện đăng nhập hoàn chỉnh.

2. **Bộ kiểm thử:**
   - `tests/unit/auth/google-oauth.test.ts`
   - `tests/unit/auth/safe-return-path.test.ts`
   - `tests/unit/auth/session-isolation.test.ts`
   - `tests/integration/auth/oauth-callback.test.ts`
   - `tests/security/oauth-security.test.ts`
   - Cập nhật `tests/unit/auth-errors.test.ts`

3. **Tài liệu & Hướng dẫn:**
   - `docs/features/auth/google-oauth.md`
   - `docs/features/auth/oauth-callback.md`
   - `docs/features/auth/redirect-matrix.md`
   - `docs/features/auth/google-cloud-supabase-setup.md`
   - `docs/user-guide/account-and-security.md`
   - Bộ tài liệu P29: `docs/phases/P29/` (00 -> 10, issues/)

## 2. Các Thao Tác Thủ Công Còn Lại (MANUAL_ACTION_REQUIRED)
Các thao tác remote sau cần thực hiện trên giao diện quản trị Google Cloud Console và Supabase Dashboard:
1. Tạo OAuth 2.0 Web Client trên Google Cloud Console.
2. Thêm Authorized Redirect URI: `https://<supabase-project-id>.supabase.co/auth/v1/callback`.
3. Nhập Google Client ID và Client Secret vào Supabase Dashboard -> Authentication -> Providers -> Google.
4. Cấu hình Supabase Redirect URLs allowlist cho các domain Preview/Production.
