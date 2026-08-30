-- Migration: 20260830190000_p23_optimize_graph_queries.sql
-- Description: Composite covering indexes for high-speed recursive CTE graph traversals (P23-T06, P23-T07)

-- 1. Index bao phủ cho việc quét quan hệ Cha/Mẹ -> Con (Descendant Traversal)
CREATE INDEX IF NOT EXISTS idx_parent_child_parent_child_covering
ON public.parent_child_relationships (tree_id, parent_id, child_id)
WHERE deleted_at IS NULL;

-- 2. Index bao phủ cho việc quét quan hệ Con -> Cha/Mẹ (Ancestor Traversal)
CREATE INDEX IF NOT EXISTS idx_parent_child_child_parent_covering
ON public.parent_child_relationships (tree_id, child_id, parent_id)
WHERE deleted_at IS NULL;

-- 3. Index bao phủ cho việc tra cứu thành viên hôn nhân (Union Members Lookup)
CREATE INDEX IF NOT EXISTS idx_union_members_person_union_covering
ON public.union_members (tree_id, person_id, union_id)
WHERE deleted_at IS NULL;

-- 4. Cập nhật phân tích thống kê bảng (ANALYZE)
ANALYZE public.family_trees;
ANALYZE public.persons;
ANALYZE public.parent_child_relationships;
ANALYZE public.unions;
ANALYZE public.union_members;
