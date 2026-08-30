import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET, PUT, DELETE, PATCH } from "@/app/api/internal/heartbeat/route";
import { heartbeatService } from "@/features/operations/heartbeat/heartbeat.service";

describe("Internal Heartbeat Route Handler (P21-T05 & P21-T06)", () => {
  const SECRET = "test_heartbeat_secret_key_12345";

  beforeEach(() => {
    vi.stubEnv("HEARTBEAT_SECRET", SECRET);
    vi.clearAllMocks();
  });

  it("trả về HTTP 405 Method Not Allowed cho các phương thức GET, PUT, DELETE, PATCH", async () => {
    const resGet = await GET();
    expect(resGet.status).toBe(405);
    const jsonGet = await resGet.json();
    expect(jsonGet.code).toBe("HEARTBEAT_METHOD_NOT_ALLOWED");

    const resPut = await PUT();
    expect(resPut.status).toBe(405);

    const resDelete = await DELETE();
    expect(resDelete.status).toBe(405);

    const resPatch = await PATCH();
    expect(resPatch.status).toBe(405);
  });

  it("từ chối với HTTP 401 khi thiếu header xác thực bí mật", async () => {
    const req = new NextRequest("http://localhost/api/internal/heartbeat", {
      method: "POST",
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe("HEARTBEAT_UNAUTHORIZED");
  });

  it("từ chối với HTTP 401 khi gửi sai mã bí mật", async () => {
    const req = new NextRequest("http://localhost/api/internal/heartbeat", {
      method: "POST",
      headers: {
        authorization: "Bearer wrong_secret_token",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe("HEARTBEAT_UNAUTHORIZED");
  });

  it("thành công với HTTP 200 và thiết lập no-store header khi gửi đúng secret", async () => {
    vi.spyOn(heartbeatService, "processHeartbeat").mockResolvedValue({
      ok: true,
      status: "recorded",
      recordedAt: "2026-08-30T10:00:00Z",
      runId: "run-abc",
      source: "github_actions",
    });

    const req = new NextRequest("http://localhost/api/internal/heartbeat", {
      method: "POST",
      headers: {
        authorization: `Bearer ${SECRET}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        source: "github_actions",
        runId: "run-abc",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("no-store");

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.status).toBe("recorded");
    expect(json.source).toBe("github_actions");
  });
});
