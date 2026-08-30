export type HeartbeatSource = "github_actions" | "manual" | "cron" | "cli" | "migration" | "test";

export type HeartbeatStatus = "success" | "failure" | "degraded";

export interface HeartbeatRecord {
  id: "primary";
  last_heartbeat_at: string;
  last_source: HeartbeatSource;
  last_run_id: string | null;
  last_status: HeartbeatStatus;
  last_duration_ms: number | null;
  last_error_code: string | null;
  consecutive_failures: number;
  last_success_at: string | null;
  last_failure_at: string | null;
  updated_at: string;
}

export interface HeartbeatRequestPayload {
  source?: HeartbeatSource;
  runId?: string | null;
  durationMs?: number | null;
}

export interface HeartbeatSuccessResponse {
  ok: true;
  status: "recorded";
  recordedAt: string;
  runId: string | null;
  source: HeartbeatSource;
}

export interface HeartbeatErrorResponse {
  ok: false;
  code: string;
  message: string;
}

export type HeartbeatApiResponse = HeartbeatSuccessResponse | HeartbeatErrorResponse;
