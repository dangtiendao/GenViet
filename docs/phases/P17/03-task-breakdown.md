# Phase P17: Bảng Đối Soát 20 Nhiệm Vụ (Task Breakdown P17-T01 đến P17-T20)

| Mã Task | Tên Nhiệm Vụ | Trạng Thái | Chi Tiết Thực Hiện |
| :--- | :--- | :---: | :--- |
| `P17-T01` | Tạo private bucket | **COMPLETED** | Bucket `person-avatars` (`public = false`, limit 10MB) |
| `P17-T02` | Thiết kế đường dẫn file | **COMPLETED** | Opaque path `trees/{treeId}/persons/{personId}/avatars/{mediaId}/...` |
| `P17-T03` | Policy upload | **COMPLETED** | Storage RLS INSERT cho Writer của Tree |
| `P17-T04` | Policy đọc | **COMPLETED** | Storage RLS SELECT cho Member của Tree / Public Tree |
| `P17-T05` | Policy xóa | **COMPLETED** | Storage RLS DELETE cho Writer của Tree |
| `P17-T06` | Kiểm tra MIME | **COMPLETED** | Magic bytes: JPEG (`FF D8 FF`), PNG, WebP |
| `P17-T07` | Kiểm tra kích thước | **COMPLETED** | Giới hạn 10MB, max 8.000x8.000px, 40MP budget |
| `P17-T08` | Đổi tên bằng UUID | **COMPLETED** | Opaque UUID random cho mediaId và uploadId |
| `P17-T09` | Nén ảnh phía client | **COMPLETED** | Canvas export sang WebP (Quality 0.85, max 512x512) |
| `P17-T10` | Xóa EXIF | **COMPLETED** | Re-draw trên Canvas xóa toàn bộ GPS & Device tags |
| `P17-T11` | Tạo thumbnail | **COMPLETED** | Cắt vuông tâm 128x128px cho PersonNode & Search |
| `P17-T12` | Upload tạm | **COMPLETED** | Luồng tải file vào thư mục `temporary/...` |
| `P17-T13` | Hoàn tất metadata | **COMPLETED** | Finalize metadata trong `person_avatars` & `persons` |
| `P17-T14` | Tạo signed URL | **COMPLETED** | Cấp Signed Read URL với TTL = 15 phút (900s) |
| `P17-T15` | Cache thumbnail phù hợp | **COMPLETED** | `signedUrlCache` in-memory cache tự làm mới |
| `P17-T16` | Thay ảnh đại diện | **COMPLETED** | `AvatarUploader` hỗ trợ xem trước và thay ảnh |
| `P17-T17` | Xóa ảnh cũ | **COMPLETED** | Compensation: Chỉ dọn file cũ sau khi ảnh mới active |
| `P17-T18` | Xử lý orphan file | **COMPLETED** | Script `cleanup-orphan-avatars.mjs` (Safe age 24h) |
| `P17-T19` | Test đoán URL | **COMPLETED** | Bảo vệ chống đoán URL hoặc truy cập không token |
| `P17-T20` | Test quyền cây khác | **COMPLETED** | Cách ly hoàn toàn dữ liệu giữa các cây gia phả |
