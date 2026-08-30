# 05 - Đặc Tả Bộ Lọc Tìm Kiếm (Search Filters Specification)

## 1. Bộ Lọc Năm Sinh (`birth_year`)
- Cho phép người dùng nhập một năm sinh cụ thể từ `100` đến `2500`.
- Khớp chính xác với cột `birth_year` trong bảng `persons`.

---

## 2. Bộ Lọc Trạng Thái Sống (`living_status`)
- **Tất cả (`all`):** Không áp dụng điều kiện lọc theo trạng thái sống.
- **Còn sống (`living`):** Chỉ trả về các nhân vật có `living_status = 'living'`.
- **Đã mất (`deceased`):** Chỉ trả về các nhân vật có `living_status = 'deceased'`.
- **Chưa rõ (`unknown`):** Chỉ trả về các nhân vật có `living_status = 'unknown'`.

---

## 3. Bộ Lọc Hồ Sơ Thiếu Thông Tin (`missing_information`)
Hỗ trợ quản trị viên gia phả rà soát và bổ sung dữ liệu:
- **`missing_birth`:** Thiếu năm sinh (`birth_year IS NULL AND birth_date IS NULL`).
- **`missing_death_for_deceased`:** Đã mất nhưng chưa rõ năm mất (`living_status = 'deceased' AND death_year IS NULL AND death_date IS NULL`).
- **`missing_hometown`:** Chưa có thông tin quê quán (`hometown_text IS NULL OR trim(hometown_text) = ''`).
- **`missing_any_core`:** Thiếu ít nhất một trong các thông tin cốt lõi (năm sinh, trạng thái sống, quê quán hoặc chưa được xác minh).
