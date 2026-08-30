# Danh Mục Kiểm Thử Tính Năng Nhật Ký (Audit Test Catalogue)

## 1. Các Tầng Kiểm Thử
1. **Database & RLS Tests:**
   - `08000_audit_schema.test.sql`: Cấu trúc bảng, kiểu dữ liệu, ràng buộc check, indexes.
   - `08100_audit_writes.test.sql`: Hàm `write_audit_log` và `record_audit_event`.
   - `08200_audit_redaction.test.sql`: Khử nhiễm Denylist và áp dụng Allowlist.
   - `08300_audit_rls.test.sql`: RLS Select và kiểm thử tính bất biến (kháng sửa/xóa).
2. **Unit Tests:**
   - `tests/unit/audit/mappers.test.ts`: Sanitize, compute changed fields, DTO mapper.
   - `tests/unit/audit/schemas.test.ts`: Query validation và date range.
   - `tests/unit/audit/components.test.tsx`: Diff summary, Item, Empty state.
3. **E2E Tests:**
   - `tests/e2e/audit.spec.ts`: Bảo vệ route `/history` và responsive mobile.
