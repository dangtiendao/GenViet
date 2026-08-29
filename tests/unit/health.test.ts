import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("Health Check Route Handler", () => {
  it("should return HTTP 200 with status ok and service genviet", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload.status).toBe("ok");
    expect(payload.service).toBe("genviet");
    expect(typeof payload.timestamp).toBe("string");
    expect(new Date(payload.timestamp).getTime()).not.toBeNaN();
  });
});
