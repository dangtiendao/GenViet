# Phase P17: Quyết Định Kiến Trúc Đã Chốt (Architectural Decisions)

## 1. Danh Sách Quyết Định Đã Khóa
1. **DEC-P17-01: Định Dạng Ảnh Chuẩn Sang WebP**
   - Output format đồng nhất là WebP với chất lượng 85% cho Avatar (512x512) và 80% cho Thumbnail (128x128).
2. **DEC-P17-02: Cơ Chế Metadata Hai Lớp**
   - Bảng `public.person_avatars` lưu toàn bộ lịch sử metadata và trạng thái vòng đời.
   - Cột `public.persons.avatar_path` trỏ trực tiếp đến object path đang active để phục vụ tra cứu nhanh.
3. **DEC-P17-03: Signed Read URL Ngắn Hạn**
   - Thời hạn TTL = 15 phút (900 giây), client cache trong memory và tự động refresh.
4. **DEC-P17-04: Chiến Lược Compensation & Không Mất Dữ Liệu**
   - File cũ chỉ được xóa sau khi file mới đã active và cập nhật metadata thành công.
