# Đặc Tả Web App Manifest & App Icons (Manifest & Icons Specification)

## 1. Cấu Hình Web App Manifest
- **Path:** `src/app/manifest.ts` -> sinh route `/manifest.webmanifest`.
- **Tên Ứng Dụng:** `GenViet - Quản lý Cây Gia phả` (short_name: `GenViet`).
- **Khởi Động:** `start_url: "/dashboard"`, `display: "standalone"`, `scope: "/"`.
- **Màu Sắc:** `theme_color: "#065f46"`, `background_color: "#fafafa"`.
- **Ngôn Ngữ:** `lang: "vi"`.

## 2. Danh Mục App Icons
- `public/icons/icon-192x192.png`: PNG 192x192 (purpose: any)
- `public/icons/icon-512x512.png`: PNG 512x512 (purpose: any)
- `public/icons/icon-maskable-192x192.png`: PNG 192x192 (purpose: maskable)
- `public/icons/icon-maskable-512x512.png`: PNG 512x512 (purpose: maskable)
- `public/apple-touch-icon.png`: PNG 180x180 (iOS Safari Home Screen)
- `public/favicon.ico`: Favicon 48x48
