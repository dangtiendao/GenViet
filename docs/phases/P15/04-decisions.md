# Hồ Sơ P15 - 04: Quyết Định Kiến Trúc (Decisions)

## 1. Quyết Định Thiết Kế Chính

1. **`DEC-P15-01`: Đồ Thị 4 Lớp Độc Lập:**
   - Hoàn toàn không đưa React Flow Node types vào tầng Domain hay Layout.
   - Tầng Layout độc lập 100% với React component tree.

2. **`DEC-P15-02`: UnionNode Trung Gian:**
   - Thay vì nối chéo trực tiếp giữa các PersonNode, tạo UnionNode 16x16px đóng vai trò trung gian định tuyến.
   - UnionNode mang tính chất Presentation-only, không thể bấm chọn làm thay đổi Center Person.

3. **`DEC-P15-03`: Tối Ưu Hóa Tránh Layout Lại (Layout Fingerprint):**
   - Fingerprint chỉ tính trên `treeId`, tập Person IDs, Relationship IDs, Union IDs, và Collapsed IDs.
   - Các tương tác UI (chọn node, mở Sheet, mở Side Panel) hoàn toàn không kích hoạt lại ELK.

4. **`DEC-P15-04`: Center Anchoring:**
   - Giữ nguyên tọa độ màn hình của Center Person khi mở rộng hoặc thu gọn cây nhằm nâng cao trải nghiệm người dùng.
