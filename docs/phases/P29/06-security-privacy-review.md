# Đánh Giá An Ninh & Bảo Mật Quyền Riêng Tư Phase P29 (Security & Privacy Review)

## 1. Kết Quả Rà Soát Bí Mật & Thông Tin Nhạy Cảm (Secret & Sensitive Data Scan)
- **Google Client Secret:** Không xuất hiện trong bất kỳ file mã nguồn, component, client bundle, log hoặc documentation nào. Chỉ được lưu trong Supabase Dashboard Authentication Provider Settings.
- **Supabase Service Role Key:** Không bị import hay tham chiếu trong các client component hoặc auth pages.
- **Authorization Code & Session Tokens:** Không bị ghi log hay gửi tới error tracker (`recordAuthFailure` áp dụng cơ chế lọc bỏ toàn bộ query param nhạy cảm).
- **Cookie Flags:** Thiết lập thông qua `@supabase/ssr` đảm bảo `HttpOnly`, `Secure` (trong môi trường HTTPS), `SameSite=Lax`.

## 2. Kiểm Soát Phân Quyền & Ranh Giới Định Danh
- **No Auto-Membership:** Đăng nhập Google không tự động thêm user vào bất kỳ cây phả hệ nào.
- **No Auto-Person Linking:** Tài khoản người dùng không tự động gắn kết với hồ sơ nhân vật trong cây dù trùng email hoặc tên.
- **No Invitation Auto-Accept:** Các lời mời đang chờ vẫn đòi hỏi người dùng thực hiện accept qua quy trình bảo mật P27.

## 3. Chống Tấn Công Chuyển Hướng (Anti Open-Redirect & Header Injection)
- Mọi giá trị `next` đều được chuẩn hóa qua `getSafeRedirectUrl`.
- Từ chối các vector tấn công: `https://evil.com`, `//evil.com`, `/\evil.com`, `javascript:`, `data:`, `CRLF`.
- Header phản hồi `Cache-Control: no-store` ngăn chặn tuyệt đối việc lưu trữ trung gian mã callback.

## 4. Kết Luận
Báo cáo an ninh và quyền riêng tư đạt mức độ **SAFE / APPROVED**.
