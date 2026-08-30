# Danh Mục Giới Hạn Đã Biết (Known Limitations Register - P23-T21)

## 1. Giới Hạn Kích Thước Lát Cắt Đồ Thị (Graph Slice Limits)
- **Độ sâu mặc định:** Ancestor Depth = 2, Descendant Depth = 2.
- **Độ sâu tối đa máy chủ:** Max Depth = 5 (ngăn chặn recursive queries làm quá tải database).
- **Giới hạn số nhân vật tối đa trên một lát cắt:** `maxPersonsBudget = 250`. Các nhánh xa hơn cần được tải theo cơ chế lazy expansion.

## 2. Giới Hạn Web Worker & Trình Duyệt Cũ
- **Web Worker Support:** Trình duyệt hiện đại hỗ trợ Module Web Worker. Nếu chạy trong môi trường cũ hoặc Node.js SSR/Test, adapter tự động chuyển về chế độ fallback trên main thread.
- **Bộ nhớ di động:** Trên các thiết bị di động RAM thấp, số lượng nodes render đồng thời trên canvas khuyến nghị duy trì dưới 100 nodes để đạt 60fps mượt mà.
