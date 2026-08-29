# Quy chuẩn Quản lý & Soạn thảo Tài liệu (Documentation Guidelines)

Tài liệu là tài sản cốt lõi hạng nhất của dự án **GenViet**, đóng vai trò là "Hợp đồng kỹ thuật" và cung cấp ngữ cảnh chuẩn xác cho con người và AI Agents làm việc độc lập. Tài liệu này quy định các tiêu chuẩn bắt buộc khi tạo mới, chỉnh sửa và duy trì tài liệu trong repository.

---

## 1. Nguyên tắc Quản lý Tài liệu Cốt lõi

1. **Định dạng mặc định là Markdown (GitHub Flavored Markdown - GFM):** Toàn bộ tài liệu kỹ thuật, hướng dẫn, kế hoạch và biên bản phải được viết bằng `.md`.
2. **Nguồn Chân lý Duy nhất (Single Source of Truth - SSOT):** Không sao chép các đoạn văn bản dài giữa nhiều tài liệu. Khi cần tham chiếu thông tin, sử dụng liên kết Markdown tương đối trỏ về tài liệu gốc.
3. **Mục đích rõ ràng (Clear Purpose):** Mọi tài liệu phải bắt đầu bằng tiêu đề cấp 1 (`#`) và một đoạn mô tả ngắn gọn về mục đích, đối tượng độc giả và phạm vi của file.
4. **Trạng thái & Ngày cập nhật (Status & Timestamp):** Các tài liệu chính sách, kế hoạch, ADR, Phase phải có phần metadata đầu file ghi rõ mã định danh, ngày ban hành và trạng thái (`DRAFT`, `ACCEPTED`, `SUPERSEDED`...).
5. **Cấm Placeholder vô nghĩa:** Không để các thẻ `TODO` hoặc `Chưa rõ` một cách lơ lửng. Mọi hạng mục chưa hoàn thiện phải gắn liền với mã Task (`PXX-TYY`), mã Bug (`PXX-BUG-NNN`) hoặc ghi nhận hoãn có kiểm soát (`DEFERRED`).
6. **Không xóa tài liệu cũ có giá trị lịch sử:** Thay vì xóa các bản ghi quyết định hoặc kế hoạch cũ, hãy đánh dấu trạng thái `SUPERSEDED` và thêm liên kết trỏ đến tài liệu thay thế mới.

---

## 2. Quy chuẩn Đặt tên File & Cấu trúc Thư mục

1. **Quy tắc Kebab-case:** Tất cả tên thư mục và tên file tài liệu phải dùng chữ thường phân cách bằng dấu gạch nối (ví dụ: `project-security-rules.md`, `git-workflow.md`).
2. **Ngoại lệ cho File Phase & Quy ước Công cụ:**
   - Thư mục Phase dùng chữ hoa: `docs/phases/P00/`, `docs/phases/P01/`...
   - File trong Phase bắt buộc có tiền tố số thứ tự 2 chữ số:
     - `00-overview.md`
     - `01-input-readiness.md`
     - `02-plan.md`
     - `03-task-breakdown.md`
     - `04-decisions.md`
     - `05-test-plan.md`
     - `06-review.md`
     - `07-re-review.md`
     - `08-summary.md`
     - `09-handover.md`
   - File tiêu chuẩn repository: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`.

---

## 3. Quy chuẩn Liên kết Nội bộ (Relative Links)

- Tất cả liên kết giữa các file tài liệu trong repository **bắt buộc phải dùng đường dẫn tương đối** (Relative Path), không dùng đường dẫn tuyệt đối hoặc link URL web cố định.
- **Ví dụ đúng:** `[Xem quy tắc Git](../git-workflow.md)`, `[Sổ rủi ro](../../risks/risk-register.md)`
- **Ví dụ sai:** `[Xem Git](C:\Project\GenViet\docs\git-workflow.md)`, `[Xem Git](https://github.com/dangtiendao/GenViet/blob/main/docs/git-workflow.md)`

---

## 4. Chuẩn hóa Thuật ngữ (Terminology & Glossary)

- Khi Phase P02 hoàn tất, một bộ thuật ngữ chuẩn (Glossary) sẽ được ban hành tại `docs/glossary.md`.
- Toàn bộ tài liệu sau đó phải nhất quán trong cách dịch và sử dụng thuật ngữ tiếng Việt / tiếng Anh (ví dụ: Phả ký, Cây gia phả, Thế hệ, Hậu duệ, Chi / Nhánh dòng họ).

---

## 5. Quy trình Cập nhật Tài liệu khi Thay đổi Contract

- Khi có sự thay đổi về API, Schema Database, biến môi trường hoặc luồng nghiệp vụ:
  1. Cập nhật tài liệu thiết kế gốc trước hoặc đồng thời với commit mã nguồn.
  2. Rà soát và cập nhật các tài liệu phụ thuộc liên quan.
  3. Ghi chú sự thay đổi trong `CHANGELOG.md`.
