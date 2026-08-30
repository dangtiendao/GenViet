# Các Quyết Định Thiết Kế Nghiệp Vụ Phase P27 (Domain Decisions)

## 1. Danh Sách Quyết Định Khóa (Locked Decisions)
1. **DEC-P27-01 (Phân Quyền 5 Vai Trò):** Thiết lập thứ bậc phân quyền `owner > admin > editor > contributor > viewer`. Owner cuối cùng không thể bị xóa hoặc hạ quyền.
2. **DEC-P27-02 (Tách Biệt Account & Person):** Tài khoản đăng nhập và Nhân vật phả hệ là 2 thực thể riêng biệt. Liên kết không tự động cấp quyền sở hữu.
3. **DEC-P27-03 (Âm Lịch Có Phiên Bản):** Sử dụng `VN_ASTRONOMICAL_V1` cho múi giờ GMT+7, đặt sau Feature Flag thử nghiệm.
4. **DEC-P27-04 (Gộp Hồ Sơ Có Kiểm Toán):** Gộp hồ sơ bắt buộc xem trước, kiểm tra phiên bản (optimistic locking), chống lặp chu trình và xóa mềm (tombstone) hồ sơ bị gộp.
5. **DEC-P27-05 (Trừu Tượng Hóa Storage Provider):** Cô lập mã nguồn nghiệp vụ khỏi URL nhà cung cấp lưu trữ, sẵn sàng chuyển đổi Cloudflare R2 khi mở rộng thương mại.
