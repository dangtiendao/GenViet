# Phase Overview: P01 - Chốt Phạm vi Sản phẩm (Product Scope Definition)

- **Mã Phase:** `P01`
- **Tên Phase:** Chốt phạm vi sản phẩm (Product Scope Definition)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE_AWAITING_PRODUCT_APPROVAL`
- **Nhánh Git thi công:** `phase/p01-product-scope`
- **Vai trò thi công:** Senior Product Manager, Product Analyst, Business Analyst & Technical Product Owner
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase

1. Chuyển hóa tầm nhìn ban đầu của GenViet thành bộ yêu cầu sản phẩm (PRD) rõ ràng, khả thi.
2. Xác định chính xác 4 nhóm người dùng mục tiêu, ưu tiên người lập phả cá nhân (`USR-001`).
3. Xác định và phân tích 6 vấn đề cốt lõi (`PROB-001` - `PROB-006`) và giả thuyết sản phẩm.
4. Chốt danh mục 24 Use Cases và luồng giá trị cốt lõi (Core Value Flow).
5. Phân định rõ 12 nhóm chức năng Must-have và 30 hạng mục Out-of-Scope để chống Scope Creep.
6. Xác lập ràng buộc quy mô (1.000 người/cây), chính sách thiết bị (Desktop & Smartphone) và trình duyệt.
7. Ban hành nguyên tắc quyền riêng tư mặc định (Privacy by Default).
8. Xây dựng danh mục User Stories theo 9 Epics (A-I) và Acceptance Criteria chuẩn Given-When-Then.
9. Thiết lập phân loại MoSCoW và Scope Baseline v0.1 làm nguồn sự thật.
10. Đóng gói tài liệu bàn giao chất lượng cao làm đầu vào cho Phase P02 (Thuật ngữ & Mô hình dữ liệu).

---

## 2. Phạm vi Thi công (Scope of Work)

### Trong phạm vi (In-Scope):
- Soạn thảo và chuẩn hóa toàn bộ 15 tài liệu sản phẩm trong [`docs/product/`](../../product/README.md).
- Hoàn thiện bộ hồ sơ 10 tài liệu phase P01 trong `docs/phases/P01/`.
- Cập nhật nhật ký quyết định sản phẩm và sổ quản lý rủi ro.

### Ngoài phạm vi (Out-of-Scope):
- Tuyệt đối không viết code ứng dụng Next.js / React / TypeScript.
- Không thiết kế database schema hoặc viết SQL migration.
- Không cấu hình hạ tầng Vercel / Supabase / Cloudflare.
- Không thiết kế chi tiết quy tắc xưng hô gia tộc phức tạp (dành cho Phase P02).
- Không thực hiện thao tác push Git lên remote repository.

---

## 3. Sản phẩm Bàn giao Chính (Key Deliverables)

- **Bộ tài liệu Yêu cầu Sản phẩm hoàn chỉnh:** 15 tài liệu tại `docs/product/` (Vision, Users, Problems, Use cases, Flow, MVP scope, Out of scope, Constraints, Privacy, Metrics, Stories, AC, MoSCoW, Baseline, PRD, Traceability).
- **Hồ sơ Nghiệm thu Phase P01:** Bộ 10 tài liệu chuẩn và 3 file issue tracking tại `docs/phases/P01/`.
- **Gói Bàn giao Đầu vào cho Phase P02:** `docs/phases/P01/09-handover.md`.
