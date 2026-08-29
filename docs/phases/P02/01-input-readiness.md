# Đánh giá Đầu vào & Tính Sẵn sàng: Phase P02 (Input Readiness - Cổng G0)

- **Mã Phase:** `P02`
- **Tên Phase:** Phân tích nghiệp vụ gia phả (Genealogy Domain Analysis)
- **Dự án:** GenViet (v0.1)
- **Ngày đánh giá:** 2026-08-29
- **Người thực hiện:** Senior Business Analyst / Domain Analyst
- **Kết luận Cổng G0:** `READY` (Đạt 100% tiêu chí DoR, đủ điều kiện thi công)

---

## 1. Kết quả Khảo sát Đầu vào từ Phase P00 và P01

### 1.1. Hiện trạng Git Repository:
- **Thư mục làm việc:** `e:\Project\GenViet`
- **Nhánh thi công P02:** `phase/p02-genealogy-domain-analysis` (tạo từ commit `d7da160` trên `master`).
- **Trạng thái Working Tree:** Hoàn toàn sạch (`clean`), không có uncommitted changes.
- **Tài liệu bàn giao tiếp nhận:**
  - P00: [`docs/phases/P00/09-handover.md`](../P00/09-handover.md), [`docs/project-charter.md`](../../project-charter.md), [`docs/definition-of-ready.md`](../../definition-of-ready.md), [`docs/definition-of-done.md`](../../definition-of-done.md), [`docs/phase-lifecycle.md`](../../phase-lifecycle.md).
  - P01: [`docs/phases/P01/09-handover.md`](../P01/09-handover.md), [`docs/product/prd-mvp.md`](../../product/prd-mvp.md), [`docs/product/v0.1-scope-baseline.md`](../../product/v0.1-scope-baseline.md), [`docs/product/user-stories.md`](../../product/user-stories.md), [`docs/product/acceptance-criteria.md`](../../product/acceptance-criteria.md), [`docs/product/product-constraints.md`](../../product/product-constraints.md), [`docs/product/privacy-baseline.md`](../../product/privacy-baseline.md).

### 1.2. Các Quyết định Đã Khóa Áp dụng cho P02:
1. **DEC-001:** Tên sản phẩm chính thức là **GenViet**.
2. **DEC-002:** Nguồn dữ liệu nghiệp vụ chính là **PostgreSQL**.
3. **DEC-003:** **Tài khoản người dùng (User Account)** và **Nhân vật gia phả (Person)** là 2 thực thể độc lập.
4. **DEC-004:** Vòng đời phase 8 cổng kiểm soát chất lượng (G0 - G7).
5. **DEC-005:** Độc lập nền tảng, thiết kế trung lập.
6. **DEC-006:** Tuyệt đối không commit secret, token, key hay dữ liệu cá nhân thật vào Git.
7. **DEC-007:** AI Agent chỉ được tạo nhánh và commit cục bộ, cấm tuyệt đối push/merge.
8. **DEC-008:** Dựng đồ thị dựa trên React Flow kết hợp thuật toán phân tầng ELK.js.
9. **P01-DEC-001:** Mô hình Single-Owner cho MVP v0.1.
10. **P01-DEC-002:** Bắt đầu cây từ node bất kỳ và mở rộng tổ tiên đa chiều.
11. **P01-DEC-003:** Xuất JSON là Must-Have, Nhập JSON là Should-Have.
12. **P01-DEC-004:** Ngưỡng quy mô 1.000 người/cây; cửa sổ hiển thị 50-80 node (2-3 thế hệ).

---

## 2. Bảng Kiểm tra Definition of Ready (DoR Checklist)

| Mã Tiêu chí | Nội dung kiểm tra | Kết quả | Bằng chứng / Ghi chú |
| :--- | :--- | :---: | :--- |
| **DoR-01** | Mục tiêu phase rõ ràng | `PASS` | 18 mục tiêu phân tích nghiệp vụ phả hệ cho v0.1. |
| **DoR-02** | Ranh giới Scope In/Out rõ ràng | `PASS` | Khóa phạm vi tài liệu nghiệp vụ; cấm code, cấm schema SQL vật lý, cấm migration. |
| **DoR-03** | Phụ thuộc tiền đề đã hoàn tất | `PASS` | P00 và P01 đã hoàn tất và được nghiệm thu, commit vào Git. |
| **DoR-04** | Tiếp nhận đầy đủ tài liệu đầu vào | `PASS` | Đã đọc kỹ PRD, Scope Baseline, User Stories, Handover P01. |
| **DoR-05** | Quyết định bắt buộc đã khóa | `PASS` | Kế thừa 100% Locked Decisions từ P00 và P01. |
| **DoR-06** | Acceptance Criteria đo lường được | `PASS` | Có 144 tiêu chí AC chi tiết (`AC-P02-001` đến `AC-P02-144`). |
| **DoR-07** | Rủi ro chính đã được nhận diện | `PASS` | Kiểm soát `RISK-002` (Mô hình quan hệ gia phả phức tạp). |
| **DoR-08** | Kế hoạch kiểm thử sơ bộ đã xác định | `PASS` | Test Plan bao phủ completeness, terminology, invariants, test cases. |
| **DoR-09** | Phương án rollback có sẵn | `PASS` | Quy trình Git branching chuẩn. |
| **DoR-10** | Dữ liệu kiểm thử tuân thủ | `PASS` | 100% Mock Data, không dùng dữ liệu người thật. |
| **DoR-11** | Không bắt AI tự suy diễn quyết định lớn | `PASS` | Các vấn đề mở được ghi nhận là `PROVISIONAL` hoặc `DECISION_REQUIRED`. |
| **DoR-12** | Không có Blocker tồn đọng | `PASS` | Blocker = 0 từ Phase P01. |
| **DoR-13** | Phạm vi file cho phép rõ ràng, Git sạch | `PASS` | Đang ở nhánh `phase/p02-genealogy-domain-analysis`, working tree sạch. |

---

## 3. Kết luận Cổng G0
Toàn bộ điều kiện tiên quyết đã đạt chuẩn `READY`. Cho phép bắt đầu thi công Phase P02.
