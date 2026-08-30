# Phase P21: Quyết Định Kiến Trúc Đã Chốt (Architectural Decisions)

## 1. Danh Sách Quyết Định Đã Khóa
1. **DEC-P21-01: Heartbeat Là Dữ Liệu Kỹ Thuật Độc Lập**
   - Bảng `system_heartbeats` là technical operations data, không thuộc Family Tree nào, không xuất hiện trong search, graph, backup hay business audit.
2. **DEC-P21-02: Ràng Buộc Singleton Tuyệt Đối Bằng Database**
   - Khóa chính `id = 'primary'` với `check (id = 'primary')`, cập nhật bằng UPSERT nguyên tử, không bao giờ tạo dòng thứ 2 hoặc lịch sử phình to vô hạn.
3. **DEC-P21-03: Zero Client Access (100% Revocation)**
   - Bảng `system_heartbeats` và hàm `record_system_heartbeat` bị thu hồi quyền hoàn toàn khỏi `anon` và `authenticated`. Chỉ cấp `service_role`.
4. **DEC-P21-04: Bảo Vệ Endpoint & So Sánh Chuỗi Bằng Web Crypto**
   - Sử dụng Web Crypto API (`globalThis.crypto.subtle`) cho phép tương thích chuẩn trên cả Node.js, Vercel Edge và Cloudflare Workers với cơ chế so sánh timing-safe.
5. **DEC-P21-05: Tuyên Bố Từ Chối SLA (SLA Disclaimer)**
   - Khẳng định rõ ràng: Heartbeat là cơ chế kỹ thuật mang tính nỗ lực tối đa (best-effort), không phải cam kết SLA hay uptime guarantee.
