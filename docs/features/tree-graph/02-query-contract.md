# Query Input Contract & API Endpoint

## 1. HTTP Endpoint
- **Phương thức:** `GET`
- **Đường dẫn:** `/api/trees/{treeId}/graph`
- **Xác thực:** Bắt buộc (Authenticated User qua Supabase Auth Cookie/Session).

## 2. Query Parameters

| Tên tham số | Kiểu dữ liệu | Mặc định | Giới hạn | Mô tả |
| :--- | :--- | :---: | :---: | :--- |
| `centerPersonId` | `UUID` | **Bắt buộc** | UUID v4 | Nhân vật trung tâm của lát cắt đồ thị |
| `ancestorDepth` | `integer` | `2` | `0` đến `5` | Độ sâu duyệt ngược lên tổ tiên |
| `descendantDepth`| `integer` | `2` | `0` đến `5` | Độ sâu duyệt xuôi xuống hậu duệ |
| `includeSpouses` | `boolean` | `true` | `true/false` | Bao gồm vợ/chồng & các Union |
| `includeUnverified` | `boolean` | `true` | `true/false` | Bao gồm quan hệ chưa xác minh |

## 3. Mã Phản Hồi HTTP
- `200 OK`: Trả về `{ success: true, data: TreeGraphDto }`.
- `400 Bad Request`: Tham số không hợp lệ hoặc Center Person không thuộc Tree (`TREE_GRAPH_TREE_MISMATCH`).
- `401 Unauthorized`: Chưa đăng nhập (`TREE_GRAPH_UNAUTHORIZED`).
- `403 Forbidden`: Không có quyền xem cây gia phả này (`TREE_GRAPH_FORBIDDEN`).
- `404 Not Found`: Không tìm thấy cây hoặc nhân vật trung tâm (`TREE_GRAPH_NOT_FOUND`).
- `500 Internal Server Error`: Lỗi hệ thống nội bộ.
