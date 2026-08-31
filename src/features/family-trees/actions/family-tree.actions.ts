"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { FamilyTreeService } from "../services/family-tree.service";
import { FamilyTreeError } from "../errors/family-tree.errors";
import type { ActionResponse } from "../types/family-tree.types";

/**
 * Server Action: Tạo cây gia phả mới và điều hướng sang trang tổng quan cây
 */
export async function createFamilyTreeAction(
  prevState: ActionResponse<{ treeId: string }> | null,
  formData: FormData
): Promise<ActionResponse<{ treeId: string }>> {
  let newTreeId: string | null = null;

  try {
    const { user } = await requireUser();

    const name = (formData.get("name") as string) || "";
    const description = (formData.get("description") as string) || null;
    const privacyLevel = (formData.get("privacyLevel") as "private" | "public") || "private";

    const result = await FamilyTreeService.createFamilyTree(user.id, {
      name,
      description,
      privacyLevel,
    });

    newTreeId = result.treeId;
    revalidatePath("/trees");
    revalidatePath("/dashboard");
  } catch (err: unknown) {
    if (err instanceof FamilyTreeError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[createFamilyTreeAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi tạo cây gia phả. Vui lòng thử lại.",
    };
  }

  if (newTreeId) {
    redirect(`/trees/${newTreeId}`);
  }

  return { success: true };
}

/**
 * Server Action: Cập nhật thông tin cơ bản (Tên, Mô tả) của cây gia phả
 */
export async function updateFamilyTreeBasicsAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { user } = await requireUser();

    const treeId = formData.get("treeId") as string;
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const expectedVersion = Number(formData.get("expectedVersion"));

    await FamilyTreeService.updateBasics(user.id, {
      treeId,
      name,
      description,
      expectedVersion,
    });

    revalidatePath(`/trees/${treeId}`);
    revalidatePath(`/trees/${treeId}/settings`);
    revalidatePath("/trees");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof FamilyTreeError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[updateFamilyTreeBasicsAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể cập nhật thông tin cây gia phả. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Cập nhật quyền riêng tư (Privacy Level)
 */
export async function updateFamilyTreePrivacyAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { user } = await requireUser();

    const treeId = formData.get("treeId") as string;
    const privacyLevel = formData.get("privacyLevel") as "private" | "public";
    const expectedVersion = Number(formData.get("expectedVersion"));

    await FamilyTreeService.updatePrivacy(user.id, {
      treeId,
      privacyLevel,
      expectedVersion,
    });

    revalidatePath(`/trees/${treeId}`);
    revalidatePath(`/trees/${treeId}/settings`);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof FamilyTreeError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[updateFamilyTreePrivacyAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể cập nhật mức độ riêng tư. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Cập nhật mốc số đời (Generation Anchor Person)
 */
export async function setGenerationAnchorAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { user } = await requireUser();

    const treeId = formData.get("treeId") as string;
    const generationAnchorPersonId = (formData.get("generationAnchorPersonId") as string) || null;
    const expectedVersion = Number(formData.get("expectedVersion"));

    await FamilyTreeService.setGenerationAnchor(user.id, {
      treeId,
      generationAnchorPersonId,
      expectedVersion,
    });

    revalidatePath(`/trees/${treeId}`);
    revalidatePath(`/trees/${treeId}/settings`);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof FamilyTreeError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[setGenerationAnchorAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể cập nhật mốc số đời. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Xóa mềm cây gia phả và điều hướng về trang danh sách
 */
export async function softDeleteFamilyTreeAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  let shouldRedirect = false;

  try {
    const { user } = await requireUser();

    const treeId = formData.get("treeId") as string;
    const confirmationName = formData.get("confirmationName") as string;
    const expectedVersion = Number(formData.get("expectedVersion"));

    await FamilyTreeService.softDelete(user.id, {
      treeId,
      confirmationName,
      expectedVersion,
    });

    revalidatePath("/trees");
    revalidatePath("/dashboard");
    shouldRedirect = true;
  } catch (err: unknown) {
    if (err instanceof FamilyTreeError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[softDeleteFamilyTreeAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể xóa cây gia phả. Vui lòng thử lại.",
    };
  }

  if (shouldRedirect) {
    redirect("/trees");
  }

  return { success: true };
}

/**
 * Server Action: Khôi phục cây gia phả đã xóa mềm
 */
export async function restoreFamilyTreeAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const { user } = await requireUser();

    const treeId = formData.get("treeId") as string;

    await FamilyTreeService.restore(user.id, {
      treeId,
    });

    revalidatePath("/trees");
    revalidatePath(`/trees/${treeId}`);
    revalidatePath(`/trees/${treeId}/trash`);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof FamilyTreeError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[restoreFamilyTreeAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể khôi phục cây gia phả. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Công khai cây gia phả (Publish)
 */
export async function publishFamilyTreeAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireUser();

    const treeId = formData.get("treeId") as string;
    const slug = formData.get("slug") as string;
    const livingPersonPolicy =
      (formData.get("livingPersonPolicy") as "REDACTED" | "STRICT") || "REDACTED";
    const searchEngineVisibility =
      (formData.get("searchEngineVisibility") as "NOINDEX" | "INDEX") || "NOINDEX";
    const expectedVersion = Number(formData.get("expectedVersion"));

    const { publishFamilyTree } = await import("@/features/public-trees/publication/publish-tree");
    await publishFamilyTree({
      treeId,
      slug,
      livingPersonPolicy,
      searchEngineVisibility,
      expectedVersion: isNaN(expectedVersion) ? undefined : expectedVersion,
    });

    revalidatePath(`/trees/${treeId}`);
    revalidatePath(`/trees/${treeId}/settings`);
    revalidatePath(`/public/trees/${slug}`);
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error & { code?: string };
    return {
      success: false,
      error: error.message || "Không thể công khai cây gia phả.",
      errorCode: error.code,
    };
  }
}

/**
 * Server Action: Chuyển cây gia phả về riêng tư (Unpublish)
 */
export async function unpublishFamilyTreeAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireUser();

    const treeId = formData.get("treeId") as string;
    const currentSlug = (formData.get("currentSlug") as string) || undefined;
    const expectedVersion = Number(formData.get("expectedVersion"));

    const { unpublishFamilyTree } =
      await import("@/features/public-trees/publication/unpublish-tree");
    await unpublishFamilyTree({
      treeId,
      currentSlug,
      expectedVersion: isNaN(expectedVersion) ? undefined : expectedVersion,
    });

    revalidatePath(`/trees/${treeId}`);
    revalidatePath(`/trees/${treeId}/settings`);
    if (currentSlug) {
      revalidatePath(`/public/trees/${currentSlug}`);
    }
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error & { code?: string };
    return {
      success: false,
      error: error.message || "Không thể chuyển cây gia phả về riêng tư.",
      errorCode: error.code,
    };
  }
}
