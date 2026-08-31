# Tổng Quan Phase P29: Đăng Nhập Bằng Google OAuth (Google OAuth Login)

## 1. Thông Tin Phase
- **Mã phase:** P29
- **Tên phase:** Đăng nhập bằng Google OAuth
- **Dự án:** GenViet
- **Phạm vi:** Bổ sung phương thức đăng nhập “Tiếp tục với Google” qua Supabase Auth (SSR PKCE)
- **Baseline:** Toàn bộ P00 đến P28 đã hoàn thành và nghiệm thu
- **Phase kế tiếp dự kiến:** P30 Public Guest View (tuyệt đối không bắt đầu trong phase này)

## 2. Bối Cảnh và Mục Tiêu Cốt Lõi
1. Bổ sung nút “Tiếp tục với Google” vào hệ thống xác thực hiện hành của GenViet.
2. Dùng Supabase Auth làm Auth provider duy nhất; không tạo bảng tài khoản hay JWT verifier thứ hai.
3. Bảo toàn 100% chức năng đăng nhập Email/Password hiện có.
4. Áp dụng chuẩn OAuth 2.0 / OIDC với flow PKCE phù hợp với kiến trúc Next.js 16 App Router & Supabase SSR.
5. Bảo vệ Route Handler callback (`/auth/callback`) và đường dẫn trả về (`return path / next`) khỏi lỗ hổng Open-Redirect và CRLF Injection.
6. Thiết lập phiên làm việc (Session) bằng HTTP-Only Secure Cookies theo đúng hợp đồng SSR.
7. **Nguyên tắc phân quyền bất biến:**
   - Không tự động cấp quyền thành viên gia phả (`Tree Membership`) sau khi đăng nhập Google.
   - Không tự động liên kết tài khoản Google với bất kỳ hồ sơ nhân vật (`Person`).
   - Không tự động chấp nhận lời mời (`Invitation`) chỉ dựa trên địa chỉ email Google.
   - Không dùng profile Google để ghi đè dữ liệu phả hệ của Person.
8. Bảo toàn cơ chế dọn dẹp cache riêng tư khi Đăng xuất (Logout) và Chuyển đổi tài khoản (Account Switch).
9. Bảo vệ tuyệt đối bí mật: Không đưa Google Client Secret, Authorization code, hay access/refresh token vào client bundle, log hoặc artifacts.
10. Thiết lập runbook hướng dẫn cấu hình chi tiết cho Google Cloud Console và Supabase Dashboard.
