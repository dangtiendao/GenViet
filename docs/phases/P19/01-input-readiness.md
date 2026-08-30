# Phase P19: Báo Cáo Sẵn Sàng Đầu Vào (Input Readiness)

## 1. Kết Quả Kiểm Tra Điều Kiện Sẵn Sàng (DoR)

| Tiêu Chí Đánh Giá | Kết Quả | Ghi Chú |
| :--- | :---: | :--- |
| Backup scope và schemaVersion rõ ràng | **PASS** | `schemaVersion: 1`, JSON Schema Draft 2020-12 |
| Quyền xuất sao lưu thuộc về Tree Owner/Editor | **PASS** | Kiểm tra quyền trong RPC `export_family_tree_backup` |
| Khử nhiễm 100% secret/token/signed URL | **PASS** | Quét đệ quy Denylist và Allowlist |
| Import luôn tạo Tree mới và chỉ định Owner | **PASS** | `auth.uid()` là Owner duy nhất, privacy = private |
| Atomic Transaction & Rollback khi có lỗi | **PASS** | Thực thi trong `import_family_tree_backup` RPC |
| Ánh xạ toàn bộ ID sang UUID mới | **PASS** | Không tái sử dụng ID nguồn, rewrite toàn bộ FK |
| Giới hạn kích thước tệp và số lượng phần tử | **PASS** | Tối đa 10 MB, 5.000 Persons, 10.000 Relationships |
