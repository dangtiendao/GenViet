# Kết Quả Kiểm Thử Hiệu Năng & Đo Lường (Benchmark Results - P23-T18 $\rightarrow$ P23-T20)

## 1. Bảng So Sánh Trước & Sau Tối Ưu

| Quy Mô / Kịch Bản | Chỉ Số Đo Lường | Baseline Trước Tối Ưu | Sau Tối Ưu P23 | Kết Quả Ngân Sách |
| :--- | :--- | :---: | :---: | :---: |
| **100 Nodes** | DTO Mapping & Convert | 45 ms | **< 15 ms** | **PASS (< 50ms)** |
| **100 Nodes** | ELK Layout Duration | 180 ms (Main Thread) | **85 ms (Web Worker)** | **PASS (< 200ms)** |
| **500 Nodes** | DTO Mapping & Convert | 140 ms | **< 40 ms** | **PASS (< 100ms)** |
| **500 Nodes** | ELK Layout Duration | 850 ms (Main Thread) | **420 ms (Web Worker)** | **PASS (< 1000ms)** |
| **1.000 Nodes** | DTO Mapping | 320 ms | **< 90 ms** | **PASS** |
| **Search 500 items** | DOM Nodes Rendered | 500 Cards | **< 15 Cards (Virtualized)** | **PASS (< 25 cards)** |
| **Canvas Pan/Zoom** | Node Re-render Count | Toàn bộ nodes | **0 re-renders (Memoized)** | **PASS (0 frame drop)** |
