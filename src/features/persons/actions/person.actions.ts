"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { PersonService } from "../services/person.service";
import { PersonError, PERSON_ERROR_CODES } from "../errors/person.errors";
import type { PersonActionResponse, SimilarPersonCandidate } from "../types/person.types";

/**
 * Server Action: Tạo nhân vật tối giản (Minimal Create)
 */
export async function createMinimalPersonAction(
  prevState: PersonActionResponse<{ personId: string }> | null,
  formData: FormData
): Promise<PersonActionResponse<{ personId: string }>> {
  let createdPersonId: string | null = null;
  let targetTreeId: string = "";

  try {
    const { user } = await requireUser();

    targetTreeId = formData.get("treeId") as string;
    const fullName = (formData.get("fullName") as string) || "";
    const gender = (formData.get("gender") as any) || "unknown";
    const livingStatus = (formData.get("livingStatus") as any) || "unknown";
    const birthPrecision = (formData.get("birthPrecision") as any) || "unknown";
    const birthDate = (formData.get("birthDate") as string) || null;
    const birthYear = formData.get("birthYear") ? Number(formData.get("birthYear")) : null;
    const birthIsEstimated = formData.get("birthIsEstimated") === "true";
    const confirmSimilar = formData.get("confirmSimilar") === "true";

    const result = await PersonService.createMinimalPerson(user.id, {
      treeId: targetTreeId,
      fullName,
      gender,
      livingStatus,
      birthPrecision,
      birthDate,
      birthYear,
      birthIsEstimated,
      confirmSimilar,
    });

    if (result.isWarning && result.warningCandidates) {
      return {
        success: false,
        warning: {
          code: PERSON_ERROR_CODES.SIMILAR_PROFILE_WARNING,
          message: "Phát hiện nhân vật có tên tương tự đã tồn tại trong cây gia phả.",
          candidates: result.warningCandidates,
        },
      };
    }

    if (result.person) {
      createdPersonId = result.person.id;
      revalidatePath(`/trees/${targetTreeId}/people`);
      revalidatePath(`/trees/${targetTreeId}`);
    }
  } catch (err: unknown) {
    if (err instanceof PersonError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[createMinimalPersonAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi tạo nhân vật. Vui lòng thử lại.",
    };
  }

  if (createdPersonId && targetTreeId) {
    redirect(`/trees/${targetTreeId}/people/${createdPersonId}`);
  }

  return { success: true };
}

/**
 * Server Action: Tạo nhân vật đầy đủ (Full Create)
 */
export async function createFullPersonAction(
  prevState: PersonActionResponse<{ personId: string }> | null,
  formData: FormData
): Promise<PersonActionResponse<{ personId: string }>> {
  let createdPersonId: string | null = null;
  let targetTreeId: string = "";

  try {
    const { user } = await requireUser();

    targetTreeId = formData.get("treeId") as string;
    const fullName = (formData.get("fullName") as string) || "";
    const gender = (formData.get("gender") as any) || "unknown";
    const livingStatus = (formData.get("livingStatus") as any) || "unknown";

    const birthPrecision = (formData.get("birthPrecision") as any) || "unknown";
    const birthDate = (formData.get("birthDate") as string) || null;
    const birthYear = formData.get("birthYear") ? Number(formData.get("birthYear")) : null;
    const birthIsEstimated = formData.get("birthIsEstimated") === "true";

    const deathPrecision = (formData.get("deathPrecision") as any) || "unknown";
    const deathDate = (formData.get("deathDate") as string) || null;
    const deathYear = formData.get("deathYear") ? Number(formData.get("deathYear")) : null;
    const deathIsEstimated = formData.get("deathIsEstimated") === "true";

    const birthPlaceText = (formData.get("birthPlaceText") as string) || null;
    const deathPlaceText = (formData.get("deathPlaceText") as string) || null;
    const hometownText = (formData.get("hometownText") as string) || null;
    const burialPlaceText = (formData.get("burialPlaceText") as string) || null;
    const occupationText = (formData.get("occupationText") as string) || null;
    const biography = (formData.get("biography") as string) || null;
    const verificationStatus = (formData.get("verificationStatus") as any) || "unverified";
    const confirmSimilar = formData.get("confirmSimilar") === "true";

    const result = await PersonService.createFullPerson(user.id, {
      treeId: targetTreeId,
      fullName,
      gender,
      livingStatus,
      birthPrecision,
      birthDate,
      birthYear,
      birthIsEstimated,
      deathPrecision,
      deathDate,
      deathYear,
      deathIsEstimated,
      birthPlaceText,
      deathPlaceText,
      hometownText,
      burialPlaceText,
      occupationText,
      biography,
      verificationStatus,
      confirmSimilar,
    });

    if (result.isWarning && result.warningCandidates) {
      return {
        success: false,
        warning: {
          code: PERSON_ERROR_CODES.SIMILAR_PROFILE_WARNING,
          message: "Phát hiện nhân vật có tên tương tự đã tồn tại trong cây gia phả.",
          candidates: result.warningCandidates,
        },
      };
    }

    if (result.person) {
      createdPersonId = result.person.id;
      revalidatePath(`/trees/${targetTreeId}/people`);
      revalidatePath(`/trees/${targetTreeId}`);
    }
  } catch (err: unknown) {
    if (err instanceof PersonError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[createFullPersonAction] Unexpected error:", err);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi tạo nhân vật. Vui lòng thử lại.",
    };
  }

  if (createdPersonId && targetTreeId) {
    redirect(`/trees/${targetTreeId}/people/${createdPersonId}`);
  }

  return { success: true };
}

/**
 * Server Action: Cập nhật thông tin nhân vật đầy đủ
 */
export async function updatePersonAction(
  prevState: PersonActionResponse | null,
  formData: FormData
): Promise<PersonActionResponse> {
  try {
    const { user } = await requireUser();

    const treeId = formData.get("treeId") as string;
    const personId = formData.get("personId") as string;
    const expectedVersion = Number(formData.get("expectedVersion"));
    const fullName = (formData.get("fullName") as string) || "";
    const gender = (formData.get("gender") as any) || "unknown";
    const livingStatus = (formData.get("livingStatus") as any) || "unknown";

    const birthPrecision = (formData.get("birthPrecision") as any) || "unknown";
    const birthDate = (formData.get("birthDate") as string) || null;
    const birthYear = formData.get("birthYear") ? Number(formData.get("birthYear")) : null;
    const birthIsEstimated = formData.get("birthIsEstimated") === "true";

    const deathPrecision = (formData.get("deathPrecision") as any) || "unknown";
    const deathDate = (formData.get("deathDate") as string) || null;
    const deathYear = formData.get("deathYear") ? Number(formData.get("deathYear")) : null;
    const deathIsEstimated = formData.get("deathIsEstimated") === "true";

    const birthPlaceText = (formData.get("birthPlaceText") as string) || null;
    const deathPlaceText = (formData.get("deathPlaceText") as string) || null;
    const hometownText = (formData.get("hometownText") as string) || null;
    const burialPlaceText = (formData.get("burialPlaceText") as string) || null;
    const occupationText = (formData.get("occupationText") as string) || null;
    const biography = (formData.get("biography") as string) || null;
    const verificationStatus = (formData.get("verificationStatus") as any) || "unverified";

    await PersonService.updatePerson(user.id, {
      treeId,
      personId,
      expectedVersion,
      fullName,
      gender,
      livingStatus,
      birthPrecision,
      birthDate,
      birthYear,
      birthIsEstimated,
      deathPrecision,
      deathDate,
      deathYear,
      deathIsEstimated,
      birthPlaceText,
      deathPlaceText,
      hometownText,
      burialPlaceText,
      occupationText,
      biography,
      verificationStatus,
    });

    revalidatePath(`/trees/${treeId}/people/${personId}`);
    revalidatePath(`/trees/${treeId}/people`);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof PersonError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[updatePersonAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể cập nhật hồ sơ nhân vật. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Xóa mềm nhân vật
 */
export async function softDeletePersonAction(
  prevState: PersonActionResponse | null,
  formData: FormData
): Promise<PersonActionResponse> {
  let targetTreeId: string = "";
  let shouldRedirect = false;

  try {
    const { user } = await requireUser();

    targetTreeId = formData.get("treeId") as string;
    const personId = formData.get("personId") as string;
    const expectedVersion = Number(formData.get("expectedVersion"));

    await PersonService.softDeletePerson(user.id, {
      treeId: targetTreeId,
      personId,
      expectedVersion,
    });

    revalidatePath(`/trees/${targetTreeId}/people`);
    revalidatePath(`/trees/${targetTreeId}`);
    shouldRedirect = true;
  } catch (err: unknown) {
    if (err instanceof PersonError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[softDeletePersonAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể xóa hồ sơ nhân vật. Vui lòng thử lại.",
    };
  }

  if (shouldRedirect && targetTreeId) {
    redirect(`/trees/${targetTreeId}/people`);
  }

  return { success: true };
}

/**
 * Server Action: Khôi phục nhân vật đã xóa mềm
 */
export async function restorePersonAction(
  prevState: PersonActionResponse | null,
  formData: FormData
): Promise<PersonActionResponse> {
  try {
    const { user } = await requireUser();

    const treeId = formData.get("treeId") as string;
    const personId = formData.get("personId") as string;
    const expectedVersion = Number(formData.get("expectedVersion"));

    await PersonService.restorePerson(user.id, {
      treeId,
      personId,
      expectedVersion,
    });

    revalidatePath(`/trees/${treeId}/people`);
    revalidatePath(`/trees/${treeId}/people/${personId}`);
    revalidatePath(`/trees/${treeId}/people/trash`);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof PersonError) {
      return { success: false, error: err.message, errorCode: err.code };
    }
    console.error("[restorePersonAction] Unexpected error:", err);
    return {
      success: false,
      error: "Không thể khôi phục hồ sơ nhân vật. Vui lòng thử lại.",
    };
  }
}

/**
 * Server Action: Tìm kiếm ứng viên tương tự (Client debounce check)
 */
export async function checkSimilarPersonsAction(
  treeId: string,
  fullName: string,
  birthYear?: number | null,
  excludePersonId?: string
): Promise<SimilarPersonCandidate[]> {
  try {
    await requireUser();
    return await PersonService.checkSimilarPeople(treeId, fullName, birthYear, excludePersonId);
  } catch (err) {
    console.error("[checkSimilarPersonsAction] Error:", err);
    return [];
  }
}
