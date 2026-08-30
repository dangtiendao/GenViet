import { describe, it, expect } from "vitest";
import { detectImageMimeType } from "@/features/media/utils/mime-validation";

describe("Media MIME Validation Utility", () => {
  it("nhận diện đúng định dạng JPEG từ magic bytes (FF D8 FF)", () => {
    const buffer = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    ]);
    expect(detectImageMimeType(buffer)).toBe("image/jpeg");
  });

  it("nhận diện đúng định dạng PNG từ magic bytes (89 50 4E 47 0D 0A 1A 0A)", () => {
    const buffer = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    expect(detectImageMimeType(buffer)).toBe("image/png");
  });

  it("nhận diện đúng định dạng WebP từ magic bytes (RIFF...WEBP)", () => {
    const buffer = new Uint8Array([
      0x52,
      0x49,
      0x46,
      0x46, // RIFF
      0x24,
      0x00,
      0x00,
      0x00, // Size
      0x57,
      0x45,
      0x42,
      0x50, // WEBP
    ]);
    expect(detectImageMimeType(buffer)).toBe("image/webp");
  });

  it("từ chối tệp HTML giả mạo đổi đuôi thành .jpg (<!DOCTYPE html>)", () => {
    const fakeHtml = new TextEncoder().encode("<!DOCTYPE html><html><body>malicious</body></html>");
    expect(detectImageMimeType(fakeHtml)).toBeNull();
  });

  it("từ chối tệp SVG (<svg xmlns=...>)", () => {
    const svgBytes = new TextEncoder().encode(
      "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='40'/></svg>"
    );
    expect(detectImageMimeType(svgBytes)).toBeNull();
  });

  it("từ chối tệp GIF (GIF89a)", () => {
    const gifBytes = new TextEncoder().encode("GIF89a\x01\x00\x01\x00\x80\x00\x00");
    expect(detectImageMimeType(gifBytes)).toBeNull();
  });

  it("từ chối mảng byte quá ngắn hoặc rỗng", () => {
    expect(detectImageMimeType(new Uint8Array([]))).toBeNull();
    expect(detectImageMimeType(new Uint8Array([0xff, 0xd8]))).toBeNull();
  });
});
