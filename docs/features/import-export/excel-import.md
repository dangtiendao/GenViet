# Nhập Dữ Liệu Bảng Tính Excel (Excel Import Pipeline - P27-T10)

## 1. Quy Trình Nhập Dữ Liệu Có Kiểm Soát
1. **Tải lên & Phân tích:** Đọc tệp `.xlsx`, loại bỏ mã công thức (Formula Injection).
2. **Khớp cột:** Nhận diện Họ tên, Giới tính, Ngày sinh, Cha, Mẹ, Vợ/Chồng.
3. **Xem trước (Preview):** Hiển thị số lượng nhân vật, quan hệ và cảnh báo lỗi.
4. **Giao dịch nguyên tử:** Ghi dữ liệu vào cây gia phả; tự động rollback nếu gặp lỗi toàn vẹn.
