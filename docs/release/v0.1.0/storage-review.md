# Báo Cáo Đánh Giá Lưu Trữ Tệp Ảnh Riêng Tư (Storage Review - P26-T11)

- **Mục tiêu:** Kiểm tra cơ chế lưu trữ Avatar bảo mật trong Supabase Private Storage Bucket (`avatars`).
- **Trạng thái:** `PASS`

---

## 1. Kết Quả Kiểm Tra Chi Tiết
1. **Bucket Private:** Bucket `avatars` có cờ `public = false`. Mọi truy cập trực tiếp không có chữ ký đều nhận mã lỗi HTTP 400/403.
2. **Ký Duyệt URL Truy Cập (Signed URLs):**
   - URL truy cập ảnh đại diện được ký duyệt có thời hạn ngắn (TTL 1 giờ).
   - URL hết hạn tự động bị từ chối truy cập.
3. **Phân Quyền Tải Lên & Xóa (Upload / Delete RLS):**
   - Chỉ Owner của cây gia phả mới có quyền tải lên hoặc thay thế ảnh đại diện của nhân vật thuộc cây đó.
   - Người ngoài không thể tải đè hoặc xóa ảnh của thành viên khác.
4. **Kiểm Tra Tính Hợp Lệ Của Tệp (File Validation):**
   - Giới hạn kích thước tối đa 5MB.
   - Kiểm tra MIME type nghiêm ngặt (`image/jpeg`, `image/png`, `image/webp`).
