# Nhật ký Quyết định: Phase P02 (Phase Decisions)

Tài liệu này ghi nhận các quyết định nghiệp vụ và nguyên tắc phân tích phả hệ được thống nhất trong Phase P02.

---

## 1. Danh sách Quyết định Nghiệp vụ trong Phase P02

### P02-DEC-001: Phân định Rạch ròi 4 Loại Người Mốc
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Cần giải quyết sự nhầm lẫn giữa người tạo đầu tiên, người đang xem, cụ tổ và mốc tính đời.
- **Quyết định:** Tách biệt thành 4 khái niệm độc lập:
  1. `Initial Person`: Ghi nhận thứ tự tạo.
  2. `Center Person`: Trọng tâm quan sát Canvas.
  3. `Founding Ancestor`: Danh hiệu danh dự / truyền thống do người dùng gán.
  4. `Generation Anchor`: Điểm mốc Đời 1 để tính số đời tương đối.
- **Lý do:** Loại bỏ triệt để các giả định sai lầm và cho phép mở rộng cây đa chiều linh hoạt.

### P02-DEC-002: Xử lý Quan hệ Cha Mẹ Kế & Giám Hộ trong v0.1
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Cần xác định cách hiển thị cha mẹ kế và người giám hộ mà không làm rối đồ thị React Flow.
- **Quyết định:**
  - Cha Mẹ Kế (`Step-parent`) được coi là quan hệ suy ra từ Hôn nhân + Phụ mẫu ruột.
  - Người Giám hộ (`Guardian`) được lưu trong bảng ghi chú chi tiết Profile, không vẽ đường nối trên Canvas chính ở v0.1.
- **Lý do:** Giữ cho đồ thị cây gia phả rõ ràng, trực quan, tập trung vào huyết thống và hôn phối trực tiếp.

### P02-DEC-003: Cấm Điền Ngày Giả `01/01` & Bảo toàn Date Precision
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Nhiều hệ thống tự động ép năm `1950` thành `1950-01-01`.
- **Quyết định:** CSDL và JSON Backup lưu đồng thời giá trị năm/tháng và mã cấp độ chính xác (`precision`). Cấm tuyệt đối việc tự động thêm ngày tháng giả.
- **Lý do:** Tôn trọng tính trung thực của dữ liệu lịch sử phả hệ.

### P02-DEC-004: Cấm Tự ý Xóa Lan Truyền (No Silent Cascading Delete)
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Khi xóa một nhân vật trung gian, có nên xóa luôn con cháu hay không?
- **Quyết định:** Xóa một Person chỉ ngắt kết nối trực tiếp của người đó; toàn bộ con cái, cha mẹ, vợ chồng của họ vẫn được giữ nguyên vẹn trên cây.
- **Lý do:** Bảo vệ dữ liệu phả hệ khỏi các thao tác xóa nhầm tai hại của người dùng.

### P02-DEC-005: Số Đời Tính Tương Đối theo Anchor
- **Trạng thái:** `PROVISIONAL`
- **Bối cảnh:** Làm thế nào để đánh số đời khi người dùng thêm cụ tổ đời cao hơn lên phía trên?
- **Quyết định:** Số đời là nhãn hiển thị tương đối theo Mốc (Anchor = 1). Thêm cụ tổ phía trên không ép đổi số đời toàn cây trừ khi người dùng chuyển Mốc lên cụ tổ đó.
- **Lý do:** Tránh việc phải chạy câu lệnh update hàng loạt số đời trong CSDL mỗi khi thêm một tổ tiên mới.
