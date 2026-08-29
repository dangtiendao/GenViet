# Hướng dẫn Cấu hình Supabase Auth (Supabase Auth Configuration Guide)

- **Mã tài liệu:** `OPS-SUPA-AUTH-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Cấu hình Tham số Auth trong Supabase Dashboard

1. **Site URL:**
   - Môi trường Local: `http://localhost:3000`
   - Môi trường Preview: `https://<branch-name>-genviet.vercel.app`
   - Môi trường Production: `https://genviet.app`
2. **Redirect URLs (Allowlist):**
   - `http://localhost:3000/**`
   - `https://*.vercel.app/**` (hoặc wildcard domain chính thức)
   - `https://genviet.app/**`
3. **Cài đặt Email Provider:**
   - `Enable Email provider`: **ON**
   - `Confirm email`: **ON** (bắt buộc xác thực email trước khi đăng nhập chính thức)
   - `Secure email change`: **ON**
