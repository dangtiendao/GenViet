# Phân Định Kiến Trúc: Domain Graph và View Graph (Domain Graph vs View Graph Architecture)

## 1. Bối Cảnh & Vấn Đề
Trong ứng dụng phả hệ GenViet, việc trực quan hóa cây gia phả cần tôn trọng các tập quán hiển thị dòng họ truyền thống (ví dụ: dòng họ nội - `PATERNAL_LINE`), trong khi các nghiệp vụ lõi như tìm kiếm, tính đường quan hệ họ hàng, phát hiện trùng lặp, sao lưu và trao đổi dữ liệu bắt buộc phải vận hành trên đồ thị quan hệ huyết thống và hôn nhân toàn vẹn 100%.

Để tránh bất kỳ sự sai lệch dữ liệu nào, hệ thống thiết lập nguyên tắc kiến trúc bất biến phân định rõ ràng giữa **Domain Graph** và **View Graph**.

## 2. Mô Hình Phân Lớp

```
+-----------------------------------------------------------------------------------+
|                                  DATABASE TABLES                                  |
|   (persons, parent_child_relationships, unions, union_members, family_trees)      |
+-----------------------------------------------------------------------------------+
             |                                                  |
             | (Full Access via RLS)                            | (Scoped Projection)
             v                                                  v
+------------------------------------+        +------------------------------------+
|            DOMAIN GRAPH            |        |             VIEW GRAPH             |
|------------------------------------|        |------------------------------------|
| - Toàn bộ nhân vật & mối quan hệ   |        | - Phép chiếu theo góc nhìn/vùng cây|
| - Không bị cắt bởi PATERNAL_LINE   |        | - Bị giới hạn bởi độ sâu (depth)   |
| - Không phụ thuộc trạng thái xem   |        | - Áp dụng quy tắc PATERNAL_LINE     |
|                                    |        | - Hỗ trợ thu gọn/mở rộng (collapse)|
+------------------------------------+        +------------------------------------+
             |                                                  |
             v                                                  v
+------------------------------------+        +------------------------------------+
|          DOMAIN CONSUMERS          |        |           VIEW CONSUMERS           |
|------------------------------------|        |------------------------------------|
| 1. Person Search (Tìm kiếm)        |        | 1. Tree View (Canvas React Flow)   |
| 2. Kinship Path Engine (Quan hệ)   |        | 2. Bounded Graph Slice API         |
| 3. Address Terms (Xưng hô)         |        | 3. Tree-Region PDF Export          |
| 4. Duplicate Detection & Merge     |        | 4. Large-Tree Poster Print         |
| 5. JSON Backup & Restore           |        |                                    |
| 6. Excel & GEDCOM Import/Export    |        |                                    |
| 7. Audit & Event Log               |        |                                    |
+------------------------------------+        +------------------------------------+
```

## 3. Các Nguyên Tắc Bất Biến (Invariants)
1. **Tuyệt đối không dùng View Graph làm nguồn dữ liệu cho Domain Consumers:**
   Các thuật toán tìm đường quan hệ, tìm kiếm hay sao lưu không bao giờ được gọi API `get_tree_graph_slice` hoặc đọc danh sách React Flow nodes.
2. **View Graph là phép chiếu thuần túy (Read-only Projection):**
   Mọi thay đổi về chế độ xem (`PATERNAL_LINE`, `ALL_DESCENDANTS`, độ sâu, thu gọn nhánh) chỉ tác động tới kết quả trả về của `get_tree_graph_slice` và giao diện Tree View, tuyệt đối không thay đổi trạng thái trong cơ sở dữ liệu.
3. **Bảo vệ quyền riêng tư & phân quyền (RLS):**
   Cả Domain Graph và View Graph đều được bảo vệ bởi cùng một hệ thống phân quyền cơ sở dữ liệu (RLS & `can_read_tree`), không cho phép bất kỳ ai đọc dữ liệu ngoài cây gia phả được cấp quyền.
