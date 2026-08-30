# Quản Lý Ảnh Đại Diện & Supabase Storage (Media Feature)

## 1. Tổng Quan
Tính năng Media cung cấp hạ tầng lưu trữ hình ảnh riêng tư và quản lý ảnh đại diện (Avatar) cho toàn bộ thành viên trong cây gia phả GenViet:
- **Private Storage:** Bucket `person-avatars` được thiết lập ở chế độ riêng tư 100% (`public = false`).
- **Bảo Vệ Quyền Riêng Tư:** Toàn bộ ảnh được truy cập thông qua Signed Read URL có thời hạn ngắn (TTL 15 phút).
- **Client Processing:** Tự động nén sang WebP, loại bỏ siêu dữ liệu nhạy cảm EXIF (GPS, thiết bị), và sinh ảnh thu nhỏ (Thumbnail 128x128).
- **An Toàn Dữ Liệu & Compensation:** Không bao giờ xóa ảnh cũ trước khi ảnh mới được kích hoạt thành công.
