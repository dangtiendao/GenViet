import { RecoveryRepository } from "../repositories/recovery.repository";
import {
  restorePersonSchema,
  restoreRelationshipSchema,
  restoreUnionSchema,
} from "../schemas/restore.schema";
import { RECOVERY_ERROR_CODES, RecoveryDomainError } from "../errors/recovery.errors";
import type {
  TrashItemDto,
  RestoreConflictPreview,
  RestorePersonInput,
  RestoreRelationshipInput,
  RestoreUnionInput,
} from "../types/recovery.types";

export class RecoveryService {
  /**
   * Lấy danh sách các đối tượng trong thùng rác
   */
  static async listTrash(treeId: string): Promise<TrashItemDto[]> {
    return RecoveryRepository.listTrashItems(treeId);
  }

  /**
   * Khôi phục nhân vật
   */
  static async restorePerson(rawInput: RestorePersonInput): Promise<boolean> {
    const parseResult = restorePersonSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new RecoveryDomainError(
        RECOVERY_ERROR_CODES.UNKNOWN_ERROR,
        parseResult.error.errors[0]?.message || "Dữ liệu khôi phục không hợp lệ"
      );
    }

    const { treeId, personId, expectedVersion, confirmWarnings } = parseResult.data;

    // Kiểm tra preview conflict
    const preview = await RecoveryRepository.previewPersonRestoreConflict(treeId, personId);
    if (preview.hasBlockingConflict) {
      throw new RecoveryDomainError(
        (preview.blockingCode as any) || RECOVERY_ERROR_CODES.UNKNOWN_ERROR,
        preview.blockingReasons[0] || "Không thể khôi phục nhân vật do xung đột dữ liệu."
      );
    }

    if (preview.hasWarnings && !confirmWarnings) {
      throw new RecoveryDomainError(
        RECOVERY_ERROR_CODES.WARNING_CONFIRMATION_REQUIRED,
        preview.warningMessages[0] || "Phát hiện cảnh báo cần xác nhận trước khi khôi phục."
      );
    }

    return RecoveryRepository.restorePerson(personId, expectedVersion);
  }

  /**
   * Khôi phục quan hệ Cha/Mẹ - Con
   */
  static async restoreRelationship(rawInput: RestoreRelationshipInput): Promise<boolean> {
    const parseResult = restoreRelationshipSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new RecoveryDomainError(
        RECOVERY_ERROR_CODES.UNKNOWN_ERROR,
        parseResult.error.errors[0]?.message || "Dữ liệu khôi phục không hợp lệ"
      );
    }

    const { treeId, relationshipId, expectedVersion } = parseResult.data;

    // Kiểm tra preview conflict
    const preview = await RecoveryRepository.previewRelationshipRestoreConflict(
      treeId,
      relationshipId
    );
    if (preview.hasBlockingConflict) {
      throw new RecoveryDomainError(
        (preview.blockingCode as any) || RECOVERY_ERROR_CODES.DEPENDENCY_DELETED,
        preview.blockingReasons[0] || "Không thể khôi phục quan hệ."
      );
    }

    return RecoveryRepository.restoreRelationship(relationshipId, expectedVersion);
  }

  /**
   * Khôi phục Hôn nhân
   */
  static async restoreUnion(rawInput: RestoreUnionInput): Promise<boolean> {
    const parseResult = restoreUnionSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new RecoveryDomainError(
        RECOVERY_ERROR_CODES.UNKNOWN_ERROR,
        parseResult.error.errors[0]?.message || "Dữ liệu khôi phục không hợp lệ"
      );
    }

    const { unionId, expectedVersion } = parseResult.data;
    return RecoveryRepository.restoreUnion(unionId, expectedVersion);
  }

  /**
   * Kiểm tra trước xung đột
   */
  static async previewConflict(
    treeId: string,
    itemType: "person" | "parent_child_relationship",
    id: string
  ): Promise<RestoreConflictPreview> {
    if (itemType === "person") {
      return RecoveryRepository.previewPersonRestoreConflict(treeId, id);
    }
    return RecoveryRepository.previewRelationshipRestoreConflict(treeId, id);
  }
}
