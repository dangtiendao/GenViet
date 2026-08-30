import { BackupRepository } from "../repositories/backup.repository";
import { validateBackupFile } from "./backup-import-validator";
import { buildIdMaps, remapBackupDocument } from "../utils/import-id-map";
import { BACKUP_ERROR_CODES, BackupDomainError } from "../errors/backup.errors";
import type {
  BackupImportPreviewDto,
  BackupImportResultDto,
  BackupValidationReport,
} from "../types/backup.types";

export class BackupImportService {
  /**
   * Xem trước nội dung tệp sao lưu trước khi thực thi nhập
   */
  static previewBackup(fileContent: string): {
    isValid: boolean;
    preview: BackupImportPreviewDto | null;
    report: BackupValidationReport;
  } {
    const { isValid, preview, report } = validateBackupFile(fileContent);
    return { isValid, preview, report };
  }

  /**
   * Thực thi nhập tệp sao lưu thành cây gia phả mới trong Database Transaction
   */
  static async executeImport(
    fileContent: string,
    expectedDigest?: string
  ): Promise<BackupImportResultDto> {
    // 1. Tái xác thực toàn bộ nội dung tệp server-side
    const { isValid, doc, preview, report } = validateBackupFile(fileContent);

    if (!isValid || !doc || !preview) {
      const firstError = report.errors[0]?.message || "Tệp sao lưu không hợp lệ";
      throw new BackupDomainError(
        (report.errors[0]?.code as any) || BACKUP_ERROR_CODES.SCHEMA_INVALID,
        firstError,
        400,
        report.errors
      );
    }

    // 2. Chống thay đổi file giữa Preview và Execute (Digest Integrity Check)
    if (expectedDigest && preview.digestSha256 !== expectedDigest) {
      throw new BackupDomainError(
        BACKUP_ERROR_CODES.PREVIEW_STALE,
        "Nội dung tệp sao lưu đã bị thay đổi sau khi xem trước. Vui lòng kiểm tra và xác nhận lại.",
        400
      );
    }

    // 3. Khởi tạo bảng ánh xạ ID cũ sang UUID mới
    const idMaps = buildIdMaps(doc);

    // 4. Ánh xạ dữ liệu sang payload cho RPC
    const remappedPayload = remapBackupDocument(doc, idMaps);

    // 5. Thực thi trong PostgreSQL Transaction
    return BackupRepository.executeImportTransaction(remappedPayload);
  }
}
