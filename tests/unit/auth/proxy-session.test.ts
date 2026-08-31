import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from "@supabase/ssr";

describe("Proxy updateSession & Server Action Protection (P29 Fix)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("không chuyển hướng 307 khi request là Server Action có header next-action", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as unknown as ReturnType<typeof createServerClient>);

    const req = new NextRequest("http://localhost:3000/dashboard", {
      method: "POST",
      headers: {
        "next-action": "action_id_123",
      },
    });

    const res = await updateSession(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("chuyển hướng 307 về /login khi request là GET vào route bảo vệ mà không có session", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as unknown as ReturnType<typeof createServerClient>);

    const req = new NextRequest("http://localhost:3000/dashboard", {
      method: "GET",
    });

    const res = await updateSession(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login?next=%2Fdashboard");
  });

  it("không chuyển hướng khi request là POST vào /login dù người dùng đã có session", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-123", email: "test@example.com" } },
          error: null,
        }),
      },
    } as unknown as ReturnType<typeof createServerClient>);

    const req = new NextRequest("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "next-action": "sign_in_action_id",
      },
    });

    const res = await updateSession(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});
