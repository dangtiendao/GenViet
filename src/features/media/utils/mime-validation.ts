export type VerifiedImageMimeType = "image/jpeg" | "image/png" | "image/webp";

/**
 * Kiểm tra magic bytes của mảng nhị phân để xác thực định dạng ảnh thực tế
 * Tuyệt đối không tin tưởng vào phần mở rộng tệp (.jpg, .png) hoặc `File.type` của trình duyệt.
 */
export function detectImageMimeType(
  buffer: Uint8Array | ArrayBuffer
): VerifiedImageMimeType | null {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  if (bytes.length < 12) {
    return null;
  }

  // 1. JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // 3. WebP: RIFF (bytes 0-3: 52 49 46 46) and WEBP (bytes 8-11: 57 45 42 50)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // Từ chối tất cả các định dạng khác (SVG, GIF, HTML giả mạo, EXE, PDF...)
  return null;
}
