# 07 - Ngữ Cảnh Cha Mẹ Phân Biệt Người Trùng Tên (Parent Context)

## 1. Bài Toán Nghiệp Vụ
Trong văn hóa gia phả Việt Nam, việc nhiều người trong cùng một họ có tên giống hệt nhau (ví dụ nhiều cụ "Nguyễn Văn An" ở các chi, nhánh khác nhau) là rất phổ biến. Người dùng cần thông tin Cha/Mẹ để phân biệt chính xác người mình muốn tìm kiếm.

---

## 2. Giải Pháp Kỹ Thuật Không Gây N+1 Queries
Thông tin cha mẹ được tổng hợp trực tiếp trong câu lệnh SQL RPC `search_persons_in_tree` thông qua Subquery JSON Aggregation:

```sql
(
    SELECT coalesce(
        jsonb_agg(
            jsonb_build_object(
                'id', parent.id,
                'fullName', parent.full_name,
                'parentRole', rel.parent_role,
                'relationshipKind', rel.relationship_kind,
                'verificationStatus', rel.verification_status
            ) ORDER BY
                CASE rel.parent_role WHEN 'father' THEN 1 WHEN 'mother' THEN 2 ELSE 3 END,
                parent.full_name ASC
        ),
        '[]'::jsonb
    )
    FROM public.parent_child_relationships rel
    JOIN public.persons parent ON parent.id = rel.parent_id
    WHERE rel.child_id = cp.p_id
      AND rel.tree_id = cp.p_tree_id
      AND rel.deleted_at IS NULL
      AND parent.deleted_at IS NULL
) AS parents_json
```

---

## 3. Hiển Thị Trên Giao Diện Người Dùng
Component `ParentContext` hiển thị:
- **Cha:** Họ tên của cha ruột / cha nuôi.
- **Mẹ:** Họ tên của mẹ ruột / mẹ nuôi.
- **Fallback:** *"Chưa có thông tin cha mẹ"* khi chưa có dữ liệu quan hệ cha-con.
