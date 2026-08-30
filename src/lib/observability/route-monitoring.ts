import { logger } from "./logger";
import { errorTracker } from "./error-tracker";

export interface RouteExecutionMetrics {
  route: string;
  method: string;
  statusCode: number;
  durationMs: number;
  requestId: string;
  errorCode?: string;
  error?: unknown;
  metadata?: Record<string, any>;
}

/**
 * Ghi nhận kết quả thực thi của một HTTP Route Handler (P25-T06)
 * Tự động phân loại 5xx, 4xx và thời gian phản hồi theo ngân sách.
 */
export function recordRouteExecution(metrics: RouteExecutionMetrics): void {
  const { route, method, statusCode, durationMs, requestId, errorCode, error, metadata } = metrics;

  if (statusCode >= 500) {
    if (error) {
      errorTracker.captureException(error, {
        requestId,
        route,
        method,
        metadata: { statusCode, durationMs, ...metadata },
      });
    } else {
      logger.error({
        event: "app.route.failed",
        message: `HTTP ${method} ${route} failed with status ${statusCode}`,
        requestId,
        route,
        method,
        statusCode,
        durationMs,
        errorCode: errorCode || `HTTP_${statusCode}`,
        metadata,
      });
    }
  } else if (statusCode >= 400 && statusCode !== 401 && statusCode !== 403 && statusCode !== 404) {
    logger.warn({
      event: "app.route.warning",
      message: `HTTP ${method} ${route} returned client error ${statusCode}`,
      requestId,
      route,
      method,
      statusCode,
      durationMs,
      errorCode: errorCode || `HTTP_${statusCode}`,
      metadata,
    });
  } else {
    logger.info({
      event: "app.route.success",
      message: `HTTP ${method} ${route} completed successfully`,
      requestId,
      route,
      method,
      statusCode,
      durationMs,
      metadata,
    });
  }
}
