# Recursive CTE Cycle Detection (Phát Hiện Chu Trình Phả Hệ)

## 1. Bản Chất Kỹ Thuật
Đồ thị phả hệ là một đồ thị có hướng không chu trình (**Directed Acyclic Graph - DAG**) trong đó mỗi cạnh có hướng `parent_id -> child_id`.

> [!CRITICAL]
> **Quy Tắc Chu Trình:** Khi thêm một cạnh `P -> C` (P là cha/mẹ của C):
> Thao tác bị coi là tạo chu trình nếu **P đã là hậu duệ (con, cháu, chắt...) của C** trong cây gia phả.

## 2. Giải Thuật PostgreSQL Recursive CTE
Hàm nội bộ `_system.check_parent_child_cycle(p_tree_id UUID, p_parent_id UUID, p_child_id UUID)` thực hiện:
```sql
CREATE OR REPLACE FUNCTION _system.check_parent_child_cycle(
    p_tree_id UUID,
    p_parent_id UUID,
    p_child_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_has_cycle boolean;
BEGIN
    -- 1. Self-link là chu trình hiển nhiên
    IF p_parent_id = p_child_id THEN
        RETURN true;
    END IF;

    -- 2. Recursive CTE tìm toàn bộ hậu duệ của p_child_id
    WITH RECURSIVE descendants AS (
        -- Anchor: Con trực tiếp của child
        SELECT child_id AS descendant_id, 1 AS depth
        FROM public.parent_child_relationships
        WHERE tree_id = p_tree_id
          AND parent_id = p_child_id
          AND deleted_at IS NULL

        UNION

        -- Recursive: Con của các hậu duệ
        SELECT r.child_id, d.depth + 1
        FROM public.parent_child_relationships r
        JOIN descendants d ON r.parent_id = d.descendant_id
        WHERE r.tree_id = p_tree_id
          AND r.deleted_at IS NULL
          AND d.depth < 100 -- Guard chống lặp vô hạn
    )
    SELECT EXISTS (
        SELECT 1 FROM descendants WHERE descendant_id = p_parent_id
    ) INTO v_has_cycle;

    RETURN COALESCE(v_has_cycle, false);
END;
$$;
```

## 3. Các Trường Hợp Kiểm Thử Đã Xác Minh
1. **Chu trình 2 node (`A -> B -> A`):** B là con của A, cố gắng gán B làm cha của A $\rightarrow$ Bị chặn ngay lập tức.
2. **Chu trình 3 thế hệ (`A -> B -> C -> A`):** C là cháu của A, cố gắng gán C làm cha của A $\rightarrow$ Bị chặn.
3. **Chu trình 4 thế hệ (`A -> B -> C -> D -> A`):** D là chắt của A, cố gắng gán D làm cha của A $\rightarrow$ Bị chặn.
4. **Nhánh cây phức tạp:** Đồ thị nhiều nhánh con và anh em họ $\rightarrow$ Phát hiện chính xác.
