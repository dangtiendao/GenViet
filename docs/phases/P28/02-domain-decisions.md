# Quyết Định Nghiệp Vụ Phase P28 (Domain Decision Records)

## 1. Quyết Định Duyệt Hậu Duệ (Descendant Traversal Mode)
- **Định danh Type:**
  ```typescript
  export type DescendantTraversalMode = "PATERNAL_LINE" | "ALL_DESCENDANTS";
  ```
- **Chế độ mặc định toàn hệ thống:** `PATERNAL_LINE`.
- **Nguyên tắc hoạt động của PATERNAL_LINE:**
  1. Hiển thị tất cả con cái trực tiếp hợp lệ của các bậc phụ huynh trong vùng duyệt.
  2. Nếu một node con có giới tính `female`, node đó vẫn xuất hiện trên sơ đồ cây (Node con gái).
  3. Không tiếp tục duyệt và không tải con cháu bên dưới node con gái đó.
  4. Nếu một node con có giới tính `male`, `unknown`, `other`, sơ đồ tiếp tục duyệt con cháu theo giới hạn độ sâu (`descendantDepth`).
- **Nguyên tắc của ALL_DESCENDANTS:** Duyệt qua mọi node con cháu bất kể giới tính cho đến khi đạt giới hạn độ sâu.

## 2. Quy Tắc Giới Tính (Sex/Gender Policy)
- Chỉ dừng duyệt khi và chỉ khi `normalizedSex === 'female'`.
- Các giá trị `male`, `unknown`, `other` tuyệt đối không bị tự động coi là nữ.
- Không suy đoán giới tính từ tên gọi tiếng Việt hay bất kỳ chuỗi nhãn giao diện nào.
- Dữ liệu chưa xác định (`unknown`) tiếp tục được duyệt để đảm bảo không vô tình ẩn dữ liệu chưa rõ.

## 3. Ngoại Lệ Cho Nhân Vật Trung Tâm (Center-Female Exception)
- Nếu người dùng chọn một người nữ làm nhân vật trung tâm (**Center Person**, `depth = 0` / Traversal Root):
  - Vẫn hiển thị Center Person nữ đó.
  - Vẫn tải và hiển thị con cái trực tiếp và con cháu của chính Center Person theo `descendantDepth`.
  - Quy tắc dừng `PATERNAL_LINE` chỉ áp dụng khi một node nữ xuất hiện như một node con (`depth > 0`) bên dưới traversal root.
  - Đảm bảo sơ đồ cây của Center nữ không bị rỗng.

## 4. Bảo Toàn Domain Graph Tuyệt Đối
- Quy tắc `PATERNAL_LINE` chỉ là **View Projection** cho Tree View và Export theo View.
- Không xóa, sửa hay lọc dữ liệu trong cơ sở dữ liệu.
- Không áp dụng quy tắc này cho: Tìm kiếm (Search), Chi tiết nhân vật (Person Detail), Tính quan hệ (Kinship), Gợi ý xưng hô (Address Terms), Phát hiện trùng lặp (Duplicate Detection), Gộp hồ sơ (Merge), Sao lưu & Phục hồi (Backup & Restore), Nhập xuất Excel / GEDCOM.

## 5. Hợp Đồng Branch Override Trong Tương Lai
- Định nghĩa kiểu:
  ```typescript
  export type DescendantBranchPolicy =
    | { kind: "INHERIT_VIEW_MODE" }
    | { kind: "FORCE_EXPAND_SELECTED_BRANCH"; boundaryPersonId: string };
  ```
- P28 khóa contract và chuẩn bị sẵn trường tham số `branchBoundaryPersonId` trên RPC và API.
