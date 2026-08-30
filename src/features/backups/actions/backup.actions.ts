"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/require-user";
import { BackupImportService } from "../services/backup-import.service";
import { BackupDomainError } from "../errors/backup.errors";
import type {
  BackupImportPreviewDto,
  BackupImportResultDto,
  BackupValidationReport,
} from "../types/backup.types";

export interface BackupActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  validationReport?: BackupValidationReport;
}

/**
 * Server Action: Xem trước tệp sao lưu JSON
 */
export async function previewBackupFileAction(
  fileContent: string
): Promise<BackupActionResponse<BackupImportPreviewDto>> {
  try {
    await requireUser();

    const { isValid, preview, report } = BackupImportService.previewBackup(fileContent);

    if (!isValid || !preview) {
      return {
        success: false,
        error: report.errors[0]?.message || "Tệp sao lưu không hợp lệ.",
        errorCode: report.errors[0]?.code,
        validationReport: report,
      };
    }

    return {
      success: true,
      data: preview,
      validationReport: report,
    };
  } catch (err: unknown) {
    if (err instanceof BackupDomainError) {
      return {
        success: false,
        error: err.message,
        errorCode: err.code,
        validationReport: err.recordErrors
          ? { isValid: false, errors: err.recordErrors, warnings: [] }
          : undefined,
      };
    }

    console.error("[previewBackupFileAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi kiểm tra tệp sao lưu.",
    };
  }
}

/**
 * Server Action: Thực thi nhập cây gia phả từ tệp sao lưu JSON
 */
export async function importBackupFileAction(
  fileContent: string,
  digestSha256?: string
): Promise<BackupActionResponse<BackupImportResultDto>> {
  try {
    await requireUser();

    const result = await BackupImportService.executeImport(fileContent, digestSha256);

    // Revalidate dashboard and trees list
    revalidatePath("/dashboard");
    revalidatePath("/trees");
    if (result.treeId) {
      revalidatePath(`/trees/${result.treeId}`);
    }

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    if (err instanceof BackupDomainError) {
      return {
        success: false,
        error: err.message,
        errorCode: err.code,
        validationReport: err.recordErrors
          ? { isValid: false, errors: err.recordErrors, warnings: [] }
          : undefined,
      };
    }

    console.error("[importBackupFileAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi nhập cây gia phả. Vui lòng thử lại.",
    };
  }
}
