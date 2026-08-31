import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isSupportedOAuthProvider,
  OAUTH_PROVIDERS,
  GOOGLE_OAUTH_SCOPES,
} from "@/features/auth/contracts/auth-provider";
import { startOAuthSignIn } from "@/features/auth/services/start-oauth-sign-in";
import * as supabaseClientModule from "@/lib/supabase/client";

describe("P29: Google OAuth Provider & Initiation Tests (AC-P29-001..012)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("chỉ chấp nhận provider 'google' trong allowlist nghiêm ngặt", () => {
    expect(isSupportedOAuthProvider("google")).toBe(true);
    expect(OAUTH_PROVIDERS).toEqual(["google"]);

    // Unsupported providers must be rejected
    expect(isSupportedOAuthProvider("github")).toBe(false);
    expect(isSupportedOAuthProvider("facebook")).toBe(false);
    expect(isSupportedOAuthProvider("apple")).toBe(false);
    expect(isSupportedOAuthProvider("")).toBe(false);
    expect(isSupportedOAuthProvider(null)).toBe(false);
    expect(isSupportedOAuthProvider(undefined)).toBe(false);
    expect(isSupportedOAuthProvider(123)).toBe(false);
  });

  it("chỉ yêu cầu các scopes tối thiểu: openid, email, profile", () => {
    expect(GOOGLE_OAUTH_SCOPES).toBe("openid email profile");
    expect(GOOGLE_OAUTH_SCOPES).not.toContain("drive");
    expect(GOOGLE_OAUTH_SCOPES).not.toContain("contacts");
    expect(GOOGLE_OAUTH_SCOPES).not.toContain("calendar");
    expect(GOOGLE_OAUTH_SCOPES).not.toContain("gmail");
  });

  it("từ chối khởi tạo nếu provider không thuộc allowlist", async () => {
    // @ts-expect-error Testing invalid runtime input
    const result = await startOAuthSignIn({ provider: "unsupported" });
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_PROVIDER_UNSUPPORTED");
  });

  it("khởi tạo thành công qua Supabase client với callback URL an toàn", async () => {
    const mockSignInWithOAuth = vi.fn().mockResolvedValue({
      data: { url: "https://accounts.google.com/o/oauth2/v2/auth?..." },
      error: null,
    });

    vi.spyOn(supabaseClientModule, "createClient").mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
      },
    } as unknown as ReturnType<typeof supabaseClientModule.createClient>);

    const result = await startOAuthSignIn({
      provider: "google",
      next: "/trees/tree-123",
    });

    expect(result.success).toBe(true);
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: expect.objectContaining({
        redirectTo: expect.stringContaining("/auth/callback?next="),
        scopes: "openid email profile",
        queryParams: {
          prompt: "select_account",
        },
      }),
    });
  });

  it("xử lý lỗi an toàn từ Supabase SDK và không ném unhandled exception", async () => {
    const mockSignInWithOAuth = vi.fn().mockResolvedValue({
      data: null,
      error: new Error("Network connection error"),
    });

    vi.spyOn(supabaseClientModule, "createClient").mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
      },
    } as unknown as ReturnType<typeof supabaseClientModule.createClient>);

    const result = await startOAuthSignIn({
      provider: "google",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
});
