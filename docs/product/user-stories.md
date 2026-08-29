# Danh mục User Stories Sản phẩm GenViet (User Story Catalogue)

- **Mã tài liệu:** `PROD-STORIES-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Tổng hợp Các Epics Sản phẩm trong MVP v0.1

- **Epic A:** Quản lý Tài khoản & Xác thực (Account & Authentication)
- **Epic B:** Quản lý Cây Gia phả (Family Tree Management)
- **Epic C:** Quản lý Nhân vật (Person / Node Management)
- **Epic D:** Quản lý Mối quan hệ Phả hệ (Relationships & Graph Rules)
- **Epic E:** Trực quan hóa & Tương tác Đồ thị (Graph Visualization & Canvas)
- **Epic F:** Tìm kiếm & Định vị Thành viên (Search & Navigation)
- **Epic G:** Ảnh Đại diện (Avatar Media)
- **Epic H:** Sao lưu & Bảo toàn Dữ liệu (Backup & Export)
- **Epic I:** Quyền Riêng tư & An toàn Dữ liệu (Privacy & Data Protection)

---

## 2. Danh sách User Stories Chi tiết theo Từng Epic

### Epic A: Tài khoản & Xác thực
- **`US-A01` (Đăng ký tài khoản):**
  - *Story:* Là một người dùng mới, tôi muốn đăng ký tài khoản bằng Email và Mật khẩu, để tôi có thể tạo không gian lưu trữ gia phả riêng tư cho gia đình mình.
  - *Giá trị nghiệp vụ:* Xác lập quyền sở hữu và bảo vệ dữ liệu.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-001` | *Use Case:* `UC-001` | *ACs:* `AC-US-A01-01`, `AC-US-A01-02`
- **`US-A02` (Đăng nhập hệ thống):**
  - *Story:* Là một người dùng đã có tài khoản, tôi muốn đăng nhập bằng Email và Mật khẩu, để tôi tiếp tục quản lý và xem cây gia phả của mình.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-001` | *Use Case:* `UC-002` | *ACs:* `AC-US-A02-01`, `AC-US-A02-02`
- **`US-A03` (Đăng xuất):**
  - *Story:* Là một người dùng đang đăng nhập, tôi muốn đăng xuất khỏi ứng dụng, để bảo đảm người khác sử dụng chung thiết bị không xem được dữ liệu gia phả của tôi.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-001` | *Use Case:* `UC-003` | *ACs:* `AC-US-A03-01`

---

### Epic B: Quản lý Cây Gia phả
- **`US-B01` (Tạo cây gia phả mới):**
  - *Story:* Là một chủ tài khoản, tôi muốn tạo một cây gia phả mới với tên gọi tùy ý (ví dụ: "Gia phả họ Trần"), để tôi phân chia dữ liệu các dòng họ khác nhau (nội/ngoại).
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-001` | *Use Case:* `UC-004` | *ACs:* `AC-US-B01-01`
- **`US-B02` (Xem danh sách cây gia phả):**
  - *Story:* Là một chủ tài khoản, tôi muốn xem danh sách các cây gia phả tôi đã tạo và bấm chọn một cây để làm việc, để tôi quản lý thuận tiện.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-001` | *Use Case:* `UC-005` | *ACs:* `AC-US-B02-01`
- **`US-B03` (Trạng thái cây chưa có dữ liệu):**
  - *Story:* Là một người dùng vừa tạo cây mới, tôi muốn nhìn thấy hướng dẫn rõ ràng để bắt đầu tạo người đầu tiên, để tôi không bị bỡ ngỡ trước màn hình trống.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-007` | *Use Case:* `UC-023` | *ACs:* `AC-US-B03-01`

---

### Epic C: Quản lý Nhân vật
- **`US-C01` (Tạo nhân vật đầu tiên):**
  - *Story:* Là một người quản trị cây, tôi muốn tạo thành viên đầu tiên trong cây từ bất kỳ ai (không bắt buộc phải là Thủy tổ), để tôi có thể bắt đầu xây dựng cây ngay từ bản thân tôi hoặc ông bà tôi.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-002`, `OBJ-003` | *Use Case:* `UC-006` | *ACs:* `AC-US-C01-01`, `AC-US-C01-02`
