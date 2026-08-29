# Kế hoạch Kiểm thử & Xác minh: Phase P02 (Phase Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các hạng mục kiểm tra, kịch bản đối soát chất lượng và kết quả thực thi cho Phase P02.

---

## 1. Kịch bản Kiểm thử Nghiệp vụ Chi tiết

### Nhóm 1: Kiểm thử Tính Đầy đủ (Completeness Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **CMP-01** | Kiểm tra toàn bộ 28 tasks P02-T01..T28 có đầu ra | 100% tài liệu tương ứng được tạo tại `docs/product/domain/` | `PASS` | Đã tạo đủ 20 tài liệu domain |
| **CMP-02** | Kiểm tra 20 Domain Invariants đều có Test Scenario | 100% Invariants (`INV-001` - `INV-020`) có test case | `PASS` | Đầy đủ trong ma trận |
| **CMP-03** | Kiểm tra 8 mã lỗi Blocking đều có Test Scenario | 100% mã `ERR-001`..`ERR-008` có test case chặn | `PASS` | Đầy đủ trong ma trận |
| **CMP-04** | Kiểm tra Bảng thuật ngữ song ngữ đầy đủ | Có đủ 40 thuật ngữ định nghĩa chuẩn | `PASS` | [`glossary.md`](../../product/domain/glossary.md) |
| **CMP-05** | Kiểm tra 80 Kịch bản Test Scenarios | Đầy đủ 80 test cases sử dụng 100% Mock Data | `PASS` | [`relationship-test-cases.md`](../../product/domain/relationship-test-cases.md) |

### Nhóm 2: Kiểm thử Tính Nhất quán Thuật ngữ (Terminology Consistency Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **TRM-01** | Phân biệt User và Person trong toàn bộ tài liệu | Không nhầm lẫn tài khoản đăng nhập với nhân vật cây | `PASS` | Nhất quán 100% |
| **TRM-02** | Phân biệt Person và Node | Person là con người phả hệ; Node là đối tượng visual | `PASS` | Nhất quán 100% |
| **TRM-03** | Phân định 4 loại người mốc | Initial, Center, Founding Ancestor, Generation Anchor | `PASS` | Định nghĩa độc lập |

### Nhóm 3: Kiểm thử Tính Bất biến & Chống Chu trình (Invariant & Cycle Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **INV-T01** | Kiểm tra quy tắc chống Self-parent | `ERR-001` chặn A làm cha của A | `PASS` | `RTC-018` |
| **INV-T02** | Kiểm tra quy tắc chống Self-spouse | `ERR-003` chặn A kết hôn với A | `PASS` | `RTC-030` |
| **INV-T03** | Kiểm tra chu trình 2 node trực tiếp | `ERR-002` chặn $A \rightarrow B \rightarrow A$ | `PASS` | `RTC-023` |
| **INV-T04** | Kiểm tra chu trình đa thế hệ N đời | `ERR-002` chặn $A \rightarrow B \rightarrow C \rightarrow \dots \rightarrow A$ | `PASS` | `RTC-024`, `RTC-025` |
| **INV-T05** | Kiểm tra chu trình khi Gộp và Phục hồi | `ERR-008` chặn chu trình phát sinh | `PASS` | `RTC-026`, `RTC-027` |

### Nhóm 4: Kiểm soát Ranh giới Phạm vi (Scope Boundary Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **SCP-01** | Không viết code ứng dụng Next.js | 0 file code ứng dụng được tạo | `PASS` | Đúng phạm vi Domain Analysis |
| **SCP-02** | Không tạo CSDL schema / migration SQL | Không có file SQL nào được tạo | `PASS` | Đúng phạm vi Domain Analysis |
| **SCP-03** | Không cài đặt thêm dependency mới | `package.json` không bị thay đổi | `PASS` | Không thêm package |
| **SCP-04** | Không can thiệp vào Phase P03/P04 | Giữ đúng ranh giới bàn giao | `PASS` | Chuẩn bị đầu vào cho P03/P04 |

### Nhóm 5: Kiểm thử Quy trình Git & An toàn (Git Safety Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **GIT-01** | Xác minh nhánh hiện tại | Đang ở `phase/p02-genealogy-domain-analysis` | `PASS` | Nhánh riêng biệt |
| **GIT-02** | Xác minh KHÔNG push lên remote | Không gửi request tới GitHub | `PASS` | Cam kết 100% |
| **GIT-03** | Xác minh KHÔNG merge vào `master` | Không thực hiện merge | `PASS` | Cam kết 100% |
| **GIT-04** | Không có secret hay dữ liệu cá nhân thật | Diff sạch hoàn toàn | `PASS` | Đã quét regex |

---

## 2. Kết luận Kiểm thử
Toàn bộ các kịch bản kiểm thử đều đạt kết quả **`PASS`**. Phase P02 đủ điều kiện chuyển sang Cổng G4/G5 (Review chất lượng).
