# Bản Ghi Chú Phát Hành: GenViet MVP v0.1.0 (Release Notes - P26-T16)

- **Tên sản phẩm:** GenViet
- **Phiên bản:** `v0.1.0`
- **Ngày phát hành:** 30/08/2026
- **Trạng thái:** MVP Hoàn thiện, Sẵn sàng triển khai

---

## 1. Điểm Nhấn Tính Năng Chính
- **Quản lý Cây gia phả & Thành viên:** Tạo nhiều cây gia phả, thêm thành viên với họ tên tiếng Việt, ngày tháng linh hoạt (Partial dates), giới tính và tiểu sử.
- **Trực quan hóa Phả hệ Đa thế hệ:** Đồ thị phân tầng hiện đại kết hợp React Flow và ELK.js chạy trên Web Worker; hỗ trợ phóng to, thu nhỏ, đổi người trung tâm và mở rộng tổ tiên/hậu duệ.
- **Tìm kiếm Tiếng Việt Thông Minh:** Tìm kiếm họ tên có dấu hoặc không dấu, lọc theo giới tính, tình trạng sống và khoảng năm.
- **Ảnh đại diện Riêng tư:** Lưu trữ bảo mật trong Supabase Private Storage Bucket, truy cập qua Signed URLs có thời hạn.
- **Nhật ký Thay đổi & Phục hồi:** Audit trail ghi nhận lịch sử và hỗ trợ khôi phục thành viên đã xóa mềm.
- **Sao lưu & Nhập Dữ liệu JSON:** Xuất và nạp tệp sao lưu JSON chuẩn v1.0 dễ dàng.
- **Ứng dụng Web Tiến Bộ (PWA):** Cài đặt trên máy tính và điện thoại, hỗ trợ màn hình thông báo offline.
- **Giám sát & Vận hành Chuyên nghiệp:** Hệ thống Heartbeat, Structured Logging gắn Request ID, lọc đệ quy PII/Secret và bộ 6 sổ tay ứng cứu sự cố.

---

## 2. Công Nghệ & Hạ Tầng
- Next.js 16 (App Router), React 19, TypeScript strict mode, Tailwind CSS v4.
- Supabase (PostgreSQL, Row Level Security, Auth, Storage).
- Vitest & Playwright Test Automation Suites.
