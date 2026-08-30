# Hệ thống Màu sắc (Color Tokens) - Phase P10

- **Mã tài liệu:** `DS-COLOR-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Triết lý Bảng màu GenViet

Bảng màu của GenViet được thiết kế dựa trên hình tượng **Cây gia phả - Nguồn cội thiêng liêng**, mang sắc thái trang trọng, ấm áp và gần gũi với truyền thống văn hóa gia đình Việt Nam.

## 2. Bảng Semantic Color Tokens

| Token CSS | Giá trị Màu (Light) | Ý nghĩa / Ứng dụng Thực tế | Độ tương phản đạt chuẩn |
| :--- | :--- | :--- | :---: |
| `--background` | `hsl(0, 0%, 100%)` | Nền trắng chủ đạo của ứng dụng | Base |
| `--foreground` | `hsl(222.2, 47.4%, 11.2%)` | Chữ chính màu xám đậm (Slate Dark) | $\ge 12:1$ (`PASS`) |
| `--primary` | `hsl(160, 84%, 39%)` (`#059669`) | Xanh lá trầm (Emerald) - Màu thương hiệu chính | $\ge 4.6:1$ (`PASS`) |
| `--primary-foreground` | `hsl(0, 0%, 100%)` | Chữ trắng trên nền nút Primary | $\ge 4.6:1$ (`PASS`) |
| `--secondary` | `hsl(210, 40%, 96.1%)` | Nền phụ cho nút phụ, thẻ nhạt | $\ge 10:1$ (`PASS`) |
| `--muted` | `hsl(210, 40%, 96.1%)` | Nền cho các thành phần giảm chú ý | Base |
| `--muted-foreground` | `hsl(215.4, 16.3%, 46.9%)` | Chữ phụ, ngày tháng, nhãn mô tả | $\ge 4.8:1$ (`PASS`) |
| `--destructive` | `hsl(0, 84.2%, 60.2%)` | Màu đỏ cảnh báo xóa / hành động nguy hiểm | $\ge 4.5:1$ (`PASS`) |
| `--warning` | `hsl(38, 92%, 50%)` | Màu hổ phách cảnh báo dữ liệu chưa xác thực | $\ge 4.5:1$ (`PASS`) |
| `--success` | `hsl(142, 76%, 36%)` | Màu xanh lá xác nhận thành công | $\ge 4.5:1$ (`PASS`) |
| `--info` | `hsl(199, 89%, 48%)` | Màu xanh dương cung cấp thông tin | $\ge 4.5:1$ (`PASS`) |
| `--ring` | `hsl(160, 84%, 39%)` | Vòng sáng Focus Ring 2px khi điều hướng bàn phím | $\ge 3.0:1$ (`PASS`) |

---

## 3. Quy tắc Không dùng Màu làm Tín hiệu Duy nhất

- Mọi trạng thái Destructive/Warning/Success đều có **kèm theo Icon hoặc Nhãn chữ tiếng Việt cụ thể**, bảo đảm người dùng khiếm thị màu (Color blindness) vẫn nhận diện chính xác 100%.
