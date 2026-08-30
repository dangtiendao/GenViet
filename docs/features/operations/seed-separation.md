# Tách Biệt Dữ Liệu Khởi Tạo & Môi Trường (Seed Separation)

## 1. Nguyên Tắc Tách Biệt
1. **Dữ Liệu Khởi Tạo Development/Test:**
   - Chỉ được áp dụng trên môi trường cục bộ (`supabase/seed.sql` hoặc scripts kiểm thử).
   - Tuyệt đối không được kích hoạt tự động khi build hoặc start production application.
2. **Không Tạo Dữ Liệu Nghiệp Vụ Giả Khi Heartbeat:**
   - Quá trình heartbeat chỉ cập nhật bảng kỹ thuật `system_heartbeats`.
   - Tuyệt đối không tạo fake Person, không tạo fake Relationship/Union, và không ghi nhận business audit log.
