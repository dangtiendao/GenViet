# Phân Hệ API Vùng Cây (Tree Graph API) - GenViet

Phân hệ API vùng cây (**Tree Graph API**) cung cấp năng lực truy vấn lát cắt đồ thị phả hệ có giới hạn (**Bounded Query Graph Slice**) quanh một nhân vật trung tâm (**Center Person**), đóng vai trò là **Lớp 2 (Query Graph Slice)** trong kiến trúc 4 lớp đồ thị độc lập ([`ARCH-GRAPH-01`](file:///e:/Project/GenViet/docs/architecture/graph-architecture.md)).

---

## 1. Nguyên Tắc Cốt Lõi
- **Độc Lập Tuyệt Đối với UI Canvas (Lớp 3 & Lớp 4):** DTO không chứa bất kỳ tọa độ `(x, y)`, kích thước `(width, height)`, hay kiểu dữ liệu nào của React Flow / ELK.js.
- **Giới Hạn Độ Sâu An Toàn (Bounded Depth):** Mặc định 2 tầng tổ tiên / 2 tầng hậu duệ; Giới hạn tối đa 5 tầng mỗi chiều.
- **Ngân Sách Kích Thước (Size Budgets):** Tối đa 250 Persons, 500 Relationships, 150 Unions trên một response.
- **Khử Trùng Lặp & Không Cạnh Mồ Côi:** Không bao giờ trả về cạnh có đỉnh không tồn tại trong danh sách Persons.
- **Bảo Vệ Dữ Liệu Riêng Tư:** Headers `Cache-Control: private, no-cache, no-store, must-revalidate` và xác thực qua RLS.

---

## 2. Cấu Trúc Thư Mục
```
src/
├── app/
│   └── api/
│       └── trees/
│           └── [treeId]/
│               └── graph/
│                   └── route.ts          # App Router Route Handler (GET)
└── features/
    └── tree-graph/
        ├── cache/
        │   └── tree-graph-cache-key.ts   # Deterministic cache key & invalidation
        ├── errors/
        │   └── tree-graph.errors.ts      # Error taxonomy Section 34
        ├── mappers/
        │   └── tree-graph.mapper.ts      # Data transformation & consistency validator
        ├── repositories/
        │   └── tree-graph.repository.ts  # Database RPC caller (Server-only)
        ├── schemas/
        │   └── tree-graph-query.schema.ts# Zod query params validation
        ├── services/
        │   └── tree-graph.service.ts     # Business coordination service
        └── types/
            └── tree-graph.types.ts       # Domain DTOs contract
```
