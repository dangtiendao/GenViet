# Danh Sách Hạn Chế Đã Biết (Known Limitations - P26-T20)

Tài liệu này liệt kê các giới hạn kỹ thuật và phạm vi hiện tại của phiên bản MVP v0.1.0:

## 1. Các Giới Hạn Nghiệp Vụ & Ứng Dụng
1. **Chỉnh Sửa Offline Chưa Được Hỗ Trợ:** Khi mất mạng, ứng dụng hiển thị màn hình thông báo offline. Để thêm, sửa hoặc xóa dữ liệu phả hệ, người dùng cần có kết nối mạng để đồng bộ với cơ sở dữ liệu và bảo đảm RLS.
2. **Quy Mô Hiển Thị Mặc Định (Bounded Depth):** Để đảm bảo hiệu năng mượt mà trên thiết bị di động, đồ thị mặc định hiển thị vùng cây 3 thế hệ xung quanh người trung tâm. Người dùng có thể nhấn "Mở rộng tổ tiên" hoặc "Mở rộng hậu duệ" để tải thêm các tầng tiếp theo.
3. **Sao Lưu JSON Chưa Kèm Tệp Ảnh Nhị Phân:** Tệp sao lưu JSON chứa toàn bộ dữ liệu cấu trúc thành viên, quan hệ và đường dẫn ảnh. Để sao lưu toàn bộ file ảnh gốc, quản trị viên sử dụng công cụ sao lưu Storage Bucket độc lập.
4. **Tiêu Chuẩn GEDCOM:** Tính năng xuất/nhập tệp chuẩn GEDCOM dự kiến sẽ có trong phiên bản v0.2.0.
