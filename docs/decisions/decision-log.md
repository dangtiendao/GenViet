# Nhật ký Quyết định Dự án GenViet (Decision Log)

Tài liệu này tổng hợp toàn bộ các quyết định kỹ thuật, kiến trúc và quản trị đã được phê duyệt trong suốt vòng đời dự án **GenViet**.

---

## 1. Danh sách Quyết định đã Khóa (Locked Decisions - Nền tảng)

Các quyết định dưới đây tạo thành khung nguyên tắc nền tảng của dự án và không được tự ý sửa đổi khi chưa có sự chấp thuận bằng văn bản của Project Owner:

| Mã Quyết định | Tiêu đề quyết định | Trạng thái | Ngày khóa | Tóm tắt nội dung |
| :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | Tên dự án & Repository | `ACCEPTED` | 2026-08-29 | Tên thương hiệu là **GenViet**, tên kỹ thuật là `genviet`. |
| **DEC-002** | Nguồn dữ liệu chính | `ACCEPTED` | 2026-08-29 | Sử dụng **PostgreSQL** (thông qua Supabase) làm CSDL chính cho toàn bộ dữ liệu nghiệp vụ. |
| **DEC-003** | Tách biệt User & Person | `ACCEPTED` | 2026-08-29 | **Tài khoản người dùng (User)** và **Nhân vật gia phả (Person)** là 2 thực thể độc lập. Một tài khoản có thể quản lý nhiều cây/nhân vật. |
| **DEC-004** | Quy trình Phase bắt buộc | `ACCEPTED` | 2026-08-29 | Mọi giai đoạn thi công phải tuân thủ 8 cổng kiểm soát (G0 - G7) và bộ 10 tài liệu chuẩn. |
| **DEC-005** | Tính trung lập nền tảng | `ACCEPTED` | 2026-08-29 | Không phụ thuộc sâu vào các API độc quyền của Vercel nhằm đảm bảo dễ dàng chuyển đổi sang Cloudflare trong tương lai. |
| **DEC-006** | Bảo mật Secret & Git | `ACCEPTED` | 2026-08-29 | Tuyệt đối không commit file `.env`, service role keys, API token hay dữ liệu cá nhân thật vào Git. |
| **DEC-007** | Ràng buộc An toàn Git cho AI | `ACCEPTED` | 2026-08-29 | AI chỉ được tạo nhánh và commit cục bộ. Cấm tuyệt đối AI push, merge, force-push hoặc tạo PR từ xa. |
| **DEC-008** | Công nghệ Visualization | `ACCEPTED` | 2026-08-29 | Sử dụng kết hợp **React Flow** (tương tác đồ thị) và **ELK.js** (thuật toán tính toán layout phân tầng tự động). |

---

## 2. Nhật ký Quyết định theo từng Phase

### Phase P00: Quản trị dự án (Project Governance)

- **DEC-P00-01 (Cấu trúc tài liệu phân tầng):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `ACCEPTED`
  - *Nội dung:* Áp dụng cấu trúc thư mục `docs/` module hóa theo domain (`product`, `architecture`, `database`, `security`, `testing`, `operations`, `phases`, `decisions`, `risks`, `prompts`, `templates`).
  - *Lý do:* Giúp AI và kỹ sư con người dễ dàng định vị ngữ cảnh, tránh nhồi nhét toàn bộ thông tin vào một file lớn gây tràn ngữ cảnh (context window).

- **DEC-P00-02 (Quy chuẩn Commit Scope):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `ACCEPTED`
  - *Nội dung:* Bắt buộc áp dụng Conventional Commits có scope phase: `<type>(PXX): <mô tả>`.
  - *Lý do:* Giúp truy vết lịch sử commit tương ứng chính xác với từng phase và dễ dàng tự động hóa việc xuất changelog.

### Phase P01: Chốt phạm vi sản phẩm (Product Scope Definition)

