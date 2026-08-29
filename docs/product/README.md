# Tài liệu Sản phẩm GenViet (Product Documentation)

Thư mục này chứa toàn bộ các tài liệu đặc tả yêu cầu sản phẩm, định hướng tầm nhìn, chân dung người dùng, danh mục use case, user story, tiêu chí nghiệm thu và chuẩn phạm vi phát hành của dự án **GenViet (v0.1)**.

---

## 1. Bản đồ Chỉ mục Tài liệu Sản phẩm

| Tên tài liệu | Mã tài liệu | Mục đích sử dụng |
| :--- | :--- | :--- |
| 🎯 **[Tầm nhìn & Mục tiêu Sản phẩm](./vision.md)** | `PROD-VISION-01` | Tầm nhìn, 7 mục tiêu định lượng (`OBJ-001` - `OBJ-007`), nguyên tắc MVP. |
| 👥 **[Chân dung Người dùng](./target-users.md)** | `PROD-USERS-01` | Phân định User Account vs Person Node, 4 chân dung người dùng (`USR-001` - `USR-004`). |
| ❓ **[Tuyên bố Vấn đề & Giả thuyết](./problem-statement.md)** | `PROD-PROBLEM-01` | 6 vấn đề cốt lõi (`PROB-001` - `PROB-006`) và giả thuyết sản phẩm. |
| 🔄 **[Luồng Giá trị Cốt lõi](./core-value-flow.md)** | `PROD-FLOW-01` | Luồng 7 bước từ Đăng ký $\rightarrow$ Xuất sao lưu JSON, định nghĩa First Value & Core Value. |
| 📋 **[Danh mục 24 Use Cases](./use-cases.md)** | `PROD-USECASE-01` | Danh mục 24 use cases (`UC-001` - `UC-024`) có đầy đủ Preconditions, Flow, Outcome. |
| 📦 **[Phạm vi Chức năng Bắt buộc](./mvp-scope.md)** | `PROD-SCOPE-01` | 12 nhóm chức năng Must-have (`FR-001` - `FR-012`) và làm rõ các trade-offs. |
| 🚫 **[Danh mục Ngoài Phạm vi](./out-of-scope.md)** | `PROD-OUTOFSCOPE-01` | 30 hạng mục bị loại bỏ khỏi v0.1 (`OOS-001` - `OOS-030`) để chống Scope Creep. |
| 📏 **[Ràng buộc Sản phẩm & Quy mô](./product-constraints.md)** | `PROD-CONSTRAINTS-01` | Giới hạn quy mô (1.000 người/cây), ma trận hỗ trợ thiết bị và trình duyệt. |
| 🔒 **[Nguyên tắc Quyền Riêng tư](./privacy-baseline.md)** | `PROD-PRIVACY-01` | 12 điều bắt buộc về bảo mật dữ liệu gia tộc (Private by default, phân cấp 4 loại dữ liệu). |
| 📊 **[Tiêu chí Thành công](./success-metrics.md)** | `PROD-METRICS-01` | 9 chỉ số đo lường định lượng (`SM-001` - `SM-009`) không dùng vanity metrics. |
| 📝 **[Danh mục User Stories](./user-stories.md)** | `PROD-STORIES-01` | User Stories chi tiết theo 9 Epics (A đến I). |
| ✅ **[Tiêu chuẩn Chấp nhận Chi tiết](./acceptance-criteria.md)** | `PROD-AC-01` | Acceptance Criteria dạng Given-When-Then cho toàn bộ story Must. |
| ⚖️ **[Phân loại Ưu tiên MoSCoW](./moscow-prioritization.md)** | `PROD-MOSCOW-01` | Phân loại Must (16), Should (7), Could (4), Won't (12). |
| 📌 **[Chuẩn Phạm vi Phát hành v0.1](./v0.1-scope-baseline.md)** | `PROD-BASELINE-v0.1` | Tài liệu nguồn sự thật chốt phạm vi phiên bản v0.1 (`PROPOSED_FOR_APPROVAL`). |
| 📑 **[Tài liệu PRD Tổng thể MVP](./prd-mvp.md)** | `PROD-PRD-01` | Bản tổng hợp yêu cầu sản phẩm MVP v0.1. |
| 🔗 **[Ma trận Truy vết Toàn diện](./traceability-matrix.md)** | `PROD-TRACE-01` | Ma trận truy vết từ Mục tiêu $\rightarrow$ Vấn đề $\rightarrow$ UC $\rightarrow$ FR $\rightarrow$ US $\rightarrow$ AC $\rightarrow$ SM $\rightarrow$ Phase. |

---

## 2. Nguyên tắc Quản lý Sản phẩm

1. **Nguồn chân lý duy nhất (SSOT):** Tài liệu trong thư mục này là căn cứ tối cao cho các phase thiết kế nghiệp vụ (P02), kiến trúc (P03) và thi công chức năng tiếp theo.
2. **Kiểm soát thay đổi:** Bất kỳ sự thay đổi nào đối với các hạng mục `Must` hoặc chuyển đổi từ `Won't` sang `In-Scope` bắt buộc phải có sự phê duyệt bằng văn bản của **Project Owner**.
