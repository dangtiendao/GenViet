# Kiến trúc Lớp Adapter & Cô lập Nhà cung cấp (Adapter Architecture)

- **Mã tài liệu:** `ARCH-ADAPTER-01`
- **Mã Kiến trúc liên quan:** `AR-009`, `CMP-009`, `ADP-001..002`, `ADR-0012`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Mục tiêu Thiết kế Lớp Adapter

Lớp Adapter đóng vai trò là **Hàng rào Cách ly (Anti-Corruption Layer)** giữa Lõi Nghiệp vụ (Domain Services) và các Dịch vụ Đám mây bên thứ ba:
- Đảm bảo Service Layer không import trực tiếp SDK của Supabase Storage, AWS S3, Resend hay Postmark.
- Cho phép chuyển đổi nhà cung cấp hạ tầng (ví dụ: từ Supabase Storage sang Cloudflare R2) chỉ bằng cách viết thêm một Adapter Implementation mới.

---

## 2. Đặc tả Hợp đồng Storage Adapter (IStorageAdapter - `ADP-001`)

> [!NOTE]
> Khai báo dưới đây là ví dụ hợp đồng kiến trúc (**`NON-PRODUCTION ARCHITECTURE EXAMPLE`**), không phải mã nguồn production.

```typescript
// NON-PRODUCTION ARCHITECTURE EXAMPLE

export interface StorageUploadAuthorization {
  uploadUrl: string;
  objectKey: string;
  expiresInSeconds: number;
}

export interface IStorageAdapter {
  /** Sinh URL có chữ ký để máy khách upload trực tiếp */
  createSignedUploadUrl(bucket: string, objectKey: string, expiresInSeconds: number): Promise<StorageUploadAuthorization>;
  
  /** Sinh URL có chữ ký để máy khách đọc ảnh từ Private Bucket */
  createSignedReadUrl(bucket: string, objectKey: string, expiresInSeconds: number): Promise<string>;
  
  /** Xóa một tệp tin khỏi Storage */
  deleteObject(bucket: string, objectKey: string): Promise<void>;
  
  /** Kiểm tra sự tồn tại và kích thước của tệp */
  getObjectMetadata(bucket: string, objectKey: string): Promise<{ exists: boolean; sizeBytes?: number }>;
}
```

### Các Triển khai (Implementations):
1. **`SupabaseStorageAdapter` (Mặc định cho v0.1):** Sử dụng `@supabase/storage-js` để giao tiếp với Supabase Storage.
2. **`CloudflareR2StorageAdapter` (Dự phòng Tương lai):** Sử dụng AWS S3 SDK Client tương thích với Cloudflare R2.
