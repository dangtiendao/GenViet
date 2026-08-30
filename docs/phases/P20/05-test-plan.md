# Phase P20: Kế Hoạch & Báo Cáo Kiểm Thử (Test Plan & Report)

## 1. Các Tầng Kiểm Thử

### 1.1. Unit & Component Tests (Vitest)
- `tests/unit/pwa/manifest.test.ts`: Kiểm tra manifest JSON và danh sách icon.
- `tests/unit/pwa/cache-policy.test.ts`: Kiểm tra bộ phân loại URL nhạy cảm và static assets.
- `tests/unit/pwa/components.test.tsx`: Kiểm tra các components giao diện PWA.
- `tests/unit/pwa/service-worker.test.ts`: Kiểm tra file `public/sw.js`.
- `tests/unit/pwa/private-cache-cleanup.test.ts`: Kiểm tra cơ chế dọn dẹp cache private.

### 1.2. End-to-End Tests (Playwright)
- `tests/e2e/pwa.spec.ts`:
  - Kiểm tra `/manifest.webmanifest`.
  - Kiểm tra tải icon assets.
  - Kiểm tra tải file `/sw.js`.
  - Kiểm tra trang `/offline` và thông báo không chỉnh sửa offline.
  - Kiểm tra viewport di động 375x667 và 320x568.
