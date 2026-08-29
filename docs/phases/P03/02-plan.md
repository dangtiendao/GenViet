# Kế hoạch Thi công Chi tiết: Phase P03 (Phase Plan - Cổng G1)

- **Mã Phase:** `P03`
- **Tên Phase:** Thiết kế UX và luồng màn hình (UX Design & Screen Flows)
- **Trạng thái Kế hoạch:** `ACCEPTED`
- **Nhánh thi công:** `phase/p03-ux-flows-wireframes`

---

## 1. Phân chia 9 Gói Công việc (Work Packages)

- **`P03-WP01`:** Preflight & Đánh giá Đầu vào (Cổng G0) $\rightarrow$ `docs/phases/P03/01-input-readiness.md`.
- **`P03-WP02`:** Kiến trúc Thông tin & Sitemap $\rightarrow$ `docs/ux/sitemap.md`, `screen-inventory.md`, `ux-principles.md`.
- **`P03-WP03`:** Luồng Xác thực & Khởi tạo Cây $\rightarrow$ `flows/authentication.md`, `create-family-tree.md`, `create-initial-person.md`, `wireframes/auth.md`, `dashboard.md`, `person-form.md`.
- **`P03-WP04`:** Luồng Quan hệ Phả hệ & Cảnh báo $\rightarrow$ `flows/add-parent.md`, `add-spouse.md`, `add-child.md`, `link-existing-person.md`, `relationship-warning-patterns.md`.
- **`P03-WP05`:** Luồng Hồ sơ, Xóa, Tìm kiếm, Center & Backup $\rightarrow$ `flows/edit-person.md`, `soft-delete-person.md`, `search-person.md`, `change-center-person.md`, `backup.md`, `wireframes/person-profile.md`, `search.md`, `settings-and-backup.md`.
- **`P03-WP06`:** Điều hướng Responsive & Bottom Sheet $\rightarrow$ `navigation-model.md`, `responsive-behavior.md`, `mobile-bottom-sheet.md`, `wireframes/desktop.md`, `mobile.md`.
- **`P03-WP07`:** Danh mục Trạng thái & Thao tác Nguy hiểm $\rightarrow$ `state-catalogue.md`, `dangerous-action-patterns.md`, `wireframes/states-and-dialogs.md`.
- **`P03-WP08`:** Node Cây, Touch & Accessibility Baseline $\rightarrow$ `person-node-spec.md`, `tree-interaction-spec.md`, `node-action-menu.md`, `touch-target-audit.md`, `accessibility-baseline.md`, `content-guidelines.md`, `form-patterns.md`, `ux-traceability-matrix.md`, `assumptions.md`, `open-questions.md`, `wireframes/family-tree.md`, `README.md`, `wireframes/README.md`.
- **`P03-WP09`:** Hồ sơ Phase P03, Self-Review & Bàn giao Kỹ thuật $\rightarrow$ Hoàn thiện `docs/phases/P03/`, cập nhật `CHANGELOG.md`, `decision-log.md`, `risk-register.md`.

---

## 2. Kế hoạch Kiểm thử & Đối soát Chất lượng (Verification Strategy)

1. **Kiểm tra Tính toàn vẹn Tài liệu:** Đảm bảo 21 tài liệu UX, 12 flow files, 10 wireframe files và 10 phase files có nội dung sâu sắc, không placeholder.
2. **Kiểm tra Tính nhất quán Nghiệp vụ:** Đảm bảo không vi phạm bất kỳ quy tắc nào trong số 20 Domain Invariants của P02 (đặc biệt là chống chu trình DAG và phân định User vs Person).
3. **Kiểm tra Độ bao phủ Truy vết:** Khép kín 100% từ P01 Objective $\rightarrow$ UC $\rightarrow$ US $\rightarrow$ P02 Rule $\rightarrow$ P03 Flow $\rightarrow$ Screen $\rightarrow$ Future Phase.
4. **Kiểm tra Ranh giới Kỹ thuật & An toàn Git:** Xác nhận không có mã nguồn, không có DDL SQL, commit sạch trên nhánh cục bộ `phase/p03-ux-flows-wireframes`, không push, không merge.
