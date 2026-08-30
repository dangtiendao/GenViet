# Performance Budget (Ngân Sách Hiệu Năng)

## 1. Mục Tiêu & Giới Hạn

| Phân Vùng | Chỉ Số | Mục Tiêu (Target) | Giới Hạn Tối Đa (Hard Limit) |
| :--- | :--- | :---: | :---: |
| **Dashboard** | Data Ready / TTFB | < 300 ms | 500 ms |
| **Graph Query** | 100 Nodes | < 50 ms | 100 ms |
| **Graph Query** | 250 Nodes (Slice Max) | < 80 ms | 150 ms |
| **ELK Layout** | 100 Nodes (Worker) | < 100 ms | 200 ms |
| **ELK Layout** | 250 Nodes (Worker) | < 180 ms | 350 ms |
| **Main Thread Blocking** | Frame Drop / Long Task | 0 ms | 16.6 ms |
| **React Node Render** | First Render | < 30 ms | 50 ms |
| **Search List** | DOM Rows Rendered | 10-15 rows | 25 rows (Virtualize) |
| **Thumbnail Media** | Size (WebP) | < 15 KB | 30 KB |
