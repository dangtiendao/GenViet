# Kế Hoạch Kiểm Thử Phase P23 (Test Plan)

1. **Unit Tests:** `tests/unit/performance/` bao phủ Performance Budget, Tree Region Cache, Selective Invalidation, ELK Web Worker Client, Search Virtualization.
2. **Database Tests:** `supabase/tests/11000_graph_indexes.test.sql` kiểm tra các covering indexes phục vụ recursive traversal.
3. **Scale Tests:** `tests/performance/scale-benchmarks.test.ts` kiểm thử tập dữ liệu 100, 500, 1.000 nodes.
4. **Regression Tests:** Toàn bộ regression suites từ P08 đến P22.