- **`US-C02` (Xem chi tiết hồ sơ nhân vật):**
  - *Story:* Là một người xem gia phả, tôi muốn nhấp vào một nhân vật để xem toàn bộ thông tin chi tiết (Họ tên, Giới tính, Năm sinh, Năm mất, Tiểu sử, Cha Mẹ, Vợ Chồng, Con), để hiểu rõ về người đó.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-005` | *Use Case:* `UC-007` | *ACs:* `AC-US-C02-01`
- **`US-C03` (Chỉnh sửa hồ sơ nhân vật):**
  - *Story:* Là một người quản trị cây, tôi muốn cập nhật thông tin của nhân vật khi thu thập thêm chi tiết mới (sửa tên, thêm năm mất, thêm tiểu sử), để dữ liệu luôn chính xác.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-002` | *Use Case:* `UC-008` | *ACs:* `AC-US-C03-01`
- **`US-C04` (Xóa mềm nhân vật):**
  - *Story:* Là một người quản trị cây, tôi muốn xóa một nhân vật khi nhập nhầm, có kèm xác nhận an toàn, để cây gia phả không bị sai lệch mà không sợ lỡ tay bấm nhầm.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-002` | *Use Case:* `UC-019` | *ACs:* `AC-US-C04-01`, `AC-US-C04-02`
- **`US-C05` (Khôi phục nhân vật từ thùng rác):**
  - *Story:* Là một người quản trị cây, tôi muốn khôi phục lại nhân vật đã bị xóa mềm, để cứu lại dữ liệu khi đổi ý.
  - *Mức ưu tiên:* `Should` | *Objective:* `OBJ-002` | *Use Case:* `UC-020` | *ACs:* `AC-US-C05-01`

---

### Epic D: Quản lý Mối quan hệ Phả hệ
- **`US-D01` (Thêm Cha mới):**
  - *Story:* Là một người quản trị cây, tôi muốn bấm "+ Thêm Cha" cho một nhân vật để nhập người cha mới, để tôi mở rộng thế hệ tổ tiên lên phía trên.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-003` | *Use Case:* `UC-009` | *ACs:* `AC-US-D01-01`
- **`US-D02` (Thêm Mẹ mới):**
  - *Story:* Là một người quản trị cây, tôi muốn bấm "+ Thêm Mẹ" cho một nhân vật để nhập người mẹ mới, để tôi bổ sung đầy đủ phụ mẫu cho nhân vật.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-003` | *Use Case:* `UC-010` | *ACs:* `AC-US-D02-01`
- **`US-D03` (Liên kết Cha/Mẹ đã có trong cây):**
  - *Story:* Là một người quản trị cây, tôi muốn liên kết một người đã có sẵn trong danh sách làm Cha/Mẹ của một nhân vật, để tránh phải tạo lại người bị trùng lặp.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-002` | *Use Case:* `UC-011` | *ACs:* `AC-US-D03-01`
- **`US-D04` (Thêm Vợ/Chồng):**
  - *Story:* Là một người quản trị cây, tôi muốn thêm bạn đời (Vợ hoặc Chồng) cho một nhân vật, để tạo thành cặp hôn phối trên cây.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-002` | *Use Case:* `UC-012` | *ACs:* `AC-US-D04-01`
- **`US-D05` (Thêm Con cái):**
  - *Story:* Là một người quản trị cây, tôi muốn thêm con trai hoặc con gái cho một cặp cha mẹ/nhân vật, để phát triển nhánh hậu duệ xuống phía dưới.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-002` | *Use Case:* `UC-013` | *ACs:* `AC-US-D05-01`
- **`US-D06` (Chống quan hệ vòng lặp & tự liên kết):**
  - *Story:* Là một người quản trị cây, tôi muốn hệ thống tự động ngăn chặn nếu tôi vô tình liên kết một người làm cha/mẹ của chính họ hoặc của tổ tiên họ, để cây không bị hỏng cấu trúc logic.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-002` | *Use Case:* `UC-024` | *ACs:* `AC-US-D06-01`, `AC-US-D06-02`

---

### Epic E: Trực quan hóa & Tương tác Đồ thị
- **`US-E01` (Xem đồ thị phân tầng):**
  - *Story:* Là một người xem gia phả, tôi muốn nhìn thấy cây gia phả được sắp xếp phân tầng rõ ràng (Đời trên ở trên, Đời dưới ở dưới), để dễ dàng hình dung thứ bậc gia tộc.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-004` | *Use Case:* `UC-014` | *ACs:* `AC-US-E01-01`
