# Tài liệu Phân tích Nghiệp vụ Gia phả GenViet (Domain Documentation)

Thư mục này chứa toàn bộ các tài liệu phân tích nghiệp vụ, mô hình dữ liệu khái niệm, hệ thống quy tắc phả học, bảng thuật ngữ, ma trận quan hệ, bộ bất biến đồ thị và kịch bản kiểm thử của dự án **GenViet (v0.1)**.

---

## 1. Bản đồ Chỉ mục Tài liệu Phân tích Nghiệp vụ

| Tên tài liệu | Mã tài liệu | Mục đích sử dụng |
| :--- | :--- | :--- |
| 📖 **[Tổng quan Nghiệp vụ](./domain-overview.md)** | `DOM-OVERVIEW-01` | Tuyên bố sứ mệnh phả học, 4 thực thể cốt lõi và các nguyên tắc bất biến. |
| 👤 **[Mô hình Định danh User & Person](./identity-model.md)** | `DOM-IDENTITY-01` | 10 quy tắc tách biệt triệt để Tài khoản người dùng vs Nhân vật gia phả. |
| 🌳 **[Khái niệm Cây Gia phả & Người Mốc](./family-tree-concepts.md)** | `DOM-TREE-01` | Cây gia phả, Người trung tâm, Người tạo đầu tiên, Thủy tổ, Mốc số đời. |
| 📐 **[Mô hình Dữ liệu Khái niệm](./domain-model.md)** | `DOM-MODEL-01` | Sơ đồ ERD khái niệm, thuộc tính thực thể, quan hệ nguồn vs quan hệ suy ra. |
| 🔗 **[Mô hình Các Loại Quan hệ](./relationship-model.md)** | `DOM-RELMODEL-01` | Phụ mẫu - Tử tức, Cha mẹ nuôi, Cha mẹ kế, Giám hộ, Hôn phối. |
| ⚖️ **[Bộ Quy tắc Quan hệ Phả hệ](./relationship-rules.md)** | `DOM-RELRULES-01` | Quy tắc tạo/sửa/xóa quan hệ, đa hôn phối, bảo toàn con cái khi ly hôn. |
| 🔲 **[Ma trận Tương thích Quan hệ](./relationship-matrix.md)** | `DOM-RELMATRIX-01` | Ma trận 2D kiểm tra khả năng thiết lập đồng thời nhiều loại quan hệ. |
| ❓ **[Dữ liệu Thiếu, Chưa xác minh & Mâu thuẫn](./uncertain-data-rules.md)** | `DOM-UNCERTAIN-01` | Xử lý khuyết phụ mẫu, 4 trạng thái xác minh, mâu thuẫn dữ liệu lịch sử. |
| 📅 **[Ngày tháng Không đầy đủ & Ước tính](./partial-date-rules.md)** | `DOM-DATE-01` | 7 cấp độ chính xác, cấm điền `01/01` giả, xử lý đã mất không rõ ngày mất. |
| ⬆️ **[Mở rộng Tổ tiên & Liên kết Hồ sơ](./domain-rules.md)** | `DOM-RULES-01` | Mở rộng cây tự do từ node bất kỳ, quy tắc liên kết người có sẵn trong cây. |
| 👥 **[Phát hiện Trùng lặp & Gộp Hồ sơ](./duplicate-and-merge-rules.md)** | `DOM-DUPMERGE-01` | 3 mức độ trùng lặp, các bất biến toán học khi gộp hồ sơ an toàn. |
| 🗑️ **[Quy tắc Xóa mềm & Khôi phục](./deletion-rules.md)** | `DOM-DELETION-01` | Xóa mềm, cấm xóa lan truyền, preview ảnh hưởng, khôi phục an toàn. |
| 🔢 **[Quy tắc Tính Thế hệ & Số Đời](./generation-rules.md)** | `DOM-GEN-01` | Thuật toán tính số đời tương đối theo Anchor, xử lý tiền bối và xung đột. |
| 🛡️ **[20 Domain Invariants Bất biến](./invariants.md)** | `DOM-INVARIANTS-01` | 20 bất biến cốt lõi, cơ chế phát hiện và chặn đứng chu trình vòng lặp (DAG). |
| 🚨 **[Danh mục Phân cấp Lỗi & Cảnh báo](./validation-severity-catalogue.md)** | `DOM-SEVERITY-01` | 8 mã lỗi Blocking (`ERR-001..008`), 7 mã Warning (`WARN-001..007`), Info. |
| 📚 **[Bảng Thuật ngữ Song ngữ Chuẩn](./glossary.md)** | `DOM-GLOSSARY-01` | 40 thuật ngữ phả hệ Việt - Anh chuẩn mực, tránh nhầm lẫn Person vs Node. |
| 🧪 **[Bộ 80 Kịch bản Kiểm thử Quan hệ](./relationship-test-cases.md)** | `DOM-TESTCASES-01` | 80 test cases bằng 100% Mock Data bao phủ toàn bộ các nhóm nghiệp vụ. |
| 🔗 **[Ma trận Truy vết Toàn diện](./domain-traceability-matrix.md)** | `DOM-TRACE-01` | Kết nối P01 Objective $\rightarrow$ UC $\rightarrow$ US $\rightarrow$ AC $\rightarrow$ P02 Concept $\rightarrow$ Rule $\rightarrow$ Invariant $\rightarrow$ RTC $\rightarrow$ Phase. |
| 💡 **[Danh mục Giả định Nghiệp vụ](./assumptions.md)** | `DOM-ASSUMPTIONS-01` | Tổng hợp các giả định nghiệp vụ được áp dụng cho v0.1. |
| ❓ **[Danh mục Câu hỏi Mở](./open-questions.md)** | `DOM-OPENQUESTIONS-01` | Các vấn đề cần Project Owner xem xét và phê duyệt. |

---

## 2. Ý nghĩa đối với các Phase Kỹ thuật Kế tiếp

- **Phase P03 (Kiến trúc & Setup Kỹ thuật):** Sử dụng các thuộc tính trong `domain-model.md` và `partial-date-rules.md` để thiết kế schema CSDL PostgreSQL và TypeScript interfaces.
- **Phase P04 (Xác thực & RLS):** Áp dụng nguyên tắc độc lập User/Person trong `identity-model.md` và ranh giới cây trong `family-tree-concepts.md` để cấu hình Supabase Auth và Row Level Security.
- **Phase P05 & P06 (CRUD & Visualization):** Áp dụng bộ quy tắc mở rộng cây, tính số đời và cơ chế chống chu trình trong `domain-rules.md`, `generation-rules.md` và `invariants.md`.
