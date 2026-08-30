# Name Normalization Strategy (Chuẩn Hóa Tên Nhân Vật)

## 1. Mục Tiêu
Cho phép tìm kiếm, gợi ý hồ sơ tương tự và chống trùng lặp không phân biệt chữ hoa, chữ thường hoặc khoảng trắng thừa, trong khi vẫn bảo tồn nguyên vẹn dấu tiếng Việt có dấu trong `full_name`.

## 2. Chiến Lược Triển Khai (Database Trigger Quản Lý)
- Database Function: `_system.normalize_person_name(input_text)`
  ```sql
  CREATE OR REPLACE FUNCTION _system.normalize_person_name(input_text text)
  RETURNS text AS $$
  BEGIN
      IF input_text IS NULL THEN
          RETURN '';
      END IF;
      RETURN lower(regexp_replace(trim(input_text), '\s+', ' ', 'g'));
  END;
  $$ LANGUAGE plpgsql IMMUTABLE;
  ```
- Trigger tự động trên bảng `public.persons`:
  ```sql
  CREATE TRIGGER trg_persons_maintain_normalized_name
  BEFORE INSERT OR UPDATE OF full_name ON public.persons
  FOR EACH ROW EXECUTE FUNCTION _system.maintain_person_normalized_name();
  ```
- Ứng dụng client / server có hàm TypeScript tương đương `normalizePersonName(name)` trong `src/features/persons/utils/normalize-person-name.ts` phục vụ tìm kiếm tương tự client-side debounce.
