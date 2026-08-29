# Đánh giá Mức độ Sẵn sàng Đầu vào: Phase P03 (Input Readiness Assessment - Cổng G0)

- **Mã Phase:** `P03`
- **Tên Phase:** Thiết kế UX và luồng màn hình (UX Design & Screen Flows)
- **Phiên bản mục tiêu:** `v0.1`
- **Ngày đánh giá:** 2026-08-29
- **Nhánh thi công:** `phase/p03-ux-flows-wireframes`
- **Starting commit:** `1df2488d55c70757a3e7e8b61e29c07ae9aa9ba4` (Merge PR #2 for P02)
- **Kết luận Cổng G0:** `READY` (14/14 tiêu chí đạt chuẩn `PASS`)

---

## 1. Bảng Kiểm tra Tiêu chuẩn Sẵn sàng (Definition of Ready Checklist)

| STT | Tiêu chí Kiểm tra Đầu vào | Tài liệu Nguồn Kiểm chứng | Trạng thái | Ghi chú Chi tiết |
| :---: | :--- | :--- | :---: | :--- |
| 1 | Quy trình Git & Nguyên tắc An toàn P00 | [`docs/git-workflow.md`](../../git-workflow.md), [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) | `PASS` | Đã khởi tạo nhánh riêng `phase/p03-ux-flows-wireframes`. |
| 2 | Tiêu chuẩn DoR và DoD dự án P00 | [`docs/definition-of-ready.md`](../../definition-of-ready.md), [`docs/definition-of-done.md`](../../definition-of-done.md) | `PASS` | Nắm rõ 8 cổng kiểm soát chất lượng G0 - G7. |
| 3 | Tầm nhìn & 7 Mục tiêu Định lượng P01 | [`docs/product/vision.md`](../../product/vision.md) | `PASS` | Mục tiêu `OBJ-001` đến `OBJ-007` đã được xác định. |
| 4 | 4 Nhóm Chân dung Người dùng P01 | [`docs/product/target-users.md`](../../product/target-users.md) | `PASS` | `USR-001` (Gia trưởng), `USR-002` (Người trẻ), `USR-003`, `USR-004`. |
| 5 | Danh mục 24 Use Cases P01 | [`docs/product/use-cases.md`](../../product/use-cases.md) | `PASS` | `UC-001` đến `UC-024` có đầy đủ pre/post conditions. |
| 6 | Phạm vi Must-have & Out-of-Scope P01 | [`docs/product/mvp-scope.md`](../../product/mvp-scope.md), [`docs/product/out-of-scope.md`](../../product/out-of-scope.md) | `PASS` | 12 nhóm Must-have và 30 hạng mục Won't (OOS). |
| 7 | User Stories & Acceptance Criteria P01 | [`docs/product/user-stories.md`](../../product/user-stories.md), [`docs/product/acceptance-criteria.md`](../../product/acceptance-criteria.md) | `PASS` | 16 Epics Must có tiêu chí Given-When-Then chi tiết. |
| 8 | Ràng buộc Sản phẩm & Mobile P01 | [`docs/product/product-constraints.md`](../../product/product-constraints.md) | `PASS` | Giới hạn 1.000 người/cây, viewport hiển thị 50-80 node. |
| 9 | Nguyên tắc Quyền Riêng tư P01 | [`docs/product/privacy-baseline.md`](../../product/privacy-baseline.md) | `PASS` | Private by default, phân cấp 4 nhóm dữ liệu nhạy cảm. |
| 10 | Phân định User Account vs Person P02 | [`docs/product/domain/identity-model.md`](../../product/domain/identity-model.md) | `PASS` | 10 quy tắc tách biệt danh tính `BR-ID-001`..`010`. |
| 11 | Khái niệm Cây & 4 Loại Người Mốc P02 | [`docs/product/domain/family-tree-concepts.md`](../../product/domain/family-tree-concepts.md) | `PASS` | Initial Person, Center Person, Founding Ancestor, Anchor. |
| 12 | Quy tắc Quan hệ & 20 Invariants P02 | [`docs/product/domain/relationship-rules.md`](../../product/domain/relationship-rules.md), [`invariants.md`](../../product/domain/invariants.md) | `PASS` | Đồ thị DAG không chu trình, chống self-parent, self-spouse. |
| 13 | Phân cấp Lỗi & Cảnh báo P02 | [`docs/product/domain/validation-severity-catalogue.md`](../../product/domain/validation-severity-catalogue.md) | `PASS` | 8 mã `ERR`, 7 mã `WARN` cần xác nhận, `WARN` mềm, `INFO`. |
| 14 | Bảng Thuật ngữ & 80 Test Cases P02 | [`docs/product/domain/glossary.md`](../../product/domain/glossary.md), [`relationship-test-cases.md`](../../product/domain/relationship-test-cases.md) | `PASS` | 40 thuật ngữ chuẩn, 80 test cases bằng 100% Mock Data. |

---

## 2. Danh mục Giả định & Ràng buộc Thiết kế UX Ban đầu

- **`P03-ASM-001` (Single-Owner UX Flow):** Trong v0.1, luồng trải nghiệm tập trung vào cá nhân tự sở hữu cây, không có UI phân quyền chia sẻ nhiều người dùng.
- **`P03-ASM-002` (Center Person Focus Context):** Trên màn hình di động, giao diện luôn căn giữa theo `Center Person` hiện tại và hiển thị các thế hệ trực hệ lân cận (cha mẹ, vợ chồng, con cái) để tối ưu không gian touch.
- **`P03-ASM-003` (Mobile Bottom Sheet Hierarchy):** Mọi thao tác xem nhanh, sửa hồ sơ và thêm quan hệ trên di động được ưu tiên mở dưới dạng Bottom Sheet để người dùng không bị mất ngữ cảnh cây phía sau.
- **`P03-ASM-004` (Date Precision UI Pattern):** Form nhập ngày tháng hỗ trợ trực tiếp việc chỉ nhập Năm hoặc Tháng/Năm mà không ép người dùng chọn lịch đầy đủ ngày.
