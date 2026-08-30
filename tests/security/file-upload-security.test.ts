import { describe, it, expect } from "vitest";
import { detectImageMimeType } from "@/features/media/utils/mime-validation";
import { buildActiveAvatarPath, parseAvatarPath } from "@/features/media/utils/object-path";

describe("P22-T32: Kiểm thử bảo mật tải lên tệp ảnh (File Upload Security)", () => {
  it("từ chối tệp HTML giả mạo đổi đuôi thành .jpg (<!DOCTYPE html>)", () => {
    const fakeHtml = new TextEncoder().encode(
      "<!DOCTYPE html><html><script>alert(1)</script></html>"
    );
    expect(detectImageMimeType(fakeHtml)).toBeNull();
  });

  it("từ chối tệp SVG chứa mã độc thực thi script", () => {
    const maliciousSvg = new TextEncoder().encode(
      "<svg xmlns='http://www.w3.org/2000/svg' onload='alert(1)'></svg>"
    );
    expect(detectImageMimeType(maliciousSvg)).toBeNull();
  });

  it("từ chối tệp nhị phân bị hỏng (corrupted magic bytes)", () => {
    const corruptBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
    expect(detectImageMimeType(corruptBytes)).toBeNull();
  });

  it("hàm sinh đường dẫn lưu trữ ngăn chặn hoàn toàn tấn công path traversal", () => {
    const treeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    const personId = "11111111-1111-4111-a111-111111111111";
    const mediaId = "22222222-2222-4222-a222-222222222222";

    const path = buildActiveAvatarPath(treeId, personId, mediaId, "thumb");

    expect(path).not.toContain("..");
    expect(path).not.toContain("\\");
    expect(path.startsWith(`trees/${treeId}/persons/${personId}/`)).toBe(true);

    const parsed = parseAvatarPath(path);
    expect(parsed).not.toBeNull();
    expect(parsed?.treeId).toBe(treeId);
    expect(parsed?.personId).toBe(personId);
    expect(parsed?.mediaId).toBe(mediaId);
  });
});
