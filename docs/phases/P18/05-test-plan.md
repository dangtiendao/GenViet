# Phase P18: Kế Hoạch & Báo Cáo Kiểm Thử (Test Plan & Report)

## 1. Các Tầng Kiểm Thử

### 1.1. CSDL & Storage RLS (pgTAP)
- `08000_audit_schema.test.sql`: Cấu trúc bảng `audit_logs`, check constraints, indexes.
- `08100_audit_writes.test.sql`: Hàm `write_audit_log` và `record_audit_event`.
- `08200_audit_redaction.test.sql`: Khử nhiễm dữ liệu nhạy cảm.
- `08300_audit_rls.test.sql`: RLS Select và kiểm thử tính bất biến (không update/delete).
- `08400_person_restore.test.sql`: Khôi phục Person với optimistic concurrency.
- `08500_relationship_restore.test.sql`: Khôi phục quan hệ (kiểm tra chu trình, trùng lặp).
- `08600_restore_conflicts.test.sql`: Chặn khôi phục khi cha/mẹ bị xóa mềm.
- `08700_trash_retention.test.sql`: Tính toán ngưỡng thời gian lưu thùng rác 30 ngày.

### 1.2. Unit & Component Tests (Vitest)
- `tests/unit/audit/mappers.test.ts`: 4 tests.
- `tests/unit/audit/schemas.test.ts`: 3 tests.
- `tests/unit/audit/components.test.tsx`: 3 tests.
- `tests/unit/recovery/schemas.test.ts`: 4 tests.
- `tests/unit/recovery/components.test.tsx`: 1 test.

### 1.3. End-to-End Tests (Playwright)
- `tests/e2e/audit.spec.ts`: Kiểm tra xác thực, điều hướng lịch sử và giao diện mobile.
