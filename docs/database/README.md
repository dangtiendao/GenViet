# Quản trị Cơ sở Dữ liệu & Môi trường Supabase (Database Management)

Thư mục này chứa toàn bộ các quy chuẩn kiến trúc, chính sách di chuyển schema (migration), chiến lược phân tách môi trường, sơ đồ thực thể và cẩm nang vận hành an toàn CSDL PostgreSQL của dự án **GenViet**.

---

## 1. Danh mục Tài liệu Quản trị Hạ tầng & Môi trường (P06 Baseline)

1. 💻 **[`local-development.md`](./local-development.md):** Hướng dẫn khởi chạy, reset và kiểm thử Supabase stack trên môi trường local.
2. 🔄 **[`migration-policy.md`](./migration-policy.md):** Quy tắc đặt tên, quản lý và kiểm soát tính bất biến của migration.
3. 🌐 **[`environment-strategy.md`](./environment-strategy.md):** Chiến lược phân tách 4 môi trường (Local, Dev Cloud, Preview, Production).
4. 🏷️ **[`type-generation.md`](./type-generation.md):** Quy trình tự động sinh TypeScript Database Types từ PostgreSQL schema.
5. 🛡️ **[`backup-before-migration.md`](./backup-before-migration.md):** Chính sách và yêu cầu sao lưu bắt buộc trước khi chạy migration.
6. 🚀 **[`production-migration-runbook.md`](./production-migration-runbook.md):** Cẩm nang 19 bước triển khai migration an toàn lên môi trường Production.
7. 📜 **[`schema-change-policy.md`](./schema-change-policy.md):** Quy định cấm thay đổi schema thủ công ngoài Git migration.
8. 🔒 **[`credential-management.md`](./credential-management.md):** Quản lý, phân cấp và quy trình luân chuyển khóa bí mật (Secret Rotation).
9. ☁️ **[`supabase-cloud-setup.md`](./supabase-cloud-setup.md):** Hướng dẫn thiết lập và liên kết Supabase Cloud Development Project (`genviet-dev`).

---

## 2. Danh mục Tài liệu Thiết kế CSDL Lõi (P07 Core Schema)

10. 🏛️ **[`core-schema.md`](./core-schema.md):** Kiến trúc thiết kế schema PostgreSQL lõi cho phả hệ.
11. 📊 **[`erd.md`](./erd.md):** Sơ đồ thực thể quan hệ Entity Relationship Diagram (Mermaid).
12. 📖 **[`data-dictionary.md`](./data-dictionary.md):** Từ điển dữ liệu chi tiết cho 7 bảng cốt lõi.
13. 🔠 **[`enum-and-lookup-decisions.md`](./enum-and-lookup-decisions.md):** Đánh giá và căn cứ lựa chọn Enum vs Lookup table.
14. 🔗 **[`referential-actions.md`](./referential-actions.md):** Ma trận hành vi khóa ngoại và cơ chế cô lập cùng cây (Same-Tree Isolation).
15. ⚡ **[`indexing-strategy.md`](./indexing-strategy.md):** Chiến lược đánh chỉ mục B-Tree, Partial Unique và Graph Query Indexes.
16. ⏱️ **[`timestamp-and-actor-policy.md`](./timestamp-and-actor-policy.md):** Chính sách dấu thời gian UTC và kiểm toán người thực hiện.
17. 🧪 **[`p07-schema-test-catalogue.md`](./p07-schema-test-catalogue.md):** Danh mục 5 test suites kiểm thử tính toàn vẹn CSDL.
