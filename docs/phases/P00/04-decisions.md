# Nhật ký Quyết định: Phase P00 (Phase Decisions)

Tài liệu này ghi nhận các quyết định kỹ thuật và kiến trúc được đưa ra trong quá trình thi công Phase P00.

---

## 1. Danh sách Quyết định trong Phase P00

### DEC-P00-01: Cấu trúc Thư mục Tài liệu Module hóa
- **Trạng thái:** `ACCEPTED`
- **Bối cảnh:** Cần tổ chức tài liệu dự án để cả kỹ sư con người và AI Agents đều dễ dàng tra cứu mà không bị tràn ngữ cảnh (context window).
- **Quyết định:** Phân tách tài liệu thành các thư mục chuyên môn riêng (`product/`, `architecture/`, `database/`, `security/`, `testing/`, `operations/`, `phases/`, `decisions/`, `risks/`, `prompts/`, `templates/`). Mỗi thư mục có file `README.md` điều hướng.
- **Hệ quả:** Cấu trúc rõ ràng, dễ bảo trì, AI có thể đọc đúng file cần thiết mà không phải tải toàn bộ tài liệu dự án.

### DEC-P00-02: Quy chuẩn Conventional Commits có Scope Phase
- **Trạng thái:** `ACCEPTED`
- **Bối cảnh:** Cần theo dõi chính xác các commit thuộc về giai đoạn nào trong lịch sử Git.
- **Quyết định:** Bắt buộc áp dụng định dạng `<type>(PXX): <mô tả ngắn>` cho toàn bộ commit của dự án.
- **Hệ quả:** Dễ dàng lọc commit theo phase, hỗ trợ xuất changelog tự động chính xác.

### DEC-P00-03: Ràng buộc Tuyệt đối Không Push/Merge bằng AI
- **Trạng thái:** `ACCEPTED`
- **Bối cảnh:** Đảm bảo an toàn tuyệt đối cho repository từ xa và nhánh chính `main`.
- **Quyết định:** AI chỉ được phép thao tác cục bộ trên nhánh phase. Toàn bộ hành vi push, merge, tạo PR và tạo release bắt buộc do con người (Project Owner / Lead Maintainer) thực hiện.
- **Hệ quả:** Loại bỏ hoàn toàn rủi ro AI ghi đè dữ liệu hoặc xung đột mã nguồn trên GitHub.
