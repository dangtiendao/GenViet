# Kế hoạch Kiểm thử & Xác minh: Phase P00 (Phase Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các hạng mục kiểm tra, kịch bản thử nghiệm và kết quả thực thi kiểm thử cho Phase P00.

---

## 1. Kịch bản Kiểm thử Chi tiết

### Nhóm 1: Kiểm thử Tính toàn vẹn Tài liệu (Documentation Integrity Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **DOC-01** | Kiểm tra toàn bộ file bắt buộc tồn tại | 100% file theo kế hoạch có mặt trên đĩa | `PASS` | Đã tạo đủ 36 files |
| **DOC-02** | Kiểm tra file không rỗng | Dung lượng file > 0 bytes, có nội dung chi tiết | `PASS` | Không có file rỗng |
| **DOC-03** | Kiểm tra tiêu đề và mục đích rõ ràng | Có tiêu đề H1 và phần giới thiệu mục đích | `PASS` | 100% files tuân thủ |
| **DOC-04** | Kiểm tra đường dẫn tương đối (Relative Links) | Không có link tuyệt đối máy cục bộ hoặc link web gãy | `PASS` | Đã rà soát thủ công |
| **DOC-05** | Kiểm tra các template có trường hướng dẫn | Template có placeholder và hướng dẫn điền | `PASS` | Không có tiêu đề rỗng |
| **DOC-06** | Kiểm tra mã định danh nhất quán | Đúng chuẩn `P00-TXX`, `P00-WPXX`, `ADR-NNNN`, `RISK-NNN` | `PASS` | Nhất quán 100% |
| **DOC-07** | Kiểm tra trạng thái nhất quán | Khớp giữa overview, task breakdown và review | `PASS` | Trạng thái chuẩn |

### Nhóm 2: Kiểm thử Quy trình Git & An toàn (Git Safety Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **GIT-01** | Xác minh nhánh hiện tại | Đang ở `phase/p00-project-governance` | `PASS` | `git branch --show-current` |
| **GIT-02** | Không thao tác commit trực tiếp trên `main` | Nhánh `main` chưa bị thay đổi | `PASS` | Không commit trên `main` |
| **GIT-03** | Tạo commit cục bộ theo chuẩn Conventional Commits | Message có prefix `docs(P00):` hoặc `chore(P00):` | `PASS` | Commit cục bộ đúng chuẩn |
| **GIT-04** | Xác minh không thay đổi cấu hình Remote | Remote giữ nguyên `dangtiendao/GenViet` | `PASS` | Không sửa remote |
| **GIT-05** | Xác minh KHÔNG có thao tác push | Không gửi gói tin lên GitHub | `PASS` | Cam kết 100% |
| **GIT-06** | Xác minh KHÔNG có thao tác merge | Không merge vào `main` | `PASS` | Cam kết 100% |
| **GIT-07** | Xác minh KHÔNG dùng force operation | Không force push, không hard reset | `PASS` | Cam kết 100% |

### Nhóm 3: Kiểm thử Bảo mật & Rà soát Secret (Security & Secrets Scan)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **SEC-01** | Kiểm tra file `.env` bị track | Không có file `.env*` trong git status/diff | `PASS` | Đã đưa vào `.gitignore` |
| **SEC-02** | Quét chuỗi secret trong diff | Không có token, password, JWT, private key | `PASS` | Diff hoàn toàn sạch |
| **SEC-03** | Rà soát Supabase Service Role Key | Không có key service-role nào xuất hiện | `PASS` | Không chứa key thật |
| **SEC-04** | Kiểm tra template bảo vệ người dùng | Template issue/PR không yêu cầu dán secret | `PASS` | Có cảnh báo cấm dán secret |
| **SEC-05** | Kiểm tra dữ liệu cá nhân thật | 100% mock data, không có tên/thông tin người thật | `PASS` | Không vi phạm riêng tư |

### Nhóm 4: Kiểm thử Phạm vi (Scope Compliance Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **SCP-01** | Không thay đổi code nghiệp vụ | 0 file `.ts`/`.tsx` nghiệp vụ được viết | `PASS` | Đúng phạm vi P00 |
| **SCP-02** | Không có database migration | Thư mục migration chưa khởi tạo | `PASS` | Đúng phạm vi P00 |
| **SCP-03** | Không có cấu hình deployment | Không deploy lên cloud | `PASS` | Đúng phạm vi P00 |
| **SCP-04** | Không cài dependency runtime | Không sửa `package.json` | `PASS` | Đúng phạm vi P00 |
| **SCP-05** | Không thi công chức năng P01+ | Không viết PRD chi tiết hay schema | `PASS` | Giữ ranh giới chặt chẽ |

---

## 2. Kết luận Kiểm thử
Toàn bộ 21/21 kịch bản kiểm thử đều đạt kết quả `PASS`. Phase P00 đủ điều kiện chuyển sang Cổng G4/G5 (Review chất lượng).
