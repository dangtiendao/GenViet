# Ma Trận Vô Hiệu Hóa Cache Có Chọn Lọc (Selective Invalidation - P23-T11)

| Sự Kiện Biến Đổi (Mutation Event) | Phạm Vi Vô Hiệu Hóa (Invalidation Scope) |
| :--- | :--- |
| `person.updated` | Vùng cache chứa `personId` tương ứng trong cây |
| `person.created` / `person.soft_deleted` | Toàn bộ cache của `treeId` |
| `relationship.*` / `union.*` | Toàn bộ cache của `treeId` |
| `auth.logout` | Xóa sạch toàn bộ in-memory cache của người dùng (`clearUserCache`) |
