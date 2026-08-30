import { logger } from "./logger";

export interface HeartbeatStatus {
  lastHeartbeatAt: string | null;
  lastSuccessAt: string | null;
  lastStatus: string | null;
  consecutiveFailures: number;
}

const STALE_HEARTBEAT_THRESHOLD_HOURS = 48;

/**
 * Phân tích và phát hiện tình trạng quá hạn hoặc lỗi của Heartbeat kỹ thuật (P25-T07)
 */
export function evaluateHeartbeatHealth(
  status: HeartbeatStatus,
  requestId?: string
): {
  isHealthy: boolean;
  isStale: boolean;
  hoursSinceLastSuccess: number | null;
} {
  if (!status.lastSuccessAt) {
    logger.warn({
      event: "heartbeat.stale",
      message: "No successful heartbeat recorded yet",
      requestId,
      metadata: { consecutiveFailures: status.consecutiveFailures },
    });
    return { isHealthy: false, isStale: true, hoursSinceLastSuccess: null };
  }

  const lastSuccessTime = new Date(status.lastSuccessAt).getTime();
  const diffHours = (Date.now() - lastSuccessTime) / (1000 * 60 * 60);
  const isStale = diffHours > STALE_HEARTBEAT_THRESHOLD_HOURS;
  const isHealthy = !isStale && status.consecutiveFailures === 0;

  if (isStale) {
    logger.warn({
      event: "heartbeat.stale",
      message: `Heartbeat is stale. Last success was ${diffHours.toFixed(1)} hours ago`,
      requestId,
      metadata: {
        hoursSinceLastSuccess: diffHours,
        consecutiveFailures: status.consecutiveFailures,
      },
    });
  } else if (status.consecutiveFailures > 0) {
    logger.warn({
      event: "heartbeat.failed",
      message: `Heartbeat has ${status.consecutiveFailures} consecutive failures`,
      requestId,
      metadata: { consecutiveFailures: status.consecutiveFailures },
    });
  } else {
    logger.info({
      event: "heartbeat.success",
      message: "Heartbeat health status is optimal",
      requestId,
      metadata: { hoursSinceLastSuccess: diffHours },
    });
  }

  return { isHealthy, isStale, hoursSinceLastSuccess: diffHours };
}
