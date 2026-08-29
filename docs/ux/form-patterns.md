# Bộ Mẫu Thiết kế Biểu mẫu & Nhập liệu (Form Patterns)

- **Mã tài liệu:** `UX-PATTERNS-FORM-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Mẫu Nhập Liệu Ngày tháng Phức hợp (Date Precision Input Pattern)

Do dữ liệu phả hệ thường khuyết thiếu ngày tháng, Form nhập ngày tháng của GenViet được thiết kế với bộ chọn cấp độ chính xác linh hoạt:

```text
┌────────────────────────────────────────────────────────┐
│  Ngày sinh                                             │
│  ┌───────────────────────┬──────────────────────────┐  │
│  │ Độ chính xác:         │ [ Chỉ biết năm ▾ ]       │  │
│  ├───────────────────────┴──────────────────────────┤  │
│  │ Năm sinh: [ 1945                               ] │  │
│  └──────────────────────────────────────────────────┘  │
│  💡 Không bắt buộc nhập ngày tháng nếu gia đình không nhớ │
└────────────────────────────────────────────────────────┘
```

- **Khi chọn "Ngày chính xác":** Hiển thị ô chọn ngày lịch chuẩn `DD/MM/YYYY`.
- **Khi chọn "Tháng và Năm":** Hiển thị bộ chọn `MM/YYYY`.
- **Khi chọn "Chỉ biết năm":** Hiển thị ô nhập số 4 chữ số `YYYY`.
- **Khi chọn "Khoảng năm / Ước tính":** Hiển thị ô nhập `Khoảng năm YYYY`.

---

## 2. Mẫu Biểu mẫu 2 Tab Thêm Quan hệ (Tabbed Relationship Pattern)

Mọi form thêm người thân (`Thêm Cha`, `Thêm Mẹ`, `Thêm Vợ/Chồng`, `Thêm Con`) đều sử dụng cấu trúc 2 Tab rõ ràng:

```text
┌────────────────────────────────────────────────────────┐
│  [ Tab 1: Tạo Người Mới ]    [ Tab 2: Chọn Người Có Sẵn ]│
├────────────────────────────────────────────────────────┤
│  ... (Nội dung form tương ứng theo từng tab) ...       │
└────────────────────────────────────────────────────────┘
```

---

## 3. Mẫu Báo lỗi Inline & Quản lý Focus (Inline Validation Pattern)
- Khi submit form có lỗi (ví dụ: để trống họ tên, năm mất trước năm sinh):
  1. Hiển thị thông báo lỗi màu đỏ ngay dưới ô nhập vi phạm.
  2. Tự động di chuyển con trỏ (Focus) tới **trường lỗi đầu tiên trong form**.
  3. Đọc thông báo lỗi cho người dùng Screen Reader thông qua thuộc tính `aria-describedby`.
