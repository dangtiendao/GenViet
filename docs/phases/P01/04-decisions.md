# Nhật ký Quyết định: Phase P01 (Phase Decisions)

Tài liệu này ghi nhận các quyết định sản phẩm và ranh giới nghiệp vụ được thống nhất trong Phase P01.

---

## 1. Danh sách Quyết định Sản phẩm trong Phase P01

### P01-DEC-001: Tập trung Hoàn toàn vào Mô hình Single-Owner trong v0.1
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Bối cảnh:** Cần quyết định việc có nên đưa tính năng mời thành viên hoặc nhiều người cùng chỉnh sửa (Multi-admin) vào v0.1 hay không.
- **Quyết định:** v0.1 chỉ tập trung vào trải nghiệm một người dùng tự quản lý dữ liệu cây của mình. Toàn bộ tính năng phân quyền cộng tác (`OOS-001` - `OOS-003`) hoãn sang v0.2+.
- **Lý do:** Giúp cấu trúc bảng CSDL và chính sách RLS cực kỳ đơn giản, loại bỏ rủi ro xung đột ghi đè đồng thời và đảm bảo phát hành v0.1 đúng tiến độ.

### P01-DEC-002: Bắt đầu Cây từ Node Bất kỳ & Mở rộng Tổ tiên Đa chiều
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Bối cảnh:** Nhiều công cụ bắt buộc phải biết đời Thủy tổ mới vẽ được cây.
- **Quyết định:** GenViet cho phép tạo người đầu tiên là bất kỳ ai (bản thân, cha mẹ, con cái). Hệ thống hỗ trợ thêm cha mẹ lên trên và con cái xuống dưới linh hoạt bất cứ lúc nào.
- **Lý do:** Phù hợp với thực tế thu thập dữ liệu chắp vá của người dùng Việt Nam.

### P01-DEC-003: Xuất JSON là Must-Have, Nhập JSON là Should-Have
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Bối cảnh:** Cần cân nhắc mức độ ưu tiên của tính năng Import và Export backup.
- **Quyết định:** Xuất bản sao lưu JSON (`FR-009`) là bắt buộc `Must` để người dùng không sợ mất dữ liệu. Nhập bản sao lưu (`UC-022`) xếp vào mức `Should` để tránh phức tạp hóa khâu kiểm tra lỗi schema trong phiên bản đầu.

### P01-DEC-004: Ngưỡng Quy mô Mục tiêu 1.000 Người & Cửa sổ Quan sát Phân tầng
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Bối cảnh:** Cần xác định quy mô hỗ trợ để định hướng kiến trúc mà không gây quá tải giao diện.
- **Quyết định:** CSDL thiết kế lưu trữ tối đa 1.000 người/cây; giao diện chỉ nạp và hiển thị 2-3 thế hệ (50-80 nodes) quanh người trung tâm đang chọn.
- **Lý do:** Tối ưu hóa bộ nhớ trình duyệt và duy trì $\ge 45\text{ FPS}$ trên thiết bị di động.
