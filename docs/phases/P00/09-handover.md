# Tài liệu Bàn giao: Phase P00 sang Phase P01 (Phase Handover - Cổng G7)

- **Phase Bàn giao:** `P00: Quản trị dự án (Project Governance)` - Trạng thái: `ACCEPTED`
- **Phase Tiếp nhận:** `P01: Yêu cầu sản phẩm (PRD & MVP Scope)` - Trạng thái: `NOT_STARTED`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Senior Technical Lead / AI Agent (P00)
- **Người tiếp nhận:** Product Lead / AI Agent (P01)

---

## 1. Danh mục Tài liệu Bắt buộc Phase P01 Phải Đọc

Trước khi mở Phase P01 tại Cổng G0, đội ngũ thi công / AI của Phase P01 bắt buộc phải đọc kỹ các tài liệu nền tảng sau:

1. **[Project Charter](../../project-charter.md):** Nắm vững tầm nhìn, người dùng mục tiêu, phạm vi tổng thể và nguyên tắc chi phí thấp.
2. **[Phase Lifecycle](../../phase-lifecycle.md):** Tuân thủ quy trình 8 cổng kiểm soát (G0 đến G7) và cấu trúc 10 tài liệu phase.
3. **[Definition of Ready](../../definition-of-ready.md)** & **[Definition of Done](../../definition-of-done.md):** Điều kiện mở và đóng phase.
4. **[Git Workflow](../../git-workflow.md)** & **[Contributing Guide](../../../CONTRIBUTING.md):** Quy tắc tạo nhánh `phase/p01-requirements-prd` và commit message `feat(P01):...` / `docs(P01):...`.
5. **[Quy tắc Bảo mật](../../security/project-security-rules.md)** & **[AI Working Agreement](../../ai-working-agreement.md):** Tuyệt đối không push Git, không lộ secret, không dùng dữ liệu người thật.

---

## 2. Các Quyết định Đã Khóa (Locked Decisions P01 Phải Tuân thủ)

Phase P01 bắt buộc phải xây dựng tài liệu PRD dựa trên các quyết định đã khóa sau (không được tự ý thay đổi):
- **DEC-001:** Tên sản phẩm chính thức là **GenViet**.
- **DEC-002:** Nguồn dữ liệu nghiệp vụ chính là **PostgreSQL**.
- **DEC-003:** **Tài khoản người dùng (User Account)** và **Nhân vật gia phả (Person)** là 2 thực thể độc lập.
- **DEC-005:** Thiết kế sản phẩm độc lập nhà cung cấp (Vendor-neutral), không phụ thuộc tính năng độc quyền đắt đỏ của Vercel.
- **DEC-008:** Giao diện dựng cây gia phả dựa trên **React Flow** kết hợp thuật toán phân tầng **ELK.js**.

---

## 3. Các Câu hỏi Mở & Rủi ro Cần Lưu ý trong Phase P01

1. **OPEN-DEC-01 (Giấy phép bản quyền - License):** Tiếp tục theo dõi, chưa cần chốt ngay trong P01.
2. **RISK-001 (Scope Creep):** P01 phải kiên quyết giới hạn phạm vi MVP:
   - Tập trung vào: Tạo cây, thêm sửa xóa nhân vật, thiết lập quan hệ gia phả cơ bản (Cha-Mẹ-Con, Vợ-Chồng), hiển thị đồ thị tương tác.
   - Hoãn sang Post-MVP: Mạng xã hội dòng họ, quỹ gia tộc, chat trực tuyến, phân tích AI ADN.

---

## 4. Ranh giới Phạm vi & Những điều P01 KHÔNG ĐƯỢC Tự Suy diễn

- **Được làm:**
  - Định nghĩa User Personas, User Journeys, Functional & Non-Functional Requirements.
  - Viết tài liệu `docs/product/prd-mvp.md`.
  - Tạo hồ sơ phase `docs/phases/P01/` sử dụng các template trong `docs/templates/`.
- **Tuyệt đối KHÔNG được làm:**
  - Không viết code ứng dụng Next.js hoặc tạo component UI trong P01 (P01 chỉ là phase Product Requirements).
  - Không tự suy diễn các quy tắc xưng hô gia tộc phức tạp (việc này thuộc về Phase P02: Glossary & Model Design).
  - Không tự ý thay đổi các quyết định đã khóa.
  - Không push code lên GitHub.

---

## 5. Khuyến nghị Hành động Tiếp theo cho Phase P01

1. Maintainer kiểm tra và merge nhánh `phase/p00-project-governance` vào `main` trên GitHub.
2. Khi bắt đầu Phase P01, tạo nhánh mới: `phase/p01-requirements-prd` từ `main`.
3. Sử dụng khung prompt `docs/prompts/phase-input-template.md` để khởi tạo Phase P01 tại Cổng G0.
