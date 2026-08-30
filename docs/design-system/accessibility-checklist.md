# Danh mục Kiểm toán Khả năng Tiếp cận (Accessibility Checklist) - Phase P10

- **Mã tài liệu:** `DS-A11Y-01`
- **Phiên bản:** `v0.1-baseline`
- **Tiêu chuẩn mục tiêu:** `WCAG 2.2 Level AA`

---

## Bảng Đánh giá Tiêu chuẩn Khả năng Tiếp cận

| Tiêu chí WCAG 2.2 AA | Yêu cầu Kỹ thuật | Trạng thái Kiểm toán P10 |
| :--- | :--- | :---: |
| **1.4.3 Contrast (Minimum)** | Độ tương phản chữ thường $\ge 4.5:1$, chữ lớn $\ge 3.0:1$. | `PASS` (Bảng mã màu đạt chuẩn) |
| **2.1.1 Keyboard** | Mọi nút bấm, menu, link và input đều điều hướng được qua phím Tab/Enter/Space. | `PASS` (Đã kiểm thử Playwright & Vitest) |
| **2.1.2 No Keyboard Trap** | Không bị kẹt tiêu điểm bàn phím trong Modal/Drawer. | `PASS` (Focus Trap có phím Escape) |
| **2.4.7 Focus Visible** | Vòng sáng Focus Ring 2px luôn hiển thị rõ ràng trên mọi control. | `PASS` (Lớp tiện ích `focus-visible`) |
| **2.5.5 / 2.5.8 Target Size** | Kích thước vùng bấm tối thiểu $\ge 44\times 44\text{px}$ trên thiết bị di động. | `PASS` (Mọi nút mobile đều $\ge 44\text{px}$) |
| **4.1.2 Name, Role, Value** | Toàn bộ Dialog, Drawer, Input, Button đều có accessible name và ARIA semantics. | `PASS` (Gán nhãn tiếng Việt rõ ràng) |
