# Kế hoạch Kiểm thử & Xác minh: Phase P01 (Phase Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các hạng mục kiểm tra, kịch bản đối soát chất lượng và kết quả thực thi cho Phase P01.

---

## 1. Kịch bản Kiểm thử Chi tiết

### Nhóm 1: Kiểm thử Tính Đầy đủ (Completeness Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **CMP-01** | Kiểm tra toàn bộ 16 tasks P01-T01..T16 có đầu ra | 100% tài liệu tương ứng được tạo tại `docs/product/` | `PASS` | Đã tạo đủ 15 tài liệu sản phẩm |
| **CMP-02** | Kiểm tra mọi User Story Must có Acceptance Criteria | 100% story Must có AC dạng Given-When-Then | `PASS` | 24 AC chi tiết cho các story Must |
| **CMP-03** | Kiểm tra mọi Mục tiêu có ít nhất 1 Use Case | 7/7 mục tiêu (`OBJ-001` - `OBJ-007`) có Use Case phục vụ | `PASS` | Đầy đủ trong ma trận |
| **CMP-04** | Kiểm tra mọi Success Metric có phương pháp đo | Có ngưỡng, thời điểm và phase chịu trách nhiệm | `PASS` | 9/9 metrics có ngưỡng đo rõ ràng |
| **CMP-05** | Kiểm tra mọi Out-of-Scope item có lý do loại bỏ | Có lý do, rủi ro và phiên bản xem xét lại | `PASS` | 30/30 items được phân tích |

### Nhóm 2: Kiểm thử Tính Nhất quán (Consistency Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **CST-01** | Kiểm tra phân loại MoSCoW không trùng chéo | Không có tính năng nào vừa thuộc Must vừa thuộc Won't | `PASS` | Nhất quán 100% |
| **CST-02** | Khớp nối giữa PRD, User Stories và AC | Thuật ngữ và mã ID đồng nhất trong toàn bộ tài liệu | `PASS` | Khớp nối hoàn hảo |
| **CST-03** | Hỗ trợ thiết bị khớp với tiêu chuẩn Responsive | Mobile ($360\text{px}$) và Desktop đều có AC tương ứng | `PASS` | Có AC riêng cho mobile |

### Nhóm 3: Kiểm thử Tính Truy vết (Traceability Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **TRC-01** | Kiểm tra chuỗi truy vết từ Mục tiêu đến Phase | Objective $\rightarrow$ Problem $\rightarrow$ UC $\rightarrow$ FR $\rightarrow$ US $\rightarrow$ AC $\rightarrow$ SM $\rightarrow$ Phase | `PASS` | Ma trận truy vết 100% khép kín |
| **TRC-02** | Không có Story Must nào bị mồ côi | Mọi story Must đều bắt nguồn từ Use Case và Objective | `PASS` | Không có story mồ côi |

### Nhóm 4: Kiểm soát Ranh giới Phạm vi (Scope Control Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **SCP-01** | Không viết code ứng dụng Next.js | 0 file `.ts`/`.tsx` ứng dụng được tạo | `PASS` | Đúng phạm vi Product Scope |
| **SCP-02** | Không tạo CSDL schema / migration SQL | Không có file SQL nào được tạo | `PASS` | Đúng phạm vi Product Scope |
| **SCP-03** | Không cài đặt thêm dependency mới | `package.json` không bị thay đổi | `PASS` | Không thêm package |
| **SCP-04** | Không thiết kế chi tiết nghiệp vụ phả hệ P02 | Dành việc chuẩn hóa thuật ngữ xưng hô cho P02 | `PASS` | Giữ đúng ranh giới phase |

### Nhóm 5: Kiểm thử Quy trình Git & An toàn (Git Safety Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **GIT-01** | Xác minh nhánh hiện tại | Đang ở `phase/p01-product-scope` | `PASS` | Nhánh riêng biệt |
| **GIT-02** | Xác minh KHÔNG push lên remote | Không gửi request tới GitHub | `PASS` | Cam kết 100% |
| **GIT-03** | Xác minh KHÔNG merge vào `main` | Không thực hiện merge | `PASS` | Cam kết 100% |
| **GIT-04** | Không có secret hay dữ liệu cá nhân thật | Diff sạch hoàn toàn | `PASS` | Đã quét regex |

---

## 2. Kết luận Kiểm thử
Toàn bộ các kịch bản kiểm thử đều đạt kết quả **`PASS`**. Phase P01 đủ điều kiện chuyển sang Cổng G4/G5 (Review chất lượng).
