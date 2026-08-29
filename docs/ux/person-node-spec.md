# Quy chuẩn Thiết kế Node Thành viên trên Cây (Person Node Specification)

- **Mã tài liệu:** `UX-NODE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Cấu trúc Trực quan của Node Thành viên (Person Node Anatomy)

Node trên Canvas React Flow được thiết kế tối giản, tập trung vào nhận diện danh tính và số đời:

```text
┌────────────────────────────────────────────────────────┐
│ [ ⭐ MỐC / TỔ ]                         [ Đời thứ 3 ]  │  <- Thanh Header nhận diện
├─────────────┬──────────────────────────────────────────┤
│             │  NGUYỄN VĂN A                            │  <- Họ tên (In đậm, 1-2 dòng)
│   [ 📷 ]    │  1950 - 2015 (Thọ 65 tuổi)               │  <- Năm sinh - Năm mất
│  Avatar     │  ──────────────────────────────────────  │
│  40x40px    │  • 3 Con  •  1 Vợ                        │  <- Tóm tắt quan hệ gia đình
└─────────────┴──────────────────────────────────────────┘
```

### Kích thước Chuẩn của Node:
- **Chiều rộng (Width):** Cố định `220px` (Desktop & Mobile).
- **Chiều cao (Height):** Cố định `90px`.
- **Bán kính bo góc (Border Radius):** `8px`.
- **Màu nền (Background):** Trắng ngà hoặc Xám sáng (`#FFFFFF` / `#F8FAFC`).

---

## 2. Các Trạng thái Hiển thị của Node (Node States)

| Trạng thái | Dấu hiệu Trực quan | Ý nghĩa Nghiệp vụ |
| :--- | :--- | :--- |
| **Mặc định (Default)** | Viền xám mỏng `1px`, bóng đổ nhẹ. | Thành viên bình thường trong cây. |
| **Người Trung tâm (Center Person)** | Viền xanh đậm `2px` (`#2563EB`) + Huy hiệu `🎯 Trung tâm`. | Trọng tâm quan sát của khung nhìn hiện tại. |
| **Đang Chọn (Selected)** | Viền xanh sáng `2px` kèm 4 nút mở rộng `+` bao quanh. | Người dùng đang tương tác với người này. |
| **Chưa Xác minh (Unverified)** | Viền nét đứt (`dashed border`) + Biểu tượng dấu hỏi `❓`. | Dữ liệu truyền khẩu đang cần kiểm chứng. |
| **Đã Mất (Deceased)** | Dải ruy-băng đen nhỏ ở góc trên hoặc nhãn `(Đã mất)`. | Thể hiện sự tôn kính, không gây phản cảm. |
| **Focus Bàn phím (A11y)** | Vòng sáng tương phản cao `3px outline` (`#3B82F6`). | Dành cho điều hướng bằng phím Tab. |

---

## 3. Quy tắc Bảo mật & Riêng tư Thông tin trên Node (`UXR-003`)
- **KHÔNG HIỂN THỊ TRÊN NODE:** Số điện thoại, Email, Căn cước công dân, Địa chỉ chi tiết, Toàn văn tiểu sử.
- **Rút gọn Tên Dài:** Nếu họ tên vượt quá 25 ký tự $\rightarrow$ Hiển thị rút gọn (ví dụ: *"Nguyễn Hoàng Minh..."*) và hiển thị đầy đủ khi chạm vào mở Profile Panel.
