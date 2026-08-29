# Phase Overview: P03 - Thiết kế UX và Luồng Màn hình (UX Design & Screen Flows)

- **Mã Phase:** `P03`
- **Tên Phase:** Thiết kế UX và luồng màn hình (UX Design & Screen Flows)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE_AWAITING_UX_APPROVAL`
- **Nhánh Git thi công:** `phase/p03-ux-flows-wireframes`
- **Vai trò thi công:** Senior UX Architect, Product Designer, Interaction Designer, Information Architect & Accessibility Reviewer
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase

1. Chuyển hóa toàn bộ phạm vi sản phẩm MVP (P01) và các quy tắc nghiệp vụ phả hệ, DAG invariants (P02) thành cấu trúc trải nghiệm người dùng hoàn chỉnh.
2. Xây dựng Sitemap và Danh mục 25 Màn hình / Lớp giao diện cho phiên bản v0.1.
3. Thiết kế toàn bộ 12 User Flows cốt lõi với sơ đồ Mermaid chi tiết.
4. Xây dựng 10 bộ Wireframe low-fidelity chuẩn trên cả Desktop và Mobile.
5. Thiết kế hệ thống điều hướng Responsive (Top Header Desktop và Bottom Navigation Mobile).
6. Quy chuẩn hóa ngăn kéo đáy Mobile Bottom Sheet 3 nấc.
7. Đặc tả chi tiết Node thành viên, tương tác Canvas đồ thị và Menu thao tác Node.
8. Xây dựng bộ mẫu cảnh báo quan hệ và phân cấp lỗi người dùng dễ hiểu.
9. Danh mục toàn diện các trạng thái Loading, Empty, Error và Xử lý ngày không đầy đủ.
10. Thiết lập tiêu chuẩn Tiếp cận WCAG 2.2 AA và kiểm toán 100% mục tiêu cảm ứng Touch Targets $\ge 44\times 44\text{px}$.
11. Đóng gói hồ sơ bàn giao làm đầu vào cho Phase P04 (Kiến trúc tổng thể), Phase P10 (Design System) và các phase thi công tiếp theo.

---

## 2. Phạm vi Thi công (Scope of Work)

### Trong phạm vi (In-Scope):
- Soạn thảo và hoàn thiện 21 tài liệu trải nghiệm người dùng tại `docs/ux/` (bao gồm thư mục `flows/` và `wireframes/`).
- Hoàn thiện bộ hồ sơ 10 tài liệu phase P03 tại `docs/phases/P03/`.
- Cập nhật nhật ký quyết định và sổ theo dõi rủi ro.

### Ngoài phạm vi (Out-of-Scope):
- Tuyệt đối không viết mã nguồn ứng dụng (Next.js, React, TypeScript, CSS).
- Không tạo database schema vật lý, SQL hay migration.
- Không cấu hình dịch vụ Supabase, Vercel hay Cloudflare.
- Không thực hiện push Git lên remote repository.

---

## 3. Sản phẩm Bàn giao Chính (Key Deliverables)

- **Phân hệ Tài liệu Thiết kế UX:** 21 tài liệu tại `docs/ux/` (Principles, Sitemap, Screen Inventory, Navigation, Responsive, Bottom Sheet, Tree Interactions, Node Spec, Node Menu, Warnings, Danger Patterns, State Catalogue, Form Patterns, Content Guidelines, Touch Audit, A11y Baseline, Traceability, Assumptions, Open Questions).
- **Phân hệ Sơ đồ Luồng Tương tác:** 12 tệp tin flow chi tiết tại `docs/ux/flows/`.
- **Phân hệ Khung dây Giao diện:** 10 tệp tin ASCII wireframe chi tiết tại `docs/ux/wireframes/`.
- **Hồ sơ Nghiệm thu Phase P03:** Bộ 10 tài liệu chuẩn và 3 file issue tracking tại `docs/phases/P03/`.
- **Gói Bàn giao Đầu vào cho Phase Kỹ thuật Kế tiếp:** `docs/phases/P03/09-handover.md`.
