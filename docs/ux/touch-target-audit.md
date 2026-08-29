# Báo cáo Kiểm toán Kích thước Thao tác Cảm ứng (Touch Target Audit)

- **Mã tài liệu:** `UX-AUDIT-TOUCH-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Tiêu chuẩn Kích thước Cảm ứng Nền tảng (WCAG 2.2 AA Baseline)

- **Kích thước Mục tiêu Tối thiểu:** `44 x 44 CSS px` cho mọi phần tử có thể chạm (Touch Target).
- **Khoảng cách Tối thiểu giữa 2 nút:** $\ge 8\text{px}$ để ngăn chặn bấm nhầm.

---

## 2. Bảng Kiểm toán Thành phần Giao diện (Component Touch Audit)

| Thành phần Giao diện | Kích thước Thiết kế | Khoảng cách Đệm (Padding/Margin) | Trạng thái Đánh giá | Ghi chú Triển khai cho Phase Kỹ thuật (P10 / P15) |
| :--- | :---: | :---: | :---: | :--- |
| **Node Thành viên trên Canvas** | `220 x 90 px` | Margin $\ge 30\text{px}$ | `PASS` | Vùng chọn cực kỳ rộng rãi, dễ dàng chạm ngón tay. |
| **Nút Menu Ba Chấm `[...]` trên Node** | `44 x 44 px` *(Vùng chạm)* | Cách mép `8px` | `PASS` | Icon `20px` nằm giữa vùng touch `44px`. |
| **Thanh Điều khiển Nổi Canvas (`[+] [-]`)**| `44 x 44 px` | Gap `8px` giữa các nút | `PASS` | Nổi ở góc trái, dễ bấm bằng ngón tay cái. |
| **Thanh Bottom Navigation (Mobile)** | Cao `56px`, rộng $25\%$ màn hình | Full cell touch | `PASS` | Đạt chuẩn Material / iOS Human Interface Guidelines. |
| **Nút Đóng Bottom Sheet `[X]`** | `44 x 44 px` | Nằm góc phải trên cùng | `PASS` | Dễ dàng đóng bằng tay phải. |
| **Các Ô Nhập Form (Input Fields)** | Cao `48px` | Gap dọc `16px` | `PASS` | Chiều cao lớn, dễ chạm để mở bàn phím. |
| **Bộ chọn Date Precision (Dropdown)** | Cao `44px` | Margin `12px` | `PASS` | Menu mở rộng dạng radio list to rõ. |
| **Nút Hành động Form (`Lưu`, `Hủy`)** | Cao `48px` | Gap ngang `12px` | `PASS` | Nút Lưu full-width hoặc nổi bật. |
| **Danh sách Kết quả Tìm kiếm** | Mỗi dòng cao `64px` | Border ngăn cách | `PASS` | Chạm cả hàng để xem chi tiết. |
| **Nút Xóa Nguy hiểm (`Delete`)** | Cao `44px` | Cách nút trên $\ge 24\text{px}$ | `PASS` | Đặt cách xa các nút thao tác thông thường để chống bấm nhầm. |

---

## 3. Kết luận Kiểm toán
100% các thành phần tương tác cảm ứng cốt lõi trên Mobile đều đạt hoặc vượt chuẩn `44 x 44 CSS px`. Thiết kế sẵn sàng bàn giao làm baseline cho Phase P10 (Design System) và Phase P15 (Tree View Implementation).
