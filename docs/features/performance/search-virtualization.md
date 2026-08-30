# Ảo Hóa Danh Sách Tìm Kiếm (Search Virtualization - P23-T16)

## 1. Nguyên Lý Windowed Virtualization
- Chỉ render các thẻ kết quả nằm trong khung nhìn cuộn + một lượng nhỏ đệm `overscan` (3 items).
- Giảm số lượng phần tử DOM từ 500-1000 phần tử xuống còn < 15 phần tử hiển thị thực tế tại một thời điểm, giữ bộ nhớ trình duyệt ổn định và thao tác cuộn 60fps trên di động.
