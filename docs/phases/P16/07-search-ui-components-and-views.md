# Phase P16: Các Thành Phần Giao Diện & Màn Hình (UI Components & Views)

## 1. Danh Mục Các Component
1. `PersonSearchInput`: Ô nhập từ khóa có debounce 300ms, hỗ trợ phím Enter, nút xóa nhanh và tương thích với bộ gõ tiếng Việt (IME).
2. `PersonSearchFiltersComponent`: Thanh điều khiển bộ lọc năm sinh, trạng thái sống và hồ sơ thiếu thông tin.
3. `PersonSearchResultItemComponent`: Thẻ kết quả chứa tên highlight, tuổi thọ, quê quán, ngữ cảnh cha mẹ, nút "Xem hồ sơ" và nút "Xem trên cây".
4. `SearchHighlight`: Tách và highlight từ khóa tìm kiếm an toàn không dùng innerHTML.
5. `ParentContext`: Hiển thị thông tin Cha & Mẹ giúp phân biệt người trùng tên.
6. `PersonSearchResultsComponent`: Danh sách kết quả, loading skeleton, empty state và nút tải thêm.
7. `PersonSearchClient`: Client coordinator quản lý state, debounce và đồng bộ URL query params.

---

## 2. Các Route Màn Hình
- `/trees/[treeId]/people/search`: Trang tìm kiếm nhân vật theo cây gia phả.
- `/search`: Trang tìm kiếm toàn cục (chuyển tiếp tới cây active của user).
- `/trees/[treeId]/people`: Danh sách nhân vật tích hợp nút "Tìm kiếm nhân vật".
