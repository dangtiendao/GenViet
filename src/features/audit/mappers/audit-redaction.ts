import { AUDIT_ERROR_CODES, AuditDomainError } from "../errors/audit.errors";
import type { AuditEntityType } from "../types/audit.types";

const DENYLIST_KEYS = new Set([
  "password",
  "current_password",
  "new_password",
  "access_token",
  "refresh_token",
  "token",
  "token_hash",
  "confirmation_token",
  "recovery_token",
  "service_role",
  "secret_key",
  "client_secret",
  "database_url",
  "database_password",
  "authorization",
  "cookie",
  "signed_url",
  "signed_upload_url",
  "upload_token",
  "cron_secret",
]);

const ALLOWED_FIELDS_BY_ENTITY: Record<AuditEntityType, Set<string>> = {
  family_tree: new Set([
    "name",
    "description",
    "status",
    "privacy_level",
    "generation_anchor_person_id",
    "default_person_id",
    "deleted_at",
    "version",
  ]),
  person: new Set([
    "full_name",
    "gender",
    "living_status",
    "birth_date",
    "birth_year",
    "birth_date_precision",
    "birth_is_estimated",
    "death_date",
    "death_year",
    "death_date_precision",
    "death_is_estimated",
    "birth_place_text",
    "death_place_text",
    "hometown_text",
    "burial_place_text",
    "occupation_text",
    "biography",
    "verification_status",
    "avatar_path",
    "deleted_at",
    "version",
  ]),
  parent_child_relationship: new Set([
    "parent_id",
    "child_id",
    "parent_role",
    "relationship_kind",
    "verification_status",
    "deleted_at",
    "version",
  ]),
  union: new Set([
    "status",
    "start_date",
    "start_year",
    "end_date",
    "end_year",
    "verification_status",
    "deleted_at",
    "version",
  ]),
  union_member: new Set(["union_id", "person_id", "member_role", "deleted_at"]),
  person_avatar: new Set([
    "avatar_path",
    "thumbnail_path",
    "file_size_bytes",
    "mime_type",
    "status",
    "deleted_at",
  ]),
};

const MAX_PAYLOAD_BYTES = 64 * 1024; // 64 KB

/**
 * Khử nhiễm và áp dụng allowlist cho snapshot dữ liệu trước/sau biến động
 */
export function sanitizeAuditData(
  entityType: AuditEntityType,
  data: Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const allowedSet = ALLOWED_FIELDS_BY_ENTITY[entityType];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    // 1. Kiểm tra Denylist
    if (DENYLIST_KEYS.has(lowerKey)) {
      continue;
    }

    // 2. Kiểm tra Allowlist
    if (allowedSet && !allowedSet.has(key)) {
      continue;
    }

    // 3. Xử lý giá trị chuỗi (Cắt ngắn nếu quá 1000 ký tự để tránh phình dung lượng)
    if (typeof value === "string") {
      sanitized[key] = value.length > 1000 ? `${value.slice(0, 997)}...` : value;
    } else if (value !== undefined) {
      sanitized[key] = value;
    }
  }

  // 4. Kiểm tra giới hạn kích thước tổng payload
  const jsonString = JSON.stringify(sanitized);
  if (jsonString.length > MAX_PAYLOAD_BYTES) {
    throw new AuditDomainError(
      AUDIT_ERROR_CODES.PAYLOAD_TOO_LARGE,
      "Dung lượng dữ liệu audit log vượt quá giới hạn 64KB"
    );
  }

  return Object.keys(sanitized).length > 0 ? sanitized : null;
}

/**
 * Tính toán danh sách các trường thực sự thay đổi giữa before và after
 */
export function computeChangedFields(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined
): string[] {
  if (!before && !after) return [];
  if (!before && after) return Object.keys(after).sort();
  if (before && !after) return Object.keys(before).sort();

  const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  const changed: string[] = [];

  for (const key of allKeys) {
    const valBefore = before ? before[key] : undefined;
    const valAfter = after ? after[key] : undefined;

    if (JSON.stringify(valBefore) !== JSON.stringify(valAfter)) {
      changed.push(key);
    }
  }

  return changed.sort();
}
