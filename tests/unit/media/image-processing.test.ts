import { describe, it, expect } from "vitest";
import { processAndCompressAvatar } from "@/features/media/processing/compress-image";
import { MEDIA_ERROR_CODES } from "@/features/media/errors/media.errors";

describe("Avatar Image Processing Pipeline", () => {
  it("từ chối tệp tin vượt quá 10 MB", async () => {
    const hugeBlob = new Blob([new Uint8Array(11 * 1024 * 1024)]);
    await expect(processAndCompressAvatar(hugeBlob)).rejects.toMatchObject({
      code: MEDIA_ERROR_CODES.FILE_TOO_LARGE,
    });
  });

  it("từ chối tệp tin có magic bytes không hợp lệ", async () => {
    const invalidBlob = new Blob([new TextEncoder().encode("not an image")]);
    await expect(processAndCompressAvatar(invalidBlob)).rejects.toMatchObject({
      code: MEDIA_ERROR_CODES.MIME_INVALID,
    });
  });

  it("xử lý thành công tệp tin JPEG hợp lệ", async () => {
    const validJpegBytes = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00,
      0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    ]);
    const validBlob = new Blob([validJpegBytes], { type: "image/jpeg" });

    const result = await processAndCompressAvatar(validBlob);
    expect(result).toBeDefined();
    expect(result.mimeType).toBe("image/webp");
    expect(result.avatarBlob).toBeDefined();
    expect(result.thumbnailBlob).toBeDefined();
  });
});
