import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleOAuthCallback } from "@/features/auth/services/handle-oauth-callback";
import { GET } from "@/app/auth/callback/route";
import { NextRequest } from "next/server";
import * as supabaseServerModule from "@/lib/supabase/server";

describe("P29: OAuth Callback Handler & Route Tests (AC-P29-017..024, AC-P29-079)", () => {
  const requestUrl = "http://localhost:3000/auth/callback";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("xử lý an toàn khi người dùng hủy bỏ ủy quyền (error=access_denied)", async () => {
    const result = await handleOAuthCallback({
      code: null,
      next: "/dashboard",
      error: "access_denied",
      errorDescription: "The user denied the request",
      requestUrl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_OAUTH_CANCELLED");
    expect(result.redirectUrl).toContain("/auth-error?code=AUTH_OAUTH_CANCELLED");
  });

  it("xử lý an toàn khi sàn Google trả lỗi chung (error=server_error)", async () => {
    const result = await handleOAuthCallback({
      code: null,
      next: "/dashboard",
      error: "server_error",
      requestUrl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_OAUTH_PROVIDER_ERROR");
    expect(result.redirectUrl).toContain("/auth-error?code=AUTH_OAUTH_PROVIDER_ERROR");
  });

  it("xử lý an toàn khi phản hồi callback thiếu authorization code", async () => {
    const result = await handleOAuthCallback({
      code: null,
      next: "/dashboard",
      error: null,
      requestUrl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_OAUTH_CALLBACK_CODE_MISSING");
    expect(result.redirectUrl).toContain("/auth-error?code=AUTH_OAUTH_CALLBACK_CODE_MISSING");
  });

  it("xử lý an toàn khi mã code bị lỗi hoặc hết hạn trong lúc trao đổi session", async () => {
    const mockExchangeCode = vi.fn().mockResolvedValue({
      error: { message: "Invalid or expired authorization code" },
    });

    vi.spyOn(supabaseServerModule, "createClient").mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCode,
      },
    } as unknown as Awaited<ReturnType<typeof supabaseServerModule.createClient>>);

    const result = await handleOAuthCallback({
      code: "expired_or_invalid_code",
      next: "/dashboard",
      error: null,
      requestUrl,
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_OAUTH_SESSION_EXCHANGE_FAILED");
    expect(result.redirectUrl).toContain("/auth-error?code=AUTH_OAUTH_SESSION_EXCHANGE_FAILED");
  });

  it("hoàn tất trao đổi code thành công và điều hướng về trang an toàn", async () => {
    const mockExchangeCode = vi.fn().mockResolvedValue({
      data: { session: { user: { id: "user-123", email: "user@example.com" } } },
      error: null,
    });

    vi.spyOn(supabaseServerModule, "createClient").mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCode,
      },
    } as unknown as Awaited<ReturnType<typeof supabaseServerModule.createClient>>);

    const result = await handleOAuthCallback({
      code: "valid_pkce_auth_code",
      next: "/trees/tree-999",
      error: null,
      requestUrl,
    });

    expect(result.success).toBe(true);
    expect(result.redirectUrl).toBe("http://localhost:3000/trees/tree-999");
  });

  it("chặn open-redirect khi next trỏ đến URL bên ngoài, fallback về /dashboard", async () => {
    const mockExchangeCode = vi.fn().mockResolvedValue({
      data: { session: { user: { id: "user-123" } } },
      error: null,
    });

    vi.spyOn(supabaseServerModule, "createClient").mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCode,
      },
    } as unknown as Awaited<ReturnType<typeof supabaseServerModule.createClient>>);

    const result = await handleOAuthCallback({
      code: "valid_code",
      next: "https://evil.example.com",
      error: null,
      requestUrl,
    });

    expect(result.success).toBe(true);
    expect(result.redirectUrl).toBe("http://localhost:3000/dashboard");
  });

  it("Callback Route Handler (GET) phải gắn header Cache-Control: no-store", async () => {
    const mockExchangeCode = vi.fn().mockResolvedValue({
      data: { session: { user: { id: "user-123" } } },
      error: null,
    });

    vi.spyOn(supabaseServerModule, "createClient").mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCode,
      },
    } as unknown as Awaited<ReturnType<typeof supabaseServerModule.createClient>>);

    const req = new NextRequest(
      "http://localhost:3000/auth/callback?code=valid_code&next=/dashboard"
    );
    const response = await GET(req);

    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(response.headers.get("Pragma")).toBe("no-cache");
    expect(response.status).toBe(307); // NextResponse.redirect default is 307
  });
});
