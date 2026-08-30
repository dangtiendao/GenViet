# Kế Hoạch Lịch Chạy GitHub Actions (GitHub Actions Schedule)

## 1. Cấu Hình Workflow
- **File:** `.github/workflows/heartbeat.yml`
- **Lịch chạy (Cron):** `17 3 */5 * *` (Chạy lúc 03:17 UTC mỗi 5 ngày một lần).
  - Tránh phút 00 để tránh nghẽn tải hàng loạt trên hạ tầng GitHub Actions.
  - Tần suất 5 ngày phù hợp với cửa sổ inactivity của nền tảng mà không tạo lưu lượng lãng phí.
- **Kích hoạt thủ công:** Hỗ trợ `workflow_dispatch` để quản trị viên có thể kiểm tra ping bất cứ lúc nào.
- **Quyền hạn (Permissions):** Tối thiểu `contents: read`.
- **Giới hạn thời gian (Timeout):** `timeout-minutes: 5`.
- **Bảo Mật:** Sử dụng GitHub Actions Secrets (`HEARTBEAT_ENDPOINT_URL`, `HEARTBEAT_SECRET`). Tắt `set -x` để đảm bảo secret không bao giờ xuất hiện trong log.
