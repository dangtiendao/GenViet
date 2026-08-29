# Quản lý & Cách ly Quyền Service Role (Service-Role Isolation)

- **Mã tài liệu:** `SEC-SERVICE-ROLE-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Ranh giới Khóa Đặc quyền (Service-Role Boundaries)

1. **Không Tiền tố Client:** Khóa bí mật `SUPABASE_SERVICE_ROLE_KEY` tuyệt đối không có tiền tố `NEXT_PUBLIC_` và chỉ được định nghĩa trong schema server-only của Zod (`src/lib/env/index.ts`).
2. **Server-Only Boundary Guard:** Module `src/lib/supabase/admin.ts` chứa chỉ thị `import "server-only";` ở dòng đầu tiên, ngăn chặn bundler đóng gói mã nguồn này vào trình duyệt.
3. **Browser Client Chỉ dùng Publishable Key:** `src/lib/supabase/client.ts` chỉ sử dụng `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Không Dùng Service Role để Bypass RLS trong Tests:** Toàn bộ các test suite kiểm thử phân quyền RLS (`supabase/tests/01100_*.sql` đến `01800_*.sql`) đều sử dụng vai trò `authenticated` kết hợp `SET LOCAL "request.jwt.claim.sub"`, không sử dụng quyền postgres hay service-role để giả lập người dùng.
