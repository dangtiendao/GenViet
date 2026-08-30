# Hợp Đồng Triển Khai Production (Production Deployment Contract - P24-T03)

## 1. Tiêu Chuẩn Cho Bản Triển Khai Chính Thức (Production)
1. **Nhánh nguồn:** Chỉ các commit đã được kiểm thử, phê duyệt và merge vào nhánh `master` mới được triển khai lên Production.
2. **Custom Domain:** Trỏ về tên miền chính thức (ví dụ: `https://genviet.vn`) với chứng chỉ SSL HTTPS hợp lệ.
3. **Cơ sở dữ liệu:** Kết nối với Supabase Production project. Migrations chỉ được áp dụng trước khi triển khai code (Forward-only schema).
4. **Smoke Test:** Bắt buộc chạy kiểm tra toàn diện `scripts/deployment/smoke-production.mjs` ngay sau khi bản build hoàn tất.
