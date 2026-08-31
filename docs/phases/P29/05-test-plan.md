# Kế Hoạch & Ma Trận Kiểm Thử Phase P29 (Test Plan)

## 1. Phạm Vi Kiểm Thử
| Tầng Kiểm Thử | File Test | Trọng Tâm | Trạng Thái |
| :--- | :--- | :--- | :--- |
| **Unit Test** | `tests/unit/auth/google-oauth.test.ts` | Provider allowlist, minimal scopes, `startOAuthSignIn` initiation service | PASS |
| **Unit Test** | `tests/unit/auth/safe-return-path.test.ts` | Open-redirect rejection, protocol-relative rejection, CRLF injection rejection | PASS |
| **Unit Test** | `tests/unit/auth/session-isolation.test.ts` | Dọn dẹp session, Service Worker cache, sessionStorage khi logout/switch | PASS |
| **Unit Test** | `tests/unit/auth-errors.test.ts` | Bảng mã lỗi P09 & P29 taxonomy, mapping thông điệp an toàn | PASS |
| **Integration Test** | `tests/integration/auth/oauth-callback.test.ts` | Route Handler callback, PKCE exchange, no-store headers, safe redirect | PASS |
| **Security Test** | `tests/security/oauth-security.test.ts` | Server-only boundary, Secret scan, token/code leak scan, no auto-membership | PASS |
| **Regression Test** | Toàn bộ 122+ test files P00 -> P28 | Bảo toàn 100% các tính năng hiện hữu (Email/Password, Tree, Media, PWA, Backup) | PASS |

## 2. Tiêu Chuẩn Nghiệm Thu Kỹ Thuật (Acceptance Criteria)
- Đạt 100% PASS trên toàn bộ test suite.
- Không có lỗ hổng rò rỉ secret trong client bundle.
- Callback response luôn mang header `Cache-Control: no-store`.
- Zero privilege escalation: User Google không có quyền trên cây phả hệ riêng tư nếu chưa có membership.
