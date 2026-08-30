# Phase P18: Quyết Định Kiến Trúc Đã Chốt (Architectural Decisions)

## 1. Danh Sách Quyết Định Đã Khóa
1. **DEC-P18-01: Tính Bất Biến Tuyệt Đối Của Audit Log (Audit Immutability)**
   - Bảng `public.audit_logs` không có RLS policy UPDATE hoặc DELETE.
   - Client không được phép gọi lệnh INSERT trực tiếp mà phải thông qua function/RPC tin cậy.
2. **DEC-P18-02: Ghi Nhật Ký Cùng Giao Dịch (Same-Transaction Auditing)**
   - Mutation và Audit được ghi nguyên tử trong cùng Database Transaction. Thao tác rollback đồng nghĩa với việc không để lại log rác.
3. **DEC-P18-03: Quyền Truy Cập Lịch Sử Cho Thành Viên Cây**
   - Mọi thành viên chính thức của cây (Owner, Admin, Editor, Viewer) đều có quyền xem lịch sử biến động của cây mình tham gia.
4. **DEC-P18-04: Khôi Phục Có Kiểm Soát & Không Tự Động Khôi Phục Phụ Thuộc**
   - Khôi phục Person không tự động khôi phục quan hệ cũ (để tránh tạo chu trình ngoài ý muốn).
   - Khôi phục quan hệ bắt buộc cả 2 đối tượng cha/mẹ và con phải đang hoạt động.
