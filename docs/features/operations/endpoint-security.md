# Bảo Mật Endpoint Nội Bộ (Internal Endpoint Security)

## 1. Ranh Giới & Quy Chuẩn Endpoint
- **Đường dẫn:** `POST /api/internal/heartbeat`
- **Phương thức:** Chỉ chấp nhận `POST`. Toàn bộ `GET`, `PUT`, `DELETE`, `PATCH` đều trả về `HTTP 405 Method Not Allowed`.
- **Cơ chế xác thực:**
  - Header `Authorization: Bearer <HEARTBEAT_SECRET>` hoặc `x-heartbeat-secret: <HEARTBEAT_SECRET>`.
  - So sánh bằng Web Crypto SHA-256 Digest và vòng lặp bitwise XOR hằng số thời gian (`timingSafeStringEqual`) chống timing side-channel attacks.
- **Giới hạn Payload:** Tối đa 1 KB.
- **Header Phản Hồi:** `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`.
- **Nguyên Tắc Bảo Vệ Bí Mật:** Tuyệt đối không log token hay Authorization header ra stdout/stderr, không echo secret trong response body, không trả stack traces hay chi tiết SQL nội bộ.
