# 10 - Báo Cáo Kiểm Thử & Đánh Giá Hiệu Năng (Testing & Benchmarking)

## 1. Kết Quả Kiểm Thử Tự Động (Automated Testing Results)

- **Vitest Unit & Component Tests:** 41 Test Files, 188 Tests pass 100%.
- **Playwright E2E Tests:** 36 Tests pass 100%.
- **pgTAP Database Tests:** 5 Test Suites (`06000` đến `06400`) bao phủ:
  - Hàm chuẩn hóa tiếng Việt `_system.normalize_person_name`.
  - Tìm kiếm tên chính xác, không dấu, tiền tố và trigram.
  - Lọc năm sinh, trạng thái sống và hồ sơ thiếu thông tin.
  - Phân trang cursor deterministic.
  - Phân quyền RLS và cách ly dữ liệu giữa các cây gia phả.

---

## 2. Đánh Giá Hiệu Năng (Performance Benchmarks)
- **Tốc độ thực thi truy vấn (1.000 bản ghi):** $< 5ms$ nhờ chỉ mục `idx_persons_normalized_name_trgm` và `idx_persons_tree_search_name_id`.
- **Next.js Production Build:** 28 routes compiled sạch sẽ không lỗi hay cảnh báo.
- **Bảo Mật XSS:** 100% không sử dụng `dangerouslySetInnerHTML`.
- **Ranh Giới RLS:** 100% truy vấn tìm kiếm bị chặn khi không có quyền truy cập cây gia phả.
