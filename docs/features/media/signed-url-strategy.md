# Chiến Lược Sinh & Cung Cấp Signed URLs (Signed URL Strategy)

## 1. Cơ Chế Sinh Signed URL Riêng Tư
1. Toàn bộ hình ảnh trong bucket `person-avatars` không thể truy cập qua URL tĩnh công khai.
2. Server Action `getAvatarSignedUrlAction` xác thực quyền đọc của người dùng với cây gia phả trước khi sinh Signed URL.
3. **Thời Hạn URL (TTL):** Mặc định 900 giây (15 phút).
4. **Không Lưu Signed URL Vào CSDL:** CSDL chỉ lưu `object_path` và `thumbnail_path`, Signed URL được sinh động khi hiển thị.
