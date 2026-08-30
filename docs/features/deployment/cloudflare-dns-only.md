# Cấu Hình Cloudflare DNS Only (P24-T09)

## 1. Yêu Cầu Bắt Buộc: Trạng Thái Đám Mây Xám (DNS Only)
Khi trỏ tên miền từ Cloudflare về Vercel:
- **Tuyệt đối KHÔNG bật Proxy (Đám mây cam)** cho các bản ghi A và CNAME phục vụ web app.
- **Bắt buộc bật DNS Only (Đám mây xám)** để Vercel trực tiếp hoàn tất thủ tục ACME Challenge cấp phát chứng chỉ SSL Let's Encrypt và tối ưu hóa CDN Next.js.

## 2. Bảo Toàn Toàn Bộ Bản Ghi Khác
- Giữ nguyên toàn bộ các bản ghi `MX`, `TXT` (SPF, DKIM, DMARC) để không làm gián đoạn hệ thống gửi/nhận email của tên miền.
