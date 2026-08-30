# Hệ thống Kiểu chữ (Typography Scale) - Phase P10

- **Mã tài liệu:** `DS-TYPO-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Font Family & Hỗ trợ Tiếng Việt
- **Primary Sans Font:** System Font Stack (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`) tối ưu hóa tốc độ tải và hỗ trợ đầy đủ 100% bộ ký tự dấu tiếng Việt.
- **Font-feature-settings:** `"rlig" 1, "calt" 1` nhằm hiển thị các dấu câu và số chuẩn mực.

---

## 2. Thang Kích thước Kiểu chữ (Type Scale)

| Cấp bậc Typo | Tailwind Class | Kích thước (Desktop / Mobile) | Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Display Title** | `text-2xl` đến `text-3xl` | `24px` - `30px` / `700 bold` | Tiêu đề trang chính, Tên cây gia phả lớn |
| **Section Heading** | `text-lg` đến `text-xl` | `18px` - `20px` / `600 semibold` | Tiêu đề card, Tiêu đề modal dialog |
| **Subheading** | `text-base` | `16px` / `600 semibold` | Tiêu đề nhóm, Tên thành viên phả hệ |
| **Body Baseline** | `text-base md:text-sm` | `16px` (Mobile) / `14px` (Desktop) | Nội dung văn bản, đoạn mô tả |
| **Form Inputs** | `text-base md:text-sm` | `16px` (Mobile) / `14px` (Desktop) | Input text (ngăn chặn Safari zoom tự động) |
| **Caption & Helper** | `text-xs` | `12px` / `400 regular` | Chú thích, thời gian, nhãn phụ |
| **Micro Badge** | `text-[10px]` | `10px` / `500 medium` | Nhãn trạng thái nhỏ gọn |

---

## 3. Xử lý Tràn chữ Tiếng Việt (Text Truncation)
- Sử dụng tiện ích `truncate` hoặc `line-clamp-2` cho tên họ dài của người Việt (ví dụ: *"Công Tằng Tôn Nữ Nguyễn Thị..."*).
- Không sử dụng chữ in hoa toàn bộ (ALL-CAPS) cho các đoạn văn bản dài.
