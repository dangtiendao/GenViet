# Kế hoạch Kiểm thử Phân quyền RLS: Phase P08 (Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các kịch bản kiểm thử bảo mật và phân quyền RLS cho Phase P08.

---

## 1. Ma trận Kịch bản Kiểm thử Bảo mật

### Nhóm 1: Helper Functions & Profiles RLS
- **SEC-01:** Helper functions kiểm tra đúng active membership, owner, và write role $\rightarrow$ `PASS` (`01000_rls_helpers.test.sql`).
- **SEC-02:** User đọc/sửa profile của chính mình; bị từ chối khi truy cập profile người khác $\rightarrow$ `PASS` (`01100_profiles_rls.test.sql`).
- **SEC-03:** Anon bị từ chối 100% khi đọc profiles $\rightarrow$ `PASS`.

### Nhóm 2: Family Trees & Memberships RLS
- **SEC-04:** Owner đọc, sửa, và xóa mềm cây của mình $\rightarrow$ `PASS` (`01200_family_trees_rls.test.sql`).
- **SEC-05:** Viewer đọc cây được cấp quyền; bị từ chối khi sửa/xóa $\rightarrow$ `PASS`.
- **SEC-06:** Owner quản lý membership (thêm/sửa/thu hồi); Viewer bị từ chối $\rightarrow$ `PASS` (`01300_memberships_rls.test.sql`).
- **SEC-07:** Chặn Viewer tự nâng quyền lên Owner $\rightarrow$ `PASS`.

### Nhóm 3: Persons, Relationships & Unions RLS
- **SEC-08:** Writer tạo, sửa, xóa mềm Person/Relationship/Union; Viewer chỉ được đọc $\rightarrow$ `PASS` (`01400_*.sql` đến `01600_*.sql`).
- **SEC-09:** Hard delete trên các bảng nghiệp vụ bị từ chối $\rightarrow$ `PASS`.

### Nhóm 4: Cross-Tree Isolation & Immutability
- **SEC-10:** Owner Cây A không đọc/sửa được dữ liệu Cây B $\rightarrow$ `PASS` (`01700_cross_tree_rls.test.sql`).
- **SEC-11:** Chặn di chuyển dữ liệu qua thay đổi `tree_id` (kể cả khi là Owner của cả 2 cây) $\rightarrow$ `PASS`.
- **SEC-12:** Chặn liên kết chéo cây trong quan hệ trực hệ $\rightarrow$ `PASS`.

### Nhóm 5: Service-Role Isolation & Regression
- **SEC-13:** Service-role key không bị đưa vào client bundle hoặc mã nguồn browser $\rightarrow$ `PASS` (`tests/security/service-role-exposure.test.ts`).
- **SEC-14:** Toàn bộ P07 regression tests và Application Quality Gates PASS 100% $\rightarrow$ `PASS`.
