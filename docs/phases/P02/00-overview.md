# Phase Overview: P02 - Phân tích Nghiệp vụ Gia phả (Genealogy Domain Analysis)

- **Mã Phase:** `P02`
- **Tên Phase:** Phân tích nghiệp vụ gia phả (Genealogy Domain Analysis)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE_AWAITING_DOMAIN_APPROVAL`
- **Nhánh Git thi công:** `phase/p02-genealogy-domain-analysis`
- **Vai trò thi công:** Senior Business Analyst, Domain Analyst, Product Domain Expert & Software Architect
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase

1. Xây dựng mô hình nghiệp vụ thống nhất cho GenViet (Domain Model cấp khái niệm).
2. Phân biệt triệt để giữa Tài khoản đăng nhập (`User Account`) và Nhân vật gia phả (`Person`).
3. Định nghĩa chuẩn xác các khái niệm: Cây gia phả, Người trung tâm, Người tạo đầu tiên, Thủy tổ, Mốc số đời.
4. Chốt quy tắc mở rộng cây tự do từ bất kỳ nhân vật nào và liên kết người có sẵn.
5. Quy chuẩn hóa các loại quan hệ: Cha/Mẹ ruột, Cha/Mẹ nuôi, Cha/Mẹ kế, Người giám hộ, Hôn phối đơn/đa lần.
6. Xác lập quy tắc biểu diễn dữ liệu khuyết thiếu, chưa rõ, ước tính hoặc mâu thuẫn.
7. Xây dựng quy tắc xử lý ngày tháng không đầy đủ (chỉ năm, tháng/năm, khoảng thời gian).
8. Quy định cơ chế phát hiện hồ sơ trùng, invariants khi gộp hồ sơ và chính sách xóa mềm an toàn.
9. Xác lập thuật toán/quy tắc tính số đời tương đối theo mốc (Generation Anchor).
10. Thiết lập 20 Domain Invariants bất biến, đặc biệt là cơ chế phát hiện và chặn đứng chu trình vòng lặp (DAG).
11. Phân loại 4 mức độ kiểm tra: `BLOCKING_ERROR`, `WARNING_REQUIRES_CONFIRMATION`, `WARNING`, `INFORMATION`.
12. Xây dựng Bảng thuật ngữ nghiệp vụ song ngữ Việt - Anh (40 thuật ngữ).
13. Xây dựng Bộ 80 Kịch bản kiểm thử quan hệ (Relationship Test Cases) bằng 100% Mock Data.
14. Đóng gói tài liệu bàn giao chất lượng cao làm đầu vào cho Phase P03 (Kiến trúc & Setup) và Phase P04 (Xác thực & RLS).

---

## 2. Phạm vi Thi công (Scope of Work)

### Trong phạm vi (In-Scope):
- Soạn thảo và hoàn thiện 20 tài liệu nghiệp vụ tại `docs/product/domain/`.
- Hoàn thiện bộ hồ sơ 10 tài liệu phase P02 tại `docs/phases/P02/`.
- Cập nhật nhật ký quyết định nghiệp vụ và sổ quản lý rủi ro.

### Ngoài phạm vi (Out-of-Scope):
- Tuyệt đối không viết code ứng dụng Next.js / React / TypeScript.
- Không thiết kế database schema vật lý hoặc viết SQL migration.
- Không cấu hình hạ tầng Vercel / Supabase / Cloudflare.
- Không thực hiện thao tác push Git lên remote repository.

---

## 3. Sản phẩm Bàn giao Chính (Key Deliverables)

- **Phân hệ Tài liệu Phân tích Nghiệp vụ Gia phả:** 20 tài liệu tại `docs/product/domain/` (Overview, Identity, Concepts, Model, Relationships, Rules, Matrix, Uncertain, Dates, Expansion, Merge, Deletion, Generation, Invariants, Severities, Glossary, Test Scenarios, Traceability, Assumptions, Open Questions).
- **Hồ sơ Nghiệm thu Phase P02:** Bộ 10 tài liệu chuẩn và 3 file issue tracking tại `docs/phases/P02/`.
- **Gói Bàn giao Đầu vào cho Phase P03 & P04:** `docs/phases/P02/09-handover.md`.
