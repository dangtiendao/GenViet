# Viewport Behavior & Center Anchoring

## 1. Tương Tác Viewport
- **Phóng to / Thu nhỏ (Zoom):**
  - Giới hạn: `minZoom = 0.1`, `maxZoom = 2.0`.
  - Hỗ trợ nút điều khiển, con lăn chuột, và thao tác pinch zoom trên màn hình cảm ứng điện thoại.
- **Dịch chuyển (Pan):**
  - Hỗ trợ kéo thả trên canvas một ngón tay (mobile) hoặc chuột (desktop).
- **Toàn cảnh (Fit View):**
  - Tự động căn chỉnh toàn bộ cây gia phả lọt gọn gàng vào giữa màn hình kèm padding 20%.
- **Toàn màn hình (Fullscreen):**
  - Hỗ trợ Fullscreen API chuẩn cho toàn bộ container canvas, kèm phím tắt `Esc` để thoát.

## 2. Cơ Chế Neo Giữ Vị Trí Tâm Điểm (Center Anchoring)
Khi người dùng bấm nút mở rộng tổ tiên hoặc hậu duệ, cấu trúc cây thay đổi làm tọa độ tuyệt đối của Center Person trong ELK bị dịch chuyển. Thuật toán `calculateAnchoredViewport` tính toán độ lệch và tự động dời viewport `(x, y)` để vị trí hiển thị của Center Person trên màn hình máy khách không bị nhảy giật.
