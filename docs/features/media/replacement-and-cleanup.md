# Thay Thế & Dọn Dẹp Ảnh Cũ (Replacement & Cleanup)

## 1. Nguyên Tắc Compensation & Không Mất Dữ Liệu
1. Ảnh đại diện mới được upload vào thư mục tạm thời (`temporary/...`).
2. Chỉ khi sao chép sang thư mục active và cập nhật CSDL `persons.avatar_path` thành công, hệ thống mới tiến hành xóa file ảnh cũ.
3. Nếu thao tác cập nhật CSDL thất bại, ảnh đại diện cũ vẫn được giữ nguyên vẹn và hiển thị bình thường.
4. Quá trình xóa file cũ và file tạm được thực thi nền bất đồng bộ, không làm chậm phản hồi tới người dùng.
