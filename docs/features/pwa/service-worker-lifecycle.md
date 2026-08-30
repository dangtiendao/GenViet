# Vòng Đời & Quản Lý Service Worker (Service Worker Lifecycle)

## 1. Các Giai Đoạn Vòng Đời
1. **Install:** Precache các tài nguyên App Shell tĩnh công khai (`/offline`, icons, manifest).
2. **Activate:** Quét toàn bộ Cache Storage, tự động xóa các version cũ có tiền tố `genviet-` và gọi `self.clients.claim()`.
3. **Fetch:** Chặn bắt navigation requests để trả về `/offline` khi mất mạng; phục vụ static build assets theo chiến lược Cache First; chuyển tiếp Network Only cho toàn bộ private API, Auth và mutations.
4. **Message:** Tiếp nhận các lệnh `SKIP_WAITING`, `CLEAR_PRIVATE_CACHES`, `GET_VERSION`.
