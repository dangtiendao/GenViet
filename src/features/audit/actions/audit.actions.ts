"use server";

import { requireUser } from "@/lib/auth/require-user";
import { AuditService } from "../services/audit.service";
import { AuditDomainError } from "../errors/audit.errors";
import type { AuditFilterQuery, AuditHistoryResponse } from "../types/audit.types";

export interface AuditActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

/**
 * Server Action: Lấy danh sách lịch sử biến động của Family Tree
 */
export async function getAuditHistoryAction(
  treeId: string,
  query: Partial<AuditFilterQuery>
): Promise<AuditActionResponse<AuditHistoryResponse>> {
  try {
    await requireUser();

    const response = await AuditService.listAuditHistory(treeId, query);
    return { success: true, data: response };
  } catch (err: unknown) {
    if (err instanceof AuditDomainError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[getAuditHistoryAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi tải lịch sử biến động. Vui lòng thử lại.",
    };
  }
}
