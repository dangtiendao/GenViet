# Thư Mời Cộng Tác An Toàn (Invitations - P27-T02)

## 1. Cơ Chế Bảo Mật Lời Mời
1. **Băm Token SHA-256:** Tuyệt đối không lưu token thô trong Database. Chỉ lưu mã băm SHA-256 với 32 bytes entropy ngẫu nhiên.
2. **Sử Dụng Một Lần (Single-Use):** Khi chấp nhận (Accept), token tự động chuyển trạng thái và tạo tư cách thành viên nguyên tử.
3. **Thời Hạn Sử Dụng (Expiry):** Mặc định 7 ngày, sau thời hạn token tự động bị vô hiệu hóa.
