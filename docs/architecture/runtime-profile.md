# Đặc tả Hồ sơ Thực thi & Giới hạn Runtime (Runtime Profile Specification)

- **Mã tài liệu:** `ARCH-RUNTIME-01`
- **Mã Kiến trúc liên quan:** `AR-012`, `RUN-001..012`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Giả định Thực thi Phi Trạng thái (Stateless Runtime Profile)

Kiến trúc GenViet được thiết kế để chạy an toàn trên bất kỳ môi trường Serverless hoặc Edge Compute nào:
1. **Không Dựa vào Ổ đĩa Cục bộ Có thể Ghi (Ephemeral Filesystem):** Máy chủ Next.js không ghi file cấu hình, file avatar tạm hay file backup vào ổ cứng local disk (`/tmp` chỉ dùng cho tác vụ ngắn hạn trong cùng request nếu bắt buộc).
2. **Không Dựa vào Bộ nhớ Tiến trình (Zero In-Memory Session State):** Không lưu trữ danh sách người dùng đang online hay cache phả hệ trong biến toàn cục `global.cache` của tiến trình Node.js (vì serverless instances sẽ tự động scale to zero).
3. **Giới hạn Thời gian Thực thi (Request Timeout Bounds):** Mọi Server Action và Route Handler được tối ưu để hoàn thành trong vòng $< 5$ giây (ngưỡng timeout mặc định của Vercel Hobby là 10-15s, Cloudflare Workers là 30s).
4. **Không Chạy Vòng lặp Nền Vô tận (No Background Daemon Loops):** Không tạo `setInterval` hay tiến trình nền chạy ngầm vĩnh viễn trong web process. Các tác vụ định kỳ phải kích hoạt qua External Scheduler (GitHub Actions / Cloudflare Cron Triggers).

---

## 2. Bảng Ma trận Khả năng Tương thích Công nghệ Runtime (Portability Profile)

| Thành phần API / Công nghệ | Trạng thái Chấp thuận | Giới hạn & Hướng dẫn Sử dụng |
| :--- | :---: | :--- |
| **Chuẩn Web Fetch / Request / Response** | `ALLOWED` | Khuyến khích sử dụng 100% thay vì `IncomingMessage`/`ServerResponse` cũ. |
| **Web Crypto API (`crypto.subtle`)** | `ALLOWED` | Sử dụng cho việc sinh UUID, băm SHA-256 (tương thích cả Node.js và Edge). |
| **Node.js `fs` / `path` module** | `AVOID` | Tuyệt đối không dùng trong code nghiệp vụ; chỉ dùng trong build scripts. |
| **Thư viện C++ Native Addons** | `AVOID` | Cấm sử dụng các package phụ thuộc C++ binaries (khó deploy lên Edge). |
| **Web Workers trong Trình duyệt** | `ALLOWED` | Sử dụng để chạy thuật toán tính layout ELK.js khi đồ thị lớn. |
| **Xử lý Ảnh trên Server (`sharp`)** | `RESTRICTED` | Không resize ảnh trên serverless; chuyển sang tải trực tiếp lên Object Store. |
| **WebSocket / Long Polling** | `DEFERRED` | Hoãn sang v0.2+; v0.1 chỉ sử dụng mô hình HTTP Request-Response. |
| **Database Connection Pooling** | `ALLOWED` | Sử dụng Supabase Transaction Connection Pooler (Port 6543 / PgBouncer). |
