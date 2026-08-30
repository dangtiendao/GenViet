import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "@/lib/observability/logger";

describe("P25-T04: Structured Logger Tests", () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("xuất log định dạng JSON Lines có đầy đủ các trường chuẩn", () => {
    logger.info({
      event: "test.event",
      message: "Test message",
      requestId: "req-12345678",
      route: "/api/test",
      statusCode: 200,
      metadata: { key: "value", secretKey: "hidden123" },
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const rawOutput = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(rawOutput);

    expect(parsed.level).toBe("info");
    expect(parsed.event).toBe("test.event");
    expect(parsed.message).toBe("Test message");
    expect(parsed.requestId).toBe("req-12345678");
    expect(parsed.route).toBe("/api/test");
    expect(parsed.statusCode).toBe(200);
    expect(parsed.metadata.key).toBe("value");
    expect(parsed.metadata.secretKey).toBe("[REDACTED]");
  });
});
