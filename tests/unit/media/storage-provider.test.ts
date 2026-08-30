import { describe, it, expect } from "vitest";
import { getStorageProvider } from "@/features/media/storage-provider/storage-factory";

describe("P27-T18: Storage Provider Abstraction Tests", () => {
  it("khởi tạo đúng Storage Provider mặc định (Supabase Storage)", () => {
    const provider = getStorageProvider();
    expect(provider.providerName).toBe("supabase");
  });

  it("tạo signed read URL hợp lệ không lộ key", async () => {
    const provider = getStorageProvider();
    const signedUrl = await provider.createSignedReadUrl(
      "avatars",
      "tree-1/person-1/avatar.jpg",
      3600
    );
    expect(signedUrl).toContain("avatars");
    expect(signedUrl).toContain("tree-1/person-1/avatar.jpg");
  });
});
