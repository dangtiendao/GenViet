# Cache Strategy & Private Invalidation

## 1. Định Dạng Cache Key Chuẩn Hóa
```
tree-graph:{userScope}:{treeId}:{centerPersonId}:a{ancestorDepth}:d{descendantDepth}:s{includeSpouses}:u{includeUnverified}:v{schemaVersion}
```

Ví dụ:
`tree-graph:u123:t11111111-1111-1111-1111-111111111111:p22222222-2222-2222-2222-222222222222:a2:d2:s1:u1:v1`

## 2. Phân Lập Quyền Riêng Tư (Privacy Isolation)
- `userScope`: Đảm bảo quyền truy cập (Owner/Viewer) của người dùng này không làm rò rỉ dữ liệu hoặc khả năng thao tác cho người dùng khác.
- Headers phản hồi HTTP luôn đặt `Cache-Control: private, no-cache, no-store, must-revalidate` để không bao giờ bị lưu trên các Proxy hoặc CDN công cộng.

## 3. Danh Mục Sự Kiện Làm Mất Hiệu Lực Cache (Invalidation Matrix)
- Khi có bất kỳ thay đổi nào đối với Person (`created`, `updated`, `soft_deleted`, `restored`), Relationship (`created`, `updated`, `soft_deleted`, `replaced`), Union (`created`, `updated`, `ended`, `soft_deleted`), hoặc Membership role, toàn bộ namespace cache của cây gia phả đó sẽ bị invalid.
