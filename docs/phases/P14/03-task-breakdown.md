# Bảng Phân Rã Công Việc (Task Breakdown) - Phase P14

| Mã Task | Tên Task | Trạng Thái | File / Artifact Liên Quan |
| :--- | :--- | :---: | :--- |
| `P14-T01` | Định nghĩa graph DTO | **DONE** | `src/features/tree-graph/types/tree-graph.types.ts` |
| `P14-T02` | Định nghĩa query input Zod schema | **DONE** | `src/features/tree-graph/schemas/tree-graph-query.schema.ts` |
| `P14-T03` | Truy vấn tổ tiên theo độ sâu (Ancestors) | **DONE** | `supabase/migrations/20260830120000_p14_add_tree_graph_query.sql` |
| `P14-T04` | Truy vấn hậu duệ theo độ sâu (Descendants) | **DONE** | `supabase/migrations/20260830120000_p14_add_tree_graph_query.sql` |
| `P14-T05` | Truy vấn vợ/chồng (Spouses) | **DONE** | `supabase/migrations/20260830120000_p14_add_tree_graph_query.sql` |
| `P14-T06` | Truy vấn Unions đa hôn nhân | **DONE** | `supabase/migrations/20260830120000_p14_add_tree_graph_query.sql` |
| `P14-T07` | Loại bỏ bản ghi xóa mềm (Soft-deleted) | **DONE** | `src/features/tree-graph/mappers/tree-graph.mapper.ts` |
| `P14-T08` | Bảo đảm dữ liệu cùng cây (Same-tree) | **DONE** | `src/features/tree-graph/mappers/tree-graph.mapper.ts` |
| `P14-T09` | Tính toán `hasMoreAncestors` | **DONE** | `supabase/migrations/20260830120000_p14_add_tree_graph_query.sql` |
| `P14-T10` | Tính toán `hasMoreDescendants` | **DONE** | `supabase/migrations/20260830120000_p14_add_tree_graph_query.sql` |
| `P14-T11` | Tính khả năng thêm cha/mẹ (`canAddFather`, `canAddMother`)| **DONE** | `supabase/migrations/20260830120000_p14_add_tree_graph_query.sql` |
| `P14-T12` | Trả trạng thái xác minh (`verificationStatus`) | **DONE** | `src/features/tree-graph/types/tree-graph.types.ts` |
| `P14-T13` | Giới hạn độ sâu tối đa (Depth clamp 5) | **DONE** | `src/features/tree-graph/schemas/tree-graph-query.schema.ts` |
| `P14-T14` | Chống truy vấn quá lớn (Size budgets) | **DONE** | `supabase/migrations/20260830120000_p14_add_tree_graph_query.sql` |
| `P14-T15` | Định nghĩa Cache key & Invalidation matrix | **DONE** | `src/features/tree-graph/cache/tree-graph-cache-key.ts` |
| `P14-T16` | Test Suite: Đồ thị đơn nhân vật | **DONE** | `supabase/tests/05000_tree_graph_single_person.test.sql` |
| `P14-T17` | Test Suite: Đồ thị đa thế hệ | **DONE** | `supabase/tests/05100_tree_graph_ancestors.test.sql` |
| `P14-T18` | Test Suite: Hôn nhân phức tạp | **DONE** | `supabase/tests/05300_tree_graph_unions.test.sql` |
| `P14-T19` | Test Suite: Giới hạn an toàn | **DONE** | `supabase/tests/05400_tree_graph_limits.test.sql` |
| `P14-T20` | Test Suite: Phân quyền RLS & cách ly cây | **DONE** | `supabase/tests/05500_tree_graph_rls.test.sql` |
