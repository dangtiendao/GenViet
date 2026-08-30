# Phase P21: Kế Hoạch Thi Công (Execution Plan)

## 1. Các Gói Công Việc (Work Packages)
1. **P21-WP01:** Preflight và đánh giá chính sách Supabase Free Tier.
2. **P21-WP02:** Bảng `system_heartbeats`, singleton constraint, RLS, `record_system_heartbeat` function, pgTAP tests.
3. **P21-WP03:** Endpoint nội bộ `POST /api/internal/heartbeat`, secret verification Web Crypto, unit tests.
4. **P21-WP04:** GitHub Actions workflow `.github/workflows/heartbeat.yml`, cron schedule, manual dispatch, retry backoff.
5. **P21-WP05:** Logging an toàn, consecutive failure counter và alerting strategy.
6. **P21-WP06:** Tách biệt seed development, script `scripts/cleanup/cleanup-test-data.mjs` với dry-run và production guard.
7. **P21-WP07:** Tài liệu tính năng (`docs/features/operations/`) và hồ sơ phase (`docs/phases/P21/`).
8. **P21-WP08:** Quality gates, Review, Handover và Local Git commit.
