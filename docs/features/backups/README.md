# Tính Năng Sao Lưu & Khôi Phục (Backup & Restore Feature)

## 1. Tổng Quan
Tính năng Sao lưu & Khôi phục của GenViet cung cấp khả năng xuất (Export) và nhập (Import) dữ liệu cây gia phả dưới dạng tệp JSON có phiên bản chuẩn (`schemaVersion: 1`), độc lập và an toàn:
- **Định dạng JSON Schema Draft 2020-12:** Chuẩn hóa toàn bộ cấu trúc dữ liệu phả hệ gồm Family Tree, Persons, Relationships, Unions, Union Members và Media Metadata.
- **Bảo mật & Quyền riêng tư:** Loại bỏ 100% tokens, mật khẩu, signed URLs và dữ liệu nhị phân ảnh khỏi file backup.
- **Nhập An Toàn & Nguyên Tử (Atomic Import):** Tự động sinh UUID mới cho toàn bộ các thực thể, rewrite foreign keys, và thực thi toàn bộ trong một Database Transaction duy nhất (Rollback 100% nếu có lỗi).
- **Mặc định tạo Cây Mới:** Thao tác nhập luôn tạo một cây gia phả độc lập ở trạng thái `private`, người thực hiện nhập trở thành Owner duy nhất.
