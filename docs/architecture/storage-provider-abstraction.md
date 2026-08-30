# Lớp Trừu Tượng Hóa Nhà Cung Cấp Lưu Trữ (Storage-Provider Abstraction - P27-T18)

## 1. Mục Tiêu Thiết Kế
Cô lập toàn bộ mã nguồn nghiệp vụ khỏi các API đặc thù của từng nhà cung cấp lưu trữ (Supabase Storage vs Cloudflare R2).

## 2. Giao Diện Chuẩn (StorageProvider Interface)
- `createSignedReadUrl(bucket, key, expiresInSeconds)`
- `uploadObject(bucket, key, body, contentType)`
- `deleteObject(bucket, key)`
- `getObjectMetadata(bucket, key)`
