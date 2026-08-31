import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { performClientSessionCleanup } from "@/lib/auth/session-cleanup";
import * as pwaCacheModule from "@/features/pwa/services/private-cache-cleanup";
import * as supabaseClientModule from "@/lib/supabase/client";

describe("P29: Session Isolation & Account Switch Cleanup (AC-P29-071..078)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("thực thi dọn dẹp toàn diện cache riêng tư và phiên Supabase client khi đăng xuất", async () => {
    const mockClearPrivateCaches = vi
      .spyOn(pwaCacheModule, "clearAllPrivateCaches")
      .mockResolvedValue();
    const mockSignOut = vi.fn().mockResolvedValue({ error: null });

    vi.stubGlobal("window", {
      sessionStorage: { clear: vi.fn() },
    });

    vi.spyOn(supabaseClientModule, "createClient").mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    } as unknown as ReturnType<typeof supabaseClientModule.createClient>);

    await performClientSessionCleanup();

    expect(mockClearPrivateCaches).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("không ném exception nếu Supabase signOut gặp lỗi mạng khi dọn dẹp", async () => {
    vi.spyOn(pwaCacheModule, "clearAllPrivateCaches").mockResolvedValue();

    vi.stubGlobal("window", {
      sessionStorage: { clear: vi.fn() },
    });

    vi.spyOn(supabaseClientModule, "createClient").mockReturnValue({
      auth: {
        signOut: vi.fn().mockRejectedValue(new Error("Network disconnect")),
      },
    } as unknown as ReturnType<typeof supabaseClientModule.createClient>);

    await expect(performClientSessionCleanup()).resolves.toBeUndefined();
  });
});
