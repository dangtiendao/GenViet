# Testing Documentation

Thư mục này chứa các tài liệu về chiến lược kiểm thử, quy chuẩn viết test, kế hoạch kiểm thử (Test Plans) và tài liệu kiểm thử chấp nhận người dùng (UAT) cho dự án **GenViet**.

---

## 1. Mục đích & Phạm vi

- Định nghĩa chiến lược kiểm thử đa tầng: Unit Tests, Integration Tests, E2E Tests và Security/RLS Tests.
- Quy chuẩn dữ liệu kiểm thử (Mock Data & Fixtures) - đảm bảo 100% là dữ liệu giả lập, không dùng thông tin người thật.
- Lưu trữ các Test Plan mẫu và kết quả kiểm thử sau mỗi phase phát triển.

---

## 2. Cấu trúc tài liệu dự kiến

- `README.md`: Chỉ mục và hướng dẫn kiểm thử (file này).
- `test-strategy.md`: Chiến lược kiểm thử tổng thể, công cụ sử dụng (Vitest / Playwright / Supabase Local Test Runner).
- `test-data-guidelines.md`: Quy định tạo dữ liệu mẫu cho cây gia phả (các kịch bản phức tạp, đa thê, nhiều thế hệ).
- `rls-test-suite.md`: Kịch bản kiểm thử bảo mật chống rò rỉ dữ liệu giữa các cây gia phả.

---

## 3. Nguyên tắc kiểm thử

1. **Shift-Left Testing:** Mọi phase có code đều phải có Test Plan trước khi thi công và được kiểm thử ngay trong quá trình viết code.
2. **Bảo mật RLS là ưu tiên hàng đầu:** Mọi bảng có RLS bắt buộc phải có automated test xác minh người dùng không thể đọc/ghi dữ liệu của người khác.
3. **Không bỏ qua lỗi test:** Mọi pull request/commit phải đảm bảo toàn bộ test suite hiện có pass 100%.
