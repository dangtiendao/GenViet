# Văn Bản Khóa Phạm Vi Phát Hành (MVP Scope Freeze - P26-T01)

- **Tên sản phẩm:** GenViet (Cây gia phả dòng họ Việt Nam)
- **Phiên bản phát hành:** `v0.1.0`
- **Mục tiêu phát hành:** Cung cấp phiên bản MVP hoàn chỉnh, bảo mật và tin cậy cho người dùng quản lý, xem và chia sẻ gia phả dòng họ.
- **Thời điểm khóa phạm vi (Freeze Timestamp):** 30/08/2026 12:00:00 UTC+7
- **Commit chốt phạm vi:** `f6150a4` (Merge PR #25)

---

## 1. Danh Mục Tính Năng Được Bao Gồm Trong MVP (Included Scope)

1. **Xác thực người dùng (Authentication - P09):**
   - Đăng ký tài khoản bằng Email & Mật khẩu (yêu cầu xác thực Email).
   - Đăng nhập, Đăng xuất, Quên mật khẩu & Đặt lại mật khẩu.
   - Bảo mật Session qua HttpOnly Cookies với cơ chế bảo vệ Callback URL.
2. **Quản lý Cây Gia Phả (Family Tree Management - P11):**
   - Tạo cây gia phả mới, chỉnh sửa thông tin cây, xem danh sách cây sở hữu.
   - Thùng rác (Trash) và Khôi phục (Restore) cây gia phả.
   - Phân quyền dữ liệu (Owner, Viewer) tuân thủ 100% PostgreSQL Row Level Security (RLS).
3. **Quản lý Thành Viên Phả Hệ (Person Management - P12):**
   - Tạo mới nhân vật với họ tên tiếng Việt, giới tính, ngày sinh/ngày mất (hỗ trợ ngày chính xác hoặc partial date YYYY/MM/DD), tình trạng sống/đã mất, ghi chú/tiểu sử.
   - Chỉnh sửa thông tin nhân vật, xóa mềm vào thùng rác và khôi phục.
4. **Quản lý Mối Quan Hệ & Hôn Nhân (Relationship & Union - P13):**
   - Thêm Cha/Mẹ (Parent-Child), Thêm Con (Child).
   - Thêm Vợ/Chồng (Spouse/Union) hỗ trợ đa hôn nhân (Multiple Unions).
   - Tự động kiểm tra và ngăn chặn chu trình phả hệ (Cycle Detection) tại tầng Database.
5. **Trực Quan Hóa Cây Gia Phả (Tree Visualization & Graph - P14, P15, P23):**
   - Đồ thị phân tầng đa thế hệ sử dụng React Flow kết hợp thuật toán phân tầng ELK.js.
   - Tính toán layout trong Web Worker ngầm không gây đơ UI chính.
   - Đổi người trung tâm (Change Center Person), mở rộng tổ tiên (Expand Ancestors) từ node bất kỳ, mở rộng hậu duệ và thu gọn nhánh.
   - Bảng điều khiển Viewport (Zoom In, Zoom Out, Fit View) và Mobile Touch Gestures.
6. **Tìm Kiếm Thành Viên Tiếng Việt (Person Search - P16):**
   - Tìm kiếm có dấu và không dấu (bỏ dấu tiếng Việt thông minh).
   - Bộ lọc theo giới tính, tình trạng sống, năm sinh/năm mất.
   - Phân trang theo con trỏ (Cursor Pagination) và danh sách ảo (Virtualization).
7. **Ảnh Đại Diện Riêng Tư (Private Avatar Storage - P17):**
   - Lưu trữ Avatar trong Supabase Private Storage Bucket.
   - Truy cập qua Signed URLs có thời hạn ngắn (TTL 1 giờ), tự động kiểm soát quyền truy cập qua API Proxy.
8. **Nhật Ký Thay Đổi & Phục Hồi Dữ Liệu (Audit Trail & Recovery - P18):**
   - Ghi nhận mọi thao tác thêm, sửa, xóa thành viên và quan hệ vào bảng `audit_logs`.
   - Xem lịch sử thay đổi và hỗ trợ khôi phục dữ liệu đã xóa mềm.
9. **Sao Lưu & Nhập Liệu Ứng Dụng (Application Backup & Import - P19):**
   - Xuất dữ liệu cây gia phả ra tệp JSON chuẩn v1.0 có checksum xác thực.
   - Xem trước cấu trúc phả hệ trước khi nhập (Import Preview) và nhập thành cây mới an toàn.
10. **Ứng Dụng Web Tiến Bộ & Hoạt Động Offline Cơ Bản (PWA & Offline Shell - P20):**
    - Cài đặt PWA trên Desktop và Mobile (Android, iOS).
    - Màn hình thông báo mất mạng (Offline Fallback Shell) với nút Thử lại tự động.
11. **Giám Sát Vận Hành & Khắc Phục Sự Cố (Observability & Operations - P21, P24, P25):**
    - System Heartbeat định kỳ giữ ấm máy chủ và phát hiện ngắt quãng.
    - Structured JSON Logging có gắn `x-request-id` và lọc đệ quy 100% PII/Secret.
    - Error Tracking an toàn (`sendDefaultPii: false`, `sessionReplay: false`).
    - Công cụ sao lưu PostgreSQL có manifest SHA-256 và kịch bản restore cô lập.
    - Bộ 6 sổ tay ứng cứu sự cố vận hành (Runbooks).

---

## 2. Các Hạng Mục Nằm Ngoài Phạm Vi MVP (Explicit Exclusions)

1. **Chỉnh sửa dữ liệu khi mất mạng (Offline Editing & Mutation Sync):** Yêu cầu kết nối mạng để đảm bảo toàn vẹn RLS và chống xung đột phả hệ.
2. **Ứng dụng Native Mobile (React Native / Flutter / Swift / Kotlin):** MVP tập trung tối ưu PWA và Responsive Web Shell.
3. **Thông báo đẩy (Web Push Notifications):** Nằm trong lộ trình sau MVP.
4. **Chỉnh sửa đồng thời theo thời gian thực (Real-time Collaborative Multi-cursor Editing):** MVP sử dụng mô hình Optimistic Concurrency Control.
5. **Tiêu chuẩn xuất nhập phả hệ chuẩn quốc tế GEDCOM:** Dự kiến phát triển ở phiên bản v0.2.0.

---

## 3. Quy Trình Quản Lý Thay Đổi Sau Khi Khóa Phạm Vi (Change-Control Policy)
- **Tuyệt đối không thêm tính năng mới.**
- Chỉ tiếp nhận sửa lỗi thuộc phân loại **P0 (Release Blocker)** hoặc **P1 (Critical Defect)**.
- Mọi bản vá phải có regression test đi kèm và phải được kiểm thử lại toàn bộ các cổng chất lượng.
