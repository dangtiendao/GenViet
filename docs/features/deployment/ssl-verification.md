# Quy Trình Kiểm Tra SSL / HTTPS (SSL Verification - P24-T10)

## 1. Các Tiêu Chí Kiểm Tra SSL
1. Kết nối an toàn qua giao thức HTTPS (TLS 1.3/1.2).
2. Chứng chỉ SSL hợp lệ, phát hành bởi Let's Encrypt / Vercel Certificate Authority.
3. Tự động chuyển hướng toàn bộ lưu lượng HTTP sang HTTPS (308 Permanent Redirect).
4. Không chứa cảnh báo nội dung hỗn hợp (Mixed Content) trong các tệp tĩnh hoặc ảnh avatar.
