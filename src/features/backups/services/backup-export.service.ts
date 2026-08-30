import { BackupRepository } from "../repositories/backup.repository";
import { backupDocumentSchema } from "../schemas/backup-document.schema";
import { assertNoSecretsInBackup } from "../mappers/backup-redaction";
import { generateSafeBackupFilename } from "../utils/backup-filename";
import { BACKUP_ERROR_CODES, BackupDomainError } from "../errors/backup.errors";
import type { BackupDocumentDto } from "../types/backup.types";

export class BackupExportService {
  /**
   * Tạo tệp sao lưu JSON hoàn chỉnh cho một cây gia phả
   */
  static async generateTreeBackup(treeId: string): Promise<{
    jsonString: string;
    filename: string;
    document: BackupDocumentDto;
  }> {
    // 1. Lấy snapshot CSDL
    const doc = await BackupRepository.exportTreeSnapshot(treeId);

    // 2. Khử nhiễm và kiểm tra 100% không có secret/token/signed URL
    assertNoSecretsInBackup(doc);

    // 3. Tự validate output với JSON Schema / Zod contract
    const parseResult = backupDocumentSchema.safeParse(doc);
    if (!parseResult.success) {
      console.error(
        "[BackupExportService.generateTreeBackup] Schema validation failed:",
        parseResult.error
      );
      throw new BackupDomainError(
        BACKUP_ERROR_CODES.SCHEMA_VALIDATION_FAILED,
        "Dữ liệu xuất không khớp với định dạng chuẩn JSON Schema v1.",
        500
      );
    }

    // 4. Tạo tên file an toàn
    const filename = generateSafeBackupFilename(doc.tree.name);
    const jsonString = JSON.stringify(doc, null, 2);

    return {
      jsonString,
      filename,
      document: doc,
    };
  }
}
