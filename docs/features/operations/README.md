# Vận Hành Kỹ Thuật Định Kỳ & Nhịp Tim Hệ Thống (Operations & System Heartbeats)

## 1. Tổng Quan
Tính năng vận hành kỹ thuật định kỳ của GenViet cung cấp cơ chế nhịp tim nội bộ (system heartbeat), bảo vệ chống tạm dừng dự án (inactivity) trong phạm vi Free Plan hợp lệ, và cung cấp công cụ dọn dẹp dữ liệu test an toàn:
- **Bảng kỹ thuật Singleton (`system_heartbeats`):** Duy trì duy nhất 1 dòng bản ghi (`id = 'primary'`), không tạo lịch sử tăng vô hạn.
- **Bảo Vệ RLS Tuyệt Đối:** Thu hồi 100% quyền truy cập từ `anon` và `authenticated`; chỉ cho phép server-side / `service_role` ghi nhận qua hàm `record_system_heartbeat`.
- **Endpoint Nội Bộ Được Bảo Vệ:** `POST /api/internal/heartbeat` bảo vệ bằng secret token và so sánh Web Crypto timing-safe.
- **GitHub Actions Scheduled Workflow:** Chạy định kỳ mỗi 5 ngày vào lúc 03:17 UTC với cơ chế retry có giới hạn (3 lần) và backoff.
- **Cách Ly Tuyệt Đối Với Nghiệp Vụ:** Tuyệt đối KHÔNG tạo nhân vật Person giả, quan hệ Relationship giả, hay hôn nhân Union giả.
- **Tuyên Bố Từ Chối SLA (SLA Disclaimer):** Nhịp tim là hoạt động kỹ thuật mang tính nỗ lực tối đa (best-effort), không phải cam kết SLA, không bảo đảm 100% uptime và không thay thế giám sát ứng dụng toàn diện.
