# Phase P21: Bảng Đối Soát 18 Nhiệm Vụ (Task Breakdown P21-T01 đến P21-T18)

| Mã Task | Tên Nhiệm Vụ | Trạng Thái | Chi Tiết Thực Hiện |
| :--- | :--- | :---: | :--- |
| `P21-T01` | Tạo bảng kỹ thuật `system_heartbeats` | **COMPLETED** | Migration `20260830180000_p21_add_system_heartbeats.sql` |
| `P21-T02` | Chỉ giữ một bản ghi heartbeat | **COMPLETED** | Khóa `id = 'primary'`, check constraint `check (id = 'primary')`, UPSERT semantics |
| `P21-T03` | Bật RLS | **COMPLETED** | `enable row level security` và `force row level security` |
| `P21-T04` | Không cấp quyền client | **COMPLETED** | Thu hồi 100% quyền từ `anon` và `authenticated`, chỉ cấp `service_role` |
| `P21-T05` | Tạo endpoint nội bộ | **COMPLETED** | `src/app/api/internal/heartbeat/route.ts` (POST only, 405 cho GET/PUT/DELETE) |
| `P21-T06` | Bảo vệ endpoint bằng secret | **COMPLETED** | Header `Authorization: Bearer <HEARTBEAT_SECRET>` hoặc `x-heartbeat-secret` |
| `P21-T07` | Dùng Web Crypto API | **COMPLETED** | `timingSafeStringEqual` bằng Web Crypto SHA-256 Digest constant time |
| `P21-T08` | Tạo GitHub Actions schedule | **COMPLETED** | `.github/workflows/heartbeat.yml` cron `17 3 */5 * *` (03:17 UTC mỗi 5 ngày) |
| `P21-T09` | Thêm retry | **COMPLETED** | 3 attempts, exponential backoff (10s, 20s), dừng ngay nếu lỗi 401/403 |
| `P21-T10` | Log trạng thái chạy | **COMPLETED** | Ghi nhận safe run log, không echo secret, tạo GitHub Step Summary |
| `P21-T11` | Cảnh báo khi thất bại liên tiếp | **COMPLETED** | Counter `consecutive_failures`, workflow failure notification |
| `P21-T12` | Tạo manual trigger | **COMPLETED** | Hỗ trợ `workflow_dispatch` |
| `P21-T13` | Không tạo Person giả | **COMPLETED** | 0 fake person records created |
| `P21-T14` | Không tạo Relationship giả | **COMPLETED** | 0 fake relationship / union records created |
| `P21-T15` | Tách seed development | **COMPLETED** | Seed chỉ áp dụng local/dev/test, không chạy khi build/start |
| `P21-T16` | Tạo script dọn dữ liệu test | **COMPLETED** | `scripts/cleanup/cleanup-test-data.mjs` với dry-run mặc định và chặn production |
| `P21-T17` | Ghi rõ heartbeat không phải SLA | **COMPLETED** | Disclaimer đầy đủ tại UI, tài liệu và mã nguồn |
| `P21-T18` | Kiểm tra lại chính sách Supabase | **COMPLETED** | `docs/features/operations/supabase-policy-review.md` |
