# Phase P17: Kế Hoạch Thi Công (Execution Plan)

## 1. Các Gói Công Việc (Work Packages)
1. **P17-WP01:** Preflight và thiết lập môi trường Storage.
2. **P17-WP02:** Migration cơ sở dữ liệu, tạo private bucket và Storage RLS policies.
3. **P17-WP03:** Image validation, nén WebP, xóa EXIF và tạo thumbnail.
4. **P17-WP04:** Luồng upload tạm thời (Temporary Upload) và hoàn tất metadata (Finalize).
5. **P17-WP05:** Cung cấp ảnh riêng tư qua Signed URLs và tối ưu bộ nhớ đệm cache.
6. **P17-WP06:** Thay thế ảnh đại diện, dọn dẹp file cũ và phát hiện file mồ côi (Orphan Cleanup).
7. **P17-WP07:** Kiểm thử bảo mật (Đoán URL, cách ly Cross-Tree).
8. **P17-WP08:** Tích hợp giao diện (Person Detail, PersonNode, Search Result) và bàn giao.
