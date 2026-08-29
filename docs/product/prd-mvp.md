# Tài liệu Yêu cầu Sản phẩm Tổng thể: GenViet MVP v0.1 (Product Requirements Document - PRD)

- **Mã tài liệu:** `PROD-PRD-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29
- **Tác giả:** Senior Product Manager & Technical Product Owner

---

## 1. Tóm tắt Điều hành (Executive Summary)

**GenViet v0.1** là phiên bản sản phẩm khả thi tối thiểu (MVP) dạng ứng dụng web responsive, được thiết kế chuyên biệt để giải quyết bài toán số hóa và trực quan hóa cây gia phả cá nhân cho các gia đình Việt Nam. Phiên bản v0.1 tập trung vào sự đơn giản, tính linh hoạt khi mở rộng tổ tiên nhiều thế hệ, khả năng tương tác mượt mà trên điện thoại và chính sách bảo vệ quyền riêng tư tuyệt đối (Private by Default).

---

## 2. Bản đồ Tài liệu Chi tiết (Traceability Index)

Tài liệu PRD này đóng vai trò là bản tổng hợp cấp cao. Chi tiết từng phân hệ được đặc tả tại các tài liệu chuyên biệt:

- 🎯 **Tầm nhìn & Mục tiêu:** [docs/product/vision.md](./vision.md)
- 👥 **Đối tượng Người dùng & Personas:** [docs/product/target-users.md](./target-users.md)
- ❓ **Tuyên bố Vấn đề & Giả thuyết:** [docs/product/problem-statement.md](./problem-statement.md)
- 🔄 **Luồng Giá trị Cốt lõi:** [docs/product/core-value-flow.md](./core-value-flow.md)
- 📋 **Danh mục 24 Use Cases:** [docs/product/use-cases.md](./use-cases.md)
- 📦 **Phạm vi Chức năng Bắt buộc:** [docs/product/mvp-scope.md](./mvp-scope.md)
- 🚫 **Danh mục Ngoài Phạm vi (30 items):** [docs/product/out-of-scope.md](./out-of-scope.md)
- 📏 **Ràng buộc Quy mô, Thiết bị & Trình duyệt:** [docs/product/product-constraints.md](./product-constraints.md)
- 🔒 **Nguyên tắc Quyền Riêng tư:** [docs/product/privacy-baseline.md](./privacy-baseline.md)
- 📊 **Tiêu chí Thành công Định lượng:** [docs/product/success-metrics.md](./success-metrics.md)
- 📝 **Danh mục User Stories (Epics A-I):** [docs/product/user-stories.md](./user-stories.md)
- ✅ **Tiêu chuẩn Chấp nhận Chi tiết:** [docs/product/acceptance-criteria.md](./acceptance-criteria.md)
- ⚖️ **Phân loại Ưu tiên MoSCoW:** [docs/product/moscow-prioritization.md](./moscow-prioritization.md)
- 📌 **Chuẩn Phạm vi Phát hành v0.1:** [docs/product/v0.1-scope-baseline.md](./v0.1-scope-baseline.md)
- 🔗 **Ma trận Truy vết Toàn diện:** [docs/product/traceability-matrix.md](./traceability-matrix.md)

---

## 3. Yêu cầu Phi Chức năng Cấp Sản phẩm (Product NFRs)

| Mã NFR | Yêu cầu phi chức năng | Lý do nghiệp vụ | Chỉ dấu kiểm tra (Acceptance Signal) |
| :--- | :--- | :--- | :--- |
| **NFR-001** | Quyền riêng tư Mặc định | Bảo vệ dữ liệu nhạy cảm của gia đình. | Không có trang xem công khai, 100% CSDL bật RLS. |
| **NFR-002** | Cách ly Dữ liệu Tuyệt đối | Ngăn chặn rò rỉ dữ liệu giữa các dòng họ. | Người dùng A không thể đọc/ghi bất kỳ bản ghi nào của User B. |
| **NFR-003** | Tính Toàn vẹn Đồ thị (DAG) | Đảm bảo tính hợp lý của phả hệ học. | Chặn 100% các thao tác tạo quan hệ vòng lặp và tự liên kết. |
| **NFR-004** | Sử dụng Đa thiết bị (Responsive) | Đáp ứng nhu cầu tra cứu trên điện thoại. | Giao diện tự co giãn tốt từ màn hình $360\text{px}$ đến màn hình $4K$. |
| **NFR-005** | Khả năng Tự do Trích xuất Dữ liệu | Tránh rủi ro mất dữ liệu khi chuyển dịch vụ. | Cho phép tải về toàn bộ cây dạng file JSON có cấu trúc rõ ràng. |
| **NFR-006** | Hiệu năng Hiển thị Đồ thị | Tránh giật lag khi vuốt chạm trên mobile. | Thời gian render cây $50 - 80$ node $\le 500\text{ms}$ trên di động. |
| **NFR-007** | Dung lượng & Khả năng Chịu tải | Đáp ứng quy mô gia phả phổ biến tại VN. | CSDL lưu trữ trơn tru tối thiểu 1.000 thành viên/cây. |
| **NFR-008** | Không Yêu cầu Ứng dụng Native | Tiết kiệm chi phí phân phối và cài đặt. | Chạy 100% trên trình duyệt web hiện đại (Chrome, Safari, Edge). |

---

## 4. Tiêu chí Phát hành Phiên bản v0.1 (Release Acceptance Criteria)

Phiên bản GenViet v0.1 chỉ được phép phát hành khi:
1. 100% các User Stories thuộc nhóm `Must` đạt chuẩn Acceptance Criteria.
2. Không còn bất kỳ lỗi nào ở mức `BLOCKER` hoặc `CRITICAL`.
3. Vượt qua bài kiểm tra bảo mật cách ly dữ liệu Row Level Security (RLS).
4. Kiểm thử thành công trên cả thiết bị máy tính để bàn và điện thoại thông minh (iOS Safari & Android Chrome).
5. Tính năng xuất bản sao lưu JSON hoạt động chính xác và không mất dữ liệu.
