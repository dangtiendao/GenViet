# Hệ thống Khoảng cách & Kích thước (Spacing & Dimensions) - Phase P10

- **Mã tài liệu:** `DS-SPACE-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Thang Khoảng cách Cơ bản (4px Grid Baseline)

| Token Spacing | Kích thước | Ứng dụng |
| :--- | :--- | :--- |
| `space-1` / `p-1` | `4px` | Khoảng cách inline nhỏ, icon padding |
| `space-2` / `p-2` | `8px` | Khoảng cách giữa icon và nhãn |
| `space-3` / `p-3` | `12px` | Padding trong ô input, thẻ badge |
| `space-4` / `p-4` | `16px` | Padding trang mobile, khoảng cách giữa các trường form |
| `space-6` / `p-6` | `24px` | Padding card, khoảng cách giữa các phần |
| `space-8` / `p-8` | `32px` | Padding trang desktop, khoảng cách section lớn |

---

## 2. Quy chuẩn Kích thước Thành phần Khung (Layout Dimensions)

- **Touch Target tối thiểu:** $\ge 44\times 44\text{px}$ trên tất cả nút bấm và liên kết điều hướng mobile (`min-h-[44px] min-w-[44px]`).
- **Chiều cao Header:** `h-16` (`64px` trên Desktop, `56px` trên Mobile).
- **Chiều rộng Sidebar Desktop:** `w-64` (`256px` khi mở rộng).
- **Chiều cao Mobile Bottom Nav:** `h-16` (`64px`) kèm padding `safe-area-bottom`.
- **Khoảng đệm nội dung dưới (Content Bottom Spacer):** `pb-24 lg:pb-8` bảo đảm thanh điều hướng đáy không che mất nội dung hoặc nút bấm cuối trang.
