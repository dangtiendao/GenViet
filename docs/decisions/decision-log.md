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

---

## 3. Danh sách các Quyết định mở / Đang thảo luận (Open Decisions)

1. **OPEN-DEC-01 (Giấy phép mã nguồn - License):** Quyết định lựa chọn giữa AGPLv3, MIT hoặc Proprietary (Bản quyền đóng). Tạm hoãn xem xét ở giai đoạn trước khi phát hành MVP.
2. **OPEN-DEC-02 (Provider gửi Email):** Lựa chọn giữa Supabase Built-in Auth Emails, Resend hoặc SendGrid. Sẽ quyết định tại Phase P04 (Auth).
