# Hệ Thống Kiểm Thử Tổng Thể & Bảo Đảm Chất Lượng (Quality Assurance & Test Automation)

## 1. Tổng Quan
Hệ thống kiểm thử của GenViet (MVP v0.1) được xây dựng theo mô hình Kim tự tháp kiểm thử (Test Automation Pyramid), bao phủ toàn diện từ các hàm nghiệp vụ, cơ sở dữ liệu/RLS, Storage, hành trình người dùng E2E, ma trận thiết bị di động đến các kịch bản bảo mật tiêu cực:
- **Unit Tests (Vitest):** Kiểm thử các hàm chuẩn hóa tên tiếng Việt, validation ngày tháng, validation quan hệ, chuyển đổi đồ thị và JSON schema sao lưu.
- **Integration Tests (pgTAP & Vitest):** Kiểm thử các giao dịch nguyên tử (atomic transactions), rollback khi lỗi, phát hiện chu trình, ma trận phân quyền 4 nhóm (Owner, Viewer, Outsider, Anonymous) và Storage policies.
- **End-to-End Tests (Playwright):** Kiểm thử toàn bộ 11 hành trình người dùng cốt lõi trên Chromium và WebKit.
- **Mobile Viewport Matrix:** Kiểm thử giao diện responsive trên màn hình siêu hẹp 320px, Android Chromium và iPhone WebKit.
- **Security & Supply Chain Tests:** Kiểm thử ngăn chặn truy cập chéo cây, tamper request, upload file giả mạo, rò rỉ secret trong client bundle, và kiểm toán 0 lỗ hổng phụ thuộc.
