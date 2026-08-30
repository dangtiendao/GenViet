# Kiến Trúc Giám Sát & Vận Hành Hệ Thống (Observability Overview - Phase P25)

## 1. Mục Tiêu Thiết Kế
1. **Bảo mật & Quyền riêng tư là ưu tiên cao nhất:** 100% mật khẩu, OTP, tokens, signed URLs và dữ liệu gia phả cá nhân (PII) được loại bỏ trước khi ghi log hoặc gửi tới Error Tracker.
2. **Liên kết Request ID xuyên suốt:** Mọi request đều có mã `x-request-id` gắn kết từ Client -> API Route -> Structured Log -> Error Event.
3. **Giám sát chủ động các luồng quan trọng:** Theo dõi lỗi 5xx, heartbeat kỹ thuật, auth failure và upload failure.
4. **Sao lưu & Phục hồi kiểm chứng độc lập:** Quy trình backup có SHA-256 manifest và kiểm thử restore trong schema cô lập.
