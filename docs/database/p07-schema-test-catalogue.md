# Danh mục Kịch bản Kiểm thử CSDL Lõi: Phase P07 (Schema Test Catalogue)

- **Mã tài liệu:** `DB-TEST-P07-01`
- **Phiên bản:** `v0.1-baseline`
- **Thư mục bài test:** `supabase/tests/`

---

## Danh mục Test Suites

| File Test | Số lượng Test Assertions | Mục đích Kiểm tra | Kết quả |
| :--- | :---: | :--- | :---: |
| **`00000_test_helpers.sql`** | - | Khởi tạo extension `pgtap` và helper tạo user giả định | `PASS` |
| **`00100_core_schema.test.sql`** | 22 | Kiểm tra sự tồn tại của 7 bảng, 12 Enums, helper functions và normalization | `PASS` |
| **`00200_core_constraints.test.sql`** | 10 | Kiểm tra các Check Constraints (tên không rỗng, version > 0, self-parent, date consistency) | `PASS` |
| **`00300_referential_actions.test.sql`** | 6 | Kiểm tra Same-tree isolation, chặn cross-tree relations, RESTRICT on delete person | `PASS` |
| **`00400_indexes.test.sql`** | 11 | Kiểm tra sự tồn tại của 11 chỉ mục B-Tree và Unique Partial Indexes | `PASS` |
| **`tests/unit/supabase-clients.test.ts`**| 2 | TypeScript compile check với generated `Database` types cho P07 | `PASS` |
