# Quản trị Cơ sở Dữ liệu & Môi trường Supabase (Database Management)

Thư mục này chứa toàn bộ các quy chuẩn kiến trúc, chính sách di chuyển schema (migration), chiến lược phân tách môi trường và cẩm nang vận hành an toàn CSDL PostgreSQL của dự án **GenViet**.

---

## Danh mục Tài liệu Quản trị CSDL

1. 💻 **[`local-development.md`](./local-development.md):** Hướng dẫn khởi chạy, reset và kiểm thử Supabase stack trên môi trường local.
2. 🔄 **[`migration-policy.md`](./migration-policy.md):** Quy tắc đặt tên, quản lý và kiểm soát tính bất biến của migration.
3. 🌐 **[`environment-strategy.md`](./environment-strategy.md):** Chiến lược phân tách 4 môi trường (Local, Dev Cloud, Preview, Production).
4. 🏷️ **[`type-generation.md`](./type-generation.md):** Quy trình tự động sinh TypeScript Database Types từ PostgreSQL schema.
5. 🛡️ **[`backup-before-migration.md`](./backup-before-migration.md):** Chính sách và yêu cầu sao lưu bắt buộc trước khi chạy migration.
6. 🚀 **[`production-migration-runbook.md`](./production-migration-runbook.md):** Cẩm nang 19 bước triển khai migration an toàn lên môi trường Production.
7. 📜 **[`schema-change-policy.md`](./schema-change-policy.md):** Quy định cấm thay đổi schema thủ công ngoài Git migration.
8. 🔒 **[`credential-management.md`](./credential-management.md):** Quản lý, phân cấp và quy trình luân chuyển khóa bí mật (Secret Rotation).
9. ☁️ **[`supabase-cloud-setup.md`](./supabase-cloud-setup.md):** Hướng dẫn thiết lập và liên kết Supabase Cloud Development Project (`genviet-dev`).
