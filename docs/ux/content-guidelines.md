# Hướng dẫn Nội dung & Văn phong Giao diện (UX Content Guidelines)

- **Mã tài liệu:** `UX-CONTENT-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Nguyên tắc Văn phong Phả học Chuẩn mực

1. **Trang trọng, Ấm áp và Tôn kính:** Sử dụng từ ngữ mang nét văn hóa gia đình Việt Nam truyền thống (*"Thành viên dòng họ"*, *"Phụ mẫu"*, *"Tổ tiên"*, *"Hậu duệ"*).
2. **Không Đổ lỗi cho Người dùng:** Thay vì viết *"Bạn đã nhập sai thông tin"*, hãy viết *"Vui lòng kiểm tra lại ngày sinh để tiếp tục"*.
3. **Nút Bấm Dùng Động từ Cụ thể:** Tuyệt đối không dùng chữ *"OK"* cho các thao tác quan trọng. Dùng *"Lưu thành viên"*, *"Xác nhận xóa mềm"*, *"Tiếp tục tạo mới"*.

---

## 2. Bảng Chuẩn hóa Từ ngữ Tránh Nhầm lẫn

| Cụm từ Đúng Chuẩn Nghiệp vụ | Cụm từ TUYỆT ĐỐI TRÁNH (Sai bản chất) | Lý do Tránh |
| :--- | :--- | :--- |
| **Thành viên gia phả / Người** | *Tài khoản dòng họ* | Tránh nhầm lẫn Person với User Account. |
| **Thành viên đầu tiên (Initial Person)** | *Cụ Thủy tổ dòng họ* | Người tạo đầu tiên có thể là chính người dùng. |
| **Người trung tâm (Center Person)** | *Gốc cây gia phả (Tree Root)* | Tránh nhầm lẫn trọng tâm quan sát với root đồ thị. |
| **Mốc đánh số đời (Generation Anchor)** | *Thế hệ gốc bất biến* | Số đời là giá trị tương đối theo mốc được chọn. |
| **Xóa thành viên khỏi cây** | *Xóa sạch dòng họ* | Làm người dùng hoảng sợ tưởng xóa lan truyền. |
| **Liên kết người đã có trong cây** | *Gộp hai người làm một* | Phân biệt thao tác nối quan hệ với gộp hồ sơ. |

---

## 3. Định dạng Ngày tháng Không Đầy đủ trên Giao diện

| Dữ liệu Người dùng Nhập | Hiển thị Đúng Chuẩn trên Giao diện | Hiển thị SAI (Cấm tuyệt đối) |
| :--- | :--- | :--- |
| Chỉ biết năm sinh `1932` | **1932** (hoặc *Năm 1932*) | ❌ `01/01/1932` |
| Biết tháng và năm `03/1932` | **Tháng 3, 1932** | ❌ `01/03/1932` |
| Năm sinh ước tính `~1930` | **Khoảng 1930** (hoặc *Thập niên 1930s*) | ❌ `1930` (Làm mất tính ước chừng) |
| Đã mất nhưng không rõ ngày | **(Đã mất)** | ❌ Tự đoán ngày mất hoặc để còn sống |
