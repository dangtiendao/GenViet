# Danh Mục Kiểm Thử Tính Năng PWA (Test Catalogue)

## 1. Các Tầng Kiểm Thử

### 1.1. Unit & Component Tests (Vitest)
- `tests/unit/pwa/manifest.test.ts`: Kiểm thử tính hợp lệ của Web App Manifest và icons.
- `tests/unit/pwa/cache-policy.test.ts`: Kiểm thử bộ phân loại URL nhạy cảm và ma trận cache policy.
- `tests/unit/pwa/components.test.tsx`: Kiểm thử các component giao diện (OfflineEditingNotice, IosInstallInstructions, v.v.).
- `tests/unit/pwa/service-worker.test.ts`: Kiểm thử tính toàn vẹn và logic của file `sw.js`.
- `tests/unit/pwa/private-cache-cleanup.test.ts`: Kiểm thử hàm dọn dẹp cache riêng tư khi logout.

### 1.2. End-to-End Tests (Playwright)
- `tests/e2e/pwa.spec.ts`:
  - Kiểm tra route `/manifest.webmanifest` trả về JSON hợp lệ với display `standalone`.
  - Kiểm tra tải thành công các icon PNG (192, 512, apple touch icon).
  - Kiểm tra tải thành công file `/sw.js` với status 200 và content-type javascript.
  - Kiểm tra tải trang `/offline` với đầy đủ thông điệp và nút thao tác.
  - Kiểm tra viewport di động 375x667 và 320x568 không bị tràn ngang.
