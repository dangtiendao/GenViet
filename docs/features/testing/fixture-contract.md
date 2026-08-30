# Hợp Đồng Dữ Liệu Kiểm Thử & Fixtures (Fixture Contract)

## 1. Nguyên Tắc Quản Trị Dữ Liệu Kiểm Thử
1. **0% Dữ Liệu Gia Đình Thật:** Toàn bộ nhân vật và cây gia phả trong kiểm thử sử dụng tên quy ước giả định (ví dụ: `Nguyễn Văn A`, `Trần Thị B`, `[FIXTURE] Cây Thử Nghiệm`).
2. **Tiền Tố Cô Lập (Namespace):** Dữ liệu kiểm thử được gán tiền tố `[TEST]`, `[FIXTURE]`, hoặc `[E2E]`.
3. **Dọn Dẹp Độc Lập:** Script `scripts/cleanup/cleanup-test-data.mjs` có thể dọn sạch dữ liệu kiểm thử mà không ảnh hưởng tới dữ liệu thật hay bảng `system_heartbeats`.
