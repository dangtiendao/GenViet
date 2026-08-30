# Sổ Tay Lệnh Thực Thi Kiểm Thử (Test Commands Runbook)

## 1. Danh Mục Các Lệnh Kiểm Thử

- **Chạy toàn bộ Unit & Integration tests:**
  ```bash
  npm run test:run
  ```
- **Chạy kiểm tra định dạng mã nguồn:**
  ```bash
  npm run format:check
  ```
- **Chạy kiểm tra tĩnh ESLint:**
  ```bash
  npm run lint
  ```
- **Chạy kiểm tra kiểu TypeScript:**
  ```bash
  npm run typecheck
  ```
- **Chạy kiểm thử Playwright E2E:**
  ```bash
  npm run test:e2e
  ```
- **Chạy kiểm tra toàn diện Quality Gates:**
  ```bash
  npm run check
  ```
- **Chạy kiểm toán bảo mật phụ thuộc:**
  ```bash
  npm audit
  ```
