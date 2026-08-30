# Kế Hoạch Thử Nghiệm Cloudflare Staging (Cloudflare Staging Compatibility - P27-T19)

## 1. Khảo Sát Tính Tương Thích Runtime
1. **Web Crypto API & Edge Runtime:** Hoàn toàn tương thích.
2. **Supabase SSR Auth Client:** Tương thích với môi trường Serverless.
3. **Mã nguồn App Router:** Yêu cầu bộ adapter OpenNext / Cloudflare Next-on-Pages để tối ưu hóa.

## 2. Ranh Giới An Toàn
- Tuyệt đối không sử dụng cơ sở dữ liệu Production hoặc Secret Production cho môi trường Staging.
- Việc triển khai Staging trên Cloudflare là `MANUAL_ACTION_REQUIRED` và chỉ thực hiện khi có sự phê duyệt của chủ dự án.
