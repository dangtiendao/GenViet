# Bảng Ghi Nhận Quyết Định Kỹ Thuật (Decisions) - Phase P14

## 1. Quyết Định Kiến Trúc Đã Khóa
- **DEC-P14-01:** Phân tách hoàn toàn dữ liệu Lớp 2 (Query Graph Slice DTO) khỏi Lớp 3 & 4 (ELK layout coordinates & React Flow types).
- **DEC-P14-02:** Chiều quan hệ đồ thị hướng `Parent -> Child`.
- **DEC-P14-03:** Giới hạn độ sâu mặc định: `ancestorDepth = 2`, `descendantDepth = 2`, `max = 5`.
- **DEC-P14-04:** Giới hạn ngân sách an toàn: 250 Persons, 500 Relationships, 150 Unions.
- **DEC-P14-05:** Triển khai truy vấn đồ thị thông qua PostgreSQL RPC `public.get_tree_graph_slice` để đảm bảo tính nhất quán giao dịch và tốc độ.
