# Hướng dẫn Kiểm thử Hệ thống Xác thực (Authentication Testing Guide)

- **Mã tài liệu:** `TEST-AUTH-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Các Lệnh Thực thi Kiểm thử

```bash
# 1. Chạy toàn bộ Unit & Security Tests (Vitest)
npm run test:run

# 2. Chạy kiểm tra cú pháp và cấu trúc Migration
npm run supabase:migrations:check

# 3. Chạy kiểm tra tính tươi mới của Database Types
npm run supabase:types:check

# 4. Chạy toàn bộ E2E Tests (Playwright)
npm run test:e2e

# 5. Chạy toàn bộ Quality Gates
npm run check
```

## 2. Danh mục Test Suites

| Nhóm Kiểm thử | Tệp tin Thực thi | Số lượng Tests / Assertions | Kết quả |
| :--- | :--- | :---: | :---: |
| **Zod Form Schemas** | `tests/unit/auth-schemas.test.ts` | 13 tests | `PASS` |
| **Safe Redirect Guard** | `tests/unit/auth-redirects.test.ts` | 6 tests | `PASS` |
| **Auth Error Taxonomy** | `tests/unit/auth-errors.test.ts` | 5 tests | `PASS` |
| **Auth Security & Boundaries** | `tests/security/auth-security.test.ts` | 3 tests | `PASS` |
| **Service-Role Isolation** | `tests/security/service-role-exposure.test.ts` | 4 tests | `PASS` |
| **E2E Smoke & Auth Flows** | `tests/e2e/auth.spec.ts` & `smoke.spec.ts` | 9 tests | `PASS` |
| **Database Profile Provisioning** | `supabase/tests/02000_auth_profile_provisioning.test.sql` | 6 assertions | `PASS` |
