import "server-only";
import { heartbeatRepository } from "./heartbeat.repository";
import type {
  HeartbeatRequestPayload,
  HeartbeatSuccessResponse,
  HeartbeatSource,
} from "./heartbeat.types";

const ALLOWED_SOURCES: readonly HeartbeatSource[] = [
  "github_actions",
  "manual",
  "cron",
  "cli",
  "migration",
  "test",
];

export class HeartbeatService {
  /**
   * Xử lý và ghi nhận nhịp tim định kỳ an toàn
   */
  async processHeartbeat(
    payload: HeartbeatRequestPayload,
    measuredDurationMs?: number
  ): Promise<HeartbeatSuccessResponse> {
    const rawSource = payload.source;
    const source: HeartbeatSource =
      rawSource && ALLOWED_SOURCES.includes(rawSource) ? rawSource : "manual";

    const runId = payload.runId && payload.runId.trim().length > 0 ? payload.runId.trim() : null;

    const durationMs =
      typeof payload.durationMs === "number" && payload.durationMs >= 0
        ? Math.round(payload.durationMs)
        : measuredDurationMs !== undefined
          ? Math.round(measuredDurationMs)
          : null;

    const record = await heartbeatRepository.recordHeartbeat({
      source,
      runId,
      durationMs,
      status: "success",
      errorCode: null,
    });

    return {
      ok: true,
      status: "recorded",
      recordedAt: record.last_heartbeat_at,
      runId: record.last_run_id,
      source: record.last_source,
    };
  }
}

export const heartbeatService = new HeartbeatService();
