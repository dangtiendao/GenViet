# Hợp Đồng Bucket & Quy Ước Đường Dẫn Đối Tượng (Bucket & Path Contract)

## 1. Cấu Hình Bucket `person-avatars`
- **Bucket ID:** `person-avatars`
- **Chế độ:** Private (`public = false`)
- **Giới hạn dung lượng:** 10 MB (10.485.760 bytes)
- **Định dạng MIME cho phép:** `image/jpeg`, `image/png`, `image/webp`

---

## 2. Quy Ước Đường Dẫn (Object Path Schemes)

### 2.1. Đường Dẫn Bền Vững (Active Path)
`trees/{treeId}/persons/{personId}/avatars/{mediaId}/{variant}.webp`
- `{treeId}`: UUID cây gia phả
- `{personId}`: UUID nhân vật sở hữu
- `{mediaId}`: UUID ngẫu nhiên duy nhất của phiên ảnh
- `{variant}`: `avatar` (512x512) hoặc `thumb` (128x128)

### 2.2. Đường Dẫn Tạm Thời (Temporary Path)
`temporary/trees/{treeId}/persons/{personId}/{uploadId}/{variant}.webp`
- `{uploadId}`: UUID phiên upload tạm thời
