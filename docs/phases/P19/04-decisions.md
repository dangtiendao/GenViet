# Phase P19: Quyết Định Kiến Trúc Đã Chốt (Architectural Decisions)

## 1. Danh Sách Quyết Định Đã Khóa
1. **DEC-P19-01: Định dạng sao lưu JSON Schema Draft 2020-12 & schemaVersion = 1**
   - Tài liệu sao lưu độc lập với phiên bản ứng dụng, sử dụng số nguyên tăng dần.
2. **DEC-P19-02: Không export dữ liệu nhị phân hoặc signed URL**
   - File JSON chỉ lưu siêu dữ liệu (metadata), ảnh sẽ trở về trạng thái placeholder sau khi nhập.
3. **DEC-P19-03: Ánh xạ 100% ID sang UUID mới khi nhập**
   - Không tái sử dụng ID nguồn, bảo đảm cách ly hoàn toàn dữ liệu giữa các cây gia phả.
4. **DEC-P19-04: Mặc định tạo Cây Gia Phả mới ở chế độ Private**
   - Thao tác nhập luôn tạo một cây gia phả độc lập, người dùng đang đăng nhập trở thành Owner duy nhất.
5. **DEC-P19-05: Giao dịch nguyên tử & Rollback 100%**
   - Thực thi trọn vẹn trong PostgreSQL RPC transaction `import_family_tree_backup`.
