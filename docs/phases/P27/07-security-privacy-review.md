# Đánh Giá Bảo Mật & Quyền Riêng Tư Phase P27 (Security & Privacy Review)

## 1. Kết Quả Rà Soát Bảo Mật
- **Bảo vệ Secret:** Quét 0 Service Role Key, 0 R2 Access Token trong client assets.
- **Băm Token Lời Mời:** Chỉ lưu mã băm SHA-256 trong Database, tự động hết hạn sau 7 ngày.
- **Tài Liệu Scan & Album:** Lưu trữ 100% trong Private Buckets; chỉ xem qua Signed URLs có thời hạn ngắn (TTL 1h).
- **Chống Injection:** Chống Formula Injection khi nhập tệp Excel; chống mã độc HTML/SVG khi tải tài liệu scan.
- **Quyền Riêng Tư PDF:** Cho phép ẩn người còn sống và ngày tháng sinh/mất khi xuất tài liệu gia phả.
