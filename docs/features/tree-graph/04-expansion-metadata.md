# Expansion Metadata & Mutation Capabilities

## 1. Mục Đích
Expansion Metadata cung cấp cho client (Phase P15) các chỉ số cần thiết để render nút mở rộng (Expand Buttons `+`) và menu hành động (Action Menu) mà không cần phải thực hiện thêm các query phụ.

## 2. Các Chỉ Số Chi Tiết

| Thuộc tính | Kiểu dữ liệu | Cách tính toán |
| :--- | :---: | :--- |
| `hasMoreAncestors` | `boolean` | `EXISTS` bản ghi cha/mẹ active của Person này nhưng **chưa nằm trong slice**. |
| `hasMoreDescendants` | `boolean` | `EXISTS` bản ghi con active của Person này nhưng **chưa nằm trong slice**. |
| `canAddFather` | `boolean` | `true` khi Person chưa có cha ruột được xác minh (`verified biological father`). |
| `canAddMother` | `boolean` | `true` khi Person chưa có mẹ ruột được xác minh (`verified biological mother`). |
| `hasVerifiedBiologicalFather` | `boolean` | Đã tồn tại quan hệ cha ruột `verified`. |
| `hasVerifiedBiologicalMother` | `boolean` | Đã tồn tại quan hệ mẹ ruột `verified`. |
| `canExpandAncestors` | `boolean` | Đồng bộ với `hasMoreAncestors`. |
| `canExpandDescendants` | `boolean` | Đồng bộ với `hasMoreDescendants`. |
