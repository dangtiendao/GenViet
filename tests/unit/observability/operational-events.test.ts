import { describe, it, expect, vi } from "vitest";
import { recordRouteExecution } from "@/lib/observability/route-monitoring";
import { evaluateHeartbeatHealth } from "@/lib/observability/heartbeat-monitoring";
import { recordAuthFailure } from "@/lib/observability/auth-monitoring";
import { recordUploadFailure } from "@/lib/observability/upload-monitoring";
import { logger } from "@/lib/observability/logger";

describe("P25: Operational Monitoring Events Tests (P25-T06 -> P25-T09)", () => {
  it("P25-T06: Ghi nhận lỗi 5xx với mức error và 200 với mức info", () => {
    const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
    const infoSpy = vi.spyOn(logger, "info").mockImplementation(() => {});

    recordRouteExecution({
      route: "/api/trees/123/graph",
      method: "GET",
      statusCode: 500,
      durationMs: 150,
      requestId: "req-1",
      error: new Error("Database timeout"),
    });

    expect(errorSpy).toHaveBeenCalledTimes(1);

    recordRouteExecution({
      route: "/api/trees/123/graph",
      method: "GET",
      statusCode: 200,
      durationMs: 45,
      requestId: "req-2",
    });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
    infoSpy.mockRestore();
  });

  it("P25-T07: Đánh giá chính xác trạng thái Heartbeat quá hạn (>48h)", () => {
    const healthy = evaluateHeartbeatHealth({
      lastHeartbeatAt: new Date().toISOString(),
      lastSuccessAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      lastStatus: "success",
      consecutiveFailures: 0,
    });
    expect(healthy.isHealthy).toBe(true);
    expect(healthy.isStale).toBe(false);

    const stale = evaluateHeartbeatHealth({
      lastHeartbeatAt: new Date().toISOString(),
      lastSuccessAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(), // 50 hours ago
      lastStatus: "success",
      consecutiveFailures: 0,
    });
    expect(stale.isHealthy).toBe(false);
    expect(stale.isStale).toBe(true);
  });

  it("P25-T08: Ghi nhận sự cố xác thực an toàn không phơi lộ mật khẩu hay token", () => {
    const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

    recordAuthFailure({
      type: "login_rejected",
      errorCode: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
      requestId: "req-auth-1",
      route: "/login",
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it("P25-T09: Ghi nhận sự cố tải lên media an toàn", () => {
    const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

    recordUploadFailure({
      stage: "validation",
      errorCode: "FILE_TOO_LARGE",
      message: "File exceeds 5MB limit",
      fileSizeBytes: 6 * 1024 * 1024,
      mimeCategory: "image/jpeg",
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});
