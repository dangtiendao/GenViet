# Quản trị Phiên làm việc & Đồng bộ Server (Session Management)

- **Mã tài liệu:** `SEC-SESSION-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Kiến trúc Quản lý Session với `@supabase/ssr`

1. **Lưu trữ Cookie HTTP-Only Secure:**
   - Token JWT và Refresh Token được lưu hoàn toàn trong HTTP-Only Cookie.
   - Không lưu trữ token trong `localStorage` hay `sessionStorage` để triệt tiêu nguy cơ đánh cắp phiên qua XSS.
2. **Next.js 16 Proxy Session Refresh:**
   - Proxy (`src/proxy.ts` / `src/lib/supabase/proxy.ts`) tự động làm mới (refresh) access token khi token sắp hết hạn trên các yêu cầu HTTP đến.
3. **Bảo vệ Đa tầng (Defense-in-Depth):**
   - **Tầng 1 - Edge Proxy:** Redirect sơ bộ người dùng chưa đăng nhập khi truy cập `/dashboard` hoặc `/account` sang `/login?next=...`.
   - **Tầng 2 - Server Guard (`requireUser`):** Xác minh trực tiếp phiên làm việc với Supabase Auth Server qua `supabase.auth.getUser()`.
   - **Tầng 3 - Server Actions:** Xác minh `auth.uid()` độc lập trước khi thực hiện mutation.
   - **Tầng 4 - PostgreSQL RLS:** Rào chắn dữ liệu cuối cùng tại tầng CSDL.
