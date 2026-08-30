# Kiểm Tra & Xác Thực Định Dạng Hình Ảnh (Image Validation)

## 1. Nguyên Tắc An Toàn
1. **Kiểm tra Magic Bytes:** Không tin tưởng phần mở rộng tệp (`.jpg`, `.png`) hay `File.type` do trình duyệt gửi lên. Bắt buộc kiểm tra chuỗi byte đầu (Magic Bytes):
   - JPEG: `FF D8 FF`
   - PNG: `89 50 4E 47 0D 0A 1A 0A`
   - WebP: `RIFF ... WEBP`
2. **Từ chối SVG & Script:** Tuyệt đối chặn các định dạng SVG, HTML, Executable, PDF để ngăn ngừa tấn công XSS hoặc Remote Code Execution.
3. **Giới Hạn Kích Thước & Điểm Ảnh:**
   - Dung lượng tệp tối đa: 10 MB.
   - Chiều rộng/cao tối đa: 8.000 x 8.000 pixel.
   - Ngân sách điểm ảnh: Tối đa 40 Megapixels (chống Decompression Bomb).
