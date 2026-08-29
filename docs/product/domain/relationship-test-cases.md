# Danh mục Kịch bản Kiểm thử Quan hệ Nghiệp vụ (Relationship Test Cases)

- **Mã tài liệu:** `DOM-TESTCASES-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Nguyên tắc Xây dựng Bộ Kịch bản Kiểm thử

1. **100% Mock Data Giả lập:** Toàn bộ họ tên, ngày tháng trong tài liệu này là dữ liệu giả định phục vụ kiểm thử, không liên quan đến bất kỳ cá nhân thật nào ngoài đời.
2. **Bao phủ Đầy đủ Mọi Tình huống:** Bao gồm ca thành công (Positive / Happy path), ca vi phạm Invariant (Negative / Blocking), ca dữ liệu bất thường (Warning) và ca phục hồi (Recovery).

---

## 2. Bảng 80 Kịch bản Kiểm thử Chi tiết (`RTC-001` đến `RTC-080`)

### Nhóm 1: Nhận dạng & Ranh giới Phạm vi (Identity & Scope)
- **`RTC-001` (User chưa liên kết Person):** User `user_01@test.com` đăng ký tài khoản $\rightarrow$ Chưa gán Person nào $\rightarrow$ Dashboard hoạt động bình thường (`PASS`).
- **`RTC-002` (Person không có User):** Tạo Person "Nguyễn Văn Cụ Tổ" $\rightarrow$ Không có email/user $\rightarrow$ Lưu thành công (`PASS`).
- **`RTC-003` (Xóa User không mất Person):** User A xóa tài khoản $\rightarrow$ Các bản ghi Person trong cây vẫn tồn tại nguyên vẹn (`PASS`).
- **`RTC-004` (Chặn liên kết chéo Cây):** Nối Person A (Cây 1) với Person B (Cây 2) $\rightarrow$ Hệ thống chặn `ERR-004` (`PASS`).

---

### Nhóm 2: Khởi tạo & Mở rộng Cây Gia phả (Expansion & Anchors)
- **`RTC-005` (Tạo Person đầu tiên A):** Cây rỗng $\rightarrow$ Tạo "Nguyễn Văn A" $\rightarrow$ A xuất hiện ở trung tâm (`PASS`).
- **`RTC-006` (Thêm Cha B cho A):** Bấm "+ Thêm Cha" $\rightarrow$ Nhập "Nguyễn Văn B" $\rightarrow$ B nằm ở tầng trên A (`PASS`).
- **`RTC-007` (Thêm Mẹ C cho A):** Bấm "+ Thêm Mẹ" $\rightarrow$ Nhập "Trần Thị C" $\rightarrow$ C nằm ở tầng trên A bên cạnh B (`PASS`).
- **`RTC-008` (Thêm Ông D qua B):** Mở hồ sơ B $\rightarrow$ "+ Thêm Cha" $\rightarrow$ Nhập "Nguyễn Văn D" $\rightarrow$ D nằm ở tầng trên B (`PASS`).
- **`RTC-009` (Thêm Bà E qua C):** Mở hồ sơ C $\rightarrow$ "+ Thêm Mẹ" $\rightarrow$ Nhập "Lê Thị E" $\rightarrow$ E nằm ở tầng trên C (`PASS`).
- **`RTC-010` (Giữ Center Person A sau khi mở rộng):** Sau khi thêm D và E $\rightarrow$ Khung nhìn vẫn tập trung vào A (`PASS`).
- **`RTC-011` (Đổi Center Person sang B):** Nhấp đúp vào B $\rightarrow$ Đồ thị căn giữa vào B (`PASS`).
- **`RTC-012` (Initial Person không phải Thủy tổ):** Node A tạo đầu tiên nhưng không tự động gắn cờ Thủy tổ (`PASS`).

---

### Nhóm 3: Quan hệ Phụ Mẫu - Tử Tức (Parent-Child)
- **`RTC-013` (Thêm Cha mới thành công):** Tạo Cha với đầy đủ họ tên $\rightarrow$ Quan hệ `ParentChild(Cha, Con)` được thiết lập (`PASS`).
- **`RTC-014` (Liên kết Cha đã có trong cây):** Chọn Ông B có sẵn làm Cha của Anh F $\rightarrow$ Nối đường thành công (`PASS`).
- **`RTC-015` (Thêm Mẹ mới thành công):** Tạo Mẹ với giới tính Nữ $\rightarrow$ Quan hệ `MOTHER` hợp lệ (`PASS`).
- **`RTC-016` (Liên kết Mẹ đã có trong cây):** Chọn Bà C có sẵn làm Mẹ của Chị G $\rightarrow$ Nối đường thành công (`PASS`).
- **`RTC-017` (Thêm Con cái):** Chọn cặp B-C $\rightarrow$ "+ Thêm Con" $\rightarrow$ Con xuất hiện ở tầng dưới B-C (`PASS`).
- **`RTC-018` (Chống Self-Parent):** Chọn A làm Cha của A $\rightarrow$ Chặn `ERR-001` (`PASS`).
- **`RTC-019` (Chống Trùng liên kết Cha-Con):** Tạo lại quan hệ Cha-Con giữa A và B $\rightarrow$ Chặn `ERR-006` (`PASS`).
- **`RTC-020` (Cảnh báo Thêm Cha ruột thứ 2):** Con đã có Cha ruột, thêm Cha ruột mới $\rightarrow$ Cảnh báo `WARN-001` (`PASS`).
- **`RTC-021` (Cho phép Quan hệ Chưa xác minh cạnh tranh):** Lưu quan hệ Cha thứ 2 ở mức `UNVERIFIED` $\rightarrow$ Lưu thành công nét đứt (`PASS`).
- **`RTC-022` (Person thiếu cả Cha và Mẹ):** Tạo nhân vật độc lập không cha mẹ $\rightarrow$ Lưu thành công (`PASS`).

---

### Nhóm 4: Phát hiện & Ngăn chặn Chu trình (Cycle Invariants)
- **`RTC-023` (Chu trình 2 Node A -> B -> A):** A là cha B; chọn B làm cha A $\rightarrow$ Chặn `ERR-002` (`PASS`).
- **`RTC-024` (Chu trình 3 Thế hệ A -> B -> C -> A):** A cha B, B cha C; chọn C làm cha A $\rightarrow$ Chặn `ERR-002` (`PASS`).
- **`RTC-025` (Chu trình Dài N Thế hệ):** Chuỗi 7 thế hệ; chọn Chắt đời 7 làm cha Cụ đời 1 $\rightarrow$ Chặn `ERR-002` (`PASS`).
- **`RTC-026` (Merge tạo Chu trình):** Gộp 2 node thuộc 2 nhánh khiến xuất hiện chu trình $\rightarrow$ Chặn `ERR-008` (`PASS`).
- **`RTC-027` (Restore tạo Chu trình):** Khôi phục node cũ khiến cây bị vòng lặp $\rightarrow$ Cảnh báo và ngắt liên kết chu trình (`PASS`).
- **`RTC-028` (Spouse Edge Không gây Chu trình):** A kết hôn B; A và B cùng là cha mẹ của C $\rightarrow$ Hợp lệ 100%, không bị coi là chu trình (`PASS`).

---

### Nhóm 5: Quan hệ Hôn nhân & Đa Hôn phối (Marriage)
- **`RTC-029` (Thêm Vợ/Chồng thành công):** A kết hôn B $\rightarrow$ Vẽ đường nối ngang cùng tầng (`PASS`).
- **`RTC-030` (Chống Self-Spouse):** A kết hôn A $\rightarrow$ Chặn `ERR-003` (`PASS`).
- **`RTC-031` (Chống Trùng Hôn nhân):** Tạo 2 bản ghi kết hôn giữa A và B $\rightarrow$ Chặn `ERR-006` (`PASS`).
- **`RTC-032` (Nhiều lần kết hôn nối tiếp):** A kết hôn B (đã ly hôn), sau đó kết hôn C $\rightarrow$ Lưu đủ 2 người phối ngẫu (`PASS`).
- **`RTC-033` (Hôn nhân chồng lấn thời gian):** Nhập 2 hôn nhân cùng `ACTIVE` $\rightarrow$ Cảnh báo `WARN-003`, cho phép lưu (`PASS`).
- **`RTC-034` (Kết thúc hôn nhân không mất con):** Xóa quan hệ hôn nhân giữa A và B $\rightarrow$ Con C vẫn giữ quan hệ với A và B (`PASS`).
- **`RTC-035` (Xóa hôn nhân không xóa Person):** Xóa liên kết kết hôn $\rightarrow$ Cả 2 Person A và B vẫn tồn tại trên cây (`PASS`).

---

### Nhóm 6: Quan hệ Đặc biệt (Adoptive, Step, Guardian)
- **`RTC-036` (Thêm Cha nuôi cùng Cha ruột):** A có Cha ruột B và Cha nuôi C $\rightarrow$ Hiển thị cả 2 với nhãn `Nuôi` (`PASS`).
- **`RTC-037` (Thêm Mẹ nuôi cùng Mẹ ruột):** A có Mẹ ruột D và Mẹ nuôi E $\rightarrow$ Lưu thành công (`PASS`).
- **`RTC-038` (Cha mẹ kế suy ra từ Hôn nhân):** B kết hôn C (C có con riêng F) $\rightarrow$ B là Cha kế của F (`PASS`).
- **`RTC-039` (Người giám hộ không tạo Huyết thống):** G là giám hộ của H $\rightarrow$ G không xuất hiện ở vị trí cha mẹ trên cây (`PASS`).
- **`RTC-040` (Người giám hộ không ảnh hưởng Số đời):** G giám hộ H $\rightarrow$ Số đời của H tính theo cha mẹ ruột, không theo G (`PASS`).
- **`RTC-041` (Cha mẹ nuôi không thay thế Cha mẹ ruột):** Nhận con nuôi không làm đứt quan hệ với cha mẹ đẻ (`PASS`).

---

### Nhóm 7: Dữ liệu Ngày tháng Không đầy đủ & Ước tính (Dates)
- **`RTC-042` (Chỉ biết Năm sinh):** Nhập `1950` $\rightarrow$ Lưu `YEAR_ONLY`, không tự điền `01/01` (`PASS`).
- **`RTC-043` (Chỉ biết Tháng và Năm):** Nhập `05/1950` $\rightarrow$ Lưu `MONTH_YEAR` (`PASS`).
- **`RTC-044` (Năm sinh Ước tính):** Nhập `Khoảng 1940` $\rightarrow$ Lưu `APPROXIMATE` (`PASS`).
- **`RTC-045` (Không rõ Ngày sinh):** Để trống ngày sinh $\rightarrow$ Lưu thành công (`PASS`).
- **`RTC-046` (Đã mất nhưng không rõ Ngày mất):** `is_living = false`, `death_date = NULL` $\rightarrow$ Lưu thành công (`PASS`).
- **`RTC-047` (Ngày mất trước Ngày sinh - Exact):** Sinh `1980-01-01`, mất `1975-01-01` $\rightarrow$ Chặn `ERR-005` (`PASS`).
- **`RTC-048` (Khoảng ngày chồng lấn):** Sinh `~1940`, mất `~1940` $\rightarrow$ Cảnh báo `WARN-004` (`PASS`).
- **`RTC-049` (Không tự động điền 01/01):** Xuất JSON file backup $\rightarrow$ Kiểm tra trường sinh năm 1930 không có `-01-01` (`PASS`).
- **`RTC-050` (Thiếu ngày mất không suy ra còn sống):** Cụ sinh 1850 không có ngày mất $\rightarrow$ Không tự động gán là còn sống (`PASS`).

---

### Nhóm 8: Phát hiện Trùng & Gộp Hồ sơ (Duplicate & Merge)
- **`RTC-051` (Cùng Tên khác Cha Mẹ):** Tạo 2 người cùng tên "Nguyễn Văn A" khác cha mẹ $\rightarrow$ Cho phép lưu (`PASS`).
- **`RTC-052` (Khác Tên cùng Ngày sinh Cha Mẹ):** Tên thường gọi khác nhau $\rightarrow$ Cảnh báo `WARN-005` (`PASS`).
- **`RTC-053` (Cảnh báo Possible Duplicate):** Trùng họ tên trong cùng nhánh $\rightarrow$ Hiển thị gợi ý (`PASS`).
- **`RTC-054` (Người dùng Bỏ qua Cảnh báo Trùng):** Nhấn "Tiếp tục tạo mới" $\rightarrow$ Lưu thành công (`PASS`).
- **`RTC-055` (Merge 2 Hồ sơ không Xung đột):** Gộp A1 vào A2 $\rightarrow$ Quan hệ của A1 chuyển sang A2, A1 lưu trữ (`PASS`).
- **`RTC-056` (Merge có Dữ liệu Mâu thuẫn):** A1 sinh 1950, A2 sinh 1952 $\rightarrow$ Bắt buộc chọn 1 năm sinh trước khi gộp (`PASS`).
- **`RTC-057` (Merge tạo Self-link):** Gộp vợ vào chồng $\rightarrow$ Chặn `ERR-007` (`PASS`).
- **`RTC-058` (Merge 2 Hồ sơ thuộc 2 Cây):** Chặn gộp cross-tree (`PASS`).
- **`RTC-059` (Truy vết Hồ sơ bị Gộp):** Tìm kiếm A1 $\rightarrow$ Hiển thị thông báo "Đã gộp vào A2" (`PASS`).

---

### Nhóm 9: Xóa Mềm & Phục hồi (Deletion & Recovery)
- **`RTC-060` (Xóa mềm Node Độc lập):** Xóa Person không quan hệ $\rightarrow$ Đánh dấu `is_deleted = true` (`PASS`).
- **`RTC-061` (Xóa Person có Cha Mẹ):** Xóa Con $\rightarrow$ Cha Mẹ vẫn tồn tại bình thường (`PASS`).
- **`RTC-062` (Xóa Person có Con cái):** Xóa Cha $\rightarrow$ Con cái vẫn tồn tại, ngắt liên kết với Cha (`PASS`).
- **`RTC-063` (Xóa Person có Vợ/Chồng):** Xóa Chồng $\rightarrow$ Vợ vẫn tồn tại bình thường (`PASS`).
- **`RTC-064` (Xóa Center Person):** Xóa node đang chọn $\rightarrow$ Tự động chuyển Center sang node thân thuộc khác (`PASS`).
- **`RTC-065` (Xóa Generation Anchor):** Xóa node Mốc $\rightarrow$ Yêu cầu chọn Mốc mới hoặc tắt số đời (`PASS`).
- **`RTC-066` (Xóa Thủy tổ):** Xóa node Thủy tổ $\rightarrow$ Gỡ cờ Thủy tổ (`PASS`).
- **`RTC-067` (Khôi phục không Xung đột):** Phục hồi node từ thùng rác $\rightarrow$ Xuất hiện lại trên cây (`PASS`).
- **`RTC-068` (Khôi phục có Xung đột Quan hệ):** Quan hệ cũ bị trùng $\rightarrow$ Phục hồi node kèm cảnh báo `WARN-006` (`PASS`).

---

### Nhóm 10: Tính Số Đời (Generation Calculation)
- **`RTC-069` (Anchor Đời 1):** Gán Anchor cho Cụ Tổ $\rightarrow$ Cụ Tổ là Đời 1 (`PASS`).
- **`RTC-070` (Con Đời 2):** Con ruột Cụ Tổ $\rightarrow$ Đời 2 (`PASS`).
- **`RTC-071` (Cháu Đời 3):** Cháu ruột Cụ Tổ $\rightarrow$ Đời 3 (`PASS`).
- **`RTC-072` (Thêm Cha phía trên Anchor):** Thêm Cha cho Mốc $\rightarrow$ Gắn nhãn `Tiền bối của Mốc` (`PASS`).
- **`RTC-073` (Đổi Mốc sang Cụ cao hơn):** Đổi Mốc sang Cụ $\rightarrow$ Toàn cây tự động tính lại số đời (`PASS`).
- **`RTC-074` (Vợ/Chồng không nhận Số đời Huyết thống):** Dâu/Rể hiển thị cùng hàng nhưng không nhận số đời huyết thống (`PASS`).
- **`RTC-075` (Node chưa kết nối Mốc):** Node cụm rời $\rightarrow$ Mang nhãn `UNDETERMINED` (`PASS`).
- **`RTC-076` (Xung đột Hai đường dẫn Thế hệ):** Hôn nhân họ hàng $\rightarrow$ Gắn nhãn `GENERATION_CONFLICT` (`PASS`).

---

### Nhóm 11: Phân cấp Mức độ Lỗi (Validation Severities)
- **`RTC-077` (Chặn đứng Blocking Invariant):** Gửi thao tác sai logic $\rightarrow$ Trả về lỗi `400/422` kèm mã lỗi (`PASS`).
- **`RTC-078` (Hiển thị Modal Xác nhận Warning):** Thao tác xóa hoặc trùng tên $\rightarrow$ Hiện modal xác nhận (`PASS`).
- **`RTC-079` (Lưu thành công Warning Mềm):** Quan hệ chưa xác minh $\rightarrow$ Lưu bình thường kèm cờ lưu ý (`PASS`).
- **`RTC-080` (Hiển thị Thông báo Information):** Thông báo cây rỗng hoặc cụm rời $\rightarrow$ Hiển thị tooltip hướng dẫn (`PASS`).
