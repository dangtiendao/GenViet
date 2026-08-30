# Giám Sát Lỗi Trên Các Tuyến API (Route Error Monitoring - P25-T06)

## 1. Phân Loại Trạng Thái HTTP
- **5xx (Internal Server Errors):** Tự động phát sự kiện `app.route.failed` và chuyển tiếp sang Error Tracker kèm Request ID.
- **4xx không mong muốn:** Ghi log ở mức `warn` để theo dõi bất thường.
- **401/403/404 dự kiến:** Không kích hoạt cảnh báo sự cố nghiêm trọng.
