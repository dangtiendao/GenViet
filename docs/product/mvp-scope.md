# Phạm vi Chức năng Bắt buộc MVP v0.1 (MVP In-Scope Requirements)

- **Mã tài liệu:** `PROD-SCOPE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Danh sách 12 Nhóm Chức năng Bắt buộc (Must-Have Functional Requirements)

| Mã FR | Nhóm chức năng | Tóm tắt phạm vi tối thiểu | Lý do thuộc MVP | Phân loại MoSCoW |
| :--- | :--- | :--- | :--- | :---: |
| **FR-001** | Tài khoản & Xác thực | Đăng ký, đăng nhập, đăng xuất bằng Email & Mật khẩu. | Cần thiết để xác định chủ sở hữu cây và bảo vệ dữ liệu. | `Must` |
| **FR-002** | Quản lý Cây Gia phả | Tạo mới, đổi tên, xem danh sách cây gia phả của tài khoản. | Khởi tạo không gian dữ liệu độc lập cho gia đình. | `Must` |
| **FR-003** | Quản lý Nhân vật (CRUD) | Thêm, xem chi tiết, sửa thông tin nhân vật (Họ tên, Giới tính, Năm sinh, Năm mất, Tiểu sử). | Thực thể dữ liệu nền tảng cấu thành phả hệ. | `Must` |
| **FR-004** | Quản lý Quan hệ Cốt lõi | Thiết lập quan hệ Cha-Con, Mẹ-Con, Vợ-Chồng (Hôn phối cơ bản). Hỗ trợ mở rộng tổ tiên lên trên. | Tạo nên cấu trúc cây gia phả nhiều thế hệ. | `Must` |
| **FR-005** | Hiển thị & Tương tác Cây | Dựng đồ thị phân tầng tự động (React Flow + ELK.js), hỗ trợ Zoom, Pan, Đổi người trung tâm. | Luồng giá trị cốt lõi (Core Value) của sản phẩm. | `Must` |
| **FR-006** | Tìm kiếm Thành viên | Tìm kiếm theo tên (có dấu và không dấu), bấm vào để định vị trên cây. | Tra cứu nhanh thành viên trong cây quy mô lớn. | `Must` |
| **FR-007** | Ảnh Đại diện (Avatar) | Tải lên ảnh chân dung cơ bản cho nhân vật (Supabase Storage). | Tăng tính sinh động và nhận diện người thân. | `Should` |
| **FR-008** | Xóa mềm Nhân vật | Đánh dấu xóa nhân vật khỏi cây mà không làm mất dữ liệu vật lý ngay lập tức. | Bảo vệ dữ liệu khỏi thao tác xóa nhầm của người dùng. | `Must` |
| **FR-009** | Sao lưu Dữ liệu (Backup) | Xuất toàn bộ dữ liệu cây (nhân vật + quan hệ) ra file định dạng JSON chuẩn. | Cho phép người dùng tự lưu trữ dự phòng, chống vendor lock-in. | `Must` |
| **FR-010** | Giao diện Đa thiết bị | Giao diện co giãn tối ưu trên Desktop, Tablet và Smartphone (Mobile-first viewport $\ge$ 360px). | Phục vụ nhu cầu tra cứu mọi lúc mọi nơi trên điện thoại. | `Must` |
| **FR-011** | Quyền riêng tư & Cách ly | Mặc định cây là riêng tư (Private by default), RLS ngăn chặn 100% việc đọc trộm cây khác. | Bảo vệ quyền riêng tư gia đình tối thượng. | `Must` |
| **FR-012** | Trạng thái Giao diện Chuẩn | Hiển thị trạng thái Loading, Empty State có hướng dẫn, và Error State rõ ràng. | Đảm bảo trải nghiệm người dùng hoàn chỉnh, không bị đơ giao diện. | `Must` |

---

## 2. Làm rõ Các Quyết định Phạm vi Cụ thể trong MVP v0.1

1. **Một hay Nhiều Gia phả trên một tài khoản?**
   - *Quyết định:* **Hỗ trợ nhiều cây gia phả (Multi-trees) trên 1 tài khoản**. Một người dùng có thể tạo cây cho nhà nội và nhà ngoại riêng biệt.
2. **Chỉ Owner hay có Viewer trong v0.1?**
   - *Quyết định:* **Chỉ tập trung vào Single Owner trong v0.1**. Toàn bộ quyền xem và sửa thuộc về chủ tài khoản. Tính năng mời xem (Viewer Link / Invitation) tạm hoãn sang v0.2.
3. **Email/Password hay Google OAuth?**
   - *Quyết định:* **Email & Password là Must**. Google OAuth được xếp mức `Should` (ưu tiên triển khai nếu không làm chậm lịch phát hành).
4. **Xuất và Nhập JSON Backup:**
   - *Quyết định:* **Xuất JSON (Export) là Must**. Nhập file JSON (Import/Restore) là `Should` (để tránh rủi ro kiểm tra schema phức tạp trong v0.1).
5. **Chế độ Offline:**
   - *Quyết định:* **Won't**. v0.1 yêu cầu kết nối Internet khi sử dụng. Chỉnh sửa offline với đồng bộ xung đột phức tạp bị loại bỏ hoàn toàn khỏi v0.1.
6. **Mối quan hệ phức tạp (Đa thê, Con nuôi):**
   - *Quyết định:* v0.1 hỗ trợ một người có nhiều vợ/chồng ở mức dữ liệu và hiển thị cơ bản. Quan hệ con nuôi/người giám hộ được chuẩn bị ở tầng data nhưng giao diện v0.1 tập trung vào Cha/Mẹ/Con sinh học.
