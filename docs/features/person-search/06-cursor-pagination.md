# 06 - Phân Trang Deterministic Bằng Cursor (Cursor Pagination)

## 1. Tại Sao Dùng Cursor Pagination Thay Vì Offset?
- **Tránh nhảy trang sai (Pagination drift):** Khi có thêm người mới hoặc sửa thông tin trong dòng họ, offset pagination sẽ làm trùng lặp hoặc nhảy cóc bản ghi.
- **Tối ưu hiệu năng cơ sở dữ liệu:** Tránh chi phí quét bỏ qua lớn (`OFFSET N`) trên các tập dữ liệu lớn.

---

## 2. Cấu Trúc Payload của Cursor
Cursor được mã hóa dưới dạng Base64 URL-safe từ mảng tuple 5 phần tử:
```typescript
[
  rankTier: number,       // 1..5
  similarity: number,     // 0.0000..1.0000 (làm tròn 4 chữ số thập phân)
  normalizedName: string, // chuỗi tên đã chuẩn hóa
  birthYear: number | null,
  id: string              // UUID duy nhất làm tie-breaker
]
```

---

## 3. Điều Kiện Cursor trong SQL
Do thứ tự sắp xếp kết hợp cả chiều tăng dần (`ASC`) và giảm dần (`DESC`), điều kiện so sánh tuple trong SQL đảo dấu `similarity_score` thành `-similarity_score` để tất cả các trường so sánh theo cùng một chiều đồng nhất:

```sql
WHERE (
    p_cursor_id IS NULL
    OR (
        cp.p_match_tier,
        -cp.p_similarity_score,
        cp.p_normalized_name,
        coalesce(cp.p_birth_year, 9999::smallint),
        cp.p_id
    ) > (
        p_cursor_rank_tier,
        -coalesce(p_cursor_similarity, 0.0::real),
        coalesce(p_cursor_normalized_name, ''),
        coalesce(p_cursor_birth_year, 9999::smallint),
        p_cursor_id
    )
)
```
