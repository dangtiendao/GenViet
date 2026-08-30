# Kim Tự Tháp Kiểm Thử (Test Automation Pyramid)

## 1. Phân Tầng Kiểm Thử

| Tầng Kiểm Thử | Framework | Số Lượng Test Suites | Mục Tiêu Kiểm Thử |
| :--- | :--- | :---: | :--- |
| **Unit Tests** | Vitest | 70+ suites | Các hàm pure functions, validation, mappers, schemas |
| **Integration Tests** | pgTAP & Vitest | 58+ SQL suites, 10+ TS suites | Giao dịch database, RLS, Storage, Rollback, Import/Export |
| **E2E Tests** | Playwright | 15+ specs | Hành trình người dùng từ UI thực tế, chuyển trang, tương tác cây |
| **Security Tests** | Vitest & Playwright | 8+ suites | Cross-tree isolation, MIME spoofing, secret scanning |
