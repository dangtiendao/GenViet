# Xử Lý Hình Ảnh, Nén & Xóa EXIF (Image Processing)

## 1. Nén & Chuyển Đổi Sang WebP Phía Client
- Toàn bộ ảnh được vẽ lên HTML5 Canvas và xuất ra định dạng chuẩn `image/webp` với mức chất lượng 85%.
- Avatar kích thước tối đa 512x512 pixel (giữ nguyên tỷ lệ gốc).
- Thumbnail cắt vuông 128x128 pixel ở tâm ảnh (Center Crop) phục vụ hiển thị nhẹ trong đồ thị cây gia phả (P15) và kết quả tìm kiếm (P16).

---

## 2. Loại Bỏ Siêu Dữ Liệu Nhạy Cảm EXIF
- Khi vẽ lại điểm ảnh qua Canvas, toàn bộ siêu dữ liệu EXIF nhạy cảm (tọa độ GPS, nhãn hiệu máy ảnh, thời gian chụp gốc) được loại bỏ hoàn toàn, bảo vệ quyền riêng tư cho các thành viên trong gia đình.
