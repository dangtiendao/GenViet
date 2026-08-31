import type { DescendantTraversalMode } from "../contracts/descendant-traversal-mode";

export const TREE_GRAPH_SCHEMA_VERSION = 1;

export interface TreeGraphCacheKeyInput {
  treeId: string;
  centerPersonId: string;
  ancestorDepth?: number;
  descendantDepth?: number;
  includeSpouses?: boolean;
  includeUnverified?: boolean;
  descendantTraversalMode?: DescendantTraversalMode;
  branchBoundaryPersonId?: string | null;
  fullTree?: boolean;
}

/**
 * Xây dựng Cache Key tất định cho truy vấn lát cắt đồ thị.
 * Tuân thủ bảo mật và phân lập quyền riêng tư người dùng.
 */
export function buildTreeGraphCacheKey(
  userScope: string,
  input: TreeGraphCacheKeyInput,
  schemaVersion: number = TREE_GRAPH_SCHEMA_VERSION
): string {
  const aDepth = input.ancestorDepth ?? 2;
  const dDepth = input.descendantDepth ?? 2;
  const spouses = input.includeSpouses !== false ? 1 : 0;
  const unverified = input.includeUnverified !== false ? 1 : 0;
  const full = input.fullTree ? 1 : 0;
  const mode = input.descendantTraversalMode || "PATERNAL_LINE";
  const boundary = input.branchBoundaryPersonId || "none";

  return `tree-graph:${userScope}:${input.treeId}:${input.centerPersonId}:a${aDepth}:d${dDepth}:s${spouses}:u${unverified}:f${full}:m${mode}:b${boundary}:v${schemaVersion}`;
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
