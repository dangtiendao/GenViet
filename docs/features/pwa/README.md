# Tính Năng PWA & App Shell Ngoại Tuyến (PWA & Offline Shell Feature)

## 1. Tổng Quan
Tính năng PWA của GenViet cung cấp khả năng cài đặt ứng dụng (Installability) trên đa nền tảng (Android, iOS Safari, Desktop Chromium) cùng App Shell ngoại tuyến an toàn:
- **Web App Manifest:** Cấu hình chuẩn Next.js MetadataRoute (`src/app/manifest.ts`) với display `standalone`, theme color `#065f46`, start URL `/dashboard`.
- **Bộ App Icons:** Đầy đủ các kích thước 192x192, 512x512, maskable icons và Apple Touch Icon.
- **Service Worker An Toàn:** Cung cấp cache có version (`genviet-shell-v1`), precache trang `/offline` và static build assets.
- **Bảo Vệ Dữ Liệu Riêng Tư Tuyệt Đối (0% Private Data Caching):** Tuyệt đối không cache token, session, auth callback, graph API, search, signed URLs hay backup payload.
- **Xác Nhận Phạm Vi Ngoại Tuyến:** Hệ thống chỉ cung cấp App Shell ngoại tuyến, hiển thị rõ ràng rằng thao tác chỉnh sửa phả hệ chưa được hỗ trợ khi offline.
