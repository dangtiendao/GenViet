# Báo Cáo Nghiệm Thu Môi Trường Máy Tính Để Bàn (Desktop Acceptance Report - P26-T07)

- **Trình duyệt kiểm thử:** Chromium Desktop (v133), WebKit Desktop (v18.2).
- **Độ phân giải màn hình (Viewports):** 1280x800, 1440x900, 1920x1080.
- **Trạng thái:** `PASS`

---

## 1. Kết Quả Nghiệm Thu Các Luồng Chính
1. **Xác thực & Chuyển hướng:** Đăng ký, đăng nhập, quên mật khẩu và bảo vệ các tuyến riêng tư hoạt động mượt mà.
2. **Quản lý Cây gia phả & Thành viên:** Tạo cây, thêm nhân vật với PartialDateInput, chỉnh sửa và xóa vào thùng rác hoạt động chính xác.
3. **Trực quan hóa Đồ thị Cây (Tree View):**
   - React Flow render sắc nét, không giật lag.
   - Thao tác zoom in/out, fit view và kéo thả canvas mượt mà.
   - Menu hành động trên node hiển thị đúng vị trí.
4. **Tìm kiếm & Phân trang:** Lọc theo họ tên tiếng Việt, giới tính và năm sinh hoạt động nhanh chóng.
5. **Sao lưu & Nhập JSON:** Xuất và nạp tệp backup JSON v1.0 hoạt động chính xác.
