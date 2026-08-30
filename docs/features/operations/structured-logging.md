# Chuẩn Hóa Structured Logging (P25-T04)

## 1. Định Dạng JSON Chuẩn
Mỗi dòng log được xuất ra định dạng JSON Lines chứa:
- `timestamp`: ISO 8601 UTC string.
- `level`: `debug` | `info` | `warn` | `error` | `fatal`.
- `event`: Tên sự kiện chuẩn hóa (ví dụ: `app.route.failed`).
- `message`: Thông điệp đã được làm sạch.
- `requestId`: Mã định danh tương ứng.
- `environment`: `development` | `preview` | `production` | `test`.
- `release`: `v0.1.0`.
- `metadata`: Đối tượng metadata đã được lọc bỏ PII đệ quy.
