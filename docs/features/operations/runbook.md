# Sổ Tay Vận Hành Nhịp Tim (Operations Runbook)

## 1. Cấu Hình Biến Bí Mật Trên GitHub Repository
Khi chuyển giao lên repository GitHub remote, quản trị viên cần cấu hình thủ công:
- `HEARTBEAT_ENDPOINT_URL`: URL public của ứng dụng trỏ tới endpoint nhịp tim (ví dụ `https://genviet.app/api/internal/heartbeat`).
- `HEARTBEAT_SECRET`: Chuỗi khóa bí mật ngẫu nhiên có độ dài tối thiểu 32 ký tự, trùng khớp với biến môi trường `HEARTBEAT_SECRET` trên server.

## 2. Quy Trình Xử Lý Khi Nhịp Tim Thất Bại (Troubleshooting)
1. **Kiểm tra Log GitHub Actions:** Xem HTTP Status trả về (401: sai secret; 500: lỗi database kết nối; Timeout: server phản hồi chậm).
2. **Kiểm tra Trạng thái Máy chủ Supabase:** Đăng nhập Supabase Dashboard xem dự án có đang ở trạng thái Active hay Paused.
3. **Thực thi Kích Hoạt Thủ Công:** Vào tab Actions trên GitHub -> chọn workflow "System Heartbeat & Operations Ping" -> bấm "Run workflow" để kiểm tra lại phản hồi tức thì.
