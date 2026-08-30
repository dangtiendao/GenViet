# Hướng Dẫn Chạy Production Smoke Tests (P24-T13)

## 1. Mục Đích & Phạm Vi
Smoke test là bộ kiểm tra nhanh, tự động và **hoàn toàn phi phá hủy (Read-only)** nhằm xác nhận tính sẵn sàng của bản triển khai Production mà không làm thay đổi dữ liệu thật của người dùng.

## 2. Lệnh Thực Thi
```bash
node scripts/deployment/smoke-production.mjs https://genviet.vn
```

## 3. Các Điểm Kiểm Tra Chính
1. API Health Check (`/api/health`) phản hồi HTTP 200.
2. Web App Manifest (`/manifest.webmanifest`) phản hồi HTTP 200.
3. Service Worker Script (`/sw.js`) phản hồi HTTP 200.
4. Trang Offline Fallback (`/offline`) phản hồi HTTP 200.
5. Trang Đăng nhập (`/login`) và Đăng ký (`/sign-up`) hiển thị giao diện đầy đủ.
