import { describe, it, expect, beforeEach } from "vitest";
import { signedUrlCache } from "@/features/media/utils/signed-url-cache";

describe("P22-T34: Quản lý thời hạn & Thu hồi Signed URL (Signed URL Expiry & Isolation)", () => {
  const personId = "11111111-1111-4111-a111-111111111111";

  beforeEach(() => {
    signedUrlCache.clear();
  });

  it("tự động hủy (trả về null) đối với Signed URL đã hết hạn", () => {
    const expiredTimestamp = Date.now() - 5000; // Đã hết hạn 5 giây trước
    signedUrlCache.set(
      personId,
      "media-1",
      "avatar",
      "https://storage.local/avatar.webp?token=expired",
      expiredTimestamp
    );

    const result = signedUrlCache.get(personId, "media-1", "avatar");
    expect(result).toBeNull();
  });

  it("xóa sạch toàn bộ in-memory signed URL cache khi gọi clear (ví dụ khi đăng xuất)", () => {
    const validTimestamp = Date.now() + 15 * 60 * 1000;
    signedUrlCache.set(
      personId,
      "media-1",
      "avatar",
      "https://storage.local/avatar.webp?token=valid",
      validTimestamp
    );

    signedUrlCache.clear();

    const result = signedUrlCache.get(personId, "media-1", "avatar");
    expect(result).toBeNull();
  });
});
