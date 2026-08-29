# Danh mục Kịch bản Kiểm thử Phân quyền RLS: Phase P08 (RLS Test Catalogue)

- **Mã tài liệu:** `DB-TEST-P08-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Danh mục Test Suites Phân quyền

| File Test | Số lượng Test Assertions | Mục đích Kiểm tra | Kết quả |
| :--- | :---: | :--- | :---: |
| **`01000_rls_helpers.test.sql`** | 6 | Kiểm tra 3 hàm helper phân quyền trong schema `_system` | `PASS` |
| **`01100_profiles_rls.test.sql`** | 6 | Kiểm tra quyền đọc/sửa profile của chính mình và chặn anon | `PASS` |
| **`01200_family_trees_rls.test.sql`** | 8 | Kiểm tra quyền tạo/đọc/sửa/xóa mềm cây gia phả theo vai trò | `PASS` |
| **`01300_memberships_rls.test.sql`** | 6 | Kiểm tra quyền quản lý membership và chặn tự nâng quyền | `PASS` |
| **`01400_persons_rls.test.sql`** | 8 | Kiểm tra quyền đọc/tạo/sửa/xóa mềm nhân vật và chặn đổi tree_id | `PASS` |
| **`01500_relationships_rls.test.sql`**| 6 | Kiểm tra quan hệ cha mẹ - con và chặn cross-tree relations | `PASS` |
| **`01600_unions_rls.test.sql`** | 6 | Kiểm tra quan hệ hôn nhân và bạn đời | `PASS` |
| **`01700_cross_tree_rls.test.sql`** | 8 | Kiểm tra cách ly dữ liệu tuyệt đối giữa Cây Alpha và Cây Beta | `PASS` |
| **`01800_owner_only_rls.test.sql`** | 6 | Kiểm tra các thao tác độc quyền của Owner | `PASS` |
| **`01900_rls_performance.test.sql`**| 4 | Kiểm tra sự tồn tại của supporting indexes và thuộc tính STABLE | `PASS` |
| **`tests/security/service-role-exposure.test.ts`** | 4 | Kiểm tra cách ly service-role không bị đưa vào client | `PASS` |
