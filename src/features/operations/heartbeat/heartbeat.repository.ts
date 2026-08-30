import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HeartbeatRecord, HeartbeatSource, HeartbeatStatus } from "./heartbeat.types";
import { HeartbeatError, HEARTBEAT_ERROR_CODES } from "./heartbeat.errors";

export class HeartbeatRepository {
  /**
   * Gọi hàm privileged record_system_heartbeat để cập nhật nhịp tim hệ thống singleton
   */
  async recordHeartbeat(params: {
    source: HeartbeatSource;
    runId?: string | null;
    durationMs?: number | null;
    status: HeartbeatStatus;
    errorCode?: string | null;
  }): Promise<HeartbeatRecord> {
    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc("record_system_heartbeat", {
      p_source: params.source,
      p_run_id: params.runId || null,
      p_duration_ms: params.durationMs || null,
      p_status: params.status,
      p_error_code: params.errorCode || null,
    });

    if (error || !data) {
      console.error("[HeartbeatRepository] Database write error:", error?.message);
      throw new HeartbeatError(
        HEARTBEAT_ERROR_CODES.WRITE_FAILED,
        "Không thể ghi nhận nhịp tim vào cơ sở dữ liệu.",
        500
      );
    }

    return data as HeartbeatRecord;
  }

  /**
   * Lấy thông tin bản ghi nhịp tim singleton hiện tại
   */
  async getHeartbeat(): Promise<HeartbeatRecord | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("system_heartbeats")
      .select("*")
      .eq("id", "primary")
      .maybeSingle();

    if (error) {
      console.error("[HeartbeatRepository] Database read error:", error.message);
      throw new HeartbeatError(
        HEARTBEAT_ERROR_CODES.DATABASE_UNAVAILABLE,
        "Không thể truy vấn bảng nhịp tim hệ thống.",
        500
      );
    }

    return data as HeartbeatRecord | null;
  }
}

export const heartbeatRepository = new HeartbeatRepository();
