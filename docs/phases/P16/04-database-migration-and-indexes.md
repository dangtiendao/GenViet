# Phase P16: Migration CSDL & Chỉ Mục Tìm Kiếm (Database Migration & Indexes)

## 1. Migration File
- Đường dẫn: `supabase/migrations/20260830130000_p16_add_person_search.sql`

## 2. Các Thành Phần Chính Trong Migration
1. Kích hoạt `unaccent` và `pg_trgm` trong schema `extensions`.
2. Tạo hàm `_system.normalize_person_name(input_text text)` với cơ chế xử lý lỗi an toàn.
3. Cập nhật dữ liệu cũ (Backfill) cho cột `normalized_name` trên toàn bộ bảng `public.persons`.
4. Tạo các chỉ mục tối ưu:
   - `idx_persons_normalized_name_trgm`: GIN Trigram index trên `normalized_name`.
   - `idx_persons_tree_search_name_id`: Composite B-tree index `(tree_id, normalized_name, id)`.
   - `idx_persons_tree_birth_year_id`: Composite B-tree index `(tree_id, birth_year, id)`.
   - `idx_persons_tree_living_status_id`: Composite B-tree index `(tree_id, living_status, id)`.
5. Tạo hàm RPC `public.search_persons_in_tree(...)` với quyền `SECURITY DEFINER` và gán quyền thực thi cho role `authenticated`.
