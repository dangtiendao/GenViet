/**
 * Hidden reasons for nodes/branches in Public Tree Graph (P30-T04, P30-T33)
 */

export type PublicHiddenReason =
  | "PRIVACY"
  | "PATERNAL_LINE"
  | "DEPTH_LIMIT"
  | "NOT_LOADED"
  | "COLLAPSED"
  | "RESOURCE_LIMIT"
  | null;

export const HIDDEN_REASON_PRIORITIES: Record<NonNullable<PublicHiddenReason>, number> = {
  PRIVACY: 1, // Highest priority: privacy always wins over traversal
  PATERNAL_LINE: 2,
  DEPTH_LIMIT: 3,
  COLLAPSED: 4,
  NOT_LOADED: 5,
  RESOURCE_LIMIT: 6,
};
