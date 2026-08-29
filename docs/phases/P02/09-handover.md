# Tài liệu Bàn giao: Phase P02 sang Phase P03 & P04 (Phase Handover - Cổng G7)

- **Phase Bàn giao:** `P02: Phân tích nghiệp vụ gia phả (Genealogy Domain Analysis)` - Trạng thái: `IMPLEMENTATION_COMPLETE_AWAITING_DOMAIN_APPROVAL`
- **Phase Tiếp nhận 1:** `P03: Thiết kế kiến trúc & Setup kỹ thuật (Architecture & Technical Setup)` - Trạng thái: `NOT_STARTED`
- **Phase Tiếp nhận 2:** `P04: Xác thực & Quản lý người dùng (Authentication & RLS)` - Trạng thái: `NOT_STARTED`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Senior Business Analyst & Software Architect (P02)

---

## 1. Gói Bàn giao cho Phase P03 (Kiến trúc, CSDL & Technical Setup)

Phase P03 chịu trách nhiệm chuyển hóa mô hình khái niệm thành kiến trúc kỹ thuật và schema PostgreSQL. Đội ngũ P03 bắt buộc phải tiếp nhận:

1. **Thuộc tính Thực thể CSDL:** Áp dụng các trường dữ liệu khái niệm trong [`domain-model.md`](../../product/domain/domain-model.md) cho các bảng `trees`, `persons`, `relationships`.
2. **Cấu trúc Lưu trữ Ngày tháng Phức hợp:** Thiết kế schema hỗ trợ 7 cấp độ chính xác ngày tháng trong [`partial-date-rules.md`](../../product/domain/partial-date-rules.md) (lưu giá trị ngày và mã `precision`).
3. **Thuật toán Chống Chu trình ở Tầng Kỹ thuật:** Chuẩn bị các hàm kiểm tra chu trình (Cycle Detection CTE / Stored Procedure) theo quy tắc bất biến [`invariants.md`](../../product/domain/invariants.md) (`INV-004`).
4. **Mã lỗi & Trạng thái Validation:** Áp dụng hệ thống mã lỗi chuẩn hóa trong [`validation-severity-catalogue.md`](../../product/domain/validation-severity-catalogue.md) (`ERR-001..008`, `WARN-001..007`).
5. **Cấu trúc JSON Backup:** Thiết kế schema export JSON theo đúng cấu trúc dữ liệu phả hệ chuẩn.

---

## 2. Gói Bàn giao cho Phase P04 (Xác thực & Phân quyền RLS)

Phase P04 chịu trách nhiệm xây dựng tầng đăng nhập và chính sách bảo mật Row Level Security. Đội ngũ P04 bắt buộc phải tiếp nhận:

1. **Nguyên tắc Tách biệt User và Person:** Tuân thủ triệt để 10 quy tắc trong [`identity-model.md`](../../product/domain/identity-model.md); cấm lưu thông tin đăng nhập trong bảng `persons`.
2. **Ranh giới Cây Gia phả (Tree Isolation Boundary):** Cấu hình chính sách RLS theo `tree_id` và `owner_user_id` dựa trên [`family-tree-concepts.md`](../../product/domain/family-tree-concepts.md), đảm bảo không bao giờ có rò rỉ dữ liệu giữa các cây.
3. **Thao tác Xóa An toàn:** Thiết lập chính sách RLS cho phép đánh dấu xóa mềm (`is_deleted = true`) mà không vi phạm quyền sở hữu.

---

## 3. Những Điều Phase P03 và P04 KHÔNG ĐƯỢC Giả định

- **KHÔNG** giả định Person là User (Không bắt buộc Person có email).
- **KHÔNG** ép kiểu ngày tháng sang format ngày chính xác tuyệt đối mà mất đi trường `precision`.
- **KHÔNG** dùng cascade delete vật lý ở tầng CSDL làm mất dữ liệu người thân khi xóa 1 người.
- **KHÔNG** tự ý mở rộng sang các tính năng đã bị loại bỏ trong [docs/product/out-of-scope.md](../../product/out-of-scope.md).

---

## 4. Khuyến nghị Hành động Tiếp theo

1. Project Owner xem xét và phê duyệt các quyết định nghiệp vụ và câu hỏi mở trong Phase P02.
2. Maintainer merge nhánh `phase/p02-genealogy-domain-analysis` vào `master` trên GitHub sau khi nghiệm thu.
3. Khởi tạo Phase P03 trên nhánh mới `phase/p03-architecture-setup` từ `master` và tiếp tục thi công.
