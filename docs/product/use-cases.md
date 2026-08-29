# Danh mục Use Cases Sản phẩm GenViet (Use Case Catalogue)

- **Mã tài liệu:** `PROD-USECASE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Bảng Tổng hợp 24 Use Cases

| Mã UC | Tên Use Case | Actor chính | Phân loại MoSCoW | Thuộc v0.1 | User Story |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **UC-001** | Đăng ký tài khoản mới (Email/Password) | Người dùng vãng lai | `Must` | **CÓ** | `US-A01` |
| **UC-002** | Đăng nhập hệ thống | Người dùng đã đăng ký | `Must` | **CÓ** | `US-A02` |
| **UC-003** | Đăng xuất khỏi hệ thống | Người dùng đăng nhập | `Must` | **CÓ** | `US-A03` |
| **UC-004** | Tạo cây gia phả mới | Chủ tài khoản | `Must` | **CÓ** | `US-B01` |
| **UC-005** | Xem danh sách cây gia phả | Chủ tài khoản | `Must` | **CÓ** | `US-B02` |
| **UC-006** | Tạo nhân vật đầu tiên trong cây | Chủ tài khoản | `Must` | **CÓ** | `US-C01` |
| **UC-007** | Xem hồ sơ chi tiết nhân vật | Chủ tài khoản | `Must` | **CÓ** | `US-C02` |
| **UC-008** | Chỉnh sửa hồ sơ nhân vật | Chủ tài khoản | `Must` | **CÓ** | `US-C03` |
| **UC-009** | Thêm cha mới cho một người | Chủ tài khoản | `Must` | **CÓ** | `US-D01` |
| **UC-010** | Thêm mẹ mới cho một người | Chủ tài khoản | `Must` | **CÓ** | `US-D02` |
| **UC-011** | Liên kết cha/mẹ đã có trong cây | Chủ tài khoản | `Must` | **CÓ** | `US-D03` |
| **UC-012** | Thêm vợ hoặc chồng (Hôn phối) | Chủ tài khoản | `Must` | **CÓ** | `US-D04` |
| **UC-013** | Thêm con cho một cặp cha mẹ/nhân vật | Chủ tài khoản | `Must` | **CÓ** | `US-D05` |
| **UC-014** | Xem cây phân tầng quanh người trung tâm | Chủ tài khoản | `Must` | **CÓ** | `US-E01` |
| **UC-015** | Thay đổi người trung tâm trên cây | Chủ tài khoản | `Must` | **CÓ** | `US-E02` |
| **UC-016** | Phóng to, thu nhỏ và di chuyển đồ thị | Chủ tài khoản | `Must` | **CÓ** | `US-E03` |
| **UC-017** | Tìm kiếm thành viên (Có dấu & Không dấu) | Chủ tài khoản | `Must` | **CÓ** | `US-F01` |
| **UC-018** | Tải lên ảnh đại diện cho nhân vật | Chủ tài khoản | `Should` | **CÓ (Should)** | `US-G01` |
| **UC-019** | Xóa mềm nhân vật khỏi cây | Chủ tài khoản | `Must` | **CÓ** | `US-C04` |
| **UC-020** | Khôi phục nhân vật từ thùng rác | Chủ tài khoản | `Should` | **CÓ (Should)** | `US-C05` |
| **UC-021** | Xuất bản sao lưu dữ liệu cốt lõi (JSON) | Chủ tài khoản | `Must` | **CÓ** | `US-H01` |
| **UC-022** | Nhập / Phục hồi bản sao lưu từ file JSON | Chủ tài khoản | `Should` | **CÓ (Should)** | `US-H02` |
| **UC-023** | Xử lý trạng thái cây chưa có dữ liệu | Chủ tài khoản | `Must` | **CÓ** | `US-B03` |
| **UC-024** | Ngăn chặn quan hệ chu trình và self-link | Chủ tài khoản | `Must` | **CÓ** | `US-D06` |

---

## 2. Đặc tả Chi tiết Các Use Cases Tiêu biểu

### UC-006: Tạo nhân vật đầu tiên trong cây (Root / Initial Person)
- **Actor chính:** Chủ tài khoản (`USR-001`).
- **Mục tiêu:** Khởi tạo node đầu tiên để bắt đầu xây dựng cây gia phả.
- **Điều kiện trước:** Người dùng đã đăng nhập và đang ở màn hình cây gia phả rỗng.
- **Trigger:** Người dùng nhấn nút "Tạo thành viên đầu tiên".
- **Luồng chính (Main Flow):**
  1. Hệ thống hiển thị form nhập thông tin cơ bản (Họ và tên, Giới tính, Ngày/Năm sinh, Còn sống hay Đã mất).
  2. Người dùng nhập thông tin và nhấn "Lưu".
  3. Hệ thống tạo bản ghi nhân vật, tự động gán làm Người trung tâm (Center Node).
  4. Hệ thống vẽ node nhân vật trên đồ thị React Flow.
- **Luồng thay thế:** Người dùng chỉ nhập Họ tên và Giới tính (các trường ngày tháng để trống) $\rightarrow$ Hệ thống vẫn lưu thành công.
- **Trường hợp lỗi:** Bỏ trống Họ và tên $\rightarrow$ Hệ thống báo lỗi validation yêu cầu nhập tên.
- **Kết quả sau cùng:** Cây gia phả có 1 thành viên hiển thị trên màn hình.

---

### UC-009 & UC-010: Thêm cha / mẹ mới cho một người (Mở rộng tổ tiên)
- **Actor chính:** Chủ tài khoản (`USR-001`).
- **Mục tiêu:** Thêm thế hệ tiền bối phía trên một người bất kỳ đã có trong cây.
- **Điều kiện trước:** Người được chọn đã tồn tại trên cây và chưa có đủ Cha/Mẹ.
- **Trigger:** Nhấn nút "+ Thêm Cha" hoặc "+ Thêm Mẹ" trên thanh công cụ/thẻ hồ sơ nhân vật.
- **Luồng chính:**
  1. Người dùng chọn "Thêm mới".
  2. Nhập thông tin cha/mẹ (Họ tên, Giới tính tương ứng Nam/Nữ, Ngày sinh/mất).
  3. Nhấn "Xác nhận".
  4. Hệ thống tạo nhân vật mới, thiết lập quan hệ Cha-Con / Mẹ-Con.
  5. Thuật toán ELK.js tự động tính toán lại vị trí phân tầng: Node cha/mẹ được đặt ở tầng trên, node con dịch chuyển xuống tầng dưới.
- **Trường hợp lỗi:** Người này đã có Cha $\rightarrow$ Nút "+ Thêm Cha" bị ẩn hoặc chỉ cho phép thay đổi/xóa liên kết cũ.

---

### UC-024: Ngăn chặn Quan hệ Không hợp lệ (Anti-Cycle & Anti-Self-Link)
- **Actor chính:** Chủ tài khoản (`USR-001`).
- **Mục tiêu:** Bảo đảm tính toàn vẹn của đồ thị gia phả dạng Directed Acyclic Graph (DAG), không xảy ra nghịch lý phả hệ.
- **Trigger:** Người dùng thực hiện thao tác liên kết cha mẹ hoặc con cái.
- **Luồng kiểm tra:**
  1. Người dùng chọn liên kết một người có sẵn làm Cha/Mẹ của Person A.
  2. Hệ thống kiểm tra:
     - Person B có trùng với Person A không? (Self-link $\rightarrow$ Từ chối).
     - Person B có phải là hậu duệ (con, cháu, chắt) của Person A không? (Cycle $\rightarrow$ Từ chối).
  3. Nếu vi phạm: Hiển thị thông báo lỗi "Không thể thiết lập quan hệ vì người này là con/cháu của nhân vật hiện tại".
  4. Nếu hợp lệ: Lưu quan hệ thành công và cập nhật đồ thị.

---

### UC-021: Xuất bản sao lưu dữ liệu cốt lõi (Export JSON Backup)
- **Actor chính:** Chủ tài khoản (`USR-001`).
- **Mục tiêu:** Tải toàn bộ dữ liệu cây gia phả về máy cá nhân dưới dạng tệp tin cấu trúc JSON.
- **Điều kiện trước:** Cây gia phả có ít nhất 1 thành viên.
- **Trigger:** Nhấn nút "Sao lưu dữ liệu" trong menu cài đặt cây.
- **Luồng chính:**
  1. Hệ thống thu thập toàn bộ danh sách nhân vật (`persons`) và các mối quan hệ (`relationships`) thuộc cây gia phả hiện tại.
  2. Đóng gói dữ liệu kèm metadata (Tên cây, Ngày xuất, Phiên bản schema JSON `genviet_v0.1`).
  3. Trình duyệt tự động kích hoạt tải file `genviet_backup_<ten-cay>_<timestamp>.json` về máy.
- **Quyền riêng tư:** Chỉ chủ sở hữu cây mới có quyền xuất dữ liệu; file tải về thuộc toàn quyền quản lý của người dùng.
