# Node Contract: PersonNode & UnionNode

## 1. `PersonNode` Specification
- **Kích thước cố định:** `width: 220px`, `height: 90px`.
- **Thành phần hiển thị:**
  - Avatar Initial Placeholder (màu sắc theo giới tính).
  - Họ và tên (cắt bớt chữ nếu quá dài).
  - Khoảng thời gian sống (Năm sinh - Năm mất vắn tắt).
  - Huy hiệu Trạng thái sống (Đã mất / Còn sống).
  - Huy hiệu Xác thực (Đã xác minh / Chưa xác minh / Tranh chấp).
  - Nút Mở rộng Tổ tiên (`+`) phía trên đỉnh.
  - Nút Mở rộng Hậu duệ (`+`) phía dưới đáy.
  - Menu Thao tác quan hệ (kết nối P12/P13).

## 2. `UnionNode` Specification
- **Kích thước cố định:** `width: 16px`, `height: 16px`.
- **Mục đích:** Là node trung gian hình học phục vụ định tuyến cạnh nối giữa hai người phối ngẫu, tránh việc phải nối chéo trực tiếp giữa các PersonNode.
- **Tính chất:** Presentation-only, không thể chọn (selectable = false), không mở chi tiết cá nhân.
