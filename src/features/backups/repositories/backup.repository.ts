import { createClient } from "@/lib/supabase/server";
import { BACKUP_ERROR_CODES, BackupDomainError } from "../errors/backup.errors";
import type { BackupDocumentDto, BackupImportResultDto } from "../types/backup.types";

export class BackupRepository {
  /**
   * Lấy snapshot dữ liệu nhất quán của cây gia phả để sao lưu
   */
  static async exportTreeSnapshot(treeId: string): Promise<BackupDocumentDto> {
    const supabase = await createClient();

    const { data, error } = await (supabase.rpc as any)("export_family_tree_backup", {
      p_tree_id: treeId,
    });

    if (error) {
      console.error("[BackupRepository.exportTreeSnapshot] RPC error:", error);
      if (error.code === "42501" || error.message.includes("BACKUP_EXPORT_FORBIDDEN")) {
        throw new BackupDomainError(
          BACKUP_ERROR_CODES.EXPORT_FORBIDDEN,
          "Bạn không có quyền xuất bản sao lưu của cây gia phả này.",
          403
        );
      }
      if (error.message.includes("BACKUP_TREE_NOT_FOUND")) {
        throw new BackupDomainError(
          BACKUP_ERROR_CODES.TREE_NOT_FOUND,
          "Không tìm thấy cây gia phả cần xuất sao lưu.",
          404
        );
      }
      throw new BackupDomainError(
        BACKUP_ERROR_CODES.EXPORT_FAILED,
        "Không thể xuất bản sao lưu cây gia phả. Vui lòng thử lại sau.",
        500
      );
    }

    return data as BackupDocumentDto;
  }

  /**
   * Thực thi import dữ liệu cây gia phả trong transaction atomic
   */
  static async executeImportTransaction(remappedPayload: unknown): Promise<BackupImportResultDto> {
    const supabase = await createClient();

    const { data, error } = await (supabase.rpc as any)("import_family_tree_backup", {
      p_backup_data: remappedPayload,
    });

    if (error) {
      console.error("[BackupRepository.executeImportTransaction] RPC error:", error);
      if (error.code === "42501") {
        throw new BackupDomainError(
          BACKUP_ERROR_CODES.IMPORT_FORBIDDEN,
          "Bạn không có quyền thực hiện thao tác nhập cây gia phả.",
          403
        );
      }
      if (error.message.includes("BACKUP_CYCLE_DETECTED")) {
        throw new BackupDomainError(
          BACKUP_ERROR_CODES.CYCLE_DETECTED,
          "Phát hiện chu trình phả hệ tổ tiên - hậu duệ không hợp lệ.",
          400
        );
      }
      throw new BackupDomainError(
        BACKUP_ERROR_CODES.IMPORT_FAILED,
        error.message || "Nhập cây gia phả thất bại. Toàn bộ thay đổi đã được hủy bỏ.",
        500
      );
    }

    const res = data as any;
    return {
      success: true,
      treeId: res.treeId,
      treeName: res.treeName,
      personCount: res.personCount,
      relationshipCount: res.relationshipCount,
      unionCount: res.unionCount,
    };
  }
}
