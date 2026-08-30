import { createClient } from "@/lib/supabase/server";
import { mapRawRowToAuditLogDto, type RawAuditRow } from "../mappers/audit.mapper";
import { sanitizeAuditData, computeChangedFields } from "../mappers/audit-redaction";
import { AUDIT_ERROR_CODES, AuditDomainError } from "../errors/audit.errors";
import type {
  AuditFilterQuery,
  AuditHistoryResponse,
  RecordAuditInput,
} from "../types/audit.types";

export class AuditRepository {
  /**
   * Truy vấn danh sách nhật ký biến động theo cây gia phả với bộ lọc và cursor pagination
   */
  static async listAuditLogs(
    treeId: string,
    filters: AuditFilterQuery
  ): Promise<AuditHistoryResponse> {
    const supabase = await createClient();
    const limit = filters.limit ? Math.min(Math.max(filters.limit, 1), 50) : 20;

    let query = supabase
      .from("audit_logs")
      .select("*")
      .eq("tree_id", treeId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit + 1);

    if (filters.entityType) {
      query = query.eq("entity_type", filters.entityType);
    }

    if (filters.actionType) {
      query = query.eq("action_type", filters.actionType);
    }

    if (filters.actorUserId) {
      query = query.eq("actor_user_id", filters.actorUserId);
    }

    if (filters.entityId) {
      query = query.eq("entity_id", filters.entityId);
    }

    if (filters.dateFrom) {
      query = query.gte("created_at", `${filters.dateFrom}T00:00:00.000Z`);
    }

    if (filters.dateTo) {
      query = query.lte("created_at", `${filters.dateTo}T23:59:59.999Z`);
    }

    if (filters.cursor) {
      try {
        const decoded = JSON.parse(Buffer.from(filters.cursor, "base64").toString("utf-8"));
        if (decoded.createdAt && decoded.id) {
          query = query.or(
            `created_at.lt.${decoded.createdAt},and(created_at.eq.${decoded.createdAt},id.lt.${decoded.id})`
          );
        }
      } catch {
        throw new AuditDomainError(
          AUDIT_ERROR_CODES.CURSOR_INVALID,
          "Con trỏ phân trang không hợp lệ"
        );
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("[AuditRepository.listAuditLogs] Database error:", error);
      throw new AuditDomainError(
        AUDIT_ERROR_CODES.QUERY_FAILED,
        "Không thể tải lịch sử biến động. Vui lòng thử lại sau.",
        500
      );
    }

    const rows = (data || []) as unknown as RawAuditRow[];
    const hasMore = rows.length > limit;
    const items = (hasMore ? rows.slice(0, limit) : rows).map(mapRawRowToAuditLogDto);

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = Buffer.from(
        JSON.stringify({ createdAt: lastItem.createdAt, id: lastItem.id })
      ).toString("base64");
    }

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Ghi nhận một sự kiện biến động nghiệp vụ (Record Audit Event)
   */
  static async recordAuditEvent(input: RecordAuditInput): Promise<string> {
    const supabase = await createClient();

    const sanitizedBefore = sanitizeAuditData(input.entityType, input.beforeData);
    const sanitizedAfter = sanitizeAuditData(input.entityType, input.afterData);
    const changedFields =
      input.changedFields || computeChangedFields(sanitizedBefore, sanitizedAfter);

    const { data, error } = await (supabase.rpc as any)("record_audit_event", {
      p_tree_id: input.treeId,
      p_entity_type: input.entityType,
      p_entity_id: input.entityId,
      p_action_type: input.actionType,
      p_before_data: sanitizedBefore,
      p_after_data: sanitizedAfter,
      p_changed_fields: changedFields,
      p_reason: input.reason || null,
      p_source: input.source || "server_action",
      p_request_id: input.requestId || null,
    });

    if (error) {
      console.error("[AuditRepository.recordAuditEvent] RPC error:", error);
      throw new AuditDomainError(
        AUDIT_ERROR_CODES.WRITE_FAILED,
        "Không thể ghi nhận nhật ký biến động.",
        500
      );
    }

    return data as string;
  }
}
