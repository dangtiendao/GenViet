# Changelog: GenViet

Toàn bộ các thay đổi đáng chú ý của dự án **GenViet** sẽ được ghi nhận chi tiết tại file này.

Định dạng tài liệu dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) và tuân thủ định hướng [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Phase P00 (Quản trị dự án):**
  - Thiết lập Hiến chương dự án (`docs/project-charter.md`) xác định tầm nhìn, phạm vi MVP, nguyên tắc bảo mật và các quyết định đã khóa.
  - Thiết lập Quy trình Git và phân nhánh chuẩn (`docs/git-workflow.md`, `CONTRIBUTING.md`) với cam kết an toàn cho AI.
  - Xây dựng Vòng đời Phase 8 cổng kiểm soát chất lượng (`docs/phase-lifecycle.md`).
  - Định nghĩa bộ tiêu chuẩn sẵn sàng Definition of Ready (`docs/definition-of-ready.md`) và hoàn thành Definition of Done (`docs/definition-of-done.md`).
  - Xây dựng Quy chuẩn Đánh giá chất lượng & Review độc lập (`docs/review-guidelines.md`).
  - Thiết lập Sổ đăng ký quyết định kiến trúc (`docs/decisions/decision-log.md`) và Sổ theo dõi rủi ro (`docs/risks/risk-register.md`).
  - Khởi tạo bộ templates chuẩn hóa cho Task, Bug, Review, Technical Debt, Rollback và Release trong `docs/templates/`.
  - Khởi tạo GitHub templates cho PR, Bug Report, Feature Request, Phase Review và Codeowners example trong `.github/`.
  - Thiết lập Quy tắc bảo mật & Quản lý Secret (`docs/security/project-security-rules.md`).
  - Thiết lập Thỏa thuận làm việc với AI (`docs/ai-working-agreement.md`) và bộ Khung Prompt chuẩn (`docs/prompts/`).
  - Xây dựng Quy chuẩn quản lý tài liệu (`docs/documentation-guidelines.md`) và Quy trình phát hành (`docs/release-process.md`).
  - Hoàn thiện toàn bộ hồ sơ phase P00 tại `docs/phases/P00/`.
- **Phase P01 (Chốt phạm vi sản phẩm):**
  - Ban hành Tầm nhìn sản phẩm và 7 mục tiêu định lượng (`docs/product/vision.md`).
  - Xác định 4 nhóm đối tượng người dùng, phân định rõ User Account và Person Node (`docs/product/target-users.md`).
  - Phân tích 6 vấn đề cốt lõi và thiết lập giả thuyết sản phẩm (`docs/product/problem-statement.md`).
  - Thiết lập danh mục 24 Use Cases (`docs/product/use-cases.md`) và Luồng giá trị cốt lõi 7 bước (`docs/product/core-value-flow.md`).
  - Phân định 12 nhóm chức năng Must-have (`docs/product/mvp-scope.md`) và 30 hạng mục Out-of-scope (`docs/product/out-of-scope.md`).
  - Xác lập Ràng buộc sản phẩm về quy mô 1.000 người/cây, ma trận hỗ trợ thiết bị và trình duyệt (`docs/product/product-constraints.md`).
  - Thiết lập 12 nguyên tắc Quyền riêng tư mặc định và bảng phân cấp 4 loại dữ liệu (`docs/product/privacy-baseline.md`).
  - Xây dựng 9 Tiêu chí thành công định lượng (`docs/product/success-metrics.md`).
  - Soạn thảo Danh mục User Stories theo 9 Epics (`docs/product/user-stories.md`) và Acceptance Criteria chuẩn Given-When-Then (`docs/product/acceptance-criteria.md`).
  - Thiết lập Phân loại ưu tiên MoSCoW (`docs/product/moscow-prioritization.md`), Chuẩn phạm vi v0.1 (`docs/product/v0.1-scope-baseline.md`) và PRD tổng thể (`docs/product/prd-mvp.md`).
  - Xây dựng Ma trận truy vết toàn diện khép kín (`docs/product/traceability-matrix.md`).
  - Hoàn thiện hồ sơ nghiệm thu Phase P01 tại `docs/phases/P01/` và gói bàn giao cho Phase P02.
