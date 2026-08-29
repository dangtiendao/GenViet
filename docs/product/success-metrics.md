# Tiêu chí Thành công của Sản phẩm MVP v0.1 (Success Metrics)

- **Mã tài liệu:** `PROD-METRICS-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Nguyên tắc Đo lường

1. **Không sử dụng Chỉ số Ảo (No Vanity Metrics):** Vì GenViet v0.1 là sản phẩm cá nhân / MVP ban đầu, không sử dụng các chỉ số thương mại như Doanh thu (MRR), Chi phí chuyển đổi (CAC) hay Tăng trưởng người dùng (Viral coefficient).
2. **Tập trung vào Độ tin cậy, Trải nghiệm & Tính toàn vẹn Dữ liệu:** Các chỉ số phải đo lường được khả năng hoàn thành tác vụ của người dùng, tốc độ hiển thị và sự an toàn của cây gia phả.

---

## 2. Bảng 9 Tiêu chí Thành công Định lượng (Success Metrics Matrix)

| Mã SM | Tên chỉ số | Định nghĩa & Cách đo | Ngưỡng thành công (Threshold) | Thời điểm đo | Phase chịu trách nhiệm | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **SM-001** | Mức độ Hoàn thiện MVP (Product Completion) | Tỷ lệ các tính năng `Must` trong MoSCoW được thi công và vượt qua kiểm thử. | **100%** (16/16 tính năng Must pass) | Cổng G6 của Phase Release | `Phase P25` | `PROPOSED` |
| **SM-002** | Tỷ lệ Thành công Luồng Cốt lõi (Core Task Success) | Tỷ lệ người dùng thử nghiệm hoàn thành trọn vẹn luồng từ Đăng ký $\rightarrow$ Tạo cây $\rightarrow$ Thêm 3 thế hệ $\rightarrow$ Xuất sao lưu JSON. | $\ge \mathbf{95\%}$ không gặp lỗi chặn (blocking error) | UAT Testing | `Phase P24` | `PROPOSED` |
| **SM-003** | Tính Toàn vẹn Đồ thị (Data Integrity Rate) | Tỷ lệ phát hiện quan hệ vòng lặp (Cycles) hoặc tự liên kết (Self-link) không hợp lệ bị hệ thống chặn thành công. | **100%** (0 quan hệ phi logic lọt vào database) | Automated Test | `Phase P16` | `PROPOSED` |
| **SM-004** | An toàn Cách ly Dữ liệu (Cross-Tenant Isolation) | Tỷ lệ các truy vấn trái phép từ Tài khoản A cố đọc dữ liệu cây của Tài khoản B bị RLS chặn đứng (HTTP 403 / Trả về mảng rỗng). | **100%** (0 trường hợp rò rỉ chéo) | Security Test | `Phase P04 / P23` | `PROPOSED` |
| **SM-005** | Khả năng Sử dụng trên Mobile (Mobile Usability) | Tỷ lệ các tác vụ cốt lõi (Xem cây, chạm đổi người trung tâm, tìm kiếm, sửa hồ sơ) thực hiện mượt mà trên màn hình $360\text{px} - 414\text{px}$. | $\ge \mathbf{90\%}$ độ hài lòng trong bài test usability | UI Testing | `Phase P22` | `PROPOSED` |
| **SM-006** | Hiệu năng Hiển thị Đồ thị (Render Latency) | Thời gian tính toán layout ELK.js và vẽ React Flow cho cây có 50 - 80 node trên thiết bị di động trung bình. | $\le \mathbf{500\text{ms}}$ (Duy trì $\ge 45\text{ FPS}$) | Performance Test | `Phase P23` | `PROPOSED` |
| **SM-007** | Tính Toàn vẹn Bản Sao lưu (Backup Completeness) | File JSON xuất ra chứa đầy đủ 100% danh sách thành viên và các mối quan hệ hiện có trên cây. | **100%** (Khớp số lượng bản ghi CSDL) | E2E Test | `Phase P20` | `PROPOSED` |
| **SM-008** | Kiểm soát Phạm vi (Scope Discipline) | Tỷ lệ các tính năng nằm trong danh sách `Out-of-Scope` không bị đưa trái phép vào codebase v0.1. | **100%** (0 tính năng OOS lọt vào v0.1) | Code Review | Toàn bộ Phase | `PROPOSED` |
| **SM-009** | Không Mất Dữ liệu (Zero Data Loss) | Số lượng sự cố mất dữ liệu nhân vật do lỗi ứng dụng trong các thao tác thông thường. | **0 sự cố** (Zero Data Loss) | Toàn bộ Vòng đời | Toàn bộ Phase | `PROPOSED` |
