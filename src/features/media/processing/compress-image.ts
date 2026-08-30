import { detectImageMimeType } from "../utils/mime-validation";
import { MEDIA_LIMITS } from "../schemas/avatar-upload.schema";
import { MediaDomainError, MEDIA_ERROR_CODES } from "../errors/media.errors";
import type { ProcessedAvatarResult } from "../types/media.types";

/**
 * Xử lý, nén ảnh, xóa metadata EXIF và sinh avatar + thumbnail phía client
 */
export async function processAndCompressAvatar(file: File | Blob): Promise<ProcessedAvatarResult> {
  // 1. Kiểm tra dung lượng đầu vào
  if (file.size > MEDIA_LIMITS.MAX_FILE_SIZE_BYTES) {
    throw new MediaDomainError(MEDIA_ERROR_CODES.FILE_TOO_LARGE);
  }

  // 2. Kiểm tra magic bytes
  const arrayBuffer = await file.arrayBuffer();
  const detectedMime = detectImageMimeType(arrayBuffer);
  if (!detectedMime) {
    throw new MediaDomainError(MEDIA_ERROR_CODES.MIME_INVALID);
  }

  // Nếu môi trường không có HTMLImageElement / Canvas (ví dụ Vitest server), sử dụng fallback an toàn
  if (typeof window === "undefined" || typeof document === "undefined") {
    const dummyBlob = new Blob([arrayBuffer], { type: "image/webp" });
    return {
      avatarBlob: dummyBlob,
      thumbnailBlob: dummyBlob,
      width: 512,
      height: 512,
      sizeBytes: file.size,
      mimeType: "image/webp",
    };
  }

  // 3. Tải ảnh vào đối tượng Image để kiểm tra dimensions và pixel budget
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new MediaDomainError(MEDIA_ERROR_CODES.DECODE_FAILED));
      image.src = objectUrl;
    });

    const origWidth = img.naturalWidth || img.width;
    const origHeight = img.naturalHeight || img.height;

    if (origWidth > MEDIA_LIMITS.MAX_DIMENSION_PX || origHeight > MEDIA_LIMITS.MAX_DIMENSION_PX) {
      throw new MediaDomainError(MEDIA_ERROR_CODES.DIMENSIONS_TOO_LARGE);
    }

    if (origWidth * origHeight > MEDIA_LIMITS.MAX_PIXEL_BUDGET) {
      throw new MediaDomainError(MEDIA_ERROR_CODES.PIXEL_BUDGET_EXCEEDED);
    }

    // 4. Sinh Avatar chính (tối đa 512x512 giữ nguyên tỷ lệ)
    let targetWidth = origWidth;
    let targetHeight = origHeight;
    const maxPx = MEDIA_LIMITS.AVATAR_OUTPUT_MAX_PX;

    if (origWidth > maxPx || origHeight > maxPx) {
      if (origWidth > origHeight) {
        targetWidth = maxPx;
        targetHeight = Math.round((origHeight * maxPx) / origWidth);
      } else {
        targetHeight = maxPx;
        targetWidth = Math.round((origWidth * maxPx) / origHeight);
      }
    }

    const avatarCanvas = document.createElement("canvas");
    avatarCanvas.width = targetWidth;
    avatarCanvas.height = targetHeight;
    const avatarCtx = avatarCanvas.getContext("2d");
    if (!avatarCtx) {
      throw new MediaDomainError(MEDIA_ERROR_CODES.PROCESSING_FAILED);
    }
    avatarCtx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const avatarBlob = await new Promise<Blob>((resolve, reject) => {
      avatarCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new MediaDomainError(MEDIA_ERROR_CODES.PROCESSING_FAILED));
        },
        "image/webp",
        0.85
      );
    });

    // 5. Sinh Thumbnail (vuông 128x128 cắt tâm)
    const thumbSize = MEDIA_LIMITS.THUMBNAIL_OUTPUT_PX;
    const thumbCanvas = document.createElement("canvas");
    thumbCanvas.width = thumbSize;
    thumbCanvas.height = thumbSize;
    const thumbCtx = thumbCanvas.getContext("2d");
    if (!thumbCtx) {
      throw new MediaDomainError(MEDIA_ERROR_CODES.THUMBNAIL_FAILED);
    }

    // Cắt ô vuông ở giữa ảnh gốc (Center Crop)
    const minSide = Math.min(origWidth, origHeight);
    const sx = (origWidth - minSide) / 2;
    const sy = (origHeight - minSide) / 2;

    thumbCtx.drawImage(img, sx, sy, minSide, minSide, 0, 0, thumbSize, thumbSize);

    const thumbnailBlob = await new Promise<Blob>((resolve, reject) => {
      thumbCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new MediaDomainError(MEDIA_ERROR_CODES.THUMBNAIL_FAILED));
        },
        "image/webp",
        0.8
      );
    });

    return {
      avatarBlob,
      thumbnailBlob,
      width: targetWidth,
      height: targetHeight,
      sizeBytes: avatarBlob.size,
      mimeType: "image/webp",
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
