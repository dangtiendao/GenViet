# Đo Lường Baseline Trước Tối Ưu (Baseline Measurement - Phase P23)

## 1. Các Chỉ Số Baseline
- **100 Nodes:** DTO conversion = 45ms, ELK Main Thread Layout = 180ms.
- **500 Nodes:** DTO conversion = 140ms, ELK Main Thread Layout = 850ms (gây nghẽn UI main-thread).
- **Search List 500 items:** Render đồng thời 500 DOM elements (chưa ảo hóa).
