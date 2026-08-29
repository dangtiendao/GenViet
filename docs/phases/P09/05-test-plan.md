# Kế hoạch Kiểm thử Hệ thống Xác thực: Phase P09 (Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các kịch bản kiểm thử bảo mật và quy trình xác thực người dùng cho Phase P09.

---

## 1. Ma trận Kịch bản Kiểm thử

### Nhóm 1: Form Validation & Redirects (Unit Tests)
- **TEST-01:** Zod schema kiểm tra hợp lệ và từ chối dữ liệu rác (email sai, mật khẩu ngắn, confirm mismatch) $\rightarrow$ `PASS` (`tests/unit/auth-schemas.test.ts`).
- **TEST-02:** Hàm `getSafeRedirectUrl` cho phép đường dẫn nội bộ và từ chối các URL độc hại (`//attacker.com`, `javascript:`, CRLF) $\rightarrow$ `PASS` (`tests/unit/auth-redirects.test.ts`).
- **TEST-03:** Error taxonomy ánh xạ đúng 17 mã lỗi sang thông báo an toàn tiếng Việt $\rightarrow$ `PASS` (`tests/unit/auth-errors.test.ts`).

### Nhóm 2: Security & Boundaries (Security Tests)
- **TEST-04:** Xác minh các tệp nhạy cảm (`require-user.ts`, `server.ts`) có `import "server-only"` và Server Actions có `"use server"` $\rightarrow$ `PASS` (`tests/security/auth-security.test.ts`).
- **TEST-05:** Quét mã nguồn không để lọt `SUPABASE_SERVICE_ROLE_KEY` trong client components $\rightarrow$ `PASS`.

### Nhóm 3: Profile Provisioning (Database Tests)
- **TEST-06:** Trigger `_system.handle_new_user()` tự động khởi tạo profile với display name từ metadata hoặc email prefix $\rightarrow$ `PASS` (`supabase/tests/02000_auth_profile_provisioning.test.sql`).
- **TEST-07:** Tính lũy kế (idempotency) của trigger khi gọi lặp lại $\rightarrow$ `PASS`.

### Nhóm 4: Giao diện & Luồng Xác thực (Playwright E2E Tests)
- **TEST-08:** Chuyển hướng người dùng chưa đăng nhập khi truy cập `/dashboard` về `/login?next=%2Fdashboard` $\rightarrow$ `PASS` (`tests/e2e/auth.spec.ts`).
- **TEST-09:** Render đầy đủ các thành phần trên trang Đăng nhập, Đăng ký, Quên mật khẩu, Báo lỗi $\rightarrow$ `PASS`.
- **TEST-10:** Render tốt trên Viewport di động (iPhone / Android) $\rightarrow$ `PASS`.
