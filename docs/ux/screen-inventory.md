# Danh mục Màn hình Ứng dụng (Screen Inventory v0.1)

- **Mã tài liệu:** `UX-INVENTORY-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## Danh mục 25 Màn hình & Lớp Giao diện Chi tiết

| Mã Screen | Tên Giao diện | Mục tiêu Chính | Ưu tiên | Entry Point | Hành động Chính (Primary Action) | Desktop Intent | Mobile Intent | Task liên quan |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **`SCR-001`** | Đăng nhập (Login) | Xác thực người dùng bằng Email/Mật khẩu | `MUST` | Truy cập trang chủ khi chưa đăng nhập | Bấm nút "Đăng nhập" | Form giữa màn hình | Form tối ưu bàn phím di động | `P03-T02` |
| **`SCR-002`** | Đăng ký (Sign-up) | Tạo tài khoản quản trị mới | `MUST` | Link từ trang Login | Bấm nút "Tạo tài khoản" | Form gọn gàng | Form di động đơn giản | `P03-T02` |
| **`SCR-003`** | Quên mật khẩu | Gửi link khôi phục mật khẩu qua email | `MUST` | Link từ trang Login | Bấm "Gửi link khôi phục" | Dialog / Sub-page | Sub-page di động | `P03-T02` |
| **`SCR-004`** | Đặt lại mật khẩu | Thiết lập mật khẩu mới từ link email | `MUST` | Deep link từ email | Bấm "Lưu mật khẩu mới" | Sub-page giữa màn hình | Sub-page di động | `P03-T02` |
| **`SCR-005`** | Dashboard / Trang chủ | Điểm đến sau đăng nhập, quản lý cây | `MUST` | Sau khi login thành công | Bấm "Mở cây gia phả" | Bảng điều khiển + Lịch sử | Danh sách thẻ cây rút gọn | `P03-T03` |
| **`SCR-006`** | Empty State Cây rỗng | Hướng dẫn tạo cây đầu tiên khi tài khoản mới | `MUST` | Dashboard khi `trees_count = 0` | Bấm "+ Tạo cây gia phả đầu tiên" | Card hướng dẫn minh họa | Card CTA toàn màn hình | `P03-T19` |
| **`SCR-007`** | Tạo Cây Gia phả Mới | Nhập tên dòng họ và tạo không gian cây | `MUST` | Nút "+ Tạo cây mới" từ Dashboard | Bấm "Khởi tạo cây" | Modal Dialog | Bottom Sheet / Form | `P03-T03` |
| **`SCR-008`** | Khởi tạo Người Đầu Tiên | Nhập thành viên đầu tiên vào cây rỗng | `MUST` | Mở cây có 0 nhân vật | Bấm "Lưu & Bắt đầu vẽ cây" | Guided Onboarding Dialog | Full-screen Sheet | `P03-T04` |
| **`SCR-009`** | Canvas Cây Gia phả | Không gian tương tác chính xem/vẽ đồ thị | `MUST` | Mở từ Dashboard hoặc Search | Chạm node, Pan, Zoom Canvas | Full-viewport Canvas + Sidebar | Full-viewport + Bottom Nav | `P03-T15..T22` |
| **`SCR-010`** | Tìm kiếm Thành viên | Tra cứu nhanh người theo tên có/không dấu | `MUST` | Nút Search trên Topbar / Bottom Nav | Gõ tên $\rightarrow$ Bấm "Xem trên cây" | Command Bar / Modal | Full Search Page / Sheet | `P03-T12` |
| **`SCR-011`** | Chi tiết Hồ sơ Thành viên | Xem tiểu sử, quan hệ, nơi an táng | `MUST` | Nhấp/Chạm vào Node trên cây | Bấm "Chỉnh sửa" / "Đổi trung tâm" | Side Panel trượt phải | Bottom Sheet (Half / Full) | `P03-T10, T17` |
| **`SCR-012`** | Form Tạo Thành viên Mới | Nhập thông tin thành viên (họ tên, ngày) | `MUST` | Chọn "+ Thêm người" từ Node menu | Bấm "Lưu thành viên" | Dialog form phân nhóm | Full-screen Sheet có tab | `P03-T04..T08` |
| **`SCR-013`** | Form Chỉnh sửa Hồ sơ | Sửa đổi thông tin nhân vật đang có | `MUST` | Bấm "Sửa hồ sơ" từ Profile panel | Bấm "Lưu thay đổi" | Dialog form | Full-screen Sheet | `P03-T10` |
| **`SCR-014`** | Form Thêm Cha / Mẹ | Mở rộng cây lên phía trên (Mới hoặc Có sẵn)| `MUST` | Chọn "Thêm Cha" / "Thêm Mẹ" từ Menu | Bấm "Xác nhận thêm" | Step Dialog | Step Sheet | `P03-T05, T06` |
| **`SCR-015`** | Form Thêm Vợ / Chồng | Thêm người phối ngẫu (Mới hoặc Có sẵn) | `MUST` | Chọn "Thêm Vợ/Chồng" từ Menu | Bấm "Xác nhận hôn phối" | Step Dialog | Step Sheet | `P03-T07` |
| **`SCR-016`** | Form Thêm Con cái | Thêm hậu duệ xuống phía dưới | `MUST` | Chọn "Thêm Con" từ Menu | Bấm "Xác nhận thêm con" | Step Dialog | Step Sheet | `P03-T08` |
| **`SCR-017`** | Liên kết Người Có sẵn | Tìm kiếm người trong cây để nối quan hệ | `MUST` | Chọn tab "Người có sẵn" trong form | Bấm "Nối quan hệ" | Search Picker List | Search Picker Sheet | `P03-T09` |
| **`SCR-018`** | Hộp thoại Xác nhận Xóa mềm | Cảnh báo tác động ngắt liên kết khi xóa | `MUST` | Bấm "Xóa thành viên" từ Menu | Bấm "Xác nhận Xóa mềm" | Alert Dialog | Alert Sheet | `P03-T11, T21` |
| **`SCR-019`** | Cài đặt Cây Gia phả | Đổi tên cây, cấu hình Mốc số đời | `MUST` | Nút Settings trên Header | Bấm "Lưu cài đặt" | Settings Drawer / Page | Settings Page | `P03-T14` |
| **`SCR-020`** | Xuất Sao lưu Dữ liệu | Tải file JSON backup gia phả về máy | `MUST` | Mục "Sao lưu" trong Cài đặt | Bấm "Tải file sao lưu (.json)" | Modal card | Bottom Sheet card | `P03-T14` |
| **`SCR-021`** | Thùng rác & Khôi phục | Quản lý và phục hồi các node đã xóa | `SHOULD` | Mục "Thùng rác" trong Cài đặt | Bấm "Khôi phục thành viên" | List Modal *(Post-MVP)* | List Sheet *(Post-MVP)* | `P03-T11` |
| **`SCR-022`** | Quản lý Tài khoản | Xem email đăng nhập, đổi mật khẩu, logout | `MUST` | Avatar dropdown trên Header | Bấm "Đăng xuất" | Dropdown Popover | Sub-page Menu | `P03-T02` |
| **`SCR-023`** | Màn hình 404 Không tìm thấy | Thông báo cây hoặc thành viên không tồn tại | `MUST` | Truy cập sai URL `/trees/:id` | Bấm "Về trang chủ" | Centered Page | Centered Page | `P03-T20` |
| **`SCR-024`** | Màn hình Từ chối Truy cập | Thông báo cây riêng tư không thuộc sở hữu | `MUST` | Cố truy cập cây của tài khoản khác | Bấm "Về cây của tôi" | Centered Page | Centered Page | `P03-T20` |
| **`SCR-025`** | Màn hình Lỗi Mạng / Offline | Thông báo mất kết nối Internet khi lưu | `MUST` | Mất kết nối khi thao tác | Bấm "Thử lại (Retry)" | Toast / Banner cảnh báo | Toast / Banner cảnh báo | `P03-T20` |
