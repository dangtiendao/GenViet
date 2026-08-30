# Hợp Đồng Bộ Nhớ Cache Vùng Cây (Tree Region Cache Contract - P23-T10)

## 1. Cấu Trúc Cache Key
`tree-graph:{userScope}:{treeId}:{centerPersonId}:a{ancestorDepth}:d{descendantDepth}:s{spouses}:u{unverified}:v{schemaVersion}`

## 2. Quy Tắc Bảo Mật & Phân Lập
- Cache là In-Memory tại client, tuyệt đối không cache trong Service Worker hay Shared Storage công khai.
- Phân lập 100% theo User Scope và Tree ID.
- Tự động xóa toàn bộ private cache khi người dùng đăng xuất hoặc đổi phiên xác thực.
