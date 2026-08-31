# Chế Độ Dòng Họ Mặc Định (Paternal-Line View Implementation)

## 1. Cơ Chế Triển Khai Server-Side
Quy tắc dừng nhánh nữ được áp dụng trực tiếp tại tầng cơ sở dữ liệu PostgreSQL thông qua mệnh đề đệ quy `WITH RECURSIVE descendant_cte`:

```sql
WITH RECURSIVE descendant_cte AS (
    -- Anchor member: Center Person (depth = 0)
    SELECT 
        p_center_person_id AS person_id,
        0 AS depth,
        ARRAY[p_center_person_id] AS visited_path,
        p.gender AS current_gender
    FROM public.persons p
    WHERE p.id = p_center_person_id
    
    UNION ALL
    
    -- Recursive member: Duyệt con cái
    SELECT 
        r.child_id AS person_id,
        d.depth + 1 AS depth,
        d.visited_path || r.child_id,
        p.gender AS current_gender
    FROM descendant_cte d
    JOIN public.parent_child_relationships r 
        ON r.parent_id = d.person_id 
        AND r.tree_id = p_tree_id 
        AND r.deleted_at IS NULL
        AND (p_include_unverified OR r.verification_status = 'verified')
    JOIN public.persons p 
        ON p.id = r.child_id 
        AND p.tree_id = p_tree_id 
        AND p.deleted_at IS NULL
    WHERE d.depth < v_applied_descendant_depth
      AND NOT (r.child_id = ANY(d.visited_path))
      -- Điều kiện PATERNAL_LINE: Dừng từ cha/mẹ 'd' nếu 'd' là nữ ở depth > 0 (không phải traversal root)
      AND (
          p_descendant_traversal_mode <> 'PATERNAL_LINE'
          OR d.depth = 0
          OR d.current_gender <> 'female'
          OR (p_branch_boundary_person_id IS NOT NULL AND d.person_id = p_branch_boundary_person_id)
      )
)
```

## 2. Các Đặc Điểm Kỹ Thuật Quan Trọng
1. **Node con gái được lấy vào ở vòng đệ quy `depth = 1`:** Node con gái là `r.child_id`. Khi `d` (người cha) duyệt con, con gái được thêm vào kết quả.
2. **Ở vòng đệ quy kế tiếp `depth = 2`:** Khi `d` là người con gái đó (`d.current_gender = 'female'` và `d.depth = 1 > 0`), điều kiện `WHERE` không thỏa mãn, ngăn không cho con cháu của người con gái đó được sinh ra trong CTE.
3. **Center Person nữ (`depth = 0`):** Điều kiện `d.depth = 0` là `TRUE`, do đó con cái của Center Person nữ vẫn được duyệt bình thường.
4. **Giới tính không phải nữ:** Nếu `d.current_gender` là `'male'`, `'unknown'`, `'other'`, điều kiện `d.current_gender <> 'female'` là `TRUE`, con cháu tiếp tục được duyệt đến hết `descendantDepth`.
