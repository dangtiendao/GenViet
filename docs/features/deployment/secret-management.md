# Quản Lý Bí Mật & Phòng Chống Lộ Service Role (Secret Management - P24-T06)

## 1. Biện Pháp Phòng Vệ Rò Rỉ Bí Mật
1. **Tuyệt đối không dùng tiền tố `NEXT_PUBLIC_`** cho bất kỳ token quản trị, Service Role Key hay cơ sở dữ liệu credentials nào.
2. **Quét tự động trong CI/CD:** Script `scripts/deployment/scan-client-secrets.mjs` quét toàn bộ source code và static bundle để chặn việc build nếu phát hiện dấu hiệu rò rỉ secret.
3. **Phân quyền truy cập Vercel:** Chỉ các thành viên có vai trò Owner/Admin mới được phép xem hoặc chỉnh sửa giá trị biến môi trường trên Vercel Dashboard.
