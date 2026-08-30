"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/require-user";
import { RecoveryService } from "../services/recovery.service";
import { RecoveryDomainError } from "../errors/recovery.errors";
import type {
  RestorePersonInput,
  RestoreRelationshipInput,
  RestoreUnionInput,
  RestoreConflictPreview,
} from "../types/recovery.types";

export interface RecoveryActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  warning?: {
    code: string;
    message: string;
  };
}

/**
 * Server Action: Khôi phục nhân vật từ thùng rác
 */
export async function restorePersonRecoveryAction(
  input: RestorePersonInput
): Promise<RecoveryActionResponse<{ personId: string }>> {
  try {
    await requireUser();

    await RecoveryService.restorePerson(input);

    revalidatePath(`/trees/${input.treeId}/people`);
    revalidatePath(`/trees/${input.treeId}/people/${input.personId}`);
    revalidatePath(`/trees/${input.treeId}/people/trash`);
    revalidatePath(`/trees/${input.treeId}/history`);
    revalidatePath(`/trees/${input.treeId}/tree`);
    revalidatePath(`/trees/${input.treeId}`);

    return { success: true, data: { personId: input.personId } };
  } catch (err: unknown) {
    if (err instanceof RecoveryDomainError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[restorePersonRecoveryAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi khôi phục nhân vật. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Khôi phục quan hệ Cha/Mẹ - Con từ thùng rác
 */
export async function restoreRelationshipRecoveryAction(
  input: RestoreRelationshipInput
): Promise<RecoveryActionResponse<{ relationshipId: string }>> {
  try {
    await requireUser();

    await RecoveryService.restoreRelationship(input);

    revalidatePath(`/trees/${input.treeId}/people`);
    revalidatePath(`/trees/${input.treeId}/people/trash`);
    revalidatePath(`/trees/${input.treeId}/history`);
    revalidatePath(`/trees/${input.treeId}/tree`);

    return { success: true, data: { relationshipId: input.relationshipId } };
  } catch (err: unknown) {
    if (err instanceof RecoveryDomainError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[restoreRelationshipRecoveryAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi khôi phục quan hệ. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Khôi phục quan hệ Hôn nhân từ thùng rác
 */
export async function restoreUnionRecoveryAction(
  input: RestoreUnionInput
): Promise<RecoveryActionResponse<{ unionId: string }>> {
  try {
    await requireUser();

    await RecoveryService.restoreUnion(input);

    revalidatePath(`/trees/${input.treeId}/people`);
    revalidatePath(`/trees/${input.treeId}/people/trash`);
    revalidatePath(`/trees/${input.treeId}/history`);
    revalidatePath(`/trees/${input.treeId}/tree`);

    return { success: true, data: { unionId: input.unionId } };
  } catch (err: unknown) {
    if (err instanceof RecoveryDomainError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[restoreUnionRecoveryAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi khôi phục hôn nhân. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Kiểm tra trước xung đột khôi phục
 */
export async function previewConflictAction(
  treeId: string,
  itemType: "person" | "parent_child_relationship",
  id: string
): Promise<RecoveryActionResponse<RestoreConflictPreview>> {
  try {
    await requireUser();
    const preview = await RecoveryService.previewConflict(treeId, itemType, id);
    return { success: true, data: preview };
  } catch (err: unknown) {
    console.error("[previewConflictAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể kiểm tra xung đột dữ liệu.",
    };
  }
}
