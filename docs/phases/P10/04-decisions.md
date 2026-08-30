# Nhật ký Quyết định Kỹ thuật: Phase P10 (Phase Decisions)

Tài liệu này ghi nhận các quyết định kỹ thuật về thiết kế giao diện trong Phase P10.

---

## 1. Danh sách Quyết định Kỹ thuật Phase P10

| Mã Quyết định | Tiêu đề Quyết định | Trạng thái | Tóm tắt Nội dung |
| :--- | :--- | :---: | :--- |
| **`P10-DEC-001`** | **Primary Emerald Color Palette:** | `ACCEPTED` | Chọn tone màu Emerald (#059669) làm màu nhận diện thương hiệu cốt lõi, tượng trưng cho sự sống và cội nguồn gia phả. |
| **`P10-DEC-002`** | **Adaptive Partial Date Contract:** | `ACCEPTED` | Component `PartialDateInput` duy trì trạng thái 4 cấp độ (exact/month/year/unknown) và cờ `isEstimated`, không chèn ngày giả 01/01. |
| **`P10-DEC-003`** | **Dual Responsive Navigation Mode:** | `ACCEPTED` | Sử dụng Desktop Sidebar ở breakpoint $\ge 1024\text{px}$ và Mobile Bottom Navigation ở breakpoint $< 1024\text{px}$. |
| **`P10-DEC-004`** | **Non-drag Mobile Bottom Sheet:** | `ACCEPTED` | Mobile Bottom Sheet luôn có nút đóng rõ ràng và phím Escape, không bắt buộc người dùng chỉ dùng thao tác kéo trượt. |
| **`P10-DEC-005`** | **Accessible Focus & Target Baseline:** | `ACCEPTED` | Áp dụng kích thước touch target tối thiểu $\ge 44\times 44\text{px}$ và vòng sáng Focus ring 2px trên toàn bộ các interactive controls. |
