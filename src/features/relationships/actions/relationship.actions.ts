"use server";

import { requireUser } from "@/lib/auth/require-user";
import { RelationshipService } from "../services/relationship.service";
import {
  addNewParentSchema,
  linkExistingParentSchema,
  addNewChildSchema,
  linkExistingChildSchema,
  createUnionWithNewPersonSchema,
  createUnionWithExistingPersonSchema,
  endUnionSchema,
  softDeleteRelationshipSchema,
  softDeleteUnionSchema,
  replaceParentRelationshipSchema,
} from "../schemas/relationship.schema";
import { revalidatePath } from "next/cache";

export type RelationshipActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  isWarning?: boolean;
  warningCode?: string;
  data?: unknown;
};

export async function searchCandidatesAction(
  treeId: string,
  excludePersonId: string,
  searchQuery?: string
) {
  try {
    await requireUser();
    const candidates = await RelationshipService.findPotentialCandidates(
      treeId,
      excludePersonId,
      searchQuery
    );
    return { success: true, candidates };
  } catch (error) {
    const err = error as Error;
    return { success: false, message: err.message, candidates: [] };
  }
}

export async function addNewParentAction(formData: unknown): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = addNewParentSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.addNewParent(user.id, parsed.data);
    revalidatePath(`/trees/${parsed.data.treeId}/people`);
    revalidatePath(`/trees/${parsed.data.treeId}/people/${parsed.data.childId}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as {
      message?: string;
      code?: string;
      severity?: string;
      canConfirm?: boolean;
    };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi thêm cha/mẹ.",
      isWarning: err.severity === "warning",
      warningCode: err.code,
    };
  }
}

export async function linkExistingParentAction(
  formData: unknown
): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = linkExistingParentSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.linkExistingParent(user.id, parsed.data);
    revalidatePath(`/trees/${parsed.data.treeId}/people`);
    revalidatePath(`/trees/${parsed.data.treeId}/people/${parsed.data.childId}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as { message?: string; code?: string; severity?: string };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi liên kết cha/mẹ.",
      isWarning: err.severity === "warning",
      warningCode: err.code,
    };
  }
}

export async function addNewChildAction(formData: unknown): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = addNewChildSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.addNewChild(user.id, parsed.data);
    revalidatePath(`/trees/${parsed.data.treeId}/people`);
    revalidatePath(`/trees/${parsed.data.treeId}/people/${parsed.data.parentId}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as { message?: string; code?: string; severity?: string };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi thêm con.",
      isWarning: err.severity === "warning",
      warningCode: err.code,
    };
  }
}

export async function linkExistingChildAction(
  formData: unknown
): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = linkExistingChildSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.linkExistingChild(user.id, parsed.data);
    revalidatePath(`/trees/${parsed.data.treeId}/people`);
    revalidatePath(`/trees/${parsed.data.treeId}/people/${parsed.data.parentId}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as { message?: string; code?: string; severity?: string };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi liên kết con.",
      isWarning: err.severity === "warning",
      warningCode: err.code,
    };
  }
}

export async function createUnionWithNewPersonAction(
  formData: unknown
): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = createUnionWithNewPersonSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.createUnionWithNewPerson(user.id, parsed.data);
    revalidatePath(`/trees/${parsed.data.treeId}/people`);
    revalidatePath(`/trees/${parsed.data.treeId}/people/${parsed.data.subjectPersonId}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as { message?: string; code?: string; severity?: string };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi kết đôi với người mới.",
      isWarning: err.severity === "warning",
      warningCode: err.code,
    };
  }
}

export async function createUnionWithExistingPersonAction(
  formData: unknown
): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = createUnionWithExistingPersonSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.createUnionWithExistingPerson(user.id, parsed.data);
    revalidatePath(`/trees/${parsed.data.treeId}/people`);
    revalidatePath(`/trees/${parsed.data.treeId}/people/${parsed.data.person1Id}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as { message?: string; code?: string; severity?: string };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi kết đôi.",
      isWarning: err.severity === "warning",
      warningCode: err.code,
    };
  }
}

export async function endUnionAction(
  treeId: string,
  personId: string,
  formData: unknown
): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = endUnionSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.endUnion(user.id, treeId, parsed.data);
    revalidatePath(`/trees/${treeId}/people/${personId}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as { message?: string; code?: string };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi kết thúc hôn nhân.",
    };
  }
}

export async function softDeleteRelationshipAction(
  treeId: string,
  personId: string,
  formData: unknown
): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = softDeleteRelationshipSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.softDeleteRelationship(user.id, treeId, parsed.data);
    revalidatePath(`/trees/${treeId}/people/${personId}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as { message?: string; code?: string };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi xóa quan hệ.",
    };
  }
}

export async function softDeleteUnionAction(
  treeId: string,
  personId: string,
  formData: unknown
): Promise<RelationshipActionResult> {
  try {
    const { user } = await requireUser();
    const parsed = softDeleteUnionSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const result = await RelationshipService.softDeleteUnion(user.id, treeId, parsed.data);
    revalidatePath(`/trees/${treeId}/people/${personId}`);
    return { success: true, data: result };
  } catch (error) {
    const err = error as { message?: string; code?: string };
    return {
      success: false,
      message: err.message || "Đã xảy ra lỗi khi xóa hôn nhân.",
    };
  }
}
