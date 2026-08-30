# Phân Hệ Hiển Thị Sơ Đồ Cây (Tree View & Interactive Canvas) - GenViet

Phân hệ hiển thị sơ đồ cây (**Tree View Canvas**) chịu trách nhiệm trực quan hóa dữ liệu phả hệ tương tác bằng **React Flow** (`@xyflow/react`) kết hợp thuật toán bố cục phân tầng **ELK.js** (`elk.layered`), hiện thực hóa **Lớp 3 (Layout Graph)** và **Lớp 4 (Presentation Graph)** trong kiến trúc 4 lớp đồ thị độc lập ([`ARCH-GRAPH-01`](file:///e:/Project/GenViet/docs/architecture/graph-architecture.md)).

---

## 1. Nguyên Tắc Cốt Lõi
- **Độc Lập 4 Lớp:** Tách biệt tuyệt đối giữa Database Domain $\rightarrow$ Query Graph Slice DTO (P14) $\rightarrow$ Layout Graph (ELK.js) $\rightarrow$ Presentation Graph (React Flow).
- **Không Lưu Tọa Độ:** Tọa độ `(x, y)` được tính toán động hoàn toàn trên client bằng ELK.js, không lưu vào database.
- **Không Kéo Nối Trực Tiếp (Read-Only Canvas v0.1):** Tắt kéo tạo quan hệ và kéo đổi cha mẹ trong canvas để bảo đảm toàn vẹn dữ liệu gia phả. Mọi thao tác chỉnh sửa đều gọi Action Menu / Dialogs P12 & P13.
- **Tối Ưu Hiệu Năng (No Relayout on Detail/Select):** Thao tác chọn node, mở Mobile Bottom Sheet hoặc Desktop Side Panel chỉ thay đổi Selection/Overlay state, không chạy lại layout ELK.
- **Neo Giữ Vị Trí Tâm Điểm (Center Anchoring):** Khi mở rộng hoặc thu gọn nhánh, tọa độ màn hình của Center Person được giữ nguyên, tránh hiện tượng giật nhảy khung nhìn.

---

## 2. Cấu Trúc Thư Mục
```
src/
├── app/
│   └── (dashboard)/
│       └── trees/
│           └── [treeId]/
│               └── tree/
│                   └── page.tsx           # Server Component trang Sơ đồ Cây
└── features/
    └── tree-view/
        ├── components/
        │   ├── family-tree-canvas.tsx    # React Flow canvas wrapper
        │   ├── family-tree-client.tsx    # Client boundary điều phối
        │   ├── person-node.tsx           # Custom PersonNode (220x90px)
        │   ├── union-node.tsx            # Custom UnionNode (16x16px)
        │   ├── parent-child-edge.tsx     # Custom Parent-Child edge
        │   ├── union-edge.tsx            # Custom Union-Member edge
        │   ├── tree-controls.tsx         # Zoom / Fit / Fullscreen buttons
        │   ├── tree-toolbar.tsx          # Thanh công cụ hiển thị Center Person
        │   ├── person-detail-sheet.tsx   # Mobile Bottom Sheet
        │   ├── person-detail-panel.tsx   # Desktop Side Panel
        │   ├── tree-loading-state.tsx    # Loading state
        │   ├── tree-empty-state.tsx      # Empty state
        │   └── tree-error-state.tsx      # Error state
        ├── config/
        │   └── tree-layout.config.ts     # Kích thước node, layer spacing
        ├── errors/
        │   └── tree-view.errors.ts       # Bảng phân loại mã lỗi Section 46
        ├── hooks/
        │   ├── use-fullscreen.ts         # Fullscreen API hook
        │   ├── use-tree-expansion.ts     # Hook mở rộng / thu gọn nhánh
        │   ├── use-tree-graph.ts         # Hook tải dữ liệu DTO từ API
        │   ├── use-tree-layout.ts        # Hook tính ELK layout theo fingerprint
        │   ├── use-tree-selection.ts     # Hook chọn nhân vật và mở chi tiết
        │   └── use-tree-viewport.ts      # Hook điều khiển viewport & center anchoring
        ├── layout/
        │   ├── branch-visibility.ts      # Tính toán ẩn nhánh con cháu
        │   ├── elk-layout-adapter.ts     # Async ELK runner
        │   ├── elk-layout-options.ts     # ELK layered options
        │   ├── graph-projection.ts       # Pure function DTO -> LayoutGraph
        │   ├── layout-graph.types.ts     # Kiểu dữ liệu layout độc lập
        │   ├── presentation-mapper.ts    # Pure function LayoutGraph -> React Flow
        │   └── viewport-anchor.ts        # Thuật toán tính viewport translation
        └── types/
            └── tree-presentation.types.ts# React Flow Node/Edge data types
```
