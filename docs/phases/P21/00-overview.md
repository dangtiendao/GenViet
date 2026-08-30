# Phase P21: Tổng Quan Phase Heartbeat và Vận Hành Miễn Phí (Phase Overview)

## 1. Thông Tin Phase
- **Mã Phase:** P21
- **Tên Phase:** Heartbeat và vận hành miễn phí
- **Dự Án:** GenViet (v0.1)
- **Nhánh Git:** `phase/p21-heartbeat-operations`
- **Trạng Thái:** **COMPLETED & ACCEPTED**
- **Phạm Vi:** Bảng kỹ thuật `system_heartbeats` singleton, RLS thu hồi quyền client, restricted writer function `record_system_heartbeat`, protected endpoint `POST /api/internal/heartbeat`, Web Crypto timing-safe secret verification, GitHub Actions workflow `.github/workflows/heartbeat.yml` (cron schedule + workflow_dispatch), bounded retry with backoff, zero fake business records, development seed separation, safe test data cleanup tool (`scripts/cleanup/cleanup-test-data.mjs`), và SLA disclaimer.
