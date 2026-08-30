# Đánh Giá Truy Vấn Đồ Thị (Graph Query Review)

## 1. Phân Tích Kế Hoạch Thực Thi (Query Plan Analysis)
- Hàm RPC `get_tree_graph_slice` sử dụng 2 Recursive CTEs có giới hạn độ sâu (`v_applied_ancestor_depth`, `v_applied_descendant_depth`).
- Áp dụng các điều kiện lọc `tree_id` và `deleted_at IS NULL` ngay tại anchor query và recursive step.
- Sử dụng các covering indexes `idx_parent_child_parent_child_covering` và `idx_parent_child_child_parent_covering` chuyển đổi các phép quét đệ quy thành **Index Only Scan**.
