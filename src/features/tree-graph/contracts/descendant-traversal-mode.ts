/**
 * Hợp đồng chế độ duyệt hậu duệ đồ thị cây gia phả (Phase P28)
 */

export const DESCENDANT_TRAVERSAL_MODES = ["PATERNAL_LINE", "ALL_DESCENDANTS"] as const;

export type DescendantTraversalMode = (typeof DESCENDANT_TRAVERSAL_MODES)[number];

export const DEFAULT_DESCENDANT_TRAVERSAL_MODE: DescendantTraversalMode = "PATERNAL_LINE";

export const TRUNCATION_REASONS = [
  "PATERNAL_LINE",
  "DEPTH_LIMIT",
  "COLLAPSED",
  "NOT_LOADED",
] as const;

export type TruncationReason = (typeof TRUNCATION_REASONS)[number];

/**
 * Hợp đồng chính sách ghi đè nhánh cục bộ cho tương lai
 */
export type DescendantBranchPolicy =
  | { kind: "INHERIT_VIEW_MODE" }
  | { kind: "FORCE_EXPAND_SELECTED_BRANCH"; boundaryPersonId: string };

/**
 * Metadata tính khả kiến và lý do thu hẹp hậu duệ
 */
export interface DescendantVisibilityMetadata {
  hasDescendants: boolean;
  hasHiddenDescendants: boolean;
  descendantsTruncated: boolean;
  truncationReason: TruncationReason | null;
  canExpandDescendants: boolean;
}
