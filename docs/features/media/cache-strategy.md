# Chiến Lược Bộ Nhớ Đệm (Cache Strategy)

## 1. Cơ Chế Cache Phía Client (`signedUrlCache`)
- Signed URLs được lưu trong bộ nhớ RAM của trình duyệt với key `genviet:avatar:${personId}:${mediaId}:${variant}`.
- Tự động làm mới khi URL còn dưới 60 giây trước khi hết hạn.
- Khi người dùng thay đổi hoặc xóa ảnh đại diện, cache của nhân vật đó sẽ được xóa tức thì (`signedUrlCache.invalidate(personId)`).
- Khi người dùng đăng xuất, toàn bộ cache ảnh riêng tư sẽ được giải phóng hoàn toàn.
