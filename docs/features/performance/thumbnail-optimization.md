# Tối Ưu Hóa Ảnh Thu Nhỏ (Thumbnail Optimization - P23-T17)

## 1. Kích Thước & Định Dạng
- Ảnh đại diện thu nhỏ (Thumbnail) được định dạng chuẩn WebP nén chất lượng cao với kích thước cố định `h-8 w-8` (32px) hoặc `h-10 w-10` (40px).
- Dung lượng trung bình < 15 KB/ảnh.
- Sử dụng thuộc tính `loading="lazy"` và bộ đệm URL đã ký `signedUrlCache` ngăn chặn gửi lặp lại các yêu cầu lấy chữ ký từ máy chủ.
