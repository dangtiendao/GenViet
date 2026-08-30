"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/require-user";
import { AvatarService } from "../services/avatar.service";
import type {
  PrepareAvatarUploadInput,
  FinalizeAvatarUploadInput,
  GetAvatarSignedUrlInput,
  DeleteAvatarInput,
} from "../schemas/avatar-upload.schema";
import { MediaDomainError } from "../errors/media.errors";
import type {
  AvatarUploadAuthorization,
  AvatarMetadata,
  AvatarSignedUrlResponse,
} from "../types/media.types";

export type MediaActionResult<T> =
  { success: true; data: T } | { success: false; error: { code: string; message: string } };

export async function prepareAvatarUploadAction(
  input: PrepareAvatarUploadInput
): Promise<MediaActionResult<AvatarUploadAuthorization>> {
  try {
    const { user } = await requireUser();
    const data = await AvatarService.prepareAvatarUpload(user.id, input);
    return { success: true, data };
  } catch (err) {
    if (err instanceof MediaDomainError) {
      return {
        success: false,
        error: { code: err.code, message: err.message },
      };
    }
    return {
      success: false,
      error: {
        code: "AVATAR_UNKNOWN_ERROR",
        message: err instanceof Error ? err.message : "Lỗi chuẩn bị tải ảnh lên.",
      },
    };
  }
}

export async function finalizeAvatarUploadAction(
  input: FinalizeAvatarUploadInput
): Promise<MediaActionResult<AvatarMetadata>> {
  try {
    const { user } = await requireUser();
    const data = await AvatarService.finalizeAvatarUpload(user.id, input);

    // Revalidate các trang liên quan (Person Detail, Person Edit, Search, Tree View)
    revalidatePath(`/trees/${input.treeId}/people/${input.personId}`);
    revalidatePath(`/trees/${input.treeId}/people/${input.personId}/edit`);
    revalidatePath(`/trees/${input.treeId}/people`);
    revalidatePath(`/trees/${input.treeId}/tree`);

    return { success: true, data };
  } catch (err) {
    if (err instanceof MediaDomainError) {
      return {
        success: false,
        error: { code: err.code, message: err.message },
      };
    }
    return {
      success: false,
      error: {
        code: "AVATAR_UNKNOWN_ERROR",
        message: err instanceof Error ? err.message : "Lỗi hoàn tất cập nhật ảnh.",
      },
    };
  }
}

export async function getAvatarSignedUrlAction(
  input: GetAvatarSignedUrlInput
): Promise<MediaActionResult<AvatarSignedUrlResponse | null>> {
  try {
    const { user } = await requireUser();
    const data = await AvatarService.getAvatarSignedUrl(user.id, input);
    return { success: true, data };
  } catch (err) {
    if (err instanceof MediaDomainError) {
      return {
        success: false,
        error: { code: err.code, message: err.message },
      };
    }
    return {
      success: false,
      error: {
        code: "AVATAR_UNKNOWN_ERROR",
        message: err instanceof Error ? err.message : "Lỗi lấy đường dẫn ảnh.",
      },
    };
  }
}

export async function removeAvatarAction(
  input: DeleteAvatarInput
): Promise<MediaActionResult<null>> {
  try {
    const { user } = await requireUser();
    await AvatarService.removeAvatar(user.id, input);

    revalidatePath(`/trees/${input.treeId}/people/${input.personId}`);
    revalidatePath(`/trees/${input.treeId}/people/${input.personId}/edit`);
    revalidatePath(`/trees/${input.treeId}/people`);
    revalidatePath(`/trees/${input.treeId}/tree`);

    return { success: true, data: null };
  } catch (err) {
    if (err instanceof MediaDomainError) {
      return {
        success: false,
        error: { code: err.code, message: err.message },
      };
    }
    return {
      success: false,
      error: {
        code: "AVATAR_UNKNOWN_ERROR",
        message: err instanceof Error ? err.message : "Lỗi xóa ảnh đại diện.",
      },
    };
  }
}
