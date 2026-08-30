# 01 - Tổng Quan Tính Năng Tìm Kiếm Nhân Vật (Person Search Overview)

## 1. Giới Thiệu
Tính năng **Tìm kiếm nhân vật** trong hệ thống GenViet cho phép người dùng tra cứu nhanh chóng và chính xác các hồ sơ thành viên trong cây gia phả (`tree_id`), bất kể người dùng nhập từ khóa có dấu, không dấu, chữ hoa, chữ thường hay sử dụng các ký tự đặc thù tiếng Việt như `đ/Đ`.

---

## 2. Các Trụ Cột Kỹ Thuật
1. **Chuẩn Hóa Tiếng Việt Nhất Quán (Deterministic Vietnamese Normalization):**
   - Chuyển chữ thường.
   - Quy đổi `đ/Đ` $\rightarrow$ `d`.
   - Bỏ dấu thanh qua `unaccent`.
   - Thu gọn khoảng trắng thừa (spaces, tabs, newlines, NBSP).
   - Đồng bộ 100% giữa hàm SQL `_system.normalize_person_name` và hàm TypeScript `normalizeVietnamese`.

2. **Chỉ Mục PostgreSQL Nâng Cao:**
   - **GIN Trigram Index** trên cột `normalized_name` với `extensions.gin_trgm_ops` cho phép tìm kiếm substring và độ tương đồng nhanh chóng.
   - **Composite B-Tree Indexes** `(tree_id, normalized_name, id)`, `(tree_id, birth_year, id)` và `(tree_id, living_status, id)`.

3. **Thuật Toán Xếp Hạng & Độ Phù Hợp (Match Tier Ranking):**
   - **Tier 1:** Trùng khớp tuyệt đối (`normalized_name = query`).
   - **Tier 2:** Trùng khớp tiền tố (`normalized_name LIKE query%`).
   - **Tier 3:** Trùng khớp một phần (`normalized_name LIKE %query%`).
   - **Tier 4:** Tương đồng mờ / Trigram similarity ($\ge 0.25$).
   - **Tier 5:** Không có từ khóa (duyệt danh sách theo bộ lọc).

4. **Bộ Lọc Nâng Cao:**
   - Lọc theo năm sinh (`birth_year`).
   - Lọc theo trạng thái sống (`living_status`: Tất cả / Còn sống / Đã mất / Chưa rõ).
   - Lọc hồ sơ thiếu thông tin (`missing_birth`, `missing_death_for_deceased`, `missing_hometown`, `missing_any_core`).

5. **Phân Trang Deterministic bằng Cursor:**
   - Mã hóa cursor Base64 URL-safe chứa tuple `(matchTier, similarityScore, normalizedName, birthYear, id)`.
   - Đảm bảo không trùng lặp và không bỏ sót bản ghi khi dữ liệu thay đổi.

6. **Ngữ Cảnh Cha Mẹ (Parent Context):**
   - Tích hợp thông tin Cha & Mẹ trực tiếp trong kết quả tìm kiếm giúp người dùng phân biệt ngay những người trùng họ tên trong dòng họ.
