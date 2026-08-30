# Phương Pháp Đo Lường Hiệu Năng (Measurement Methodology)

## 1. Công Cụ & Môi Trường
- **API đo lường chuẩn:** Web Performance User Timing API (`performance.mark`, `performance.measure`).
- **Môi trường đo:** Production Build local Next.js + PostgreSQL Local Supabase (với ANALYZE statistics cập nhật).
- **Bộ mẫu:** Mỗi bài đo được thực hiện tối thiểu 5 lần lặp để loại trừ phương sai và lấy giá trị trung vị (Median / p50).
- **Phân tách các giai đoạn:** Đo tách biệt Server Query, Network Serialization, Client Mapping, Web Worker ELK Compute, và React State/DOM Render.
