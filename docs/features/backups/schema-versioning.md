# Chính Sách Quản Lý Phiên Bản Schema (Schema Versioning Policy)

## 1. Nguyên Tắc Quản Lý Phiên Bản
1. **Số nguyên tăng dần:** `schemaVersion` bắt buộc là số nguyên dương (`1, 2, 3, ...`), tách biệt hoàn toàn với phiên bản mã nguồn của ứng dụng.
2. **Phiên bản hiện tại:** `BACKUP_CURRENT_SCHEMA_VERSION = 1`.
3. **Quy tắc tương thích:**
   - Phiên bản hiện tại (`v1`): Xử lý trực tiếp.
   - Phiên bản tương lai (`> 1`): Bị từ chối kèm thông báo yêu cầu cập nhật ứng dụng (`BACKUP_VERSION_TOO_NEW`).
   - Phiên bản cũ hợp lệ: Chuyển đổi qua hàm pure migration tuần tự (`v1 -> v2`).
   - Thiếu phiên bản hoặc phiên bản không hợp lệ: Bị từ chối (`BACKUP_SCHEMA_VERSION_MISSING` / `BACKUP_SCHEMA_VERSION_INVALID`).
