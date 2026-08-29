# Kế hoạch Kiểm thử & Xác minh: Phase P03 (Phase Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các hạng mục kiểm tra, kịch bản đối soát chất lượng và kết quả thực thi cho Phase P03.

---

## 1. Kịch bản Kiểm thử Thiết kế UX Chi tiết

### Nhóm 1: Kiểm thử Tính Đầy đủ (Completeness Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **CMP-01** | Kiểm tra toàn bộ 26 tasks P03-T01..T26 có đầu ra | 100% tài liệu tương ứng được tạo tại `docs/ux/` | `PASS` | Đầy đủ 21 tài liệu UX |
| **CMP-02** | Kiểm tra 12 User Flows cốt lõi | 100% flows có sơ đồ Mermaid và mô tả | `PASS` | Đầy đủ trong `docs/ux/flows/` |
| **CMP-03** | Kiểm tra 10 bộ Wireframe Low-Fidelity | 100% wireframe ASCII có chú thích | `PASS` | Đầy đủ trong `docs/ux/wireframes/` |
| **CMP-04** | Kiểm tra Danh mục 25 Màn hình (Screen Inventory) | 100% màn hình có actor, priority, actions | `PASS` | [`screen-inventory.md`](../../ux/screen-inventory.md) |
| **CMP-05** | Kiểm tra Ma trận Truy vết Toàn diện | 100% Must stories có luồng UX tương ứng | `PASS` | [`ux-traceability-matrix.md`](../../ux/ux-traceability-matrix.md) |

### Nhóm 2: Kiểm thử Tính Nhất quán Nghiệp vụ Phả hệ (Domain Consistency Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **DOM-T01** | Phân định User Account vs Person Node | Không nhầm lẫn tài khoản đăng nhập với thành viên | `PASS` | Nhất quán 100% |
| **DOM-T02** | Phân định 4 loại Người Mốc | Initial, Center, Founding Ancestor, Generation Anchor | `PASS` | Định nghĩa độc lập |
| **DOM-T03** | Chặn đứng Chu trình Vòng lặp Thế hệ (DAG) | `ERR-002` khóa nút Lưu và hiển thị giải thích | `PASS` | `relationship-warning-patterns.md` |
| **DOM-T04** | Hỗ trợ Ngày tháng Không đầy đủ (Partial Dates) | Không ép chọn ngày giả `01/01` | `PASS` | `form-patterns.md` |
| **DOM-T05** | Cấm Xóa Lan Truyền (No Silent Cascade) | Xóa 1 người không làm mất người thân (`INV-015`) | `PASS` | `dangerous-action-patterns.md` |

### Nhóm 3: Kiểm thử Khả năng Tiếp cận & Cảm ứng (A11y & Touch Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **A11Y-T01**| Kiểm toán Kích thước Cảm ứng Touch Targets | 100% mục tiêu chạm $\ge 44 \times 44\text{ CSS px}$ | `PASS` | [`touch-target-audit.md`](../../ux/touch-target-audit.md) |
| **A11Y-T02**| Điều hướng Bàn phím & Focus State | Hỗ trợ Tab, Enter, Space, Esc, Focus Outline `3px` | `PASS` | [`accessibility-baseline.md`](../../ux/accessibility-baseline.md) |
| **A11Y-T03**| Giải pháp Thay thế cho Screen Reader | Chế độ Danh sách / Tìm kiếm thay thế cho Canvas | `PASS` | `accessibility-baseline.md` |
| **A11Y-T04**| Tính Độc lập Màu sắc | Luôn kèm Icon và Văn bản giải thích | `PASS` | `content-guidelines.md` |

### Nhóm 4: Kiểm soát Ranh giới Kỹ thuật & An toàn Git (Scope & Git Safety)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **SCP-01** | Không viết mã nguồn ứng dụng (Next.js/React/CSS)| 0 file code ứng dụng được tạo | `PASS` | Đúng phạm vi UX Design |
| **SCP-02** | Không tạo CSDL schema / migration SQL | Không có file SQL nào được tạo | `PASS` | Đúng phạm vi UX Design |
| **SCP-03** | Không cài đặt thêm dependency mới | `package.json` không bị thay đổi | `PASS` | Không thêm package |
| **GIT-01** | Xác minh nhánh hiện tại | Đang ở `phase/p03-ux-flows-wireframes` | `PASS` | Nhánh riêng biệt |
| **GIT-02** | Xác minh KHÔNG push lên remote | Không gửi request tới GitHub | `PASS` | Cam kết 100% |
| **GIT-03** | Xác minh KHÔNG merge vào `master` | Không thực hiện merge | `PASS` | Cam kết 100% |

---

## 2. Kết luận Kiểm thử
Toàn bộ các kịch bản kiểm thử đều đạt kết quả **`PASS`**. Phase P03 đủ điều kiện chuyển sang Cổng G4/G5 (Review chất lượng).
