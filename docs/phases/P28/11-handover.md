# Biên Bản Bàn Giao (Handover Document) - Phase P28

## 1. Thông Tin Bàn Giao
- **Mã phase:** P28
- **Tên phase:** Chế độ hiển thị dòng họ mặc định (Default Paternal-Line Tree View)
- **Nhánh Git:** `phase/p28-paternal-line-view`
- **Môi trường:** Local development & testing
- **Trạng thái an toàn Git:** Không có code, tag hay migration nào được push, merge hoặc deploy lên remote.

## 2. Danh Mục Tài Sản Bàn Giao
1. **Migrations & SQL Functions:**
   - `supabase/migrations/20260831120000_p28_paternal_line_graph.sql`: RPC `get_tree_graph_slice` với tham số `p_descendant_traversal_mode` và `p_branch_boundary_person_id`.
   - `supabase/tests/05600_tree_graph_paternal_line.test.sql`: Bộ kiểm thử pgTAP cho logic Recursive CTE.
2. **Contracts, Schemas & Services:**
   - `src/features/tree-graph/contracts/descendant-traversal-mode.ts`
   - `src/features/tree-graph/schemas/tree-graph-query.schema.ts`
   - `src/features/tree-graph/types/tree-graph.types.ts`
   - `src/features/tree-graph/errors/tree-graph.errors.ts`
   - `src/features/tree-graph/mappers/tree-graph.mapper.ts`
   - `src/features/tree-graph/repositories/tree-graph.repository.ts`
   - `src/features/tree-graph/cache/tree-graph-cache-key.ts`
   - `src/features/tree-graph/cache/tree-region-invalidation.ts`
3. **Components & Presentation:**
   - `src/features/tree-view/components/hidden-descendants-indicator.tsx`
   - `src/features/tree-view/components/person-node.tsx`
   - `src/features/tree-view/components/tree-toolbar.tsx`
   - `src/features/tree-view/hooks/use-tree-graph.ts`
   - `src/app/api/trees/[treeId]/graph/route.ts`
4. **Exports & Prints:**
   - `src/features/exports/pdf/pdf-options.ts`
   - `src/features/exports/pdf/pdf-generator.ts`
   - `src/features/exports/large-tree-print/large-tree-export.ts`
5. **Kiểm Thử (Tests):**
   - `tests/unit/tree-graph/traversal-mode.test.ts`
   - `tests/unit/tree-graph/hidden-metadata.test.ts`
   - `tests/unit/tree-graph/cache-key.test.ts`
   - `tests/unit/tree-view/person-node-paternal.test.tsx`
   - `tests/unit/exports/pdf-scope.test.ts`
   - `tests/integration/domain-graph-preservation.test.ts`
6. **Tài Liệu Kiến Trúc & Vận Hành:**
   - `docs/architecture/domain-graph-vs-view-graph.md`
   - `docs/features/tree-view/descendant-traversal-modes.md`
   - `docs/features/tree-view/paternal-line-view.md`
   - `docs/features/tree-view/hidden-descendant-metadata.md`
   - `docs/features/tree-view/cache-and-invalidation.md`
   - `docs/phases/P28/*` (00-overview -> 11-handover)

## 3. Khuyến Nghị Cho Phase Tiếp Theo
- Tiếp tục duy trì ranh giới tách biệt bất biến giữa Domain Graph và View Graph trong các phase tương lai.
- Khi người dùng yêu cầu bật tính năng chuyển đổi chế độ xem trực tiếp trên UI, có thể kích hoạt feature flag và mở rộng thêm giao diện nút chuyển đổi chế độ đã được chuẩn bị sẵn hợp đồng kỹ thuật.
