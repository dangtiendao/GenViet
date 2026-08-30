# Đánh Giá Kỹ Thuật Truy Vấn Phase P23

Các chỉ mục bao phủ mới `idx_parent_child_parent_child_covering` và `idx_parent_child_child_parent_covering` cùng với giới hạn độ sâu chặt chẽ (`v_max_ancestor_depth = 5`, `v_max_descendant_depth = 5`) đảm bảo thời gian thực thi truy vấn luôn ổn định < 100ms ngay cả khi dữ liệu tổng số của cây đạt trên 1.000 nhân vật.
