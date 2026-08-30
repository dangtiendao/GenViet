# Chính Sách Khử Nhiễm & Bảo Mật Dữ Liệu Nhật Ký (Redaction Policy)

## 1. Nguyên Tắc An Toàn
1. **Allowlist là cơ chế phòng vệ chính:** Chỉ các trường thuộc danh sách cho phép của từng Entity Type mới được lưu vào `before_data` và `after_data`.
2. **Denylist bổ trợ:** Bất kỳ khóa nào liên quan tới mật khẩu, token, session cookie, secret keys, URL ký tạm hay chuỗi base64 nhị phân đều bị loại bỏ triệt để.
3. **Giới hạn kích thước:** Giới hạn tối đa 1.000 ký tự cho mỗi trường văn bản dài (như tiểu sử) và tối đa 64 KB cho toàn bộ payload JSONB.
