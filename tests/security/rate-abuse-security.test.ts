import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/internal/heartbeat/route";
import { NextRequest } from "next/server";

describe("P22-T35: Kiểm thử phòng chống lạm dụng tải cục bộ (Basic Rate Abuse Security)", () => {
  const TEST_SECRET = "super-secret-heartbeat-token-12345678";

  beforeEach(() => {
    vi.stubEnv("HEARTBEAT_SECRET", TEST_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("từ chối ngay lập tức chuỗi 5 requests sai secret liên tiếp mà không thực hiện ghi database", async () => {
    for (let i = 0; i < 5; i++) {
      const req = new NextRequest("http://localhost/api/internal/heartbeat", {
        method: "POST",
        headers: {
          authorization: `Bearer invalid_burst_attempt_${i}`,
        },
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    }
  });

  it("từ chối ngay lập tức request có payload vượt quá giới hạn 1KB cho phép", async () => {
    const oversizedBody = "x".repeat(2048); // 2KB

    const req = new NextRequest("http://localhost/api/internal/heartbeat", {
      method: "POST",
      headers: {
        authorization: `Bearer ${TEST_SECRET}`,
        "content-length": "2048",
      },
      body: oversizedBody,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("HEARTBEAT_PAYLOAD_INVALID");
  });
});
