# Performance & Query Plan Review: Tree Graph API

## 1. Phân Tích Kế Hoạch Thực Thi (Execution Plan)
- **Tổ tiên (Ancestor CTE):** Sử dụng index `idx_parent_child_active_unique` và `idx_parent_child_child` trên `(tree_id, child_id)`. Quét index lookup thay vì full table scan.
- **Hậu duệ (Descendant CTE):** Sử dụng index trên `(tree_id, parent_id)`. Quét index lookup nhanh chóng.
- **Phát hiện chu trình:** Sử dụng mảng `visited_path` với chi phí `O(d)` (trong đó $d \le 5$) cực kỳ nhẹ, không gây tốn CPU.
- **Kiểm tra biên (EXISTS):** Dùng toán tử `EXISTS (SELECT 1 ... LIMIT 1)` trả về ngay khi tìm thấy 1 bản ghi thỏa mãn, không đếm toàn bộ cây.

## 2. Rủi Ro Còn Lại (Residual Risks)
- Với các dòng họ có hàng nghìn thành viên, việc gọi truy vấn đồ thị cần tiếp tục được benchmark chi tiết trong Phase P23 (Performance Optimization).
