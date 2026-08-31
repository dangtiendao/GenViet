# Chế Độ Duyệt Hậu Duệ (Descendant Traversal Modes)

## 1. Giới Thiệu
Chế độ duyệt hậu duệ kiểm soát cách thức thuật toán Recursive CTE và đồ thị phả hệ duyệt các nhánh con cháu từ nhân vật trung tâm (Center Person).

## 2. Danh Sách Các Chế Độ
```typescript
export type DescendantTraversalMode = "PATERNAL_LINE" | "ALL_DESCENDANTS";
```

### 2.1. PATERNAL_LINE (Chế độ dòng họ mặc định)
- **Mục đích:** Hiển thị sơ đồ phả hệ tập trung vào các nhánh dòng họ nội theo truyền thống gia phả Việt Nam.
- **Quy tắc:**
  - Hiển thị đầy đủ con trai, con gái trực tiếp của các cặp cha mẹ trong cây.
  - Node con gái (`gender === 'female'`) hiển thị bình thường trên cây với đầy đủ thông tin.
  - Sơ đồ dừng duyệt và không mở rộng tiếp con cháu bên dưới node con gái đó.
  - Node con trai (`gender === 'male'`) hoặc chưa xác định giới tính (`gender === 'unknown' | 'other'`) tiếp tục duyệt con cháu theo độ sâu.
  - **Ngoại lệ:** Nếu Center Person là nữ, con cái và con cháu trực hệ của chính người đó vẫn được duyệt bình thường.

### 2.2. ALL_DESCENDANTS (Chế độ mở rộng toàn bộ con cháu)
- **Mục đích:** Khám phá toàn diện mạng lưới con cháu qua cả dòng nội và dòng ngoại.
- **Quy tắc:** Duyệt qua mọi node con cháu bất kể giới tính nam hay nữ cho đến khi đạt độ sâu yêu cầu.

## 3. Hợp Đồng Serialization
- Khi gửi qua URL Query Params: `?descendantTraversalMode=PATERNAL_LINE` hoặc `?descendantTraversalMode=ALL_DESCENDANTS`.
- Giá trị mặc định khi thiếu tham số: `PATERNAL_LINE`.
- Giá trị không hợp lệ: Server từ chối ngay với mã lỗi `GRAPH_TRAVERSAL_MODE_INVALID` (HTTP 400).
