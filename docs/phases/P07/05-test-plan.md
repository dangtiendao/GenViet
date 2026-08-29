# Kế hoạch Kiểm thử & Xác minh Toàn vẹn Schema: Phase P07 (Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các hạng mục kiểm thử DDL Schema và kết quả thực thi cho Phase P07.

---

## 1. Ma trận Kịch bản Kiểm thử (Test Matrix)

### Nhóm 1: Kiểm thử Migration & Cú pháp SQL
- **MIG-01:** File migration `20260829154907_p07_create_core_genealogy_schema.sql` đúng format timestamp $\rightarrow$ `PASS`.
- **MIG-02:** Migration check (`node scripts/supabase/check-migrations.mjs`) $\rightarrow$ `PASS`.
- **MIG-03:** Khởi tạo từ database sạch (Idempotent execution) $\rightarrow$ `PASS`.

### Nhóm 2: Kiểm thử Cấu trúc Schema & Kiểu Dữ liệu
- **SCH-01:** 7 bảng cốt lõi tồn tại đầy đủ $\rightarrow$ `PASS` (`00100_core_schema.test.sql`).
- **SCH-02:** 12 Enums tồn tại với các nhãn hợp lệ $\rightarrow$ `PASS`.
- **SCH-03:** Hàm chuẩn hóa tên hoạt động deterministic $\rightarrow$ `PASS`.

### Nhóm 3: Kiểm thử Ràng buộc Toàn vẹn (Integrity & Check Constraints)
- **CHK-01:** Tên gia phả rỗng bị từ chối (`23514`) $\rightarrow$ `PASS` (`00200_core_constraints.test.sql`).
- **CHK-02:** Tên nhân vật rỗng bị từ chối (`23514`) $\rightarrow$ `PASS`.
- **CHK-03:** Version $\le 0$ bị từ chối $\rightarrow$ `PASS`.
- **CHK-04:** Ngày mất trước ngày sinh bị từ chối $\rightarrow$ `PASS`.
- **CHK-05:** Tự liên kết cha/mẹ chính mình (`parent_id = child_id`) bị từ chối $\rightarrow$ `PASS`.
- **CHK-06:** Dữ liệu năm sinh (year-only) và người đã mất không có ngày mất được chấp nhận $\rightarrow$ `PASS`.

### Nhóm 4: Kiểm thử Khóa ngoại & Cô lập Cùng Cây (Same-Tree Isolation)
- **REF-01:** Tạo quan hệ cha/mẹ - con cùng cây thành công $\rightarrow$ `PASS` (`00300_referential_actions.test.sql`).
- **REF-02:** Tạo quan hệ cha/mẹ - con chéo cây (Cross-tree) bị từ chối bởi khóa ngoại composite $\rightarrow$ `PASS`.
- **REF-03:** Xóa vật lý nhân vật khi đang có quan hệ huyết thống bị RESTRICT $\rightarrow$ `PASS`.
- **REF-04:** Xóa vật lý nhân vật làm mốc Generation Anchor kích hoạt `ON DELETE SET NULL` $\rightarrow$ `PASS`.

### Nhóm 5: Kiểm thử Chỉ mục & TypeScript Database Types
- **IDX-01:** 11 chỉ mục B-Tree và Unique Partial Indexes tồn tại đầy đủ $\rightarrow$ `PASS` (`00400_indexes.test.sql`).
- **TYP-01:** File `src/lib/supabase/database.types.ts` chứa đầy đủ 7 bảng và 12 Enums $\rightarrow$ `PASS`.
- **TYP-02:** `npm run supabase:types:check` và Vitest type tests PASS 100% $\rightarrow$ `PASS`.
