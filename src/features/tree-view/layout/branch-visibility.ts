import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

/**
 * Tính toán tập hợp các Person ID bị ẩn khi người dùng thu gọn một hoặc nhiều nhánh (Branch Collapse)
 */
export function calculateHiddenPersonIds(
  dto: TreeGraphDto,
  collapsedPersonIds: Set<string>
): Set<string> {
  const hidden = new Set<string>();
  if (!collapsedPersonIds || collapsedPersonIds.size === 0) {
    return hidden;
  }

  // Xây dựng đồ thị con cái: parentId -> childIds
  const childrenMap = new Map<string, string[]>();
  for (const rel of dto.parentChildRelationships) {
    const list = childrenMap.get(rel.parentId) || [];
    list.push(rel.childId);
    childrenMap.set(rel.parentId, list);
  }

  // Với mỗi collapsedPersonId, duyệt đệ quy ẩn con cháu (trừ Center Person)
  for (const collapsedId of collapsedPersonIds) {
    const queue = [...(childrenMap.get(collapsedId) || [])];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      // Tuyệt đối không bao giờ ẩn Center Person
      if (currentId !== dto.centerPersonId) {
        hidden.add(currentId);
        const nextChildren = childrenMap.get(currentId) || [];
        queue.push(...nextChildren);
      }
    }
  }

  return hidden;
}
