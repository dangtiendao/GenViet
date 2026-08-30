# Đánh Giá Chính Sách Gói Vercel Hobby (Vercel Hobby Policy Review - P24-T16)

- **Ngày kiểm tra:** 30/08/2026
- **Nguồn tài liệu chính thức:** Vercel Fair Use Policy & Pricing Documentation (https://vercel.com/docs/plans/hobby)
- **Tên dự án:** GenViet (v0.1)
- **Mục đích sử dụng:** Dự án cá nhân, phi thương mại (Personal / Non-commercial open-source project).
- **Thu phí người dùng:** KHÔNG (0 VND / Free).
- **Sử dụng cho doanh nghiệp:** KHÔNG.

## 1. Hạn Mức Gói Vercel Hobby Hiện Hành

| Hạng Mục Tài Nguyên | Giới Hạn Gói Hobby | Dự Kiến Mức Sử Dụng GenViet v0.1 | Đánh Giá Mức Độ Phù Hợp |
| :--- | :--- | :--- | :---: |
| **Băng thông (Data Transfer)** | 100 GB / tháng | ~ 5 - 10 GB / tháng | **ĐẠT (Thoải mái)** |
| **Serverless Function Execution** | 100 GB-Hrs / tháng | ~ 10 - 20 GB-Hrs | **ĐẠT** |
| **Serverless Execution Timeout** | 10s (mặc định) - 60s max | < 2s (tối ưu hóa ở P23) | **ĐẠT** |
| **Build Executions** | 6,000 phút / tháng | < 100 phút / tháng | **ĐẠT** |
| **Edge Middleware Invocations** | 1,000,000 yêu cầu / tháng | < 50,000 yêu cầu / tháng | **ĐẠT** |
| **Image Optimization** | 1,000 source images / tháng | < 200 source images (dùng private Signed URL avatar) | **ĐẠT** |
| **Custom Domains** | Hỗ trợ miễn phí | 1 Domain chính (ví dụ: `genviet.vn`) | **ĐẠT** |
| **SSL / TLS Certificate** | Tự động Let's Encrypt | HTTPS tự động | **ĐẠT** |

## 2. Kết Luận & Quyết Định
- **Quyết định:** `HOBBY_ALLOWED`
- **Lưu ý:** Gói Vercel Hobby không cung cấp cam kết SLA doanh nghiệp. Nếu trong tương lai dự án GenViet mở rộng quy mô thương mại hoặc hợp tác với tổ chức/dòng họ có phát sinh thu phí, bắt buộc phải nâng cấp lên **Vercel Pro**.
