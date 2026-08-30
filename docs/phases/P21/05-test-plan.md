# Phase P21: Kế Hoạch & Báo Cáo Kiểm Thử (Test Plan & Report)

## 1. Các Tầng Kiểm Thử

### 1.1. Database Tests (pgTAP)
- `supabase/tests/10000_system_heartbeats.test.sql`: Kiểm tra bảng, cột, ràng buộc singleton `check (id = 'primary')`, kiểm tra count = 1.
- `supabase/tests/10100_system_heartbeats_rls.test.sql`: Kiểm tra RLS, quyền `anon` denied, `authenticated` denied, `service_role` allowed.
- `supabase/tests/10200_system_heartbeats_function.test.sql`: Kiểm tra hàm `record_system_heartbeat` success/failure, counter atomic update và bảo toàn số dòng = 1.

### 1.2. Unit & Integration Tests (Vitest)
- `tests/unit/operations/heartbeat-auth.test.ts`: Kiểm tra `timingSafeStringEqual`, `extractSecretFromHeaders`, `verifyHeartbeatSecret`.
- `tests/unit/operations/heartbeat-service.test.ts`: Kiểm tra `HeartbeatService.processHeartbeat` với allowlist source và measured duration.
- `tests/unit/operations/heartbeat-route.test.ts`: Kiểm tra Route Handler `POST /api/internal/heartbeat`, kiểm tra từ chối 405 với GET/PUT/DELETE, từ chối 401 khi thiếu/sai secret, trả về 200 với `no-store` khi hợp lệ.
