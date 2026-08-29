# Bộ Nguyên tắc Thiết kế Trải nghiệm Người dùng GenViet (UX Principles)

- **Mã tài liệu:** `UX-PRINCIPLES-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Tuyên ngôn Trải nghiệm Cốt lõi (Core UX Statement)

> **GenViet** mang lại trải nghiệm dựng và tra cứu cây gia phả **thuận tiện, riêng tư và tự nhiên như ký ức gia đình**:
> - Người dùng có thể bắt đầu từ chính mình hoặc bất kỳ người thân nào.
> - Cây phát triển linh hoạt đa chiều theo thời gian.
> - Thao tác trên điện thoại thông minh mượt mà và trực quan như trên máy tính để bàn.
> - Tôn trọng sự thật lịch sử: chấp nhận dữ liệu khuyết thiếu, ngày tháng ước chừng và nhiều luồng hôn nhân phức tạp.

---

## 2. 10 Nguyên tắc Thiết kế Trải nghiệm Cốt lõi (The 10 Core UX Rules)

1. **`UXR-001` (Bình đẳng Nền tảng - Mobile & Desktop First-class):** Mọi luồng giá trị cốt lõi (Đăng ký, Tạo cây, Thêm thành viên, Mở rộng tổ tiên, Tìm kiếm, Đổi người trung tâm, Xuất sao lưu) đều phải hoàn tất trọn vẹn và dễ dàng trên màn hình điện thoại cảm ứng $375\text{px}$.
2. **`UXR-002` (Không Nhồi nhét Đồ thị trên Mobile):** Trên màn hình di động, không cố ép hiển thị toàn bộ 1.000 người cùng lúc. Mặc định khung nhìn tập trung vào **Người trung tâm (Center Person)** và các thế hệ lân cận (cha mẹ, vợ chồng, con cái).
3. **`UXR-003` (Tiết lộ Thông tin Tăng tiến - Progressive Disclosure):** Node trên cây chỉ hiển thị thông tin nhận dạng tối thiểu (Họ tên, Năm sinh/mất, Ảnh đại diện, Dấu hiệu quan hệ). Chi tiết tiểu sử, nơi an táng, ghi chú chỉ mở ra khi người dùng chủ động chạm/nhấp vào node.
4. **`UXR-004` (Thao tác Bắt đầu từ Ngữ cảnh - Context-driven Actions):** Muốn thêm Cha, Mẹ, Vợ/Chồng hay Con cái, người dùng luôn bắt đầu từ Menu thao tác ngay tại Node nhân vật đó, không bắt người dùng phải vào form chung rồi tự gõ ID tìm kiếm.
5. **`UXR-005` (Luôn Hỗ trợ 2 Hướng Tạo mới & Liên kết):** Mọi thao tác thêm người thân đều cung cấp 2 tab rõ ràng:
   - **Tạo thành viên mới:** Nhập họ tên, năm sinh.
   - **Liên kết người đã có:** Tìm kiếm người đã tồn tại trong cây để nối vào quan hệ.
6. **`UXR-006` (Xem trước Quan hệ Trước khi Xác nhận - Relationship Preview):** Giao diện luôn hiển thị dòng xác nhận trực quan: *"Nguyễn Văn A sẽ là CHA của Nguyễn Văn B"* trước khi người dùng nhấn nút Lưu.
7. **`UXR-007` (Phân định Rõ ràng Lỗi Chặn vs Cảnh báo):**
   - **Lỗi Chặn (`BLOCKING_ERROR`):** Khóa nút Lưu, hiển thị giải thích bằng ngôn ngữ đời thường (ví dụ: *"Không thể chọn B làm cha vì B đang là con của A"*).
   - **Cảnh báo (`WARNING`):** Cho phép người dùng đọc hiểu tác động và bấm *"Tôi hiểu và muốn tiếp tục"* để ghi nhận dữ liệu lịch sử.
8. **`UXR-008` (Bảo toàn Vị trí Khung nhìn - Viewport Stability):** Sau khi thêm cụ tổ đời cao hơn lên phía trên, đồ thị mở rộng nhẹ nhàng, người trung tâm hiện tại vẫn giữ vững vị trí quan sát, tuyệt đối không làm người dùng bị giật khung nhìn hay mất dấu vị trí.
9. **`UXR-009` (Không Dùng Thuật ngữ Kỹ thuật Đánh đố):** Cấm tuyệt đối hiển thị các từ ngữ như `DAG`, `Graph Cycle`, `Foreign Key`, `RPC Error`, `RLS Policy`, `UUID` trên giao diện người dùng thông thường.
10. **`UXR-010` (Phản hồi Trực quan Mọi Thay đổi):** Mọi hành động thành công đều có Toast thông báo nhẹ nhàng; mọi thao tác xóa mềm hoặc ngắt liên kết đều có hộp thoại giải thích rõ *"Người thân của nhân vật này vẫn được giữ nguyên vẹn trên cây"*.
