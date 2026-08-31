# Sổ Theo Dõi Nợ Kỹ Thuật (Technical Debt Log) - Phase P28

| Mã | Hạng mục | Đánh giá tác động | Kế hoạch giải quyết |
|---|---|---|---|
| TD-01 | Tối ưu hóa truy vấn EXISTS trong Expansion Metadata trên cây cực lớn (>10.000 persons) | Hiện tại đã có partial index trên `parent_child_relationships (tree_id, parent_id) WHERE deleted_at IS NULL`, thời gian thực thi < 2ms trên cây 1.000 người. | Theo dõi thêm với volume dữ liệu lớn hơn ở các phase mở rộng. |
