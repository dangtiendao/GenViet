# Chính Sách Retry & Cảnh Báo Lỗi (Retry & Alerting Policy)

## 1. Cơ Chế Thử Lại (Retry Policy)
- **Số lần thử tối đa:** 3 lần (`MAX_ATTEMPTS = 3`).
- **Thời gian chờ tăng dần (Exponential Backoff):**
  - Lần 1: Ngay lập tức.
  - Lần 2: Chờ 10 giây.
  - Lần 3: Chờ 20 giây.
- **Request Timeout:** 15 giây cho mỗi lần request (`curl --max-time 15`).
- **Phân loại lỗi:**
  - Lỗi 401 / 403 (Xác thực không hợp lệ): DỪNG THỬ LẠI NGAY LẬP TỨC để tránh gửi lặp lại các request sai quyền.
  - Lỗi 5xx hoặc sự cố mạng: Tự động thử lại theo backoff.

## 2. Chiến Lược Cảnh Báo (Alerting Strategy)
- **Hiển thị trực quan:** Workflow GitHub Actions chuyển sang màu đỏ (FAILED) khi cả 3 lần thử đều thất bại.
- **Ghi nhận vào cơ sở dữ liệu:** Tăng `consecutive_failures` trong bảng `system_heartbeats`.
- **Thông báo:** Gửi email thông báo chuẩn của GitHub cho maintainers khi workflow thất bại.
