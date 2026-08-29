# Danh mục Câu hỏi Mở Kiến trúc: Phase P04 (Architecture Open Questions)

- **Mã tài liệu:** `ARCH-OPENQUESTIONS-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## Danh mục 5 Câu hỏi Mở Cần Project Owner Xem xét & Phê duyệt

| Mã Câu hỏi | Tiêu đề & Nội dung | Phương án Đề xuất của P04 | Trạng thái |
| :--- | :--- | :--- | :---: |
| **`P04-OQ-001`** | **Phê duyệt 16 Architecture Decision Records (ADRs):** Toàn bộ 16 ADRs (`ADR-0001` đến `ADR-0016`) có được Project Owner chấp thuận chuyển sang trạng thái `ACCEPTED` không? | Đề xuất: Phê duyệt toàn bộ 16 ADRs để làm kim chỉ nam triển khai cho Phase P05 đến P25. | `PROPOSED` |
| **`P04-OQ-002`** | **Chiến lược Xử lý Ảnh Avatar khi Người dùng Tải lên:** Nên resize ảnh ngay tại trình duyệt máy khách (Canvas Resize trước khi upload) hay để nguyên ảnh gốc $< 5\text{MB}$? | Đề xuất: Resize ảnh tại máy khách xuống tối đa $800\times 800\text{px}$ WebP/JPEG trước khi tải lên Storage để tiết kiệm dung lượng và tăng tốc độ tải. | `PROVISIONAL` |
| **`P04-OQ-003`** | **Lựa chọn Provider Gửi Email Giao dịch khi Nâng cấp v0.2+:** Nên ưu tiên Resend hay Postmark cho phân hệ `IEmailAdapter`? | Đề xuất: Sử dụng Resend do hỗ trợ React Email và tích hợp mượt mà với Next.js/Edge. Sẽ quyết định chính thức khi làm v0.2. | `DEFERRED` |
| **`P04-OQ-004`** | **Thời điểm Thực hiện Kiểm thử Chuyển dịch Cloudflare:** Nên dựng môi trường Staging Cloudflare ngay trong Phase P21 hay chờ sau khi phát hành MVP trên Vercel? | Đề xuất: Hoàn thiện và ổn định MVP trên Vercel trước (Phase P05-P24), sau đó chạy thử nghiệm migration sang Cloudflare tại Phase P25. | `PROVISIONAL` |
| **`P04-OQ-005`** | **Thời hạn Lưu trữ Nhật ký Kiểm toán (Audit Retention):** Nhật ký trong `audit_logs` nên lưu trữ vĩnh viễn hay dọn dẹp sau 1 năm? | Đề xuất: Lưu trữ vĩnh viễn cho bản phát hành MVP v0.1 vì dung lượng text audit cho 1.000 người rất nhỏ ($< 10\text{MB}$). | `PROVISIONAL` |
