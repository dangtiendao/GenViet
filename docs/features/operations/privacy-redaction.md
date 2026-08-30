# Cơ Chế Lọc & Ẩn Dữ Liệu Riêng Tư Khỏi Log (Privacy Redaction - P25-T03)

## 1. Danh Sách Các Thuộc Tính Bị Loại Bỏ (Denylist)
- `password`, `secret`, `token`, `otp`, `auth`, `authorization`, `cookie`, `service_role`
- `apikey`, `private_key`, `signedUrl`, `signed_url`
- `biography`, `note`, `raw_payload`, `image_bytes`, `base64`

## 2. Phòng Ngừa Tấn Công Log Injection
Mọi chuỗi đưa vào hệ thống log đều được lọc bỏ các ký tự xuống dòng (`\r\n`) và ký tự điều khiển ASCII qua hàm `sanitizeLogString`.
