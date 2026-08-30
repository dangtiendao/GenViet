# 03 - Thiết Kế Chỉ Mục Tìm Kiếm (Search Indexes Design)

## 1. Mục Tiêu Thiết Kế
Tối ưu hóa hiệu năng truy vấn cho các tập dữ liệu từ hàng trăm đến hàng chục nghìn nhân vật trong mỗi cây gia phả. Đảm bảo thời gian phản hồi tìm kiếm dưới 100ms.

---

## 2. Danh Mục Các Chỉ Mục (Indexes)

### 2.1. GIN Trigram Index trên `normalized_name`
```sql
CREATE INDEX IF NOT EXISTS idx_persons_normalized_name_trgm
ON public.persons USING gin (normalized_name extensions.gin_trgm_ops)
WHERE deleted_at IS NULL;
```
- **Mục đích:** Tăng tốc tìm kiếm trùng khớp một phần (substring containment `LIKE '%query%'`) và tính toán độ tương đồng mờ (trigram similarity).
- **Điều kiện lọc:** Chỉ lập chỉ mục các bản ghi nhân vật còn hoạt động (`WHERE deleted_at IS NULL`).

### 2.2. Composite B-Tree Index trên `(tree_id, normalized_name, id)`
```sql
CREATE INDEX IF NOT EXISTS idx_persons_tree_search_name_id
ON public.persons (tree_id, normalized_name, id)
WHERE deleted_at IS NULL;
```
- **Mục đích:** Phục vụ tìm kiếm tiền tố (`LIKE 'query%'`), sắp xếp theo tên và phân trang cursor theo từng cây gia phả.

### 2.3. Composite B-Tree Index trên `(tree_id, birth_year, id)`
```sql
CREATE INDEX IF NOT EXISTS idx_persons_tree_birth_year_id
ON public.persons (tree_id, birth_year, id)
WHERE deleted_at IS NULL;
```
- **Mục đích:** Phục vụ lọc nhanh theo năm sinh và sắp xếp thứ cấp trong cùng cây gia phả.

### 2.4. Composite B-Tree Index trên `(tree_id, living_status, id)`
```sql
CREATE INDEX IF NOT EXISTS idx_persons_tree_living_status_id
ON public.persons (tree_id, living_status, id)
WHERE deleted_at IS NULL;
```
- **Mục đích:** Phục vụ lọc nhanh theo trạng thái sống (`living`, `deceased`, `unknown`).
