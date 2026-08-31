# Bộ Nhớ Cache & Chiến Lược Invalidation (Cache & Invalidation Strategy)

## 1. Cấu Trúc Cache Key
Cache key cho lát cắt đồ thị cây gia phả bắt buộc phải mang tính tất định (Deterministic), phân lập theo người dùng, cây gia phả, nhân vật trung tâm, các tham số độ sâu và **chế độ duyệt hậu duệ**:

```typescript
export function buildTreeGraphCacheKey(
  userScope: string,
  input: TreeGraphQueryInput,
  schemaVersion: number = TREE_GRAPH_SCHEMA_VERSION
): string {
  const aDepth = input.ancestorDepth;
  const dDepth = input.descendantDepth;
  const spouses = input.includeSpouses ? 1 : 0;
  const unverified = input.includeUnverified ? 1 : 0;
  const full = input.fullTree ? 1 : 0;
  const mode = input.descendantTraversalMode || "PATERNAL_LINE";
  const boundary = input.branchBoundaryPersonId || "none";

  return `tree-graph:${userScope}:${input.treeId}:${input.centerPersonId}:a${aDepth}:d${dDepth}:s${spouses}:u${unverified}:f${full}:m${mode}:b${boundary}:v${schemaVersion}`;
}
```

## 2. Phân Lập Cache
1. **Phân lập Chế độ duyệt:** `PATERNAL_LINE` và `ALL_DESCENDANTS` có cache key hoàn toàn khác nhau (`mPATERNAL_LINE` vs `mALL_DESCENDANTS`), đảm bảo chuyển đổi chế độ xem không bị lấy dữ liệu cũ.
2. **Phân lập Người dùng (User Scope):** Cache key gắn liền với `userId` để ngăn ngừa rò rỉ dữ liệu giữa các tài khoản khác nhau.
3. **Phân lập Cây gia phả (Tree Scope):** Không bao giờ dùng chung cache giữa các cây gia phả.

## 3. Ma Trận Invalidation Khi Thay Đổi Dữ Liệu
Bộ nhớ cache vùng cây liên quan sẽ bị xóa ngay khi xảy ra các sự kiện:
- **Cập nhật giới tính (`person.gender` updated):** Bắt buộc làm mất hiệu lực toàn bộ cache vùng cây liên quan vì có thể làm thay đổi hoàn toàn cây con hậu duệ phía dưới.
- **Thao tác quan hệ cha-con (`relationship.created`, `relationship.updated`, `relationship.soft_deleted`, `relationship.restored`):** Làm mất hiệu lực cache của cây.
- **Thao tác hôn nhân (`union.*`):** Làm mất hiệu lực cache của cây.
- **Thao tác nhân vật (`person.*`):** Làm mất hiệu lực cache của cây.
- **Đăng xuất / Chuyển tài khoản:** Toàn bộ private cache trong bộ nhớ phiên làm việc được xóa sạch.
