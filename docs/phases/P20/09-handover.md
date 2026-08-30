# Phase P20: Biên Bản Bàn Giao (Phase Handover)

## 1. Thông Tin Bàn Giao
- **Mã Phase:** P20
- **Tên Phase:** PWA và trải nghiệm di động
- **Nhánh Thực Hiện:** `phase/p20-pwa-mobile-shell`
- **Trạng Thái:** **COMPLETED & ACCEPTED**

---

## 2. Hướng Dẫn Bàn Giao Cho Các Phase Sau
- **Bàn giao P21 (Cộng tác thời gian thực & Heartbeat):**
  - P20 không triển khai heartbeat ngầm.
  - Sử dụng online/offline events từ `useNetworkStatus` để phục hồi kênh WebSocket / Realtime khi mạng kết nối lại.
- **Bàn giao P22 (Security & Hardening):**
  - Bộ kiểm thử bảo mật 0% token/signed URL trong Cache Storage (`tests/unit/pwa/cache-policy.test.ts`).
  - Ma trận kiểm thử cách ly tài khoản và dọn dẹp cache private khi đăng xuất (`tests/unit/pwa/private-cache-cleanup.test.ts`).
- **Bàn giao P23 (Performance & Optimization):**
  - Giới hạn cache budget của App Shell (`genviet-shell-v1` < 2 MB tổng dung lượng).
  - Tối ưu hóa tải trang offline và font self-hosted.
- **Bàn giao P25 (Operations & Maintenance):**
  - Cơ chế tự động dọn dẹp cache cũ khi nâng cấp version cache trong `public/sw.js`.
- **Bàn giao P26 (Release & Acceptance):**
  - Danh mục app icons và Web App Manifest hợp lệ phục vụ kiểm duyệt phát hành.
