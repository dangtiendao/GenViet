# Tiêu chuẩn Chấp nhận Sản phẩm Chi tiết (Product Acceptance Criteria)

- **Mã tài liệu:** `PROD-AC-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Danh sách Acceptance Criteria Chi tiết (Định dạng Given - When - Then)

### Nhóm A: Tài khoản & Xác thực (Epic A)

- **`AC-US-A01-01` (Đăng ký thành công - Positive):**
  - **Given:** Người dùng chưa có tài khoản và đang ở trang Đăng ký.
  - **When:** Nhập một email hợp lệ chưa tồn tại và mật khẩu $\ge 6$ ký tự, sau đó nhấn "Đăng ký".
  - **Then:** Hệ thống tạo tài khoản mới thành công, tự động đăng nhập và chuyển hướng người dùng đến Dashboard.
- **`AC-US-A01-02` (Đăng ký lỗi trùng email - Negative/Validation):**
  - **Given:** Email `user@example.com` đã được đăng ký trên hệ thống.
  - **When:** Người dùng khác cố gắng đăng ký với email `user@example.com`.
  - **Then:** Hệ thống hiển thị thông báo lỗi "Email này đã được sử dụng" và không tạo tài khoản mới.
- **`AC-US-A02-01` (Đăng nhập thành công - Positive):**
  - **Given:** Người dùng đã có tài khoản hợp lệ.
  - **When:** Nhập đúng Email và Mật khẩu, nhấn "Đăng nhập".
  - **Then:** Đăng nhập thành công, chuyển đến danh sách cây gia phả.
- **`AC-US-A02-02` (Đăng nhập sai mật khẩu - Negative):**
  - **Given:** Người dùng đang ở màn hình Đăng nhập.
  - **When:** Nhập sai mật khẩu và nhấn "Đăng nhập".
  - **Then:** Hệ thống hiển thị lỗi "Email hoặc mật khẩu không chính xác", không tiết lộ email có tồn tại hay không.
- **`AC-US-A03-01` (Đăng xuất an toàn - Positive):**
  - **Given:** Người dùng đang trong phiên đăng nhập.
  - **When:** Nhấn nút "Đăng xuất" trong menu tài khoản.
  - **Then:** Phiên làm việc bị hủy, chuyển hướng về trang chủ/đăng nhập, không thể bấm nút Back trình duyệt để xem lại dữ liệu cũ.

---

### Nhóm B: Quản lý Cây Gia phả (Epic B)

- **`AC-US-B01-01` (Tạo cây gia phả mới - Positive):**
  - **Given:** Người dùng đã đăng nhập và đang ở Dashboard.
  - **When:** Nhập tên cây "Gia phả họ Lê" và nhấn "Tạo cây".
  - **Then:** Cây mới được tạo và người dùng được chuyển ngay vào màn hình Canvas đồ thị của cây đó.
- **`AC-US-B02-01` (Xem danh sách cây - Positive):**
  - **Given:** Người dùng đã tạo 2 cây gia phả ("Họ Nguyễn Nội" và "Họ Trần Ngoại").
  - **When:** Vào trang Dashboard.
  - **Then:** Hiển thị đủ danh sách 2 cây, có nút mở từng cây độc lập.
- **`AC-US-B03-01` (Trạng thái cây rỗng - Empty State):**
  - **Given:** Cây gia phả mới tạo chưa có thành viên nào.
  - **When:** Người dùng mở cây gia phả.
  - **Then:** Hệ thống hiển thị màn hình Empty State với thông điệp chào mừng và nút bấm nổi bật `[+ Tạo thành viên đầu tiên]`.

---

### Nhóm C: Quản lý Nhân vật (Epic C)

- **`AC-US-C01-01` (Tạo người đầu tiên đầy đủ thông tin - Positive):**
  - **Given:** Cây gia phả đang rỗng.
  - **When:** Người dùng nhập Họ tên "Nguyễn Văn A", Giới tính "Nam", Năm sinh "1950" và nhấn "Lưu".
  - **Then:** Nhân vật được tạo thành công, xuất hiện ở vị trí trung tâm Canvas với đầy đủ nhãn tên và năm sinh.
- **`AC-US-C01-02` (Tạo người chỉ có Họ tên - Validation/Tolerance):**
  - **Given:** Form tạo nhân vật.
  - **When:** Người dùng chỉ nhập Họ tên "Trần Thị B", Giới tính "Nữ", bỏ trống ngày/năm sinh và nhấn "Lưu".
  - **Then:** Hệ thống vẫn lưu thành công nhân vật và hiển thị trên cây mà không báo lỗi thiếu ngày sinh.
- **`AC-US-C02-01` (Xem chi tiết hồ sơ - Positive):**
  - **Given:** Nhân vật "Nguyễn Văn A" đang có mặt trên cây.
  - **When:** Người dùng nhấp chuột (hoặc chạm tay) vào node "Nguyễn Văn A".
  - **Then:** Bảng thông tin chi tiết (Side Panel trên Desktop / Bottom Drawer trên Mobile) mở ra hiển thị họ tên, giới tính, năm sinh/mất, danh sách cha mẹ, vợ chồng và con cái.
- **`AC-US-C03-01` (Chỉnh sửa hồ sơ - Positive):**
  - **Given:** Nhân vật "Nguyễn Văn A" có năm sinh 1950.
  - **When:** Người dùng sửa năm sinh thành 1948 và thêm tiểu sử "Cụ đỗ tú tài năm 1970", nhấn "Cập nhật".
  - **Then:** Thông tin được lưu ngay lập tức, node trên cây cập nhật năm sinh 1948.
- **`AC-US-C04-01` (Xóa mềm nhân vật kèm xác nhận - Negative/Safety):**
  - **Given:** Nhân vật "Nguyễn Văn C" trên cây.
  - **When:** Người dùng nhấn nút "Xóa thành viên".
  - **Then:** Hộp thoại cảnh báo xuất hiện: "Bạn có chắc chắn muốn xóa thành viên này khỏi cây gia phả không?".
- **`AC-US-C04-02` (Xác nhận xóa mềm thành công - Positive/Soft-delete):**
  - **Given:** Hộp thoại xác nhận xóa nhân vật "Nguyễn Văn C" đang hiển thị.
  - **When:** Người dùng bấm "Xác nhận xóa".
  - **Then:** Nhân vật biến mất khỏi đồ thị cây gia phả, các liên kết nối tới người này bị ngắt, nhưng bản ghi trong CSDL chỉ bị đánh dấu `is_deleted = true` (không xóa vật lý ngay).
- **`AC-US-C05-01` (Khôi phục nhân vật từ thùng rác - Recovery/Should):**
  - **Given:** Người dùng mở danh sách thành viên đã xóa (Thùng rác).
  - **When:** Chọn "Nguyễn Văn C" và nhấn "Khôi phục".
  - **Then:** Nhân vật được phục hồi trạng thái hoạt động và xuất hiện trở lại trong danh sách thành viên của cây.

---

### Nhóm D: Quản lý Mối quan hệ Phả hệ (Epic D)

- **`AC-US-D01-01` (Thêm Cha mới - Mở rộng tổ tiên lên trên - Positive):**
  - **Given:** Nhân vật "Nguyễn Văn Con" (Đời 2) chưa có cha trên cây.
  - **When:** Người dùng bấm "+ Thêm Cha", nhập tên "Nguyễn Văn Cha" và nhấn Lưu.
  - **Then:** "Nguyễn Văn Cha" được tạo mới với giới tính Nam, tự động nối đường liên kết cha-con, vị trí của "Nguyễn Văn Cha" nằm ở tầng trên của "Nguyễn Văn Con".
- **`AC-US-D02-01` (Thêm Mẹ mới - Mở rộng tổ tiên lên trên - Positive):**
  - **Given:** Nhân vật "Nguyễn Văn Con" chưa có mẹ trên cây.
  - **When:** Người dùng bấm "+ Thêm Mẹ", nhập tên "Trần Thị Mẹ" và nhấn Lưu.
  - **Then:** "Trần Thị Mẹ" được tạo mới với giới tính Nữ, nối liên kết mẹ-con ở tầng trên.
- **`AC-US-D03-01` (Liên kết Cha/Mẹ có sẵn trong cây - Positive):**
  - **Given:** "Cụ A" đã tồn tại trong cây.
  - **When:** Người dùng mở hồ sơ "Người B", chọn mục Phụ mẫu $\rightarrow$ Chọn "Liên kết người có sẵn" $\rightarrow$ Chọn "Cụ A" làm Cha.
  - **Then:** Quan hệ Cha-Con giữa Cụ A và Người B được thiết lập thành công trên đồ thị.
- **`AC-US-D04-01` (Thêm Vợ/Chồng - Hôn phối - Positive):**
  - **Given:** Nhân vật "Nguyễn Văn A" (Nam).
  - **When:** Bấm "+ Thêm Vợ", nhập tên "Lê Thị Vợ" và nhấn Lưu.
  - **Then:** Node "Lê Thị Vợ" được tạo và đặt cạnh "Nguyễn Văn A" ở cùng một tầng thế hệ, nối với nhau bằng đường hôn phối.
- **`AC-US-D05-01` (Thêm Con cái - Positive):**
  - **Given:** Cặp vợ chồng "Nguyễn Văn A" & "Lê Thị Vợ".
  - **When:** Bấm "+ Thêm Con", nhập tên "Nguyễn Văn Con Trai" và nhấn Lưu.
  - **Then:** "Nguyễn Văn Con Trai" được tạo ở tầng dưới, nối dây bắt nguồn từ cặp cha mẹ A - Vợ.
- **`AC-US-D06-01` (Chống Self-link - Validation):**
  - **Given:** Nhân vật "Nguyễn Văn A".
  - **When:** Người dùng cố gắng chọn "Nguyễn Văn A" làm Cha của chính "Nguyễn Văn A".
  - **Then:** Hệ thống từ chối và thông báo lỗi "Một người không thể là cha/mẹ của chính mình".
- **`AC-US-D06-02` (Chống Chu trình vòng lặp - Anti-cycle / Integrity):**
  - **Given:** Cụ A là Cha của Ông B; Ông B là Cha của Anh C.
  - **When:** Người dùng cố gắng chọn Anh C làm Cha của Cụ A.
  - **Then:** Hệ thống phát hiện chu trình vòng lặp, từ chối lưu và hiển thị thông báo lỗi "Không thể thiết lập quan hệ vì gây ra vòng lặp thế hệ phi logic".

---

### Nhóm E: Trực quan hóa & Tương tác Đồ thị (Epic E)

- **`AC-US-E01-01` (Hiển thị phân tầng đồ thị tự động - Positive):**
  - **Given:** Cây gia phả có 3 thế hệ (Ông bà, Cha mẹ, Con cái).
  - **When:** Người dùng mở màn hình đồ thị.
  - **Then:** Các thành viên cùng thế hệ nằm trên cùng một hàng ngang; các thế hệ trên/dưới được xếp thẳng hàng theo trục dọc tự động.
- **`AC-US-E02-01` (Đổi người trung tâm - Navigation):**
  - **Given:** Đồ thị đang hiển thị quanh "Cụ Tổ".
  - **When:** Người dùng nhấp đúp vào node "Cháu Đích Tôn".
  - **Then:** Đồ thị tự động tính toán lại, căn giữa màn hình vào "Cháu Đích Tôn" và mở rộng các nhánh xung quanh người này.
- **`AC-US-E03-01` (Zoom & Pan mượt mà - Interaction):**
  - **Given:** Đồ thị đang mở trên màn hình.
  - **When:** Người dùng cuộn con lăn chuột hoặc dùng 2 ngón tay chụm/mở (pinch).
  - **Then:** Tỷ lệ đồ thị phóng to/thu nhỏ mượt mà từ 20% đến 200% mà không bị giật lag khung hình.
- **`AC-US-E04-01` (Trải nghiệm chạm trên điện thoại - Mobile Responsive):**
  - **Given:** Người dùng mở ứng dụng trên điện thoại có màn hình rộng 375px (iPhone).
  - **When:** Dùng 1 ngón tay vuốt trên màn hình để di chuyển cây.
  - **Then:** Canvas đồ thị di chuyển mượt mà theo ngón tay; khi chạm vào một node thì mở Drawer thông tin từ đáy màn hình mà không che mất toàn bộ cây.

---

### Nhóm F: Tìm kiếm & Định vị (Epic F)

- **`AC-US-F01-01` (Tìm kiếm không dấu & có dấu - Positive):**
  - **Given:** Cây gia phả có thành viên tên "Nguyễn Đăng Tiến".
  - **When:** Người dùng nhập "dang tien" hoặc "Đăng Tiến" vào thanh tìm kiếm.
  - **Then:** Kết quả tìm kiếm hiển thị thành viên "Nguyễn Đăng Tiến" trong danh sách gợi ý.
- **`AC-US-F02-01` (Định vị nhân vật từ tìm kiếm - Navigation):**
  - **Given:** Danh sách kết quả tìm kiếm đang hiển thị "Nguyễn Đăng Tiến".
  - **When:** Người dùng nhấp vào kết quả đó.
  - **Then:** Khung nhìn Canvas tự động di chuyển (Smooth Pan) đưa node "Nguyễn Đăng Tiến" vào chính giữa màn hình và nhấp nháy làm nổi bật (Highlight node).

---

### Nhóm G & H: Ảnh đại diện & Sao lưu Dữ liệu (Epics G & H)

- **`AC-US-G01-01` (Tải lên ảnh chân dung - Positive/Should):**
  - **Given:** Người dùng ở trang chỉnh sửa hồ sơ nhân vật.
  - **When:** Chọn một file ảnh `.jpg`/`.png` có dung lượng $\le 2\text{MB}$ và nhấn Lưu.
  - **Then:** Ảnh được tải lên Supabase Storage thành công và hiển thị avatar tròn trên node của nhân vật.
- **`AC-US-H01-01` (Xuất file JSON sao lưu đầy đủ - Backup/Must):**
  - **Given:** Cây gia phả có 15 thành viên và 14 mối quan hệ.
  - **When:** Người dùng nhấn nút "Sao lưu dữ liệu (JSON)".
  - **Then:** Trình duyệt tải về file `genviet_backup_<ten-cay>_<timestamp>.json` chứa đủ 100% 15 nhân vật và 14 quan hệ đúng cấu trúc schema v0.1.
- **`AC-US-H02-01` (Nhập file JSON sao lưu hợp lệ - Restore/Should):**
  - **Given:** Người dùng có file backup JSON hợp lệ của GenViet v0.1.
  - **When:** Chọn chức năng "Nhập từ file sao lưu" và chọn file JSON.
  - **Then:** Hệ thống giải mã dữ liệu, tạo cây gia phả mới với toàn bộ nhân vật và mối quan hệ nguyên vẹn như lúc xuất.

---

### Nhóm I: Quyền Riêng tư & Bảo mật (Epic I)

- **`AC-US-I01-01` (Cách ly dữ liệu người dùng - Privacy/Security/Must):**
  - **Given:** Tài khoản User B đang đăng nhập.
  - **When:** User B cố gắng gửi request đọc hoặc sửa dữ liệu `tree_id` hoặc `person_id` thuộc quyền sở hữu của User A.
  - **Then:** Hệ thống từ chối truy cập (HTTP 403 Forbidden / Trả về rỗng do RLS) và tuyệt đối không để lộ bất kỳ thông tin nào của User A.
- **`AC-US-I02-01` (Xác nhận thao tác xóa cây gia phả - Safety/Must):**
  - **Given:** Người dùng đang ở màn hình cài đặt cây.
  - **When:** Nhấn "Xóa toàn bộ cây gia phả".
  - **Then:** Hệ thống hiển thị hộp thoại yêu cầu gõ lại đúng tên cây để xác nhận hành động hủy bỏ không thể hoàn tác.
