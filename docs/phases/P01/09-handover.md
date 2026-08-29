# Tài liệu Bàn giao: Phase P01 sang Phase P02 (Phase Handover - Cổng G7)

- **Phase Bàn giao:** `P01: Chốt phạm vi sản phẩm (Product Scope Definition)` - Trạng thái: `IMPLEMENTATION_COMPLETE_AWAITING_PRODUCT_APPROVAL`
- **Phase Tiếp nhận:** `P02: Thuật ngữ & Mô hình dữ liệu gia phả (Glossary & Genealogy Model Design)` - Trạng thái: `NOT_STARTED`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Senior Product Manager & Technical Product Owner (P01)
- **Người tiếp nhận:** Domain Architect & Database Designer (P02)

---

## 1. Danh mục Tài liệu Bắt buộc Phase P02 Phải Đọc

Trước khi bắt đầu Phase P02 tại Cổng G0, đội ngũ thi công / AI của Phase P02 bắt buộc phải đọc kỹ các tài liệu đầu vào sau:

1. **[Tài liệu PRD Tổng thể MVP](../../product/prd-mvp.md):** Nắm bức tranh tổng quan về sản phẩm GenViet v0.1.
2. **[Chuẩn Phạm vi v0.1 (Scope Baseline)](../../product/v0.1-scope-baseline.md):** Nguồn chân lý về phạm vi tính năng được phép làm.
3. **[Danh mục User Stories](../../product/user-stories.md):** Đặc biệt là **Epic C (Nhân vật)** và **Epic D (Quan hệ phả hệ)**.
4. **[Tiêu chuẩn Chấp nhận Chi tiết](../../product/acceptance-criteria.md):** Nắm rõ các tiêu chí kiểm thử quan hệ (Chống chu trình, chống self-link, mở rộng tổ tiên).
5. **[Ràng buộc Sản phẩm & Quy mô](../../product/product-constraints.md):** Mục tiêu 1.000 người/cây, hiển thị 2-3 đời mặc định.
6. **[Nguyên tắc Quyền Riêng tư](../../product/privacy-baseline.md):** Phân loại dữ liệu Family-Private, Sensitive và Highly Sensitive.

---

## 2. Các Quyết định Đã Khóa Phase P02 Bắt buộc Tuân thủ

- **DEC-002:** Nguồn dữ liệu nghiệp vụ chính là **PostgreSQL**.
- **DEC-003:** **Tài khoản người dùng (User Account)** và **Nhân vật gia phả (Person)** là 2 thực thể độc lập.
- **DEC-008:** Dựng đồ thị bằng **React Flow + ELK.js** (Yêu cầu mô hình dữ liệu phải dễ chuyển đổi thành cấu trúc Nodes & Edges).
- **P01-DEC-001:** Mô hình dữ liệu v0.1 tập trung vào Single-Owner, không thiết kế bảng phân quyền đa người dùng phức tạp trong v0.1.
- **P01-DEC-002:** Không có khái niệm "bắt buộc phải là Thủy tổ" ở tầng dữ liệu; bất kỳ person node nào cũng có thể là node gốc hoặc có cha/mẹ được thêm sau.

---

## 3. Các Nhiệm vụ Trọng tâm Bàn giao cho Phase P02

Phase P02 có nhiệm vụ xây dựng nền tảng nghiệp vụ phả học và thiết kế mô hình dữ liệu khái niệm, bao gồm:
1. **Chuẩn hóa Thuật ngữ Phả hệ (Glossary):**
   - Định nghĩa chính xác các thuật ngữ tiếng Việt / tiếng Anh: Cây gia phả (Family Tree), Chi họ / Nhánh (Branch), Thế hệ / Đời (Generation), Tiền bối / Tổ tiên (Ancestors), Hậu duệ (Descendants), Hôn phối (Spouses), Phụ mẫu (Parents).
2. **Mô hình Dữ liệu Khái niệm (Conceptual Data Model):**
   - Thiết kế cấu trúc thực thể `trees`, `persons`, `relationships`.
   - Phân tích và xử lý các ca quan hệ phức tạp:
     - Một người có nhiều vợ/chồng (Hôn phối đa lần).
     - Người chưa rõ cha mẹ (Bán cấu trúc).
     - Phân định quan hệ cha mẹ ruột (Biological) và cha mẹ nuôi (Adoptive - chuẩn bị sẵn ở tầng dữ liệu).
3. **Quy tắc Kiểm tra Tính Toàn vẹn Đồ thị (Graph Invariants):**
   - Xây dựng thuật toán phát hiện chu trình vòng lặp thế hệ (Cycle Detection logic).

---

## 4. Những Điều Phase P02 KHÔNG ĐƯỢC Giả định hoặc Tự Ý Triển khai

- **KHÔNG** tự ý mở rộng phạm vi sản phẩm sang các tính năng đã bị loại bỏ trong [docs/product/out-of-scope.md](../../product/out-of-scope.md) (như xưng hô họ hàng tự động, lịch âm, GEDCOM).
- **KHÔNG** viết code SQL migration hoặc tạo bảng thật trong database (việc này thuộc về Phase P03: Technical Setup).
- **KHÔNG** giả định tất cả người trong cây đều có đầy đủ ngày tháng năm sinh/mất chính xác.

---

## 5. Khuyến nghị Hành động Tiếp theo

1. Project Owner xem xét và phê duyệt hồ sơ Scope Baseline của Phase P01.
2. Maintainer merge nhánh `phase/p01-product-scope` vào `main` trên GitHub sau khi nghiệm thu.
3. Khi khởi tạo Phase P02, tạo nhánh mới `phase/p02-glossary-model` từ `main` và sử dụng khung prompt [`docs/prompts/phase-input-template.md`](../../prompts/phase-input-template.md).
