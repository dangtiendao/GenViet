# Biên Bản Bàn Giao (Handover to Phase P15) - Phase P14

## 1. Gói Dữ Liệu Bàn Giao Cho Phase P15 (Hiển Thị Cây & Canvas)
1. **API Endpoint Sẵn Sàng:** `GET /api/trees/{treeId}/graph?centerPersonId={centerPersonId}&ancestorDepth=2&descendantDepth=2&includeSpouses=true`
2. **DTO Contract Chuẩn Mực:** `TreeGraphDto` tại `src/features/tree-graph/types/tree-graph.types.ts`.
3. **Expansion & Limits Metadata:** Đã tính toán sẵn sàng cho P15 chỉ việc gắn vào các nút `+` (Expand) và Action Menu.

## 2. Hướng Dẫn Tích Hợp P15
- Phase P15 nhận `TreeGraphDto` từ API này, chuyển đổi sang **Layout Graph (ELK.js)** để tính tọa độ `(x, y)`, sau đó render lên **Presentation Graph (React Flow Canvas)**.
- Khi người dùng click nút mở rộng một node, P15 chỉ cần gọi lại endpoint này với `centerPersonId` mới hoặc độ sâu tăng thêm.
