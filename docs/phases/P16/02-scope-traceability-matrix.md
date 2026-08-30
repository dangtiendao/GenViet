# Phase P16: Ma Trận Truy Vết Yêu Cầu (Scope Traceability Matrix)

## 1. Bảng Đối Soát 20 Nhiệm Vụ (Tasks P16-T01 đến P16-T20)

| Mã Task | Tên Nhiệm Vụ | Trạng Thái | File / Thành Phần Thi Công |
| :--- | :--- | :---: | :--- |
| `P16-T01` | Hàm chuẩn hóa tiếng Việt tập trung | **COMPLETED** | `src/features/person-search/utils/normalize-vietnamese.ts` & `_system.normalize_person_name` |
| `P16-T02` | Quy đổi 'đ' và 'Đ' thành 'd' | **COMPLETED** | `replace(/[đĐ]/g, "d")` trong SQL và TypeScript |
| `P16-T03` | Chuẩn hóa khoảng trắng thừa | **COMPLETED** | `trim()`, thu gọn `\s+` thành khoảng trắng đơn |
| `P16-T04` | Kích hoạt extension `unaccent` | **COMPLETED** | `20260830130000_p16_add_person_search.sql` |
| `P16-T05` | Kích hoạt extension `pg_trgm` | **COMPLETED** | `20260830130000_p16_add_person_search.sql` |
| `P16-T06` | Tạo search indexes (GIN & B-Tree) | **COMPLETED** | `idx_persons_normalized_name_trgm`, `idx_persons_tree_search_name_id` |
| `P16-T07` | Search theo họ tên (Exact, Prefix, Substring) | **COMPLETED** | RPC `search_persons_in_tree` |
| `P16-T08` | Search không dấu | **COMPLETED** | Chuẩn hóa query và so khớp `normalized_name` |
| `P16-T09` | Search theo tên thường gọi | **DEFERRED** | Đánh dấu DEFERRED do schema `persons` chưa có cột `common_name` |
| `P16-T10` | Lọc theo năm sinh | **COMPLETED** | Tham số `p_birth_year` trong RPC và UI filter |
| `P16-T11` | Lọc theo trạng thái sống | **COMPLETED** | Tham số `p_living_status` trong RPC và UI filter |
| `P16-T12` | Lọc hồ sơ thiếu thông tin | **COMPLETED** | Bộ lọc `missing_birth`, `missing_death`, `missing_hometown`, `missing_any_core` |
| `P16-T13` | Phân trang ổn định bằng cursor | **COMPLETED** | `src/features/person-search/utils/search-cursor.ts` |
| `P16-T14` | Debounce input tìm kiếm (300ms) | **COMPLETED** | `PersonSearchInput` xử lý debounce và IME an toàn |
| `P16-T15` | Highlight từ khóa an toàn | **COMPLETED** | `SearchHighlight` (Zero dangerouslySetInnerHTML) |
| `P16-T16` | Hiển thị cha mẹ phân biệt trùng tên | **COMPLETED** | `ParentContext` & JSON aggregation trong RPC |
| `P16-T17` | Nút xem hồ sơ | **COMPLETED** | Link đến `/trees/[treeId]/people/[personId]` |
| `P16-T18` | Nút xem trên cây | **COMPLETED** | Link đến `/trees/[treeId]/tree?centerPersonId=[personId]` |
| `P16-T19` | Test dấu tiếng Việt | **COMPLETED** | `tests/unit/person-search/normalization.test.ts` & pgTAP `06000` |
| `P16-T20` | Test hiệu năng | **COMPLETED** | pgTAP suites, Next.js build và Playwright E2E |
