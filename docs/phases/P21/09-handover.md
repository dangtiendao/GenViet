# Phase P21: Biên Bản Bàn Giao (Phase Handover)

## 1. Thông Tin Bàn Giao
- **Mã Phase:** P21
- **Tên Phase:** Heartbeat và vận hành miễn phí
- **Nhánh Thực Hiện:** `phase/p21-heartbeat-operations`
- **Trạng Thái:** **COMPLETED & ACCEPTED**

---

## 2. Hướng Dẫn Bàn Giao Cho Các Phase Sau
- **Bàn giao P22 (Security & Hardening):**
  - Endpoint security tests: `tests/unit/operations/heartbeat-route.test.ts`.
  - Web Crypto timing-safe verification: `tests/unit/operations/heartbeat-auth.test.ts`.
  - Singleton invariant và RLS tests: `supabase/tests/10000_system_heartbeats.test.sql`, `10100_system_heartbeats_rls.test.sql`.
- **Bàn giao P23 (Performance & Optimization):**
  - Thời gian xử lý endpoint nhịp tim < 50ms.
  - Zero performance impact trên database (duy nhất 1 dòng ghi nhận, không tạo index nặng hay query phức tạp).
- **Bàn giao P25 (Operations & Maintenance):**
  - Sổ tay cấu hình GitHub Secrets (`HEARTBEAT_ENDPOINT_URL`, `HEARTBEAT_SECRET`).
  - Hướng dẫn kích hoạt workflow thủ công và xử lý khi heartbeat thất bại (`docs/features/operations/runbook.md`).
  - Hướng dẫn dọn dẹp dữ liệu test định kỳ (`scripts/cleanup/cleanup-test-data.mjs`).
- **Bàn giao P26 (Release & Acceptance):**
  - Tuyên bố từ chối SLA và chính sách Supabase Free Plan (`docs/features/operations/supabase-policy-review.md`).
  - Nhắc nhở người dùng cấu hình GitHub Secrets thủ công trước khi kích hoạt trên môi trường thật.
