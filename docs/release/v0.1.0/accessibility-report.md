# Báo Cáo Đánh Giá Khả Năng Tiếp Cận (Accessibility Review - P26-T09)

- **Tiêu chuẩn tham chiếu:** WCAG 2.1 Level AA Baseline Checklist
- **Trạng thái:** `PASS (Không có lỗi P0/P1 gây cản trở thao tác)`

---

## 1. Kết Quả Kiểm Tra Chi Tiết
1. **Điều Hướng Bằng Bàn Phím (Keyboard Navigation):** Toàn bộ các tương tác chính (đăng nhập, tạo cây, mở modal, duyệt danh sách) điều hướng được bằng phím `Tab`, `Space`, `Enter` và `Escape`.
2. **Khóa Tiêu Điểm Trong Hộp Thoại (Dialog Focus Trap):** Mọi modal dialog đều bắt tiêu điểm bên trong và trả lại tiêu điểm vị trí cũ sau khi đóng.
3. **Độ Tương Phản Màu Sắc (Color Contrast):** Màu văn bản chính và các nút hành động đạt tỷ lệ tương phản $\ge 4.5:1$ so với nền.
4. **Nhãn Phù Hợp Trợ Năng (Aria Labels & Form Associations):** 100% trường nhập liệu có liên kết `label` và `aria-describedby` cho thông báo lỗi.
