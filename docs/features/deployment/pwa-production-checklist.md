# Danh Sách Kiểm Tra PWA Trên Môi Trường Production (P24-T12)

## 1. Yêu Cầu Kỹ Thuật PWA
- [x] Web App Manifest trả về mã HTTP 200 tại `/manifest.webmanifest`.
- [x] Khai báo đầy đủ icons kích thước 192x192, 512x512, maskable và apple-touch-icon.
- [x] Đăng ký Service Worker an toàn tại `/sw.js` trên giao thức HTTPS.
- [x] Trang dự phòng `/offline` hoạt động khi mất kết nối mạng.
- [x] Dữ liệu nhạy cảm (Private Graph, Signed URLs, Tokens) tuyệt đối KHÔNG được lưu trong Cache Storage.
- [x] Khả năng cài đặt (Installability) trên trình duyệt Chromium / Android và iOS Add to Home Screen.
