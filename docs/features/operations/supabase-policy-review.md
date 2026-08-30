# Đánh Giá Chính Sách Supabase Free Plan (Supabase Policy Review)

## 1. Thông Tin Đánh Giá
- **Ngày kiểm tra:** 30/08/2026
- **Nguồn tài liệu chính thức:** Supabase Docs & Pricing (https://supabase.com/pricing, https://supabase.com/docs/guides/platform/pausing)
- **Gói dịch vụ giả định:** Supabase Free Tier (Hobby/Community Plan)

## 2. Các Quy Định Hiện Hành Cần Lưu Ý
1. **Cơ chế Tạm Dừng Dự Án (Project Pausing):**
   - Các dự án thuộc gói Free không có hoạt động trong 7 ngày liên tục có thể bị tạm dừng tự động để giải phóng tài nguyên nền tảng.
   - Để khôi phục dự án đã bị tạm dừng, người quản trị cần truy cập Supabase Dashboard để Unpause thủ công.
2. **Hạn Mức Miễn Phí (Free Limits):**
   - 500 MB PostgreSQL Database storage.
   - 1 GB File Storage.
   - 500,000 Edge Function Invocations / tháng.
3. **Mục Đích Của Nhịp Tim (Heartbeat Purpose):**
   - Hoạt động heartbeat nhằm thực hiện kiểm tra kết nối kỹ thuật định kỳ (5 ngày một lần) và duy trì trạng thái vận hành của hệ thống.
   - **Tuyên Bố Từ Chối Trách Nhiệm (Disclaimer):** Heartbeat KHÔNG bảo đảm 100% dự án không bị tạm dừng nếu Supabase thay đổi thuật toán phát hiện hoạt động. Đây là cơ chế hỗ trợ kỹ thuật (best-effort), không phải là SLA hay uptime guarantee.
