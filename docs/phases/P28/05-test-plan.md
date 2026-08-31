# Kế Hoạch Kiểm Thử Phase P28 (Test Plan P28)

## 1. Mục Tiêu Kiểm Thử
Chứng minh chế độ `PATERNAL_LINE` hoạt động chính xác theo mọi quy tắc nghiệp vụ đã khóa:
1. Node con gái (FEMALE) xuất hiện, nhưng hậu duệ phía dưới không được mở rộng trong `PATERNAL_LINE`.
2. Center Person là nữ vẫn xem được con cái của chính mình.
3. Node con trai (MALE) và chưa rõ giới tính (UNKNOWN / OTHER) tiếp tục duyệt bình thường.
4. Chế độ `ALL_DESCENDANTS` duyệt qua mọi node đến hết độ sâu.
5. Ancestor traversal không bị ảnh hưởng.
6. Toàn bộ các tính năng Domain (Search, Kinship, Duplicate/Merge, Backup, Restore, GEDCOM, Excel) bảo toàn 100% dữ liệu gốc.
7. Cache key phân lập tuyệt đối giữa các chế độ duyệt.
8. Giao diện có chỉ báo nhánh ẩn rõ ràng và hỗ trợ đầy đủ Accessibility.

## 2. Ma Trận Fixtures
Xây dựng cây phả hệ mẫu chuẩn:
- **Tâm điểm (Center A - Nam)**:
  - Con trai **B (Nam)** -> có con **C (Nam)**.
  - Con gái **D (Nữ)** -> có con **E (Nam)** -> có con **F (Nữ)**. (D có 2 cuộc hôn nhân).
  - Con **U (Unknown)** -> có con **V (Nam)**.
  - Con gái **G (Nữ)** -> không có con.

### Kết quả mong đợi trong PATERNAL_LINE từ Center A:
- Xuất hiện: A, B, C, D, U, V, G, các phối ngẫu liên quan.
- Không xuất hiện: E, F (hậu duệ của D).
- Node D có `hasHiddenDescendants: true`, `truncationReason: 'PATERNAL_LINE'`.
- Node G có `hasHiddenDescendants: false`.

### Kết quả khi Center là D (Nữ):
- Xuất hiện: D, E, F (con cháu của D được duyệt bình thường).
- Nếu E là Nam -> F xuất hiện.

### Kết quả trong ALL_DESCENDANTS từ Center A:
- Xuất hiện đầy đủ: A, B, C, D, E, F, U, V, G.

## 3. Các Lớp Kiểm Thử
1. **Unit Tests (Vitest)**: Traversal Mode, Cache Key, Mapper, Errors, PDF/Print options.
2. **Database SQL Tests (pgTAP)**: RPC Recursive CTE, Female stop, Center female exception, Same-tree, RLS.
3. **Integration Tests**: API Route `/api/trees/[treeId]/graph`, Domain Graph preservation.
4. **Component & Accessibility Tests**: `PersonNode`, `HiddenDescendantsIndicator`, ARIA labels.
5. **Security & Data Integrity Tests**: Phân quyền, không rò rỉ dữ liệu ngoài cây, không xóa sửa dữ liệu domain.
6. **Performance Tests**: Đo lường 100, 500, 1.000 Persons.
