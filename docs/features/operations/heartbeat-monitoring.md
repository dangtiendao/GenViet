# Giám Sát Sức Khỏe Heartbeat Định Kỳ (P25-T07)

## 1. Tiêu Chí Phát Hiện Heartbeat Quá Hạn (Stale Detection)
- Nếu thời gian kể từ lần heartbeat thành công gần nhất vượt quá **48 giờ**, hệ thống tự động phát cảnh báo `heartbeat.stale`.
- Nếu có lỗi ghi nhận liên tiếp (`consecutiveFailures > 0`), phát sự kiện `heartbeat.failed`.
