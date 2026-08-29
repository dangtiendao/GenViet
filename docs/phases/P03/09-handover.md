# Tài liệu Bàn giao: Phase P03 sang các Phase Kỹ thuật (Phase Handover - Cổng G7)

- **Phase Bàn giao:** `P03: Thiết kế UX và luồng màn hình (UX Design & Screen Flows)` - Trạng thái: `IMPLEMENTATION_COMPLETE_AWAITING_UX_APPROVAL`
- **Phase Tiếp nhận 1:** `P04: Kiến trúc hệ thống tổng thể (System Architecture)` - Trạng thái: `NOT_STARTED`
- **Phase Tiếp nhận 2:** `P10: Design System & Responsive Shell` - Trạng thái: `NOT_STARTED`
- **Phase Tiếp nhận 3:** `P15: Visualization Engine & Tree View (React Flow)` - Trạng thái: `NOT_STARTED`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Senior UX Architect & Accessibility Reviewer (P03)

---

## 1. Gói Bàn giao cho Phase P04 (Kiến trúc Tổng thể)

1. **Danh mục Màn hình & Ranh giới Module:** Căn cứ vào [`screen-inventory.md`](../../ux/screen-inventory.md) để thiết kế cấu trúc Route Next.js App Router tương ứng.
2. **Yêu cầu Phục hồi & Trạng thái UI:** Căn cứ vào [`state-catalogue.md`](../../ux/state-catalogue.md) để thiết kế Error Boundary, React Suspense và cơ chế State Management.
3. **Cấu trúc Dữ liệu Sao lưu JSON:** Căn cứ vào [`flows/backup.md`](../../ux/flows/backup.md) để thiết kế API Export an toàn.

---

## 2. Gói Bàn giao cho Phase P10 (Design System & Responsive Shell)

1. **Khung Giao diện Điều hướng:** Triển khai Top Header Desktop và Bottom Navigation Mobile theo [`navigation-model.md`](../../ux/navigation-model.md).
2. **Mẫu Biểu mẫu & Form Controls:** Xây dựng Form Component hỗ trợ Date Precision và Inline Validation theo [`form-patterns.md`](../../ux/form-patterns.md).
3. **Bộ Component Hộp thoại & Bottom Sheet:** Xây dựng Bottom Sheet 3 nấc (Peek, Half, Full) theo [`mobile-bottom-sheet.md`](../../ux/mobile-bottom-sheet.md).
4. **Tiêu chuẩn Khả năng Tiếp cận:** Áp dụng kích thước Touch Target $\ge 44\times 44\text{px}$ và Focus Outline `3px` theo [`accessibility-baseline.md`](../../ux/accessibility-baseline.md).

---

## 3. Gói Bàn giao cho Phase P15 (Tree View & React Flow)

1. **Quy chuẩn Node Thành viên:** Triển khai Custom Node React Flow kích thước `220x90px` theo [`person-node-spec.md`](../../ux/person-node-spec.md).
2. **Tương tác Canvas:** Tích hợp bộ nút điều khiển nổi (Pan, Zoom, Fit view, Center Focus) theo [`tree-interaction-spec.md`](../../ux/tree-interaction-spec.md).
3. **Menu Thao tác Node:** Triển khai Context Menu / Bottom Sheet thao tác theo [`node-action-menu.md`](../../ux/node-action-menu.md).

---

## 4. Những Điều các Phase Kỹ thuật KHÔNG ĐƯỢC Giả định

- **KHÔNG** ép người dùng chọn ngày `01/01` giả khi họ chỉ nhớ năm sinh.
- **KHÔNG** dùng cascade delete xóa luôn người thân khi người dùng bấm xóa 1 thành viên.
- **KHÔNG** đưa các thông báo kỹ thuật (`DAG Cycle`, `RPC Error`, `UUID`) lên giao diện người dùng.
- **KHÔNG** tự ý thay đổi phạm vi sang các tính năng ngoài v0.1.

---

## 5. Khuyến nghị Hành động Tiếp theo

1. Project Owner xem xét và phê duyệt các quyết định UX và câu hỏi mở trong Phase P03.
2. Maintainer merge nhánh `phase/p03-ux-flows-wireframes` vào `master` trên GitHub sau khi nghiệm thu.
3. Khởi tạo Phase P04 trên nhánh mới `phase/p04-system-architecture` từ `master`.
