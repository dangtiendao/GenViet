# Metadata Nhánh Ẩn (Hidden Descendant Metadata & Accessibility)

## 1. Mục Đích
Cung cấp thông tin chính xác về lý do một nhánh gia phả không tiếp tục mở rộng trên Tree View để giao diện có thể:
1. Hiển thị huy hiệu/chỉ báo ("Có hậu duệ đang ẩn") cho các node con gái có con.
2. Cung cấp tooltip/hộp thoại giải thích rõ ràng và có tính tiếp cận cao (Accessibility).
3. Phân biệt rõ ràng giữa:
   - Node không có con trong cơ sở dữ liệu.
   - Node có con nhưng bị ẩn do chế độ `PATERNAL_LINE`.
   - Node có con nhưng chạm giới hạn độ sâu (`DEPTH_LIMIT`).
   - Node bị thu gọn bởi người dùng (`COLLAPSED`).

## 2. Cấu Trúc Metadata
```typescript
export interface ExpansionDto {
  hasMoreAncestors: boolean;
  hasMoreDescendants: boolean;
  canAddFather: boolean;
  canAddMother: boolean;
  canExpandAncestors: boolean;
  canExpandDescendants: boolean;
  hasVerifiedBiologicalFather: boolean;
  hasVerifiedBiologicalMother: boolean;
  
  // Phase P28
  hasHiddenDescendants?: boolean;
  descendantsTruncated?: boolean;
  truncationReason?: "PATERNAL_LINE" | "DEPTH_LIMIT" | "COLLAPSED" | "NOT_LOADED" | null;
}
```

## 3. Cách Tính Toán Tại Cơ Sở Dữ Liệu
Trong RPC `get_tree_graph_slice`, trường `hasHiddenDescendants` được tính toán bằng mệnh đề `EXISTS` scoped theo `tree_id` và active rows:
```sql
(
    p_descendant_traversal_mode = 'PATERNAL_LINE'
    AND p.gender = 'female'
    AND p.id <> p_center_person_id
    AND EXISTS (
        SELECT 1 
        FROM public.parent_child_relationships r
        JOIN public.persons cr 
            ON cr.id = r.child_id 
            AND cr.tree_id = p_tree_id 
            AND cr.deleted_at IS NULL
        WHERE r.tree_id = p_tree_id
          AND r.parent_id = p.id
          AND r.deleted_at IS NULL
          AND (p_include_unverified OR r.verification_status = 'verified')
    )
) AS has_hidden_descendants
```

## 4. Hỗ Trợ Tiếp Cận (Accessibility Standards)
- **Tên tiếp cận (Accessible Name):** Badge và nút có `aria-label="Thành viên [Tên]: Hậu duệ qua nhánh nữ đang được ẩn theo chế độ xem mặc định"`.
- **Keyboard Navigation:** Sử dụng phím `Tab`, `Enter`, `Space` để tập trung và mở tooltip giải thích.
- **Hỗ trợ thiết bị cảm ứng (Mobile Touch):** Bấm chạm vào huy hiệu để mở Popover thông tin thay vì chỉ phụ thuộc vào hiệu ứng rê chuột (`hover`).
- **Màu sắc & Độ tương phản:** Kết hợp biểu tượng và văn bản, không truyền tải thông điệp duy nhất qua màu sắc (đạt chuẩn WCAG 2.1 AA).
