# Chi tiết Danh mục Task: Phase P09 (Task Breakdown)

Tài liệu này theo dõi chi tiết 18 tasks (`P09-T01` đến `P09-T18`) trong Phase P09.

---

## Bảng Phân bổ 18 Tasks Phase P09

| Mã Task | Tên Task Kỹ thuật | Gói công việc | Trạng thái | Tệp tin Đầu ra Chính |
| :--- | :--- | :---: | :---: | :--- |
| **`P09-T01`** | Đăng ký email & mật khẩu | `WP03` | `DONE` | `src/app/(auth)/sign-up/page.tsx` |
| **`P09-T02`** | Xác minh email | `WP03` | `DONE` | `src/app/auth/callback/route.ts` & `confirm/route.ts` |
| **`P09-T03`** | Đăng nhập email & mật khẩu | `WP04` | `DONE` | `src/app/(auth)/login/page.tsx` |
| **`P09-T04`** | Đăng xuất an toàn | `WP04` | `DONE` | `signOutAction` trong `actions/index.ts` |
| **`P09-T05`** | Yêu cầu quên mật khẩu | `WP05` | `DONE` | `src/app/(auth)/forgot-password/page.tsx` |
| **`P09-T06`** | Đặt lại mật khẩu mới | `WP05` | `DONE` | `src/app/(auth)/update-password/page.tsx` |
| **`P09-T07`** | Đồng bộ session server | `WP02` | `DONE` | `src/lib/supabase/proxy.ts` & `server.ts` |
| **`P09-T08`** | Bảo vệ dashboard route | `WP02` | `DONE` | `src/app/(dashboard)/layout.tsx` |
| **`P09-T09`** | Chuyển hướng user chưa đăng nhập | `WP02` | `DONE` | `src/proxy.ts` & `src/lib/auth/redirects.ts` |
| **`P09-T10`** | Tạo profile sau đăng ký | `WP03` | `DONE` | `20260829163000_p09_provision_profiles.sql` |
| **`P09-T11`** | Cập nhật tên hiển thị | `WP06` | `DONE` | `src/app/(dashboard)/account/page.tsx` |
| **`P09-T12`** | Đổi mật khẩu trong session | `WP05` | `DONE` | `changePasswordAction` trong `actions/index.ts` |
| **`P09-T13`** | Xử lý session hết hạn | `WP06` | `DONE` | `src/lib/auth/require-user.ts` |
| **`P09-T14`** | Xử lý email link hỏng/hết hạn | `WP06` | `DONE` | `src/app/(auth)/auth-error/page.tsx` |
| **`P09-T15`** | Chuẩn bị Google OAuth | `WP07` | `DEFERRED` | [`docs/operations/google-oauth-configuration.md`](../../operations/google-oauth-configuration.md) |
| **`P09-T16`** | Kiểm thử nhiều tab | `WP08` | `DONE` | Multi-tab session specs |
| **`P09-T17`** | Kiểm thử mobile browser | `WP08` | `DONE` | `tests/e2e/auth.spec.ts` (Mobile Viewport) |
| **`P09-T18`** | Kiểm thử callback preview URL | `WP08` | `DONE` | [`docs/operations/preview-auth-callbacks.md`](../../operations/preview-auth-callbacks.md) |
