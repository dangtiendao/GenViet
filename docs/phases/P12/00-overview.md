# Hồ Sơ Phase P12: Quản Lý Nhân Vật (Person Management)

## 1. Thông Tin Chung
- **Mã Phase:** P12
- **Tên Phase:** Quản lý nhân vật (Person Management)
- **Dự Án:** GenViet (Responsive Web App Quản lý Cây Gia Phả, v0.1)
- **Nhánh Thi Công:** `phase/p12-person-management`
- **Trạng Thái Nghiệm Thu:** COMPLETED & ACCEPTED

## 2. Mục Tiêu Đã Hoàn Thành
1. Xây dựng phân hệ CRUD Person hoàn chỉnh theo phạm vi cây gia phả.
2. Zod form validation chung cho Minimal Create và Full Edit.
3. Tuân thủ Invariant INV-002: Hỗ trợ Partial Date (Exact, Year-only, Unknown, Estimated flags), cấm tạo ngày giả `01/01`.
4. Ràng buộc logic ngày tháng: Chặn trường hợp ngày mất trước ngày sinh.
5. Quê quán (`hometown_text`), Nghề nghiệp (`occupation_text`), Tiểu sử (`biography`), Trạng thái xác minh (`verification_status`).
6. Tự động chuẩn hóa `normalized_name` thông qua trigger database.
7. Trang chi tiết nhân vật (`/trees/[treeId]/people/[personId]`) kèm bảng tổng hợp quan hệ gia đình (Read-only Relationship Summary).
8. Kiểm soát ghi đè đồng thời (Optimistic Concurrency Control) bằng cột `version`.
9. Xóa mềm (Soft delete) và Khôi phục (Restore) an toàn với RPC `restore_person`.
10. Cảnh báo hồ sơ tương tự (Similar Profile Warning) khi tạo nhân vật.
11. 100% tuân thủ RLS P08, không vi phạm phạm vi P13 (Relationship Mutation) hay P15 (Tree Canvas).
