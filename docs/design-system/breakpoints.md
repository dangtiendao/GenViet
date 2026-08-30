# Chính sách Điểm ngắt Giao diện (Breakpoints Policy) - Phase P10

- **Mã tài liệu:** `DS-BREAK-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Bảng Điểm ngắt Tiêu chuẩn (Tailwind CSS v4)

| Breakpoint | Chiều rộng Viewport | Mục tiêu Bố cục & Trải nghiệm |
| :--- | :--- | :--- |
| **`Base`** | `< 640px` | Giao diện điện thoại di động (1 cột, Mobile Bottom Nav, Drawer, Bottom Sheet). |
| **`sm`** | `\ge 640px` | Màn hình điện thoại lớn / phablet, form chia 2 cột nhỏ. |
| **`md`** | `\ge 768px` | Tablet dọc, form mở rộng 2-3 cột, card hiển thị dạng lưới. |
| **`lg`** | `\ge 1024px` | **Desktop Breakpoint**: Ẩn Mobile Nav, kích hoạt Desktop Sidebar cố định (`w-64`). |
| **`xl`** | `\ge 1280px` | Màn hình máy tính để bàn tiêu chuẩn (`max-w-7xl`). |
| **`2xl`** | `\ge 1536px` | Màn hình máy tính lớn, giới hạn nội dung trung tâm không kéo giãn vô hạn. |

---

## 2. Nguyên tắc Mobile-First
- Thiết kế mặc định ưu tiên màn hình di động nhỏ (`320px` - `375px`).
- Không sử dụng các điều kiện phát hiện thiết bị (User-Agent Sniffing); bố cục tự động thích ứng mượt mà theo CSS Media Queries.
