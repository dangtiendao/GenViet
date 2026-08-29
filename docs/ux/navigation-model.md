# Mô hình Điều hướng Ứng dụng (Navigation Model: Desktop & Mobile)

- **Mã tài liệu:** `UX-NAVMODEL-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Mô hình Điều hướng trên Desktop (Desktop Navigation) - `P03-T15`

Desktop sử dụng cấu trúc kết hợp giữa **Top Header tinh gọn** và **Thanh công cụ Canvas nổi (Floating Controls)** để tối đa hóa không gian hiển thị cây gia phả:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  [Logo] GenViet  |  Họ Nguyễn (Nam Định) ▾      [ 🔍 Tìm kiếm... Ctrl+K ] (User) ▾│
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   [ + ] Zoom In                                                            │
│   [ - ] Zoom Out                CANVAS ĐỒ THỊ CÂY GIA PHẢ                  │
│   [ ⛶ ] Fit View                                                           │
│   [ 🎯] Về Mốc                                                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Các Thành phần Điều hướng Desktop:
- **`NAV-001` (App Top Header):** Chứa Logo, Bộ chuyển đổi cây (Tree Switcher), Thanh tìm kiếm nhanh `Ctrl + K`, Nút Cài đặt và Menu tài khoản.
- **`NAV-002` (Floating Canvas Toolbar):** Nằm gọn ở góc trái màn hình Canvas, bao gồm các nút phóng to, thu nhỏ, vừa màn hình (`Fit View`), đưa về người trung tâm (`Center Person`).
- **`NAV-003` (Side Panel Profile Drawer):** Trượt từ mép phải màn hình sang khi nhấp vào bất kỳ Person nào, không che khuất toàn bộ cây.

---

## 2. Mô hình Điều hướng trên Mobile (Mobile Bottom Navigation) - `P03-T16`

Trên màn hình điện thoại ($375\text{px}$), ứng dụng sử dụng thanh điều hướng đáy cố định (**Bottom Navigation Bar**) với 4 mục chính trong tầm với của ngón tay cái:

```text
┌────────────────────────────────────────────────────────┐
│  [ 🌳 Cây ]    [ 🔍 Tìm kiếm ]    [ ⚙️ Cài đặt ]    [ 👤 Tôi ]  │
└────────────────────────────────────────────────────────┘
```

| Mục Điều hướng | Mã Nav | Biểu tượng & Nhãn | Hành vi khi Chạm (Touch Interaction) |
| :--- | :---: | :--- | :--- |
| **Cây gia phả** | `NAV-M01` | 🌳 Cây | Mở khung nhìn đồ thị Canvas chính, tập trung vào Center Person. |
| **Tìm kiếm** | `NAV-M02` | 🔍 Tìm kiếm | Mở trang tra cứu thành viên toàn diện `SCR-010`. |
| **Cài đặt** | `NAV-M03` | ⚙️ Cài đặt | Mở trang cài đặt cây gia phả và xuất sao lưu `SCR-019`. |
| **Tài khoản** | `NAV-M04` | 👤 Tôi | Quản lý thông tin đăng nhập, đổi mật khẩu, đăng xuất. |

### Các Quy tắc An toàn Điều hướng Di động:
- **Không đặt nút Thao tác Nguy hiểm ở Bottom Nav (`UXR-004`):** Nút xóa hoặc ngắt liên kết tuyệt đối không bao giờ nằm ở thanh điều hướng đáy.
- **Tự động Ẩn khi Bàn phím Xuất hiện:** Khi người dùng mở bàn phím ảo để nhập liệu, Bottom Navigation tự động ẩn để tránh che mất các nút hành động trong form.
- **Tuân thủ Vùng An toàn (Safe Area Insets):** Tương thích với thanh điều hướng cử chỉ của iOS và Android (đệm padding dưới đáy $\ge 20\text{px}$).
