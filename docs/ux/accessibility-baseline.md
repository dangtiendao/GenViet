# Tiêu chuẩn Khả năng Tiếp cận Nền tảng (Accessibility Baseline: WCAG 2.2 AA)

- **Mã tài liệu:** `UX-A11Y-BASELINE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Tuyên bố Khả năng Tiếp cận (Accessibility Statement)

GenViet hướng tới mục tiêu đáp ứng tiêu chuẩn **WCAG 2.2 cấp độ AA** trong giai đoạn thiết kế trải nghiệm, đảm bảo mọi người dùng—bao gồm người lớn tuổi, người khiếm thị sử dụng Screen Reader, người dùng chỉ dùng bàn phím—đều có thể tra cứu và gìn giữ gia phả một cách thuận tiện.

*(Lưu ý: Tài liệu này xác lập tiêu chuẩn thiết kế kiến trúc UX; việc kiểm thử nghiệm thu kỹ thuật thực tế sẽ được thực hiện tại Phase P10, P15 và P22).*

---

## 2. Các Quy chuẩn Tiếp cận Cốt lõi

### 2.1. Điều hướng Hoàn toàn bằng Bàn phím (Keyboard Navigation)
- **Thứ tự Tab Logic:** Đi theo chiều đọc từ trên xuống dưới, từ trái sang phải (`Header` $\rightarrow$ `Canvas Node` $\rightarrow$ `Controls` $\rightarrow$ `Panel`).
- **Trực quan hóa Vết Focus (`Visible Focus`):** Mọi phần tử đang nhận focus đều có vòng sáng bao quanh tương phản cao (`outline: 3px solid #2563EB; outline-offset: 2px;`).
- **Bẫy Focus trong Hộp thoại (Dialog Focus Trap):** Khi Modal hoặc Sheet mở ra, phím Tab chỉ di chuyển bên trong hộp thoại; bấm `ESC` sẽ đóng hộp thoại và trả lại focus về phần tử kích hoạt trước đó.

### 2.2. Tương phản Màu sắc & Tính Độc lập Màu (Color Independence)
- **Tỷ lệ Tương phản Tối thiểu:**
  - Văn bản thông thường: Đạt tỷ lệ tương phản $\ge 4.5:1$ so với nền.
  - Văn bản tiêu đề lớn & Biểu tượng UI: Đạt tỷ lệ tương phản $\ge 3.0:1$.
- **Không Dùng Màu Làm Tín hiệu Duy nhất:** Mọi trạng thái (lỗi, cảnh báo, giới tính) đều có kèm biểu tượng (`Icon`) và văn bản mô tả cụ thể.

### 2.3. Giải pháp Thay thế cho Canvas Đồ thị (Non-Canvas Alternative)
- Đối với người dùng khiếm thị sử dụng Trình đọc màn hình (Screen Reader / NVDA / VoiceOver): Canvas đồ thị có thể khó định vị không gian.
- **Giải pháp:** Hệ thống cung cấp **Chế độ Danh sách Thành viên & Tra cứu Tìm kiếm (`SCR-010`)** song song với Canvas, cho phép người dùng dùng Screen Reader đọc lần lượt từng thế hệ, phụ mẫu và con cái một cách tuần tự và rõ ràng.

### 2.4. Hỗ trợ Giảm Chuyển động (Reduced Motion)
- Khi người dùng kích hoạt `prefers-reduced-motion: reduce` trên hệ điều hành: Các hiệu ứng trượt mượt mà (Smooth Pan, Zoom Animation, Shimmer) được tự động tắt hoặc thay thế bằng chuyển cảnh tức thì để chống chóng mặt.
