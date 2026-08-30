import type { AuditEntityType, AuditActionType, AuditLogDto } from "../types/audit.types";

export const ENTITY_TYPE_LABELS: Record<AuditEntityType, string> = {
  family_tree: "Cây gia phả",
  person: "Nhân vật",
  parent_child_relationship: "Quan hệ Cha/Mẹ - Con",
  union: "Quan hệ Hôn nhân",
  union_member: "Thành viên Hôn nhân",
  person_avatar: "Ảnh đại diện",
};

export const ACTION_TYPE_LABELS: Record<AuditActionType, string> = {
  create: "Tạo mới",
  update: "Cập nhật",
  soft_delete: "Xóa vào thùng rác",
  restore: "Khôi phục",
  replace: "Thay thế",
  status_change: "Đổi trạng thái",
  link: "Liên kết",
  unlink: "Hủy liên kết",
  privacy_change: "Đổi quyền riêng tư",
  generation_anchor_change: "Đổi mốc thế hệ",
  avatar_replace: "Thay ảnh đại diện",
  avatar_remove: "Xóa ảnh đại diện",
};

export interface RawAuditRow {
  id: string;
  tree_id: string;
  actor_user_id: string | null;
  actor_name_cached: string | null;
  entity_type: string;
  entity_id: string;
  action_type: string;
  before_data: any;
  after_data: any;
  changed_fields: string[] | null;
  reason: string | null;
  source: string;
  created_at: string;
}

export function mapRawRowToAuditLogDto(row: RawAuditRow): AuditLogDto {
  const entityType = row.entity_type as AuditEntityType;
  const actionType = row.action_type as AuditActionType;

  return {
    id: row.id,
    treeId: row.tree_id,
    actorUserId: row.actor_user_id,
    actorName: row.actor_name_cached || "Hệ thống",
    entityType,
    entityTypeLabel: ENTITY_TYPE_LABELS[entityType] || entityType,
    entityId: row.entity_id,
    actionType,
    actionTypeLabel: ACTION_TYPE_LABELS[actionType] || actionType,
    beforeData: row.before_data && typeof row.before_data === "object" ? row.before_data : null,
    afterData: row.after_data && typeof row.after_data === "object" ? row.after_data : null,
    changedFields: Array.isArray(row.changed_fields) ? row.changed_fields : [],
    reason: row.reason,
    source: row.source,
    createdAt: row.created_at,
  };
}
