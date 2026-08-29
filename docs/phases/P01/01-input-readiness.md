# Đánh giá Đầu vào & Tính Sẵn sàng: Phase P01 (Input Readiness - Cổng G0)

- **Mã Phase:** `P01`
- **Tên Phase:** Chốt phạm vi sản phẩm (Product Scope Definition)
- **Dự án:** GenViet (v0.1)
- **Ngày đánh giá:** 2026-08-29
- **Người thực hiện:** Senior Product Manager / AI Agent
- **Kết luận Cổng G0:** `READY` (Đạt 100% tiêu chí DoR, đủ điều kiện thi công)

---

## 1. Kết quả Khảo sát Đầu vào từ Phase P00

### 1.1. Hiện trạng Git Repository & Tài liệu P00:
- **Thư mục làm việc:** `e:\Project\GenViet`
- **Nhánh thi công P01:** `phase/p01-product-scope` (tạo từ commit `7a3a85e` của P00).
- **Trạng thái Working Tree:** Hoàn toàn sạch (`clean`), không có uncommitted changes.
- **Tài liệu bàn giao từ P00:** Đã tiếp nhận và đọc kỹ [`docs/phases/P00/09-handover.md`](../P00/09-handover.md), [`docs/project-charter.md`](../../project-charter.md), [`docs/definition-of-ready.md`](../../definition-of-ready.md), [`docs/definition-of-done.md`](../../definition-of-done.md), [`docs/phase-lifecycle.md`](../../phase-lifecycle.md), [`docs/decisions/decision-log.md`](../../decisions/decision-log.md), [`docs/risks/risk-register.md`](../../risks/risk-register.md).

### 1.2. Các Quyết định Đã Khóa Áp dụng cho P01:
1. **DEC-001:** Tên sản phẩm chính thức là **GenViet**.
2. **DEC-002:** Nguồn dữ liệu nghiệp vụ chính là **PostgreSQL**.
3. **DEC-003:** **Tài khoản người dùng (User Account)** và **Nhân vật gia phả (Person)** là 2 thực thể độc lập.
4. **DEC-004:** Vòng đời phase 8 cổng kiểm soát chất lượng (G0 - G7).
5. **DEC-005:** Độc lập nền tảng, thiết kế trung lập, không phụ thuộc sâu vào tính năng độc quyền của Vercel.
6. **DEC-006:** Tuyệt đối không commit secret, token, key hay dữ liệu cá nhân thật vào Git.
7. **DEC-007:** AI Agent chỉ được tạo nhánh và commit cục bộ, cấm tuyệt đối push/merge.
8. **DEC-008:** Dựng cây gia phả dựa trên React Flow kết hợp thuật toán phân tầng ELK.js.

---

## 2. Bảng Kiểm tra Definition of Ready (DoR Checklist)

| Mã Tiêu chí | Nội dung kiểm tra | Kết quả | Bằng chứng / Ghi chú |
| :--- | :--- | :---: | :--- |
| **DoR-01** | Mục tiêu phase rõ ràng | `PASS` | 14 mục tiêu xác định phạm vi sản phẩm MVP v0.1. |
| **DoR-02** | Ranh giới Scope In/Out rõ ràng | `PASS` | Khóa phạm vi tài liệu sản phẩm; cấm viết code, cấm thiết kế CSDL/schema, cấm làm quy tắc P02. |
| **DoR-03** | Phụ thuộc tiền đề đã hoàn tất | `PASS` | Phase P00 đã được nghiệm thu `ACCEPTED` và bàn giao đầy đủ. |
| **DoR-04** | Tiếp nhận đầy đủ tài liệu đầu vào | `PASS` | Đã đọc bộ tài liệu governance và Project Charter. |
| **DoR-05** | Quyết định kiến trúc bắt buộc đã khóa | `PASS` | 8 Locked Decisions (`DEC-001` - `DEC-008`) được kế thừa 100%. |
| **DoR-06** | Acceptance Criteria đo lường được | `PASS` | Có 88 tiêu chí AC cụ thể (`AC-P01-001` - `AC-P01-088`). |
| **DoR-07** | Rủi ro chính đã được nhận diện | `PASS` | Kế thừa Risk Register, đặc biệt kiểm soát `RISK-001` (Scope Creep). |
| **DoR-08** | Kế hoạch kiểm thử sơ bộ đã xác định | `PASS` | Test Plan bao phủ tính toàn vẹn, tính nhất quán, tính truy vết và kiểm soát scope. |
| **DoR-09** | Phương án rollback có sẵn | `PASS` | Kế thừa quy trình hoàn tác từ Phase P00. |
| **DoR-10** | Dữ liệu kiểm thử tuân thủ | `PASS` | 100% Mock Data, không dùng dữ liệu người thật. |
| **DoR-11** | Không bắt AI tự suy diễn quyết định lớn | `PASS` | Định hướng MVP cá nhân rõ ràng; các điểm chưa chốt sẽ đánh dấu `PROPOSED_FOR_APPROVAL`. |
| **DoR-12** | Không có Blocker tồn đọng | `PASS` | Blocker = 0 từ Phase P00. |
| **DoR-13** | Phạm vi file cho phép rõ ràng, Git sạch | `PASS` | Đang ở nhánh `phase/p01-product-scope`, working tree sạch. |

---

## 3. Kết luận Cổng G0
Toàn bộ điều kiện tiên quyết đã đạt chuẩn `READY`. Cho phép bắt đầu thi công Phase P01 theo các Work Packages đã hoạch định.
