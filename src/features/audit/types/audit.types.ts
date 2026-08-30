export type AuditEntityType =
  | "family_tree"
  | "person"
  | "parent_child_relationship"
  | "union"
  | "union_member"
  | "person_avatar";

export type AuditActionType =
  | "create"
  | "update"
  | "soft_delete"
  | "restore"
  | "replace"
  | "status_change"
  | "link"
  | "unlink"
  | "privacy_change"
  | "generation_anchor_change"
  | "avatar_replace"
  | "avatar_remove";

export interface AuditLogDto {
  id: string;
  treeId: string;
  actorUserId: string | null;
  actorName: string | null;
  entityType: AuditEntityType;
  entityTypeLabel: string;
  entityId: string;
  actionType: AuditActionType;
  actionTypeLabel: string;
  beforeData: Record<string, unknown> | null;
  afterData: Record<string, unknown> | null;
  changedFields: string[];
  reason: string | null;
  source: string;
  createdAt: string;
}

export interface AuditFilterQuery {
  entityType?: AuditEntityType;
  actionType?: AuditActionType;
  actorUserId?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  entityId?: string;
  limit?: number;
  cursor?: string;
}

export interface AuditHistoryResponse {
  items: AuditLogDto[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface RecordAuditInput {
  treeId: string;
  entityType: AuditEntityType;
  entityId: string;
  actionType: AuditActionType;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
  changedFields?: string[] | null;
  reason?: string | null;
  source?: string;
  requestId?: string | null;
}
