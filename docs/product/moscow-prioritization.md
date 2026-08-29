# Phân loại Ưu tiên Tính năng MoSCoW (MoSCoW Prioritization)

- **Mã tài liệu:** `PROD-MOSCOW-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Định nghĩa Khung Phân loại MoSCoW

- **`Must-Have` (Bắt buộc phải có):** Các tính năng cốt lõi sống còn; nếu thiếu thì sản phẩm v0.1 không thể hoạt động, không mang lại giá trị hoặc không an toàn.
- **`Should-Have` (Nên có):** Tính năng có giá trị cao, nâng cao trải nghiệm người dùng; có thể triển khai ngay nếu không làm chậm tiến độ phát hành v0.1.
- **`Could-Have` (Có thể có):** Tính năng nhỏ, hữu ích nhưng không ảnh hưởng đến mục tiêu chính của v0.1; chỉ làm khi thừa thời gian.
- **`Won't-Have` (Không làm trong v0.1):** Các tính năng bị loại bỏ hoàn toàn khỏi phiên bản v0.1 để tránh phình to phạm vi (Scope Creep).

---

## 2. Bảng Phân loại Chi tiết Toàn bộ Hạng mục Tính năng

### 2.1. Nhóm Bắt buộc (Must-Have - 16 Hạng mục Cốt lõi)

| Mã | Tên hạng mục tính năng | Giá trị mang lại | Độ phức tạp | Phụ thuộc |
| :--- | :--- | :--- | :---: | :--- |
| **M-01** | Xác thực Email & Mật khẩu cơ bản | Bảo vệ tài khoản và phân quyền dữ liệu. | Thấp | Supabase Auth |
| **M-02** | Khởi tạo & Đổi tên Cây gia phả | Tạo không gian dữ liệu độc lập. | Thấp | CSDL PostgreSQL |
| **M-03** | Thêm, Xem, Sửa nhân vật linh hoạt | Nhập liệu thông tin cơ bản của từng người. | Vừa | CSDL PostgreSQL |
| **M-04** | Cho phép bắt đầu từ người bất kỳ | Không bắt buộc nhập từ Thủy tổ. | Thấp | Thiết kế dữ liệu |
| **M-05** | Thiết lập quan hệ Cha/Mẹ/Vợ/Con cơ bản | Cấu thành nên cây phả hệ gia đình. | Vừa | CSDL PostgreSQL |
| **M-06** | Mở rộng Tổ tiên lên trên từ bất kỳ node nào | Bổ sung thế hệ cha ông bất cứ lúc nào. | Vừa | Thuật toán ELK.js |
| **M-07** | Liên kết thành viên có sẵn làm phụ mẫu | Tái sử dụng node, tránh trùng lặp người. | Vừa | Logic quan hệ |
| **M-08** | Chống Quan hệ Chu trình & Tự liên kết | Giữ toàn vẹn đồ thị phả hệ (DAG). | Vừa | Validation Rule |
| **M-09** | Dựng đồ thị phân tầng tự động | Trực quan hóa thứ bậc thế hệ trên màn hình. | Cao | React Flow + ELK.js |
| **M-10** | Thay đổi Người trung tâm (Focus Node) | Tái định vị đồ thị theo góc nhìn từng người. | Vừa | React Flow State |
| **M-11** | Tương tác Zoom, Pan Canvas mượt mà | Thao tác khám phá cây trực quan. | Vừa | React Flow |
| **M-12** | Tìm kiếm tên có dấu và không dấu | Tra cứu người thân trong 2 giây. | Vừa | PostgreSQL Search |
| **M-13** | Giao diện Mobile Responsive (Touch) | Sử dụng mượt mà trên điện thoại thông minh. | Cao | Tailwind CSS |
| **M-14** | Mặc định Riêng tư & RLS Cách ly | Ngăn chặn 100% rò rỉ dữ liệu chéo. | Cao | Supabase RLS |
| **M-15** | Xuất bản sao lưu dữ liệu JSON | Cho phép người dùng tự lưu giữ an toàn. | Thấp | JSON Serializer |
| **M-16** | Xác nhận thao tác xóa & Trạng thái lỗi | Tránh mất dữ liệu nhầm lẫn, UX hoàn chỉnh. | Thấp | UI Components |

