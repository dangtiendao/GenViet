export type TrashItemType = "person" | "parent_child_relationship" | "union";

export interface TrashItemDto {
  id: string;
  treeId: string;
  itemType: TrashItemType;
  itemTypeLabel: string;
  displayName: string;
  detailSummary: string | null;
  deletedAt: string;
  deletedBy: string | null;
  version: number;
  canRestore: boolean;
}

export interface RestoreConflictPreview {
  hasBlockingConflict: boolean;
  hasWarnings: boolean;
  blockingReasons: string[];
  warningMessages: string[];
  blockingCode?: string;
}

export interface RestorePersonInput {
  treeId: string;
  personId: string;
  expectedVersion?: number;
  confirmWarnings?: boolean;
}

export interface RestoreRelationshipInput {
  treeId: string;
  relationshipId: string;
  expectedVersion?: number;
  confirmWarnings?: boolean;
}

export interface RestoreUnionInput {
  treeId: string;
  unionId: string;
  expectedVersion?: number;
  confirmWarnings?: boolean;
}
