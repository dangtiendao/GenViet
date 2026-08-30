# Test Catalogue: Tree Graph API (Phase P14)

## 1. Database pgTAP Test Suites
| Mã Test | Đường dẫn | Mục đích kiểm thử | Kết quả |
| :--- | :--- | :--- | :---: |
| `05000` | `supabase/tests/05000_tree_graph_single_person.test.sql` | Kiểm thử cây đơn nhân vật không có quan hệ | **PASS** |
| `05100` | `supabase/tests/05100_tree_graph_ancestors.test.sql` | Kiểm thử duyệt tổ tiên đa thế hệ & `hasMoreAncestors` | **PASS** |
| `05200` | `supabase/tests/05200_tree_graph_descendants.test.sql` | Kiểm thử duyệt hậu duệ đa thế hệ & `hasMoreDescendants` | **PASS** |
| `05300` | `supabase/tests/05300_tree_graph_unions.test.sql` | Kiểm thử hôn phối và nhiều cuộc hôn nhân | **PASS** |
| `05400` | `supabase/tests/05400_tree_graph_limits.test.sql` | Kiểm thử giới hạn độ sâu (clamp 5) và ngân sách | **PASS** |
| `05500` | `supabase/tests/05500_tree_graph_rls.test.sql` | Kiểm thử phân quyền RLS và cách ly dữ liệu giữa các cây | **PASS** |

## 2. Unit & Integration Vitest Suites
| Bộ Test | Mục đích | Số lượng test | Kết quả |
| :--- | :--- | :---: | :---: |
| `tests/unit/tree-graph/schemas.test.ts` | Validate Zod query params, depth range, strict mode | 8 | **PASS** |
| `tests/unit/tree-graph/cache-key.test.ts` | Validate cache key builder, userScope isolation, invalidation events | 4 | **PASS** |
| `tests/unit/tree-graph/mapper.test.ts` | Validate DTO mapping, duplicate cleanup, orphan edge elimination | 4 | **PASS** |
| `tests/unit/tree-graph/errors.test.ts` | Validate error taxonomy & HTTP status codes | 3 | **PASS** |

## 3. Playwright E2E & Route Handler Suites
| Bộ Test | Mục đích | Số lượng test | Kết quả |
| :--- | :--- | :---: | :---: |
| `tests/e2e/tree-graph-api.spec.ts` | Kiểm thử Route Handler `/api/trees/[treeId]/graph` (Auth 401, 400, no-cache headers) | 3 | **PASS** |
