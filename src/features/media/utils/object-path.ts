import type { AvatarPathComponents, AvatarVariant } from "../types/media.types";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Xây dựng đường dẫn bền vững (Active Path) cho ảnh đại diện
 */
export function buildActiveAvatarPath(
  treeId: string,
  personId: string,
  mediaId: string,
  variant: AvatarVariant = "avatar"
): string {
  if (!UUID_REGEX.test(treeId) || !UUID_REGEX.test(personId) || !UUID_REGEX.test(mediaId)) {
    throw new Error("Mã định danh không hợp lệ khi tạo đường dẫn ảnh đại diện.");
  }
  return `trees/${treeId}/persons/${personId}/avatars/${mediaId}/${variant}.webp`;
}

/**
 * Xây dựng đường dẫn tạm thời (Temporary Path) cho luồng upload
 */
export function buildTemporaryAvatarPath(
  treeId: string,
  personId: string,
  uploadId: string,
  variant: AvatarVariant = "avatar"
): string {
  if (!UUID_REGEX.test(treeId) || !UUID_REGEX.test(personId)) {
    throw new Error("Mã định danh không hợp lệ khi tạo đường dẫn ảnh tạm.");
  }
  // Sanitize uploadId
  const safeUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safeUploadId) {
    throw new Error("Upload ID không hợp lệ.");
  }
  return `temporary/trees/${treeId}/persons/${personId}/${safeUploadId}/${variant}.webp`;
}

/**
 * Phân tích và kiểm tra an toàn đường dẫn đối tượng (chống Path Traversal)
 */
export function parseAvatarPath(path?: string | null): AvatarPathComponents | null {
  if (!path || typeof path !== "string") return null;

  // Chặn path traversal & ký tự nguy hiểm
  if (path.includes("..") || path.includes("\\") || path.includes("\0")) {
    return null;
  }

  const parts = path.split("/");

  // Pattern 1: trees/{treeId}/persons/{personId}/avatars/{mediaId}/{variant}.{ext}
  if (
    parts.length === 7 &&
    parts[0] === "trees" &&
    parts[2] === "persons" &&
    parts[4] === "avatars"
  ) {
    const treeId = parts[1];
    const personId = parts[3];
    const mediaId = parts[5];
    const filePart = parts[6];

    if (!UUID_REGEX.test(treeId) || !UUID_REGEX.test(personId) || !UUID_REGEX.test(mediaId)) {
      return null;
    }

    const [variant, ext] = filePart.split(".");
    if (
      (variant !== "avatar" && variant !== "thumb") ||
      (ext !== "webp" && ext !== "jpg" && ext !== "png")
    ) {
      return null;
    }

    return {
      treeId,
      personId,
      mediaId,
      variant,
      extension: ext,
      isTemporary: false,
    };
  }

  // Pattern 2: temporary/trees/{treeId}/persons/{personId}/{uploadId}/{variant}.{ext}
  if (
    parts.length === 7 &&
    parts[0] === "temporary" &&
    parts[1] === "trees" &&
    parts[3] === "persons"
  ) {
    const treeId = parts[2];
    const personId = parts[4];
    const uploadId = parts[5];
    const filePart = parts[6];

    if (!UUID_REGEX.test(treeId) || !UUID_REGEX.test(personId) || !uploadId) {
      return null;
    }

    const [variant, ext] = filePart.split(".");
    if (
      (variant !== "avatar" && variant !== "thumb") ||
      (ext !== "webp" && ext !== "jpg" && ext !== "png")
    ) {
      return null;
    }

    return {
      treeId,
      personId,
      mediaId: uploadId,
      variant,
      extension: ext,
      isTemporary: true,
    };
  }

  return null;
}