---

### 2.2. Nhóm Nên có (Should-Have - 7 Hạng mục)

| Mã | Tên hạng mục tính năng | Lý do thuộc Should | Điều kiện hoãn |
| :--- | :--- | :--- | :--- |
| **S-01** | Tải lên ảnh đại diện nhân vật | Tăng nhận diện người thân nhưng không ảnh hưởng cấu trúc cây. | Hoãn nếu xử lý Storage phức tạp. |
| **S-02** | Nhập / Phục hồi từ file JSON sao lưu | Tiện lợi khi chuyển máy nhưng có thể nhập tay lại trong v0.1. | Hoãn nếu schema validation cồng kềnh. |
| **S-03** | Khôi phục nhân vật từ thùng rác | Cứu dữ liệu đã xóa mềm; v0.1 có thể tạo lại node mới. | Hoãn sang v0.2. |
| **S-04** | Đăng nhập nhanh bằng Google OAuth | Giảm thao tác nhập mật khẩu; Email/Pass đã đủ dùng. | Hoãn nếu cấu hình OAuth tốn thời gian. |
| **S-05** | Hỗ trợ cài đặt PWA (Web App Install) | Lưu icon ra màn hình chính điện thoại tiện lợi. | Hoãn nếu Service Worker phát sinh lỗi cache. |
| **S-06** | Quản lý nhiều cây trên 1 tài khoản | Tạo cây nội/ngoại; v0.1 1 cây vẫn dùng được. | Ưu tiên cao trong Should. |
| **S-07** | Bộ lọc tìm kiếm theo thế hệ/giới tính | Hỗ trợ tìm nhanh khi cây có trên 200 người. | Hoãn sang v0.2. |

---

### 2.3. Nhóm Có thể có (Could-Have - 4 Hạng mục)

| Mã | Tên hạng mục tính năng | Ghi chú |
| :--- | :--- | :--- |
| **C-01** | Chọn khoảng năm sinh ước tính (Thập niên 1950s, 1960s) | Giúp nhập dữ liệu khi chỉ nhớ khoảng thời gian. |
| **C-02** | Giao diện Bottom Sheet vuốt chạm nâng cao trên mobile | Cải thiện cảm giác vuốt tự nhiên như app native. |
| **C-03** | Ghi nhớ người trung tâm đã xem gần nhất theo phiên | Giúp người dùng mở lại đúng chỗ đang xem. |
| **C-04** | Trường nhập thông tin nơi an táng / quê quán | Mở rộng thông tin tiểu sử. |

---

### 2.4. Nhóm Không làm trong v0.1 (Won't-Have - 12 Hạng mục Trọng điểm)

- **W-01:** Mời cộng tác và phân quyền nhiều người chỉnh sửa (`OOS-001`, `OOS-002`, `OOS-003`).
- **W-02:** Album ảnh gia đình đa phương tiện & Video (`OOS-006`, `OOS-007`).
- **W-03:** Lịch âm và nhắc ngày giỗ chạp (`OOS-010`, `OOS-011`).
- **W-04:** Xuất bản in phả đồ PDF vector khổ lớn A0/A1 (`OOS-015`).
- **W-05:** Tương thích chuẩn quốc tế GEDCOM (`OOS-016`).
- **W-06:** Thuật toán tính danh xưng xưng hô họ hàng (`OOS-017`).
- **W-07:** Tính năng trí tuệ nhân tạo (Nhận diện mặt AI, tóm tắt tiểu sử AI) (`OOS-019`, `OOS-020`).
- **W-08:** Phân tích dữ liệu xét nghiệm ADN (`OOS-021`).
- **W-09:** Ứng dụng di động native trên App Store / Google Play (`OOS-026`).
- **W-10:** Chỉnh sửa Offline-first và đồng bộ xung đột tự động (`OOS-027`).
- **W-11:** Chế độ cây gia phả công khai cho cộng đồng (`OOS-025`).
- **W-12:** Mạng xã hội dòng họ, chat và thanh toán trực tuyến (`OOS-022`, `OOS-023`, `OOS-024`).
