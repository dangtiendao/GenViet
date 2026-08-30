# Cấu Hình Supabase Auth Redirect URLs (P24-T07)

## 1. Cấu Hình Bắt Buộc Trên Supabase Dashboard (Authentication $\rightarrow$ URL Configuration)

### Site URL
- `https://genviet.vn` (Canonical Production URL)

### Redirect URLs (Cho phép chuyển hướng hợp lệ)
- `http://localhost:3000/**` (Cho môi trường Local Development)
- `https://genviet.vn/**` (Cho môi trường Production)
- `https://www.genviet.vn/**` (Cho subdomain www)
- `https://genviet-*.vercel.app/**` (Cho các bản Vercel Preview Deployments)

## 2. Phòng Chống Tấn Công Open-Redirect
Mọi yêu cầu chuyển hướng sau khi đăng nhập (`next`) đều được kiểm tra nghiêm ngặt qua hàm `getSafeRedirectUrl` tại `src/lib/auth/redirects.ts` để loại bỏ các URL trỏ ra ngoài tên miền cho phép hoặc chứa mã độc CRLF.
