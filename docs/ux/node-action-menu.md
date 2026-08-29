# Đặc tả Menu Thao tác Node Thành viên (Node Action Menu Specification)

- **Mã tài liệu:** `UX-NODEMENU-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Phân nhóm Các Hành động trên Node

```text
┌────────────────────────────────────────────────────────┐
│  MENU THAO TÁC: NGUYỄN VĂN A                       [X] │
├────────────────────────────────────────────────────────┤
│  [ NHÓM 1: ĐIỀU HƯỚNG & XEM ]                          │
│  • 👤 Xem chi tiết hồ sơ                               │
│  • 🎯 Đặt làm người trung tâm khung nhìn               │
│  • ✏️ Chỉnh sửa thông tin hồ sơ                        │
├────────────────────────────────────────────────────────┤
│  [ NHÓM 2: THÊM QUAN HỆ GIA ĐÌNH ]                     │
│  • ⬆️ + Thêm Cha                                       │
│  • ⬆️ + Thêm Mẹ                                       │
│  • ↔️ + Thêm Vợ / Chồng                                │
│  • ⬇️ + Thêm Con cái                                   │
│  • 🔗 Liên kết với thành viên có sẵn                   │
├────────────────────────────────────────────────────────┤
│  [ NHÓM 3: THAO TÁC NGUY HIỂM ]                        │
│  • 🗑️ Xóa thành viên khỏi cây phả hệ...                │
└────────────────────────────────────────────────────────┘
```

---

## 2. Quy chuẩn Kỹ thuật & Khả năng Truy cập (Accessibility)

1. **Không Phụ thuộc Chuột Phải (`A11Y-010`):** Mọi Node đều có nút ba chấm `[...]` ở góc trên để mở menu bằng chuột trái hoặc màn hình cảm ứng.
2. **Hỗ trợ Bàn phím Desktop:**
   - Dùng phím `Tab` để di chuyển tới node.
   - Nhấn phím `Space` hoặc `Enter` để mở Action Menu.
   - Dùng phím mũi tên `↑` `↓` để duyệt các mục menu.
   - Nhấn `ESC` để đóng menu và tự động trả lại Focus vào đúng node đó.
3. **Phân biệt Hành động Nguy hiểm:** Nút `🗑️ Xóa thành viên` luôn được xếp ở cuối cùng, cách biệt bằng đường kẻ ngang mỏng và có màu chữ đỏ cảnh báo.
