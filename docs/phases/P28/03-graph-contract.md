# Hợp Đồng Graph API Phase P28 (Graph Request & Response Contract)

## 1. Request Schema
```typescript
export interface GraphRegionRequest {
  treeId: string;
  centerPersonId: string;
  ancestorDepth?: number;       // default: 2, max: 5
  descendantDepth?: number;     // default: 2, max: 5
  includeSpouses?: boolean;     // default: true
  includeUnverified?: boolean;  // default: true
  descendantTraversalMode?: "PATERNAL_LINE" | "ALL_DESCENDANTS"; // default: 'PATERNAL_LINE'
  branchBoundaryPersonId?: string; // optional UUID
  fullTree?: boolean;
}
```

## 2. Server Default & Validation Rules
1. Server luôn normalize tham số `descendantTraversalMode`. Nếu thiếu (undefined / null), server tự động dùng `"PATERNAL_LINE"`.
2. Chuỗi mode không thuộc allowlist `["PATERNAL_LINE", "ALL_DESCENDANTS"]` sẽ bị từ chối với mã lỗi `GRAPH_TRAVERSAL_MODE_INVALID` (HTTP 400).
3. `branchBoundaryPersonId` nếu có phải là UUID hợp lệ và thuộc cùng `treeId`.
4. RLS và quyền truy cập cây gia phả (`can_read_tree`) được thực thi nghiêm ngặt tại Database RPC.

## 3. Node Metadata Contract (Expansion DTO)
```typescript
export interface ExpansionDto {
  hasMoreAncestors: boolean;
  hasMoreDescendants: boolean;
  canAddFather: boolean;
  canAddMother: boolean;
  canExpandAncestors: boolean;
  canExpandDescendants: boolean;
  hasVerifiedBiologicalFather: boolean;
  hasVerifiedBiologicalMother: boolean;
  
  // Phase P28 Extensions
  hasHiddenDescendants?: boolean;
  descendantsTruncated?: boolean;
  truncationReason?: "PATERNAL_LINE" | "DEPTH_LIMIT" | "COLLAPSED" | "NOT_LOADED" | null;
}
```

## 4. Bảng Phân Biệt Trạng Thái Của Nhánh
| Tình trạng nhân vật | `hasDescendants` | `hasHiddenDescendants` | `truncationReason` | Hiển thị giao diện |
|---|---|---|---|---|
| Không có con trong DB | `false` | `false` | `null` | Không có nút / badge |
| Con gái có con (chế độ PATERNAL_LINE) | `true` | `true` | `'PATERNAL_LINE'` | Badge/Tooltip "Có hậu duệ đang ẩn" |
| Con trai có con chưa tải hết (chạm depth) | `true` | `false` | `'DEPTH_LIMIT'` | Nút "+ Đời sau" |
| Người dùng bấm thu gọn nhánh con | `true` | `false` | `'COLLAPSED'` | Nút "+{N} con" |

## 5. Error Taxonomy P28
- `GRAPH_TRAVERSAL_MODE_INVALID`: Chế độ duyệt hậu duệ không hợp lệ (HTTP 400).
- `GRAPH_BRANCH_POLICY_INVALID`: Chính sách ghi đè nhánh không hợp lệ (HTTP 400).
- `GRAPH_BRANCH_BOUNDARY_INVALID`: Điểm biên nhánh không hợp lệ (HTTP 400).
- `GRAPH_BRANCH_BOUNDARY_CROSS_TREE`: Điểm biên nhánh không thuộc cây gia phả hiện tại (HTTP 403).
- `TREE_GRAPH_FORBIDDEN`: Không có quyền truy cập cây gia phả (HTTP 403).
- `TREE_GRAPH_CENTER_NOT_FOUND`: Nhân vật trung tâm không tồn tại (HTTP 404).
