# Ma Trận Kiểm Thử Thiết Bị Di Động (Mobile Test Matrix)

## 1. Ma Trận Nền Tảng & Trình Duyệt

| Nền Tảng | Trình Duyệt | Viewport | Kiểm Thử Tự Động (Playwright) | Kiểm Thử Thủ Công |
| :--- | :--- | :---: | :---: | :---: |
| Android Chromium | Chrome Mobile / Edge | 375x667, 360x800 | Manifest, Icons, sw.js, Offline fallback | Cài đặt PWA thật, Standalone launch |
| iOS Safari | Mobile Safari / WebKit | 375x667, 390x844 | Manifest, Apple icon, WebKit layout | Add to Home Screen, Safe-area |
| Màn hình nhỏ | Chromium / Mobile Safari | 320x568 | 0px horizontal overflow, Touch targets | Vuốt chạm thực tế trên thiết bị nhỏ |
