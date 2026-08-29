# Kế hoạch Thi công Chi tiết: Phase P02 (Phase Plan - Cổng G1)

- **Mã Phase:** `P02`
- **Tên Phase:** Phân tích nghiệp vụ gia phả (Genealogy Domain Analysis)
- **Trạng thái Kế hoạch:** `ACCEPTED`
- **Nhánh thi công:** `phase/p02-genealogy-domain-analysis`

---

## 1. Phân chia Gói Công việc (Work Packages)

### `P02-WP01`: Preflight & Đánh giá Đầu vào (Cổng G0)
- Kiểm tra Git preflight, xác minh DoR từ Phase P00 và P01.
- Tạo nhánh `phase/p02-genealogy-domain-analysis`.
- Đầu ra: `docs/phases/P02/01-input-readiness.md`.

### `P02-WP02`: Identity & Khái niệm Cây Gia phả
- Thi công các task `P02-T01` đến `P02-T06`.
- Đầu ra: `docs/product/domain/domain-overview.md`, `identity-model.md`, `family-tree-concepts.md`, `domain-model.md`.

### `P02-WP03`: Mô hình Quan hệ Gia đình
- Thi công các task `P02-T07` đến `P02-T12`.
- Đầu ra: `docs/product/domain/relationship-model.md`, `relationship-rules.md`, `relationship-matrix.md`.

### `P02-WP04`: Dữ liệu Khuyết thiếu & Ngày tháng Không đầy đủ
- Thi công các task `P02-T13` đến `P02-T18`.
- Đầu ra: `docs/product/domain/uncertain-data-rules.md`, `partial-date-rules.md`.

### `P02-WP05`: Mở rộng Tổ tiên, Trùng lặp, Gộp & Xóa mềm
- Thi công các task `P02-T19` đến `P02-T23`.
- Đầu ra: `docs/product/domain/domain-rules.md`, `duplicate-and-merge-rules.md`, `deletion-rules.md`.

### `P02-WP06`: Thế hệ, Bất biến Đồ thị & Phân cấp Lỗi
- Thi công các task `P02-T24` đến `P02-T26`.
- Đầu ra: `docs/product/domain/generation-rules.md`, `invariants.md`, `validation-severity-catalogue.md`.

### `P02-WP07`: Bảng Thuật ngữ, Kịch bản Test & Ma trận Truy vết
- Thi công các task `P02-T27`, `P02-T28`.
- Đầu ra: `docs/product/domain/glossary.md`, `relationship-test-cases.md`, `domain-traceability-matrix.md`, `assumptions.md`, `open-questions.md`, `README.md`.

### `P02-WP08`: Hồ sơ Nghiệm thu Phase P02, Self-Review & Bàn giao P03/P04
- Hoàn thiện toàn bộ hồ sơ phase P02 tại `docs/phases/P02/`.
- Thực hiện self-review độc lập đối chiếu 144 tiêu chí Acceptance Criteria.
- Cập nhật `CHANGELOG.md`, `decision-log.md`, `risk-register.md` và tạo commit cục bộ.

---

## 2. Kế hoạch Xác minh & Kiểm thử (Verification Strategy)

1. **Kiểm tra Tính toàn vẹn Tài liệu:** Đảm bảo 20 tài liệu domain và 10 tài liệu phase có nội dung sâu sắc, không có placeholder.
2. **Kiểm tra Thuật ngữ & Mô hình:** Đảm bảo không nhầm lẫn User vs Person, Person vs Node, Initial Person vs Founding Ancestor vs Generation Anchor.
3. **Kiểm tra Tính nhất quán & Truy vết:** Đối soát ma trận liên kết giữa P01 Objective $\rightarrow$ UC $\rightarrow$ US $\rightarrow$ P02 Concept $\rightarrow$ Rule $\rightarrow$ Invariant $\rightarrow$ RTC $\rightarrow$ Phase.
4. **Kiểm tra Ranh giới Phạm vi:** Tuyệt đối không có code ứng dụng, DDL SQL hay migration.
5. **Kiểm tra An toàn Git:** Xác nhận thao tác trên nhánh cục bộ `phase/p02-genealogy-domain-analysis`, commit sạch, không push, không merge.
