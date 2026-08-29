# Cơ chế Cách ly Dữ liệu Giữa các Cây Gia phả (Cross-Tree Isolation)

- **Mã tài liệu:** `SEC-ISOLATION-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Ba Lớp Bảo vệ Cách ly Dữ liệu (Three Layers of Isolation)

1. **Lớp 1: RLS Filtering:**
   - Mọi câu truy vấn SELECT đều đi kèm điều kiện `_system.is_active_tree_member(tree_id)`. Kể cả khi kẻ tấn công đoán được chính xác `UUID` của một nhân vật hay một cây khác, câu lệnh `SELECT ... WHERE id = 'target-uuid'` trả về đúng `0 rows` mà không làm rò rỉ bất kỳ thông tin nào.
2. **Lớp 2: Composite Foreign Keys (P07):**
   - Khóa ngoại giữa các nhân vật và quan hệ đều là `(tree_id, parent_id) REFERENCES persons(tree_id, id)`. Ngăn chặn hoàn toàn việc một Person từ Cây A liên kết làm cha/mẹ của Person Cây B ở tầng lưu trữ CSDL.
3. **Lớp 3: Immutable Columns Trigger (P08):**
   - Trigger `_system.prevent_immutable_columns_mutation()` chặn triệt để mọi hành vi UPDATE cột `tree_id` (SQLSTATE `42501`). Kể cả khi một người dùng là Owner của cả Cây A và Cây B, họ cũng không thể "chuyển" nhân vật từ Cây A sang Cây B bằng lệnh UPDATE thông thường.
