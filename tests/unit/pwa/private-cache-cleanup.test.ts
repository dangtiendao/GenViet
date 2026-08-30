import { describe, it, expect, vi } from "vitest";
import { clearAllPrivateCaches } from "@/features/pwa/services/private-cache-cleanup";

describe("Private Cache Cleanup on Logout / Account Switch (P20-T09)", () => {
  it("thực thi dọn dẹp sessionStorage và caches mà không gây exception", async () => {
    const mockCachesDelete = vi.fn().mockResolvedValue(true);
    const mockCachesKeys = vi
      .fn()
      .mockResolvedValue(["genviet-shell-v1", "genviet-private-user123"]);

    const mockSessionClear = vi.fn();
    const mockCaches = {
      keys: mockCachesKeys,
      delete: mockCachesDelete,
    };
    const mockSession = {
      clear: mockSessionClear,
    };

    // Giả lập window, caches và sessionStorage
    vi.stubGlobal("caches", mockCaches);
    vi.stubGlobal("sessionStorage", mockSession);
    vi.stubGlobal("window", {
      caches: mockCaches,
      sessionStorage: mockSession,
    });

    await expect(clearAllPrivateCaches()).resolves.toBeUndefined();
    expect(mockSessionClear).toHaveBeenCalled();
    expect(mockCachesDelete).toHaveBeenCalledWith("genviet-private-user123");
    expect(mockCachesDelete).not.toHaveBeenCalledWith("genviet-shell-v1");

    vi.unstubAllGlobals();
  });
});
