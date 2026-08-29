# Database Documentation

Thư mục này chứa tài liệu thiết kế cơ sở dữ liệu, sơ đồ thực thể quan hệ (ERD), định nghĩa bảng, chỉ mục (indexes), quy tắc phân quyền dữ liệu (RLS) và quy trình di chuyển dữ liệu (Migrations) cho dự án **GenViet**.

---

## 1. Mục đích & Phạm vi

- Quản lý mô hình dữ liệu quan hệ gia phả (Genealogy Data Model) trên PostgreSQL.
- Định nghĩa chi tiết các thực thể: `users`, `trees`, `persons`, `relationships`, `media_records`.
- Lưu trữ tài liệu chính sách Row Level Security (RLS) bảo vệ dữ liệu độc lập cho từng cây gia phả.
- Lưu trữ quy trình và nguyên tắc viết SQL Migrations an toàn, có phương án rollback.

---

## 2. Cấu trúc tài liệu dự kiến

- `README.md`: Chỉ mục và hướng dẫn tài liệu database (file này).
- `schema-overview.md`: Sơ đồ ERD và mô tả chi tiết các bảng trong cơ sở dữ liệu.
- `relationships-model.md`: Thiết kế mô hình quan hệ phức tạp (Cha-Con, Mẹ-Con, Đa thê, Nhận con nuôi...).
- `rls-policies.md`: Danh sách và logic kiểm tra của các chính sách Row Level Security.
- `migration-guidelines.md`: Quy chuẩn đặt tên migration, quy trình deploy và rollback migration.

---

## 3. Nguyên tắc quản lý Database

1. **Khóa quyết định tách biệt thực thể:** Tài khoản người dùng (`users`) và Thành viên gia phả (`persons`) phải là hai bảng riêng biệt.
2. **Bắt buộc RLS trên mọi bảng nghiệp vụ:** Không một bảng nào chứa dữ liệu người dùng/gia phả được phép vô hiệu hóa RLS.
3. **Mọi migration phải có Forward & Rollback script:** Không chạy migration trực tiếp trên production mà không qua kiểm thử local/staging.
4. **Không chứa dữ liệu cá nhân thật trong tài liệu hay test fixtures.**
