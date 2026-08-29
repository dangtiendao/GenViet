# Đặc tả Hành vi Thích ứng Màn hình (Responsive Behavior Specification)

- **Mã tài liệu:** `UX-RESPONSIVE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Bảng Ma trận Thích ứng theo Thiết bị (Responsive Matrix)

| Thiết bị & Khung nhìn | Điều hướng Chính | Hiển thị Đồ thị Cây | Hiển thị Hồ sơ Chi tiết | Nhập liệu & Form |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile (`< 768px`)** | Bottom Navigation 4 mục cố định dưới đáy | Cửa sổ tập trung quanh `Center Person` (30-50 nodes) | Bottom Sheet (3 nấc: Peek, Half, Full) | Full-screen Sheet có nút Lưu cố định |
| **Tablet (`768px - 1023px`)** | Topbar rút gọn hoặc Navigation Rail | Cửa sổ mở rộng (50-80 nodes) | Side Panel trượt phải (`320px`) | Modal Dialog ở giữa màn hình |
| **Desktop (`≥ 1024px`)** | Top Header đầy đủ + Phím tắt `Ctrl+K` | Đồ thị toàn màn hình (Full viewport) | Side Panel trượt phải (`380px`) | Modal Dialog phân nhóm rõ ràng |

---

## 2. Các Hành vi Thích ứng Đặc thù

### 2.1. Hành vi Cảm ứng trên Di động (Mobile Touch Interactions)
- **Chạm 1 lần (Single Tap) vào Node:** Mở Bottom Sheet xem nhanh hồ sơ và menu hành động.
- **Kéo rê (Pan gesture):** Di chuyển tự do trên Canvas đồ thị một cách mượt mà.
- **Véo 2 ngón (Pinch-to-zoom):** Phóng to / thu nhỏ khung nhìn từ mức $0.2x$ đến $2.0x$.
- **Không Phụ thuộc vào Hover:** Toàn bộ các thông tin quan trọng đều xem được thông qua thao tác chạm trực tiếp, không dựa vào hiệu ứng di chuột (hover-only).

### 2.2. Xử lý Bàn phím Ảo (Keyboard-Aware Layout)
- Khi bàn phím ảo xuất hiện trên iOS/Android: Form tự động cuộn trường đang nhập vào vùng nhìn thấy được, nút *"Lưu"* gắn liền phía trên bàn phím để người dùng không phải bấm ẩn bàn phím mới lưu được.
