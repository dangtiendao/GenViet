# Tài liệu Quản trị & Kiến trúc GenViet

Chào mừng bạn đến với kho tài liệu chính thức của dự án **GenViet** - Web App quản lý cây gia phả.

Kho tài liệu này được thiết kế theo cấu trúc module hóa, phục vụ việc tra cứu, phát triển độc lập và cộng tác hiệu quả giữa con người (Product Owner, Developers, Reviewers) và các trợ lý AI (AI Agents).

---

## 1. Cấu trúc thư mục tài liệu

```text
docs/
├── README.md                      # Chỉ mục tài liệu trung tâm (file này)
├── project-charter.md             # Hiến chương dự án GenViet (mục tiêu, phạm vi, nguyên tắc)
├── git-workflow.md                # Quy trình Git, phân nhánh, an toàn commit
├── phase-lifecycle.md             # Vòng đời phase và các cổng kiểm soát (G0 - G7)
├── definition-of-ready.md         # Tiêu chí Definition of Ready (DoR)
├── definition-of-done.md          # Tiêu chí Definition of Done (DoD)
├── review-guidelines.md           # Quy chuẩn Review độc lập & phân loại lỗi
├── documentation-guidelines.md    # Tiêu chuẩn viết và cập nhật tài liệu
├── release-process.md             # Quy trình đóng gói và phát hành phiên bản
├── ai-working-agreement.md        # Thỏa thuận và nguyên tắc làm việc với AI
├── product/                       # Tài liệu sản phẩm (PRD, User Stories, Personas)
│   └── README.md
├── architecture/                  # Kiến trúc hệ thống, sơ đồ khối, ADRs
│   └── README.md
├── database/                      # Thiết kế schema, quan hệ gia phả, migration rules
│   └── README.md
├── security/                      # Chính sách bảo mật, RLS, quản lý secret
│   ├── README.md
│   └── project-security-rules.md
├── testing/                       # Chiến lược kiểm thử, test plan, test cases
│   └── README.md
├── operations/                    # Vận hành, CI/CD, hosting, giám sát
│   └── README.md
├── decisions/                     # Nhật ký quyết định kiến trúc (Decision Log & ADRs)
│   ├── README.md
│   ├── decision-log.md
│   └── ADR-template.md
├── risks/                         # Quản lý rủi ro dự án
│   ├── README.md
│   └── risk-register.md
├── templates/                     # Các template chuẩn hóa cho issue, task, bug
│   ├── phase-overview-template.md
│   ├── task-template.md
│   ├── review-template.md
│   ├── bug-template.md
│   ├── technical-debt-template.md
│   ├── rollback-template.md
│   └── release-checklist-template.md
├── prompts/                       # Chuẩn hóa prompts giao việc và review cho AI
│   ├── README.md
│   ├── phase-input-template.md
│   ├── phase-implementation-template.md
│   ├── phase-review-template.md
│   ├── phase-re-review-template.md
│   ├── phase-summary-template.md
│   └── phase-handover-template.md
└── phases/                        # Quản lý hồ sơ thi công chi tiết từng phase
    ├── README.md
    └── P00/                       # Phase P00: Quản trị dự án
        ├── 00-overview.md
        ├── 01-input-readiness.md
        ├── 02-plan.md
        ├── 03-task-breakdown.md
        ├── 04-decisions.md
        ├── 05-test-plan.md
        ├── 06-review.md
        ├── 07-re-review.md
        ├── 08-summary.md
        ├── 09-handover.md
        └── issues/
            ├── blocker.md
            ├── deferred.md
            └── technical-debt.md
```

---

## 2. Lộ trình phát triển & Quản lý Phase

Dự án GenViet được thi công theo từng **Phase** độc lập, tuần tự và có cổng kiểm soát chất lượng nghiêm ngặt:

| Mã Phase | Tên Phase | Trạng thái | Thư mục hồ sơ |
| :--- | :--- | :--- | :--- |
| **P00** | Quản trị dự án | `ACCEPTED` (Đang nghiệm thu) | [Hồ sơ P00](./phases/P00/00-overview.md) |
| **P01** | Yêu cầu sản phẩm (PRD & Scope) | `NOT_STARTED` | `docs/phases/P01/` (Sẽ khởi tạo ở P01) |
| **P02** | Thuật ngữ & Mô hình dữ liệu gia phả | `NOT_STARTED` | `docs/phases/P02/` |
| **P03** | Thiết kế kiến trúc & Setup kỹ thuật | `NOT_STARTED` | `docs/phases/P03/` |
| **P...** | Các phase chức năng tiếp theo | `NOT_STARTED` | `docs/phases/P.../` |

---

## 3. Các quy định cốt lõi cần đọc trước

Trước khi bắt đầu bất kỳ công việc nào trong repository này, tất cả thành viên và AI Agents bắt buộc phải đọc và tuân thủ:

1. **[Hiến chương dự án](./project-charter.md)**: Nắm rõ tầm nhìn, phạm vi và các quyết định đã khóa.
2. **[Quy trình Git & An toàn](./git-workflow.md)**: Quy tắc phân nhánh, commit Conventional Commits và lệnh cấm tuyệt đối AI push/merge.
3. **[Quy tắc làm việc với AI](./ai-working-agreement.md)**: Thỏa thuận trách nhiệm, khảo sát trước khi làm, kiểm tra an toàn.
4. **[Quy tắc bảo mật](./security/project-security-rules.md)**: Không lộ secret, không đưa dữ liệu thật vào test/log.
5. **[Definition of Ready (DoR)](./definition-of-ready.md)** & **[Definition of Done (DoD)](./definition-of-done.md)**: Tiêu chuẩn để mở và đóng một task/phase.

---

## 4. Nguyên tắc cập nhật tài liệu

- **Nguồn chân lý duy nhất (Single Source of Truth):** Không sao chép các đoạn văn bản dài giữa nhiều tài liệu. Sử dụng liên kết Markdown tương đối để trỏ về tài liệu gốc.
- **Tính khả thi và trung thực:** Tài liệu phải phản ánh đúng hiện trạng của repository, không tuyên bố các chức năng chưa được triển khai là đã hoàn tất.
- **Không để placeholder mơ hồ:** Mọi mục `TODO` hoặc `Chưa xử lý` phải gắn liền với mã định danh task (`PXX-TYY`), issue hoặc ghi rõ `DEFERRED`.
