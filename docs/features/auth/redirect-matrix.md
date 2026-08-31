# Ma Trận Điều Hướng & Allowlist URL (Redirect Matrix)

- **Mã tài liệu:** `FEAT-AUTH-REDIRECT-01`
- **Phiên bản:** `v1.0`

---

## 1. Bảng Đối Soát Môi Trường & Callback URLs
| Môi Trường | Hostname Ứng Dụng | Redirect URL Cấu Hình Tại Supabase |
| :--- | :--- | :--- |
| **Local** | `localhost:3000`, `127.0.0.1:3000` | `http://localhost:3000/**`<br>`http://127.0.0.1:3000/**` |
| **Vercel Preview** | `*.vercel.app` | `https://*.vercel.app/**`<br>`https://genviet-*.vercel.app/**` |
| **Production** | `genviet.vn` | `https://genviet.vn/**` |

## 2. Tiêu Chuẩn Lọc Đường Dẫn Nội Bộ (Safe Internal Path Validation)
Hàm `getSafeRedirectUrl(target, fallback)` áp dụng các quy tắc kiểm tra nghiêm ngặt:
1. Phải bắt đầu bằng một ký tự gạch chéo `/`.
2. Không bắt đầu bằng hai gạch chéo `//` (Protocol-Relative URL).
3. Không bắt đầu bằng `/\` (Backslash Bypass).
4. Không chứa các schema ngoại vi: `http:`, `https:`, `javascript:`, `data:`, `vbscript:`.
5. Không chứa ký tự ngắt dòng `\r`, `\n` (CRLF Injection).
6. Tự động chuyển về `/dashboard` nếu bất kỳ điều kiện nào trên bị vi phạm.
