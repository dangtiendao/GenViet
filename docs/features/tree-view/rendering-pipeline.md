# Rendering Pipeline: 4 Lớp Đồ Thị & Luồng Chuyển Đổi Dữ Liệu

## 1. Sơ Đồ Pipeline
```
[Database Rows] (Lớp 1: Domain Graph)
       ↓ (get_tree_graph_slice RPC)
[TreeGraphDto] (Lớp 2: Query Graph Slice - P14)
       ↓ (projectDtoToLayoutGraph)
[LayoutGraph] (Lớp 3: Pure Layout Graph - P15)
       ↓ (calculateElkLayout / elk.layered)
[PositionedLayoutGraph] (Tọa độ x, y phân tầng)
       ↓ (mapLayoutToReactFlow)
[ReactFlow Nodes & Edges] (Lớp 4: Presentation Graph - P15)
       ↓ (React Flow View Engine)
[Canvas Viewport SVG/HTML Canvas]
```

## 2. Ma Trận Chuyển Đổi

| Thực thể | Lớp 2: Graph DTO | Lớp 3: Layout Graph (ELK) | Lớp 4: React Flow |
| :--- | :--- | :--- | :--- |
| **Nhân vật** | `GraphPersonDto` | Node `{ width: 220, height: 90 }` | `PersonNode` component |
| **Quan hệ huyết thống** | `ParentChildRelationshipDto` | Edge `{ source, target, type: "parent-child" }` | `ParentChildEdge` component |
| **Hôn phối** | `UnionDto` + `UnionMemberDto` | Intermediate Node `{ width: 16, height: 16 }` + Edge `union-member` | `UnionNode` + `UnionEdge` |
| **Tọa độ** | ❌ Không tồn tại | Output `{ x, y }` từ ELK | `position: { x, y }` |
| **Tâm điểm** | `dto.centerPersonId` | Không phân biệt (chỉ là Node) | Viền Emerald + Huy hiệu Crown |
