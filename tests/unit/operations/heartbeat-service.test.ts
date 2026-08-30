import { describe, it, expect, vi, beforeEach } from "vitest";
import { HeartbeatService } from "@/features/operations/heartbeat/heartbeat.service";
import { heartbeatRepository } from "@/features/operations/heartbeat/heartbeat.repository";
import type { HeartbeatRecord } from "@/features/operations/heartbeat/heartbeat.types";

describe("Heartbeat Service (P21-T05)", () => {
  let service: HeartbeatService;

  beforeEach(() => {
    service = new HeartbeatService();
    vi.clearAllMocks();
  });

  it("xử lý thành công payload hợp lệ từ github_actions và trả về kết quả chuẩn", async () => {
    const mockRecord: HeartbeatRecord = {
      id: "primary",
      last_heartbeat_at: "2026-08-30T10:00:00Z",
      last_source: "github_actions",
      last_run_id: "gh-run-999",
      last_status: "success",
      last_duration_ms: 120,
      last_error_code: null,
      consecutive_failures: 0,
      last_success_at: "2026-08-30T10:00:00Z",
      last_failure_at: null,
      updated_at: "2026-08-30T10:00:00Z",
    };

    vi.spyOn(heartbeatRepository, "recordHeartbeat").mockResolvedValue(mockRecord);

    const res = await service.processHeartbeat(
      {
        source: "github_actions",
        runId: "gh-run-999",
        durationMs: 120,
      },
      120
    );

    expect(res.ok).toBe(true);
    expect(res.status).toBe("recorded");
    expect(res.source).toBe("github_actions");
    expect(res.runId).toBe("gh-run-999");
    expect(res.recordedAt).toBe("2026-08-30T10:00:00Z");
  });

  it("tự động chuyển source về 'manual' khi source không nằm trong allowlist", async () => {
    const mockRecord: HeartbeatRecord = {
      id: "primary",
      last_heartbeat_at: "2026-08-30T10:00:00Z",
      last_source: "manual",
      last_run_id: null,
      last_status: "success",
      last_duration_ms: 45,
      last_error_code: null,
      consecutive_failures: 0,
      last_success_at: "2026-08-30T10:00:00Z",
      last_failure_at: null,
      updated_at: "2026-08-30T10:00:00Z",
    };

    const spy = vi.spyOn(heartbeatRepository, "recordHeartbeat").mockResolvedValue(mockRecord);

    await service.processHeartbeat({ source: "unauthorized_source" as any });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "manual",
      })
    );
  });
});
