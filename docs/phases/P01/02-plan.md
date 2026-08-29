# Kế hoạch Thi công Chi tiết: Phase P01 (Phase Plan - Cổng G1)

- **Mã Phase:** `P01`
- **Tên Phase:** Chốt phạm vi sản phẩm (Product Scope Definition)
- **Trạng thái Kế hoạch:** `ACCEPTED`
- **Nhánh thi công:** `phase/p01-product-scope`

---

## 1. Phân chia Gói Công việc (Work Packages)

### `P01-WP01`: Preflight & Đánh giá Đầu vào (Cổng G0)
- Kiểm tra Git preflight, xác minh DoR từ Phase P00.
- Tạo nhánh `phase/p01-product-scope`.
- Đầu ra: `docs/phases/P01/01-input-readiness.md`.

### `P01-WP02`: Tầm nhìn, Người dùng & Tuyên bố Vấn đề
- Thi công các task `P01-T01`, `P01-T02`, `P01-T03`.
- Đầu ra: `docs/product/vision.md`, `docs/product/target-users.md`, `docs/product/problem-statement.md`.

### `P01-WP03`: Danh mục Use Cases & Luồng Giá trị Cốt lõi
- Thi công các task `P01-T04`, `P01-T05`.
- Đầu ra: `docs/product/use-cases.md`, `docs/product/core-value-flow.md`.

### `P01-WP04`: Phạm vi MVP, Ràng buộc, Quyền riêng tư & Tiêu chí Thành công
- Thi công các task `P01-T06`, `P01-T07`, `P01-T08`, `P01-T09`, `P01-T10`, `P01-T11`, `P01-T12`.
- Đầu ra: `docs/product/mvp-scope.md`, `docs/product/out-of-scope.md`, `docs/product/product-constraints.md`, `docs/product/privacy-baseline.md`, `docs/product/success-metrics.md`.

### `P01-WP05`: User Stories & Acceptance Criteria Chi tiết
- Thi công các task `P01-T13`, `P01-T14`.
- Đầu ra: `docs/product/user-stories.md`, `docs/product/acceptance-criteria.md`.

### `P01-WP06`: MoSCoW Prioritization, v0.1 Scope Baseline, PRD & Ma trận Truy vết
- Thi công các task `P01-T15`, `P01-T16`.
- Đầu ra: `docs/product/moscow-prioritization.md`, `docs/product/v0.1-scope-baseline.md`, `docs/product/prd-mvp.md`, `docs/product/traceability-matrix.md`, `docs/product/README.md`.

### `P01-WP07`: Hồ sơ Nghiệm thu Phase P01, Self-Review & Bàn giao P02
- Hoàn thiện toàn bộ hồ sơ phase P01 tại `docs/phases/P01/`.
- Thực hiện self-review độc lập đối chiếu 88 tiêu chí Acceptance Criteria.
- Cập nhật `CHANGELOG.md`, `decision-log.md`, `risk-register.md` và tạo commit cục bộ.

---

## 2. Kế hoạch Xác minh & Kiểm thử (Verification Strategy)

1. **Kiểm tra Tính toàn vẹn Tài liệu:** Đảm bảo 100% tài liệu được tạo đủ, có nội dung chi tiết, không có file rỗng.
2. **Kiểm tra Tính nhất quán & Truy vết:** Đối soát ma trận liên kết giữa Objective $\rightarrow$ Problem $\rightarrow$ Use Case $\rightarrow$ Requirement $\rightarrow$ Story $\rightarrow$ AC.
3. **Kiểm tra Ranh giới Phạm vi:** Tuyệt đối không có code ứng dụng hay migration SQL.
4. **Kiểm tra An toàn Git:** Xác nhận thao tác trên nhánh cục bộ `phase/p01-product-scope`, commit sạch, không push, không merge.
