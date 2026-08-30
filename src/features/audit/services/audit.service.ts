import { AuditRepository } from "../repositories/audit.repository";
import { auditQuerySchema } from "../schemas/audit-query.schema";
import { AUDIT_ERROR_CODES, AuditDomainError } from "../errors/audit.errors";
import type {
  AuditFilterQuery,
  AuditHistoryResponse,
  RecordAuditInput,
} from "../types/audit.types";

export class AuditService {
  /**
   * Lấy danh sách lịch sử biến động cho một cây gia phả
   */
  static async listAuditHistory(
    treeId: string,
    rawQuery: Partial<AuditFilterQuery>
  ): Promise<AuditHistoryResponse> {
    const parseResult = auditQuerySchema.safeParse({ ...rawQuery, treeId });
    if (!parseResult.success) {
      throw new AuditDomainError(
        AUDIT_ERROR_CODES.QUERY_INVALID,
        parseResult.error.errors[0]?.message || "Tham số truy vấn lịch sử không hợp lệ"
      );
    }

    return AuditRepository.listAuditLogs(treeId, parseResult.data);
  }

  /**
   * Ghi nhận sự kiện biến động nghiệp vụ
   */
  static async recordAudit(input: RecordAuditInput): Promise<string> {
    return AuditRepository.recordAuditEvent(input);
  }
}
