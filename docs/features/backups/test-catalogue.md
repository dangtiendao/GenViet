# Danh Mục Kiểm Thử Tính Năng Sao Lưu & Khôi Phục (Test Catalogue)

## 1. Các Tầng Kiểm Thử

### 1.1. CSDL & pgTAP Tests
- `09000_backup_export.test.sql`: Kiểm tra RPC `export_family_tree_backup` và quyền export.
- `09100_backup_import.test.sql`: Kiểm tra RPC `import_family_tree_backup` tạo cây mới, owner và persons.
- `09200_backup_id_mapping.test.sql`: Kiểm tra ánh xạ ID và foreign key rewrite.
- `09300_backup_import_rollback.test.sql`: Kiểm tra rollback toàn bộ khi có exception giữa chừng.
- `09400_backup_import_security.test.sql`: Kiểm tra caller unauthenticated bị từ chối.

### 1.2. Unit Tests (Vitest)
- `tests/unit/backups/schemas.test.ts`: Zod schema validation & strict unknown fields check.
- `tests/unit/backups/version-detector.test.ts`: Version detection logic.
- `tests/unit/backups/validator.test.ts`: Multi-layer validation, cycle check, secret detection, prototype pollution.
- `tests/unit/backups/id-map.test.ts`: ID map generator and document remapping.
- `tests/unit/backups/redaction.test.ts`: Secret scanner and assertion.
- `tests/unit/backups/filename.test.ts`: Safe filename generation and CRLF prevention.
- `tests/unit/backups/components.test.tsx`: UI export card, preview summary, validation errors.

### 1.3. End-to-End Tests (Playwright)
- `tests/e2e/backups.spec.ts`: Bảo vệ route `/trees/import`, API download, responsive mobile.
