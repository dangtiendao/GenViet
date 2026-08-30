import { describe, it, expect, beforeEach } from "vitest";
import { signedUrlCache } from "@/features/media/utils/signed-url-cache";

describe("Signed URL Cache Manager", () => {
  const personId = "11111111-1111-4111-a111-111111111111";

  beforeEach(() => {
    signedUrlCache.clear();
  });

  it("lưu và lấy URL thành công khi chưa hết hạn", () => {
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút sau
    signedUrlCache.set(
      personId,
      "media-1",
      "avatar",
      "https://storage.local/avatar.webp?token=123",
      expiresAt
    );

    const cached = signedUrlCache.get(personId, "media-1", "avatar");
    expect(cached).toBe("https://storage.local/avatar.webp?token=123");
  });

  it("trả về null khi URL đã hết hạn hoặc sắp hết hạn trong 60 giây", () => {
    const expiresAt = Date.now() + 30 * 1000; // 30s sau (dưới ngưỡng 60s an toàn)
    signedUrlCache.set(
      personId,
      "media-1",
      "avatar",
      "https://storage.local/avatar.webp?token=expired",
      expiresAt
    );

    const cached = signedUrlCache.get(personId, "media-1", "avatar");
    expect(cached).toBeNull();
  });

  it("vô hiệu hóa (invalidate) toàn bộ cache của một person khi thay đổi avatar", () => {
    const expiresAt = Date.now() + 10 * 60 * 1000;
    signedUrlCache.set(
      personId,
      "media-1",
      "avatar",
      "https://storage.local/avatar.webp",
      expiresAt
    );
    signedUrlCache.set(personId, "media-1", "thumb", "https://storage.local/thumb.webp", expiresAt);

    signedUrlCache.invalidate(personId);

    expect(signedUrlCache.get(personId, "media-1", "avatar")).toBeNull();
    expect(signedUrlCache.get(personId, "media-1", "thumb")).toBeNull();
  });
});
