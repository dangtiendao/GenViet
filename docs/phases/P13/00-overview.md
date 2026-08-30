# Hồ Sơ Phase P13: Quản Lý Quan Hệ Phả Hệ (Relationship Management)

## 1. Thông Tin Chung
- **Mã Phase:** P13
- **Tên Phase:** Quản lý quan hệ (Relationship Management)
- **Dự Án:** GenViet (Responsive Web App Quản lý Cây Gia Phả, v0.1)
- **Nhánh Thi Công:** `phase/p13-relationship-management`
- **Trạng Thái Nghiệm Thu:** COMPLETED & ACCEPTED

## 2. Mục Tiêu Đã Hoàn Thành
1. Xây dựng **Relationship Service** và **Transactional RPCs** nguyên tử.
2. Thuật toán **Recursive CTE phát hiện chu trình (Cycle Detection)** bằng hàm đệ quy PostgreSQL `_system.check_parent_child_cycle`.
3. Kiểm tra tính cô lập cùng Tree ID (**Same-Tree**), chặn tự liên kết (**Self-link**), và chặn quan hệ trùng lặp (**Duplicate**).
4. Phân biệt rõ ràng lỗi chặn (`blocking`), cảnh báo (`warning`), và thông tin (`info`).
5. Luồng Thêm cha mới / mẹ mới (Tạo Person + Relation trong 1 transaction).
6. Luồng Liên kết cha/mẹ có sẵn với tìm kiếm cùng Tree và cảnh báo cha/mẹ ruột.
7. Hỗ trợ cha mẹ nuôi (`adoptive`) song song với cha mẹ ruột (`biological`).
8. Luồng Thêm con mới / Liên kết con có sẵn (hỗ trợ tùy chọn cha/mẹ thứ hai).
9. Tạo và quản lý Union (Hôn nhân & Kết đôi), hỗ trợ nhiều lần kết hôn và kết thúc hôn nhân an toàn.
10. Xóa mềm quan hệ và Thay thế nguyên tử quan hệ mà không làm mất Person.
11. Giao diện Node Action Menu và Relationship Preview thân thiện, responsive, accessible.
12. 100% không vi phạm ranh giới P14 (Graph-slice API) hay P15 (React Flow layout).
