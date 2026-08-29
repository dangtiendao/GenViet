# Phase Overview: P00 - Quản trị Dự án (Project Governance)

- **Mã Phase:** `P00`
- **Tên Phase:** Quản trị dự án (Project Governance)
- **Dự án:** GenViet (Web App quản lý cây gia phả)
- **Trạng thái:** `ACCEPTED`
- **Nhánh Git thi công:** `phase/p00-project-governance`
- **Vai trò thi công:** Senior Technical Lead, Engineering Manager & Documentation Architect
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase

1. Thiết lập khung quy tắc quản trị dự án, hiến chương dự án (Project Charter) và định hướng kỹ thuật.
2. Chuẩn hóa quy trình Git, phân nhánh, an toàn commit và thỏa thuận làm việc an toàn với AI.
3. Tạo cấu trúc thư mục tài liệu module hóa, dễ dàng mở rộng và định hướng ngữ cảnh cho AI.
4. Định nghĩa bộ tiêu chuẩn Definition of Ready (DoR) và Definition of Done (DoD) đa tầng.
5. Chuẩn hóa quy trình quản lý rủi ro, quyết định kiến trúc (Decision Log / ADR), issue và nợ kỹ thuật.
6. Xây dựng nền tảng vững chắc để các phase tiếp theo có thể thi công độc lập và an toàn bằng AI.
7. Tuyệt đối không triển khai chức năng ứng dụng, không cài đặt runtime dependencies trong phase này.

---

## 2. Phạm vi Thi công (Scope of Work)

### Trong phạm vi (In-Scope):
- Khảo sát repository và thiết lập nhánh làm việc `phase/p00-project-governance`.
- Xây dựng hệ thống tài liệu quản trị cốt lõi tại `docs/` (`project-charter.md`, `git-workflow.md`, `phase-lifecycle.md`, `definition-of-ready.md`, `definition-of-done.md`, `review-guidelines.md`, `documentation-guidelines.md`, `release-process.md`, `ai-working-agreement.md`).
- Xây dựng các README định hướng cho tất cả thư mục chức năng (`product`, `architecture`, `database`, `security`, `testing`, `operations`, `phases`, `decisions`, `risks`, `prompts`, `templates`).
- Thiết lập quy tắc bảo mật & quản lý secret (`docs/security/project-security-rules.md`).
- Xây dựng Sổ đăng ký quyết định (`decision-log.md`) và Sổ rủi ro (`risk-register.md`).
- Xây dựng bộ template chuẩn hóa cho issue, task, bug, review, rollback, release.
- Thiết lập bộ template GitHub (`PULL_REQUEST_TEMPLATE.md`, `ISSUE_TEMPLATE/*`, `CODEOWNERS.example`) và `.gitignore`.
- Cập nhật `CONTRIBUTING.md`, `CHANGELOG.md` và `README.md` gốc.
- Hoàn thiện toàn bộ hồ sơ phase P00 (`00-` đến `09-` và `issues/`).

### Ngoài phạm vi (Out-of-Scope):
- Không viết code ứng dụng Next.js / React / TypeScript.
- Không cài đặt npm/pnpm runtime packages.
- Không cấu hình Vercel, Supabase Cloud hoặc Cloudflare.
- Không tạo database migration.
- Không đưa dữ liệu gia phả thật vào tài liệu/test.
- Không push lên remote repository, không merge, không tạo PR từ xa.

---

## 3. Sản phẩm Bàn giao Chính (Key Deliverables)

- **Bộ tài liệu quản trị hoàn chỉnh:** 10 tài liệu quản trị tại `docs/` và 7 README định hướng domain.
- **Bộ templates đầy đủ:** 7 file template dự án tại `docs/templates/` và 5 file template tại `.github/`.
- **Bộ prompt chuẩn cho AI:** 6 template prompt tại `docs/prompts/`.
- **Hồ sơ nghiệm thu P00:** 10 file tài liệu chuẩn tại `docs/phases/P00/` và 3 file quản lý issue.
- **Gói bàn giao đầu vào cho Phase P01:** `docs/phases/P00/09-handover.md`.

---

## 4. Các Quyết định & Ràng buộc đã Khóa

- Áp dụng đầy đủ 8 Locked Decisions (`DEC-001` đến `DEC-008`).
- Ràng buộc an toàn Git: Toàn bộ công việc nằm trên nhánh cục bộ `phase/p00-project-governance`, commit cục bộ sạch, tuyệt đối không push/merge.
