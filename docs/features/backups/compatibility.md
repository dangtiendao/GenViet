# Ma Trận Tương Thích Phiên Bản Schema (Compatibility Matrix)

## 1. Ma Trận Tương Thích

| Phiên Bản Schema | Trạng Thái Hỗ Trợ | Hành Động Hệ Thống |
| :---: | :---: | :--- |
| `schemaVersion: 1` | **CURRENT** | Nhập trực tiếp vào hệ thống |
| `schemaVersion: 2+` | **FUTURE** | Từ chối (`BACKUP_VERSION_TOO_NEW`), yêu cầu cập nhật ứng dụng |
| `schemaVersion: 0` | **UNSUPPORTED** | Từ chối (`BACKUP_VERSION_UNSUPPORTED`) |
| `schemaVersion: null` | **MISSING** | Từ chối (`BACKUP_SCHEMA_VERSION_MISSING`) |
