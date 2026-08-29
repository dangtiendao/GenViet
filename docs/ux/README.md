# Tài liệu Thiết kế Trải nghiệm Người dùng GenViet (UX Documentation)

Thư mục này chứa toàn bộ hệ thống tài liệu đặc tả trải nghiệm người dùng, kiến trúc thông tin, sơ đồ luồng thao tác, quy chuẩn tương tác node cây, phân cấp lỗi và wireframes của dự án **GenViet (v0.1)**.

---

## 1. Bản đồ Chỉ mục Tài liệu UX

| Tên tài liệu | Mã tài liệu | Mục đích sử dụng |
| :--- | :--- | :--- |
| 🎯 **[Nguyên tắc Thiết kế UX](./ux-principles.md)** | `UX-PRINCIPLES-01` | 10 nguyên tắc vàng định hướng trải nghiệm người dùng GenViet. |
| 🗺️ **[Sơ đồ Cấu trúc Trang (Sitemap)](./sitemap.md)** | `UX-SITEMAP-01` | Sơ đồ cây phân cấp toàn bộ màn hình và lớp giao diện v0.1. |
| 📋 **[Danh mục Màn hình (Screen Inventory)](./screen-inventory.md)** | `UX-INVENTORY-01` | Danh mục 25 màn hình và overlay kèm mục tiêu, actor, actions. |
| 🧭 **[Mô hình Điều hướng](./navigation-model.md)** | `UX-NAVMODEL-01` | Cấu trúc Top Header Desktop và Bottom Navigation Mobile. |
| 📱 **[Hành vi Thích ứng Responsive](./responsive-behavior.md)** | `UX-RESPONSIVE-01` | Quy tắc thích ứng trên Mobile ($<768\text{px}$), Tablet và Desktop. |
| 📑 **[Ngăn kéo Đáy Mobile (Bottom Sheet)](./mobile-bottom-sheet.md)** | `UX-SHEET-01` | Quy chuẩn 3 nấc Peek, Half, Full và cử chỉ vuốt an toàn. |
| 🌳 **[Quy chuẩn Tương tác Cây](./tree-interaction-spec.md)** | `UX-TREEINTERACTION-01` | Pan, Zoom, Center Focus và thanh công cụ điều khiển nổi. |
| 👤 **[Quy chuẩn Node Thành viên](./person-node-spec.md)** | `UX-NODE-01` | Kích thước `220x90px`, cấu trúc hiển thị và các trạng thái node. |
| ⚡ **[Menu Thao tác Node](./node-action-menu.md)** | `UX-NODEMENU-01` | 3 nhóm hành động: Điều hướng, Thêm quan hệ và Thao tác nguy hiểm. |
| ⚠️ **[Mẫu Cảnh báo Quan hệ](./relationship-warning-patterns.md)** | `UX-PATTERNS-REL-01` | Phân cấp Lỗi Chặn (`ERR`), Cảnh báo (`WARN`), Thông tin (`INFO`). |
| 🛡️ **[Xác nhận Thao tác Nguy hiểm](./dangerous-action-patterns.md)** | `UX-PATTERNS-DANGER-01` | Hộp thoại xác nhận xóa mềm, đổi mốc đời và cảnh báo chưa lưu. |
| 📊 **[Danh mục Trạng thái (Loading, Empty, Error)](./state-catalogue.md)** | `UX-STATES-01` | Ma trận trạng thái Loading Skeleton, Empty State và Error Recovery. |
| 📝 **[Mẫu Biểu mẫu & Nhập liệu](./form-patterns.md)** | `UX-PATTERNS-FORM-01` | Nhập ngày tháng Date Precision, 2 Tab thêm người, Inline validation. |
| ✍️ **[Hướng dẫn Văn phong & Nội dung](./content-guidelines.md)** | `UX-CONTENT-01` | Từ ngữ chuẩn mực phả học Việt Nam, không dùng thuật ngữ kỹ thuật. |
| 👆 **[Kiểm toán Kích thước Cảm ứng](./touch-target-audit.md)** | `UX-AUDIT-TOUCH-01` | Đánh giá 100% mục tiêu touch đạt chuẩn $\ge 44\times 44\text{px}$. |
| ♿ **[Tiêu chuẩn Tiếp cận Nền tảng (A11y)](./accessibility-baseline.md)** | `UX-A11Y-BASELINE-01` | Định hướng WCAG 2.2 AA, điều hướng bàn phím và giải pháp Screen Reader. |
| 🔗 **[Ma trận Truy vết UX](./ux-traceability-matrix.md)** | `UX-TRACE-01` | Ma trận liên kết P01 Objective $\rightarrow$ UC $\rightarrow$ US $\rightarrow$ P02 Rule $\rightarrow$ P03 Flow $\rightarrow$ Screen. |
| 💡 **[Danh mục Giả định UX](./assumptions.md)** | `UX-ASSUMPTIONS-01` | Tổng hợp các giả định trải nghiệm người dùng áp dụng cho v0.1. |
| ❓ **[Danh mục Câu hỏi Mở UX](./open-questions.md)** | `UX-OPENQUESTIONS-01` | 5 câu hỏi mở chờ Project Owner phê duyệt. |

---

## 2. Thư mục Con Chuyên đề

- 🔄 **[`flows/`](./flows/authentication.md):** Chứa 12 luồng tương tác chi tiết có sơ đồ Mermaid (Auth, Setup, Add Relations, Edit, Delete, Search, Center, Backup).
- 📐 **[`wireframes/`](./wireframes/README.md):** Chứa 10 bộ wireframe ASCII low-fidelity trực quan cho toàn bộ các màn hình cốt lõi.
