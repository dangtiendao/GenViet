import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

/**
 * Pure Merge Function: Hợp nhất 2 lát cắt TreeGraphDto để mở rộng cây mà không làm mất cây cũ
 */
export function mergeTreeGraphDtos(
  base: TreeGraphDto | null,
  incoming: TreeGraphDto
): TreeGraphDto {
  if (!base) return incoming;
  if (base.treeId !== incoming.treeId) return incoming;

  // 1. Hợp nhất Persons theo ID (cập nhật isCenter theo incoming centerPersonId mới nhất)
  const targetCenterId = incoming.centerPersonId || base.centerPersonId;
  const personMap = new Map(base.persons.map((p) => [p.id, p]));
  for (const p of incoming.persons) {
    personMap.set(p.id, p);
  }

  // Chuẩn hóa cờ isCenter cho toàn bộ danh sách nhân vật
  const updatedPersons = Array.from(personMap.values()).map((p) => ({
    ...p,
    isCenter: p.id === targetCenterId,
  }));

  // 2. Hợp nhất Parent-Child Relationships theo ID
  const relMap = new Map(base.parentChildRelationships.map((r) => [r.id, r]));
  for (const r of incoming.parentChildRelationships) {
    relMap.set(r.id, r);
  }

  // 3. Hợp nhất Unions theo ID
  const unionMap = new Map(base.unions.map((u) => [u.id, u]));
  for (const u of incoming.unions) {
    unionMap.set(u.id, u);
  }

  // 4. Hợp nhất Union Members theo unionId-personId
  const memberKey = (m: { unionId: string; personId: string }) => `${m.unionId}-${m.personId}`;
  const memberMap = new Map(base.unionMembers.map((m) => [memberKey(m), m]));
  for (const m of incoming.unionMembers) {
    memberMap.set(memberKey(m), m);
  }

  return {
    ...base,
    centerPersonId: targetCenterId,
    persons: updatedPersons,
    parentChildRelationships: Array.from(relMap.values()),
    unions: Array.from(unionMap.values()),
    unionMembers: Array.from(memberMap.values()),
    expansion: {
      ...base.expansion,
      ...incoming.expansion,
    },
  };
}
