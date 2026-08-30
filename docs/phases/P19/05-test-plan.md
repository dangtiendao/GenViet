# Phase P19: Kế Hoạch & Báo Cáo Kiểm Thử (Test Plan & Report)

## 1. Các Tầng Kiểm Thử

### 1.1. CSDL & pgTAP Tests
- `09000_backup_export.test.sql`: Kiểm tra export snapshot và phân quyền.
- `09100_backup_import.test.sql`: Kiểm tra import tạo cây mới, owner và persons.
- `09200_backup_id_mapping.test.sql`: Kiểm tra ánh xạ ID quan hệ và mốc thế hệ.
- `09300_backup_import_rollback.test.sql`: Kiểm tra rollback toàn bộ khi có lỗi.
- `09400_backup_import_security.test.sql`: Kiểm tra bảo mật RPCs.

### 1.2. Unit & Component Tests (Vitest)
- `tests/unit/backups/schemas.test.ts`: Zod schema validation.
- `tests/unit/backups/version-detector.test.ts`: Version detector.
- `tests/unit/backups/validator.test.ts`: Multi-layer validator & cycle detection.
- `tests/unit/backups/id-map.test.ts`: ID mapping engine.
- `tests/unit/backups/redaction.test.ts`: Secret scanner & assertion.
- `tests/unit/backups/filename.test.ts`: Safe filename generator.
- `tests/unit/backups/components.test.tsx`: Backup UI components.

### 1.3. End-to-End Tests (Playwright)
- `tests/e2e/backups.spec.ts`: Bảo vệ route `/trees/import`, API route và mobile viewports.
