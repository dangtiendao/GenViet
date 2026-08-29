# Danh mục Trạng thái Giao diện (UI State Catalogue)

- **Mã tài liệu:** `UX-STATES-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Trạng thái Đang tải Dữ liệu (Loading States) - `P03-T18`

| Vùng / Màn hình | Kiểu Loading Đề xuất | Mục tiêu Trải nghiệm | Hành vi Phục hồi / Fallback |
| :--- | :--- | :--- | :--- |
| **Khởi động Ứng dụng** | Fullscreen Splash + Logo mờ | Tránh màn hình trắng, chuẩn bị phiên | Nếu quá $8\text{s} \rightarrow$ Hiện nút "Tải lại trang" |
| **Canvas Cây Gia phả** | Skeleton Nodes mờ (3 tầng mẫu) | Giữ nguyên cấu trúc layout, tránh giật hình | Nếu lỗi $\rightarrow$ Hiện Error Card giữa Canvas |
| **Hồ sơ Thành viên** | Skeleton Shimmer text lines | Người dùng biết thông tin sắp xuất hiện | Tự động thử lại 1 lần nếu mạng chậm |
| **Tìm kiếm Thành viên** | Spinner nhỏ ở góc phải ô nhập | Không khóa bàn phím, phản hồi gõ tức thì | Tự hủy request cũ khi người dùng gõ tiếp |
| **Nút Bấm Form (Submit)** | Nút đổi màu mờ + Spinner nhỏ | Chống bấm đúp gây duplicate bản ghi | Tự mở lại nút nếu sau $10\text{s}$ không phản hồi |
| **Xuất Sao lưu JSON** | Modal Progress bar ("Đang đóng gói...")| Người dùng an tâm dữ liệu đang được tạo | Có nút "Hủy bỏ" nếu file quá lớn |

---

## 2. Trạng thái Trống / Chưa có Dữ liệu (Empty States) - `P03-T19`

| Tình huống Trống | Tiêu đề Trực quan | Lời Giải thích Hướng dẫn | Lệnh Hành động Chính (Primary CTA) |
| :--- | :--- | :--- | :--- |
| **Tài khoản mới chưa có cây** | "Bắt đầu hành trình gìn giữ cội nguồn" | Bạn chưa có cây gia phả nào. Hãy tạo không gian gia đình đầu tiên. | `[ + Tạo Cây Gia phả Đầu Tiên ]` |
| **Cây gia phả chưa có người** | "Cây gia phả đang trống" | Hãy thêm thành viên đầu tiên để bắt đầu kết nối các thế hệ. | `[ + Thêm Thành viên Đầu Tiên ]` |
| **Không tìm thấy kết quả** | "Không tìm thấy thành viên phù hợp" | Thử tìm bằng tên không dấu hoặc kiểm tra lại chính tả. | `[ + Tạo Thành viên Mới ]` |
| **Thành viên chưa có Cha** | *(Hiển thị trên Profile)* | Chưa có thông tin về người Cha. | `[ + Thêm Cha ]` |
| **Thành viên chưa có Mẹ** | *(Hiển thị trên Profile)* | Chưa có thông tin về người Mẹ. | `[ + Thêm Mẹ ]` |
| **Chưa có người phối ngẫu** | *(Hiển thị trên Profile)* | Chưa ghi nhận thông tin hôn phối. | `[ + Thêm Vợ/Chồng ]` |
| **Chưa có con cái** | *(Hiển thị trên Profile)* | Chưa có thông tin về thế hệ sau. | `[ + Thêm Con cái ]` |

---

## 3. Trạng thái Lỗi & Cách Phục hồi (Error States & Recovery) - `P03-T20`

| Loại Lỗi | Mã Lỗi UX | Thông báo Người dùng | Hành vi Phục hồi (Recovery Action) |
| :--- | :---: | :--- | :--- |
| **Sai Mật khẩu** | `ERR-UX-01` | "Email hoặc mật khẩu không chính xác." | Giữ lại email, focus lại vào ô Mật khẩu. |
| **Mất Kết nối Mạng** | `ERR-UX-02` | "Không có kết nối Internet. Đang thử kết nối lại..." | Hiển thị Banner vàng trên đầu + Nút "Thử lại". |
| **Hết Hạn Phiên (Session)**| `ERR-UX-03` | "Phiên đăng nhập đã hết hạn vì lý do an toàn." | Mở Modal đăng nhập nhanh tại chỗ, giữ nguyên form. |
| **Không tìm thấy Cây (404)**| `ERR-UX-04` | "Cây gia phả không tồn tại hoặc đã bị xóa." | Nút `[ Về Trang chủ của Tôi ]`. |
| **Từ chối Quyền (403)** | `ERR-UX-05` | "Cây gia phả này được đặt ở chế độ riêng tư." | Nút `[ Đăng nhập bằng tài khoản khác ]`. |
| **Lỗi Lưu Trùng Chu trình**| `ERR-UX-06` | "Không thể lưu quan hệ vì tạo ra vòng lặp thế hệ." | Nút `[ Quay lại kiểm tra quan hệ ]`. |