- **P01-DEC-001 (Mô hình Single-Owner cho MVP v0.1):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED_FOR_APPROVAL`
  - *Nội dung:* v0.1 tập trung vào trải nghiệm một cá nhân tự quản lý gia phả; hoãn phân quyền cộng tác đa người dùng sang v0.2+.
  - *Lý do:* Giữ kiến trúc đơn giản, giảm thiểu rủi ro xung đột ghi đè đồng thời và tăng tốc độ ra mắt MVP.

- **P01-DEC-002 (Khởi tạo từ Node Bất kỳ & Mở rộng Tổ tiên Đa chiều):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED_FOR_APPROVAL`
  - *Nội dung:* Cho phép bắt đầu cây từ bất kỳ nhân vật nào và bổ sung cha mẹ lên trên hoặc con cháu xuống dưới linh hoạt.
  - *Lý do:* Phù hợp với thực tế thu thập dữ liệu chắp vá của người dùng Việt Nam.

- **P01-DEC-003 (Xuất JSON là Must-Have, Nhập JSON là Should-Have):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED_FOR_APPROVAL`
  - *Nội dung:* Bắt buộc tính năng Xuất JSON sao lưu trong v0.1; tính năng Nhập JSON xếp mức Should.
  - *Lý do:* Đảm bảo an toàn dữ liệu cho người dùng trước, tránh phát sinh lỗi phức tạp khâu parse schema.

- **P01-DEC-004 (Ngưỡng Quy mô 1.000 người & Cửa sổ Hiển thị 2-3 đời):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `ACCEPTED`
  - *Nội dung:* CSDL hỗ trợ lưu 1.000 người/cây; Canvas đồ thị hiển thị cửa sổ 50-80 node (2-3 thế hệ) quanh người trung tâm.
  - *Lý do:* Đảm bảo hiệu năng mượt mà $\ge 45\text{ FPS}$ trên điện thoại thông minh.

### Phase P02: Phân tích nghiệp vụ gia phả (Genealogy Domain Analysis)

- **P02-DEC-001 (Phân định Rạch ròi 4 Loại Người Mốc):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Tách biệt 4 khái niệm độc lập: Initial Person (thứ tự tạo), Center Person (trọng tâm nhìn), Founding Ancestor (danh hiệu danh dự), Generation Anchor (mốc Đời 1).
  - *Lý do:* Loại bỏ các giả định sai lầm và cho phép mở rộng cây đa chiều linh hoạt.

- **P02-DEC-002 (Xử lý Cha Mẹ Kế & Giám Hộ trong v0.1):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Cha Mẹ Kế là quan hệ suy ra từ Hôn nhân; Giám Hộ lưu ở dạng ghi chú Profile, không vẽ đường nối trên Canvas chính ở v0.1.
  - *Lý do:* Giữ đồ thị trực quan, tập trung vào huyết thống và hôn phối trực tiếp.

- **P02-DEC-003 (Cấm Điền Ngày Giả 01/01 & Bảo toàn Date Precision):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Lưu đồng thời giá trị niên đại và mã precision; cấm tự tiện biến năm sinh thành ngày giả `01/01`.
  - *Lý do:* Tôn trọng tính trung thực của dữ liệu lịch sử phả hệ.

- **P02-DEC-004 (Cấm Tự ý Xóa Lan Truyền - No Silent Cascade):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Xóa một Person chỉ ngắt kết nối trực tiếp của người đó; toàn bộ con cái, cha mẹ, vợ chồng vẫn giữ nguyên vẹn trên cây.
  - *Lý do:* Bảo vệ dữ liệu phả hệ khỏi các thao tác xóa nhầm tai hại.

- **P02-DEC-005 (Số Đời Tính Tương Đối theo Anchor):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Số đời là nhãn hiển thị tương đối theo Mốc (Anchor = 1); thêm tổ tiên phía trên không ép đổi số đời toàn cây.
  - *Lý do:* Tránh việc cập nhật hàng loạt số đời trong CSDL mỗi khi thêm cụ tổ mới.

---

## 3. Danh sách các Quyết định mở / Đang thảo luận (Open Decisions)

1. **OPEN-DEC-01 (Giấy phép mã nguồn - License):** Quyết định lựa chọn giữa AGPLv3, MIT hoặc Proprietary (Bản quyền đóng). Tạm hoãn xem xét ở giai đoạn trước khi phát hành MVP.
2. **OPEN-DEC-02 (Provider gửi Email):** Lựa chọn giữa Supabase Built-in Auth Emails, Resend hoặc SendGrid. Sẽ quyết định tại Phase P04 (Auth).
