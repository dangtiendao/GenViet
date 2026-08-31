# Hợp Đồng Xác Thực Google OAuth Phase P29 (OAuth Contract)

## 1. Provider Allowlist
- Chỉ chấp nhận provider: `'google'`.
- Schema:
  ```ts
  export const OAUTH_PROVIDERS = ['google'] as const;
  export type OAuthProvider = typeof OAUTH_PROVIDERS[number];
  ```

## 2. Initiation Contract
- Phương thức: `startOAuthSignIn({ provider: 'google', next?: string })`.
- Scope: `openid email profile`.
- Prompt: `select_account`.
- Callback URL cấu hình: `${getAppOrigin()}/auth/callback?next=${encodeURIComponent(sanitizedNext)}`.

## 3. Callback Route Handler Contract
- Đường dẫn: `/auth/callback` (GET).
- Header phản hồi bắt buộc:
  ```http
  Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
  Pragma: no-cache
  Expires: 0
  ```
- Quy trình xử lý:
  1. Kiểm tra tham số `error`: Nếu người dùng hủy (`access_denied`), chuyển hướng về `/auth-error?code=AUTH_OAUTH_CANCELLED`.
  2. Kiểm tra tham số `code`: Nếu thiếu, chuyển hướng về `/auth-error?code=AUTH_OAUTH_CALLBACK_CODE_MISSING`.
  3. Trao đổi mã PKCE với `supabase.auth.exchangeCodeForSession(code)` trên server.
  4. Nếu thất bại, ghi log redacted và chuyển hướng về `/auth-error?code=AUTH_OAUTH_SESSION_EXCHANGE_FAILED`.
  5. Nếu thành công, điều hướng về `getSafeRedirectUrl(next, '/dashboard')`.

## 4. UI & Accessibility Contract
- Văn bản nút: “Tiếp tục với Google”.
- Icon: Google G logo SVG chính thức.
- Focus visible: `focus-visible:ring-2 focus-visible:ring-emerald-600`.
- Chiều cao touch target tối thiểu: `44px`.
- Disabled state khi request đang kết nối để tránh duplicate submit.