- **`US-E02` (Thay đổi người trung tâm):**
  - *Story:* Là một người xem gia phả, tôi muốn nhấp đúp vào một nhân vật bất kỳ để biến họ thành Người trung tâm (Focus Node), để đồ thị tự động chuyển hướng hiển thị xoay quanh nhánh của người đó.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-004` | *Use Case:* `UC-015` | *ACs:* `AC-US-E02-01`
- **`US-E03` (Phóng to, thu nhỏ & di chuyển canvas):**
  - *Story:* Là một người xem gia phả, tôi muốn cuộn chuột hoặc dùng 2 ngón tay kéo/zoom đồ thị mượt mà, để tôi bao quát toàn cảnh hoặc xem kỹ từng node.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-004` | *Use Case:* `UC-016` | *ACs:* `AC-US-E03-01`
- **`US-E04` (Tương tác trên màn hình điện thoại):**
  - *Story:* Là một người dùng smartphone, tôi muốn toàn bộ thao tác thêm người, chọn người trung tâm và xem hồ sơ được tối ưu cho cảm ứng, để tôi sử dụng thoải mái bằng một tay.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-004` | *Use Case:* `UC-014` | *ACs:* `AC-US-E04-01`

---

### Epic F: Tìm kiếm & Định vị Thành viên
- **`US-F01` (Tìm kiếm theo tên có dấu & không dấu):**
  - *Story:* Là một người dùng, tôi muốn gõ tên thành viên (ví dụ: "Nguyen Van A" hoặc "Nguyễn Văn A") vào ô tìm kiếm, để lọc nhanh người tôi cần tìm trong hàng trăm người.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-005` | *Use Case:* `UC-017` | *ACs:* `AC-US-F01-01`
- **`US-F02` (Định vị nhân vật trên cây từ kết quả tìm kiếm):**
  - *Story:* Là một người dùng, khi tôi chọn một người từ danh sách kết quả tìm kiếm, tôi muốn đồ thị tự động cuộn (Pan & Center) tới vị trí của người đó, để tôi biết họ thuộc nhánh nào.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-005` | *Use Case:* `UC-017` | *ACs:* `AC-US-F02-01`

---

### Epic G: Ảnh Đại diện
- **`US-G01` (Tải lên ảnh chân dung):**
  - *Story:* Là một người quản trị cây, tôi muốn tải ảnh chân dung đại diện cho nhân vật, để cây gia phả thêm sinh động và dễ nhận biết người thân.
  - *Mức ưu tiên:* `Should` | *Objective:* `OBJ-002` | *Use Case:* `UC-018` | *ACs:* `AC-US-G01-01`

---

### Epic H: Sao lưu & Bảo toàn Dữ liệu
- **`US-H01` (Xuất file JSON sao lưu):**
  - *Story:* Là một người quản trị cây, tôi muốn bấm nút xuất bản sao lưu để tải về file `.json` chứa toàn bộ dữ liệu cây gia phả của tôi, để tôi tự cất giữ an toàn trên máy cá nhân.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-006` | *Use Case:* `UC-021` | *ACs:* `AC-US-H01-01`
- **`US-H02` (Nhập file JSON sao lưu):**
  - *Story:* Là một người quản trị cây, tôi muốn tải lên file `.json` đã sao lưu trước đó để phục hồi lại cây gia phả, để không bị mất dữ liệu khi chuyển thiết bị.
  - *Mức ưu tiên:* `Should` | *Objective:* `OBJ-006` | *Use Case:* `UC-022` | *ACs:* `AC-US-H02-01`

---

### Epic I: Quyền Riêng tư & An toàn Dữ liệu
- **`US-I01` (Cách ly dữ liệu người dùng):**
  - *Story:* Là một người dùng, tôi muốn đảm bảo không một người dùng nào khác có thể xem hay chỉnh sửa cây gia phả của tôi, để thông tin gia đình tôi được an toàn tuyệt đối.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-001` | *Use Case:* `UC-005` | *ACs:* `AC-US-I01-01`
- **`US-I02` (Xác nhận thao tác xóa nguy hiểm):**
  - *Story:* Là một người dùng, khi tôi thực hiện xóa nhân vật hoặc xóa cây, tôi muốn hệ thống yêu cầu xác nhận rõ ràng, để tránh việc tôi lỡ tay bấm nhầm gây mất dữ liệu.
  - *Mức ưu tiên:* `Must` | *Objective:* `OBJ-002` | *Use Case:* `UC-019` | *ACs:* `AC-US-I02-01`
