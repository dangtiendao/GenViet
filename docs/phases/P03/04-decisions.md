# Nhật ký Quyết định: Phase P03 (Phase Decisions)

Tài liệu này ghi nhận các quyết định thiết kế trải nghiệm người dùng (UX Decisions) và nguyên tắc tương tác được thống nhất trong Phase P03.

---

## 1. Danh sách Quyết định UX trong Phase P03

### P03-DEC-001: Cấu trúc Bottom Navigation 4 Mục Cố định trên Mobile
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Cần thanh điều hướng đáy di động tinh gọn, dễ chạm trong tầm ngón tay cái mà không quá tải thông tin.
- **Quyết định:** Khóa cố định 4 mục: `🌳 Cây`, `🔍 Tìm kiếm`, `⚙️ Cài đặt`, `👤 Tôi`.
- **Lý do:** Tối ưu hóa không gian hiển thị, tuân thủ tiêu chuẩn chiều cao `56px` và vùng an toàn Safe Area.

### P03-DEC-002: Ngăn Kéo Đáy 3 Nấc (3-Tier Bottom Sheet) cho Hồ sơ Di động
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Tránh việc người dùng bị mất ngữ cảnh cây khi chạm vào xem thông tin thành viên trên điện thoại.
- **Quyết định:** Sử dụng Bottom Sheet với 3 nấc: `Peek` (80px), `Half` (45% màn hình) và `Full` (90% màn hình).
- **Lý do:** Giúp người dùng vừa xem tên, phụ mẫu vừa nhìn thấy vị trí node của họ trên cây gia phả.

### P03-DEC-003: Mẫu Form Quan hệ 2 Tab (Tạo Mới vs Chọn Có Sẵn)
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Giúp người dùng dễ dàng phân biệt giữa việc tạo một người thân mới và liên kết một người đã có trên cây.
- **Quyết định:** Mọi form thêm Cha, Mẹ, Vợ/Chồng, Con đều chia 2 Tab độc lập.
- **Lý do:** Loại bỏ triệt để nhầm lẫn giữa thao tác nối quan hệ (`Link`) và gộp hồ sơ (`Merge`).

### P03-DEC-004: Bộ chọn Date Precision Trực tiếp trong Biểu mẫu
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Người dùng thường chỉ nhớ năm sinh (ví dụ: 1945), nếu dùng bộ chọn lịch thông thường sẽ ép họ chọn ngày 01/01.
- **Quyết định:** Tích hợp bộ chọn độ chính xác ngày tháng (Chính xác, Tháng/Năm, Chỉ năm, Ước tính).
- **Lý do:** Tuân thủ nguyên tắc tôn trọng dữ liệu lịch sử và Invariant `INV-010`.

### P03-DEC-005: Xem trước Tác động (Impact Preview) Bắt buộc khi Xóa Mềm
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Người dùng thường lo sợ xóa 1 người sẽ làm mất sạch con cái hoặc cha mẹ của người đó.
- **Quyết định:** Hộp thoại xóa mềm luôn liệt kê số lượng quan hệ bị ngắt và câu cam kết bảo toàn dữ liệu người thân.
- **Lý do:** Giúp người dùng an tâm thao tác, loại bỏ nỗi sợ mất dữ liệu.
