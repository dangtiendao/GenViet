# Kế hoạch Thi công Chi tiết: Phase P00 (Phase Plan - Cổng G1)

- **Mã Phase:** `P00`
- **Tên Phase:** Quản trị dự án (Project Governance)
- **Trạng thái Kế hoạch:** `ACCEPTED` (Đã phê duyệt)
- **Nhánh thi công:** `phase/p00-project-governance`

---

## 1. Phân chia Gói Công việc (Work Packages)

Kế hoạch thi công P00 được chia thành 7 Work Packages tuần tự:

### `P00-WP01`: Khảo sát & Khung tài liệu gốc
- **Mục tiêu:** Khảo sát preflight, tạo nhánh phase và dựng khung tài liệu cơ bản.
- **Danh sách file tạo mới:**
  - `docs/README.md`
  - `docs/project-charter.md`
  - `docs/product/README.md`
  - `docs/architecture/README.md`
  - `docs/database/README.md`
  - `docs/security/README.md`
  - `docs/testing/README.md`
  - `docs/operations/README.md`

### `P00-WP02`: Git Workflow & Templates Cộng tác
- **Mục tiêu:** Thiết lập quy trình Git an toàn, chuẩn commit, template GitHub và `.gitignore`.
- **Danh sách file tạo mới:**
  - `CONTRIBUTING.md`
  - `docs/git-workflow.md`
  - `.gitignore`
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `.github/ISSUE_TEMPLATE/bug_report.yml`
  - `.github/ISSUE_TEMPLATE/feature_request.yml`
  - `.github/ISSUE_TEMPLATE/phase_review.yml`
  - `.github/ISSUE_TEMPLATE/config.yml`
  - `.github/CODEOWNERS.example`

### `P00-WP03`: Vòng đời Phase, DoR, DoD & Review Guidelines
- **Mục tiêu:** Thiết lập 8 cổng kiểm soát chất lượng, bộ tiêu chuẩn DoR/DoD và hướng dẫn review.
- **Danh sách file tạo mới:**
  - `docs/phases/README.md`
  - `docs/phase-lifecycle.md`
  - `docs/definition-of-ready.md`
  - `docs/definition-of-done.md`
  - `docs/review-guidelines.md`

### `P00-WP04`: Quản lý Quyết định, Rủi ro, Issue & Templates
- **Mục tiêu:** Xây dựng sổ quyết định, sổ rủi ro và toàn bộ template quản lý chất lượng.
- **Danh sách file tạo mới:**
  - `docs/decisions/README.md`
  - `docs/decisions/decision-log.md`
  - `docs/decisions/ADR-template.md`
  - `docs/risks/README.md`
  - `docs/risks/risk-register.md`
  - `docs/templates/phase-overview-template.md`
  - `docs/templates/task-template.md`
  - `docs/templates/review-template.md`
  - `docs/templates/bug-template.md`
  - `docs/templates/technical-debt-template.md`
  - `docs/templates/rollback-template.md`
  - `docs/templates/release-checklist-template.md`

### `P00-WP05`: Quy tắc Bảo mật, Thỏa thuận AI & Tiêu chuẩn Tài liệu
- **Mục tiêu:** Ban hành quy tắc bảo mật secret, thỏa thuận làm việc với AI, bộ khung prompt và quy chuẩn viết tài liệu.
- **Danh sách file tạo mới:**
  - `docs/security/project-security-rules.md`
  - `docs/ai-working-agreement.md`
  - `docs/prompts/README.md`
  - `docs/prompts/phase-input-template.md`
  - `docs/prompts/phase-implementation-template.md`
  - `docs/prompts/phase-review-template.md`
  - `docs/prompts/phase-re-review-template.md`
  - `docs/prompts/phase-summary-template.md`
  - `docs/prompts/phase-handover-template.md`
  - `docs/documentation-guidelines.md`

### `P00-WP06`: Changelog, Release Process & Root README
- **Mục tiêu:** Khởi tạo CHANGELOG, quy trình phát hành và cập nhật README gốc.
- **Danh sách file tạo mới:**
  - `CHANGELOG.md`
  - `docs/release-process.md`
  - `README.md`

### `P00-WP07`: Đánh giá Chất lượng, Tổng kết Phase & Bàn giao P01
- **Mục tiêu:** Hoàn thiện bộ hồ sơ phase P00, thực hiện self-review, tổng kết nghiệm thu và bàn giao cho Phase P01.
- **Danh sách file tạo mới:**
  - `docs/phases/P00/00-overview.md`
  - `docs/phases/P00/01-input-readiness.md`
  - `docs/phases/P00/02-plan.md`
  - `docs/phases/P00/03-task-breakdown.md`
  - `docs/phases/P00/04-decisions.md`
  - `docs/phases/P00/05-test-plan.md`
  - `docs/phases/P00/06-review.md`
  - `docs/phases/P00/07-re-review.md`
  - `docs/phases/P00/08-summary.md`
  - `docs/phases/P00/09-handover.md`
  - `docs/phases/P00/issues/blocker.md`
  - `docs/phases/P00/issues/deferred.md`
  - `docs/phases/P00/issues/technical-debt.md`

---

## 2. Kế hoạch Xác minh & Kiểm thử (Verification Strategy)

1. **Kiểm tra Cấu trúc & Liên kết:** Rà soát toàn bộ đường dẫn tương đối, đảm bảo không có link gãy.
2. **Kiểm tra An toàn Bảo mật:** Quét diff bằng regex để phát hiện secret, token, key.
3. **Kiểm tra Tiêu chí Chấp nhận:** Đối soát 44 tiêu chí Acceptance Criteria.
4. **Cam kết An toàn Git:** Xác nhận 100% thay đổi nằm trên nhánh cục bộ `phase/p00-project-governance`, commit sạch, không push, không merge.
