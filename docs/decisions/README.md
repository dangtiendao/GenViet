# Quản lý Quyết định Kiến trúc & Thiết kế (Architecture Decisions)

Thư mục này là nơi lưu trữ toàn bộ nhật ký quyết định kỹ thuật và các bản ghi quyết định kiến trúc (Architecture Decision Records - ADR) của dự án **GenViet**.

---

## 1. Cấu trúc thư mục

- `README.md`: Hướng dẫn quản lý quyết định (file này).
- `decision-log.md`: **Nhật ký quyết định tổng hợp** ghi lại toàn bộ các quyết định đã khóa và quyết định theo từng phase.
- `ADR-template.md`: Bản mẫu chuẩn để soạn thảo một Architecture Decision Record (ADR) chi tiết.
- `ADR-NNNN-ten-quyet-dinh.md`: Các bản ghi ADR cụ thể khi có sự thay đổi kiến trúc trọng yếu (được đánh số từ `ADR-0001`).

---

## 2. Khi nào cần tạo ADR?

Cần tạo một file ADR riêng biệt khi quyết định đáp ứng ít nhất một trong các tiêu chí sau:
1. **Ảnh hưởng sâu rộng:** Quyết định tác động đến nhiều hơn 2 module hoặc thay đổi toàn bộ luồng dữ liệu.
2. **Chi phí thay đổi cao:** Quyết định chọn một công nghệ hoặc cấu trúc dữ liệu mà nếu đổi lại sẽ tốn nhiều tuần công sức (ví dụ: Thay đổi Engine dựng đồ thị gia phả, đổi hệ quản trị CSDL).
3. **Thay đổi chính sách bảo mật/phân quyền:** Thay đổi cơ chế xác thực hoặc kiến trúc RLS.

Đối với các quyết định kỹ thuật nhỏ trong phạm vi 1 phase, chỉ cần ghi nhận trực tiếp vào `decision-log.md` và file `04-decisions.md` của phase đó.

---

## 3. Vòng đời của một ADR (ADR Statuses)

- `PROPOSED`: Quyết định đang được đề xuất thảo luận, chưa được phê duyệt.
- `ACCEPTED`: Quyết định đã được Project Owner / Tech Lead phê duyệt áp dụng.
- `SUPERSEDED`: Quyết định cũ đã bị thay thế bởi một ADR mới hơn (kèm liên kết đến ADR mới).
- `DEPRECATED`: Quyết định không còn hiệu lực do hệ thống đã loại bỏ tính năng liên quan.
- `REJECTED`: Đề xuất đã bị từ chối sau khi xem xét.
