import type { TreeGraphQueryInput } from "../schemas/tree-graph-query.schema";

export const TREE_GRAPH_SCHEMA_VERSION = 1;

/**
 * Xây dựng Cache Key tất định cho truy vấn lát cắt đồ thị.
 * Tuân thủ bảo mật và phân lập quyền riêng tư người dùng.
 */
export function buildTreeGraphCacheKey(
  userScope: string,
  input: TreeGraphQueryInput,
  schemaVersion: number = TREE_GRAPH_SCHEMA_VERSION
): string {
  const aDepth = input.ancestorDepth;
  const dDepth = input.descendantDepth;
  const spouses = input.includeSpouses ? 1 : 0;
  const unverified = input.includeUnverified ? 1 : 0;

  return `tree-graph:${userScope}:${input.treeId}:${input.centerPersonId}:a${aDepth}:d${dDepth}:s${spouses}:u${unverified}:v${schemaVersion}`;
}

/**
 * Danh sách các sự kiện làm mất hiệu lực bộ nhớ cache đồ thị (Invalidation Matrix)
 */
export const TREE_GRAPH_INVALIDATION_EVENTS = [
  "person.created",
  "person.updated",
  "person.soft_deleted",
  "person.restored",
  "relationship.created",
  "relationship.updated",
  "relationship.soft_deleted",
  "relationship.replaced",
  "union.created",
  "union.updated",
  "union.ended",
  "union.soft_deleted",
  "tree.updated",
  "tree.soft_deleted",
  "membership.updated",
] as const;

export type TreeGraphInvalidationEvent = (typeof TREE_GRAPH_INVALIDATION_EVENTS)[number];
