# An toàn Chuyển hướng & Chống Open-Redirect (Auth Redirect Security)

- **Mã tài liệu:** `SEC-REDIRECT-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Cơ chế Chống Tấn công Open-Redirect (`getSafeRedirectUrl`)

Mọi tham số chuyển hướng (`next`, `redirectTo`) đều bắt buộc phải đi qua hàm kiểm tra nghiêm ngặt `getSafeRedirectUrl(target, fallback)` tại `src/lib/auth/redirects.ts`:

1. **Bắt buộc Ký tự Khởi đầu:** Phải bắt đầu bằng đúng 1 dấu `/`.
2. **Chặn Protocol-Relative:** Từ chối chuỗi bắt đầu bằng `//` (ví dụ `//attacker.com`).
3. **Chặn Schema Tuyệt đối:** Từ chối `http:`, `https:`, `javascript:`, `data:`.
4. **Chặn Ký tự Điều khiển & CRLF:** Từ chối `\r`, `\n` để chống HTTP Response Splitting.
5. **Chặn Ký tự Backslash:** Từ chối `/\attacker.com`.
6. **Fallback An toàn:** Tự động trả về `/dashboard` nếu phát hiện bất kỳ dấu hiệu không hợp lệ nào.
