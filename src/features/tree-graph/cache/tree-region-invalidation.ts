import { TreeRegionCache } from "./tree-region-cache";
import type { TreeGraphInvalidationEvent } from "./tree-graph-cache-key";

export interface InvalidationPayload {
  event: TreeGraphInvalidationEvent;
  treeId: string;
  personId?: string;
  targetPersonIds?: string[];
}

/**
 * Xử lý vô hiệu hóa bộ nhớ cache có chọn lọc theo ma trận biến đổi dữ liệu (P23-T11)
 */
export function handleSelectiveCacheInvalidation(payload: InvalidationPayload): void {
  const cache = TreeRegionCache.getInstance();

  switch (payload.event) {
    case "person.created":
    case "person.updated":
    case "person.soft_deleted":
    case "person.restored":
      if (payload.personId) {
        // Vô hiệu hóa vùng liên quan đến nhân vật
        cache.invalidatePerson(payload.treeId, payload.personId);
      } else {
        cache.invalidateTree(payload.treeId);
      }
      break;

    case "relationship.created":
    case "relationship.updated":
    case "relationship.soft_deleted":
    case "relationship.replaced":
    case "union.created":
    case "union.updated":
    case "union.ended":
    case "union.soft_deleted":
    case "tree.updated":
    case "tree.soft_deleted":
    case "membership.updated":
      // Các thay đổi cấu trúc liên quan đến nhiều nhân vật: Vô hiệu hóa toàn bộ cache của cây đó
      cache.invalidateTree(payload.treeId);
      break;

    default:
      cache.invalidateTree(payload.treeId);
      break;
  }
}
