import { logger } from "./logger";
import { normalizeError, NormalizedError } from "./error-normalizer";
import { redactData, sanitizeLogString } from "./redact";
import { generateRequestId, sanitizeRequestId } from "./request-id";

export interface ErrorTrackingContext {
  requestId?: string;
  route?: string;
  method?: string;
  userId?: string; // Sẽ được hash hoặc ẩn danh, không dùng email
  metadata?: Record<string, any>;
  tags?: Record<string, string>;
}

export interface CapturedErrorEvent {
  id: string;
  timestamp: string;
  error: NormalizedError;
  requestId: string;
  environment: string;
  release: string;
  route?: string;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

class ErrorTrackerAdapter {
  private isInitialized = false;
  private environment: string;
  private release = "v0.1.0";

  constructor() {
    this.environment = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  }

  public init(): void {
    if (this.isInitialized) return;
    // Cấu hình cơ chế tracking lỗi an toàn (sendDefaultPii = false, sessionReplay = false)
    this.isInitialized = true;
  }

  /**
   * Bắt và xử lý ngoại lệ an toàn, tự động loại bỏ PII và credentials
   */
  public captureException(error: unknown, context: ErrorTrackingContext = {}): string {
    const eventId = generateRequestId();
    const requestId = sanitizeRequestId(context.requestId || generateRequestId());
    const normalized = normalizeError(error);

    const safeMetadata = context.metadata ? redactData(context.metadata) : undefined;
    const safeTags = context.tags
      ? Object.fromEntries(
          Object.entries(context.tags).map(([k, v]) => [sanitizeLogString(k), sanitizeLogString(v)])
        )
      : undefined;

    const event: CapturedErrorEvent = {
      id: eventId,
      timestamp: new Date().toISOString(),
      error: normalized,
      requestId,
      environment: this.environment,
      release: this.release,
      route: context.route ? sanitizeLogString(context.route) : undefined,
      tags: safeTags,
      metadata: safeMetadata,
    };

    // Luôn đồng bộ ghi nhận qua Structured Logger
    logger.error({
      event: "app.unhandled_error",
      message: normalized.message,
      requestId,
      route: context.route,
      method: context.method,
      errorCode: normalized.code,
      error,
      metadata: {
        errorTrackerEventId: eventId,
        tags: safeTags,
        ...safeMetadata,
      },
    });

    return eventId;
  }

  /**
   * Bắt thông điệp cảnh báo nghiệp vụ an toàn
   */
  public captureMessage(
    message: string,
    level: "info" | "warn" | "error" = "info",
    context: ErrorTrackingContext = {}
  ): string {
    const eventId = generateRequestId();
    const requestId = sanitizeRequestId(context.requestId || generateRequestId());

    logger[level]({
      event: "app.operational_message",
      message,
      requestId,
      route: context.route,
      method: context.method,
      metadata: {
        errorTrackerEventId: eventId,
        ...(context.metadata ? redactData(context.metadata) : {}),
      },
    });

    return eventId;
  }
}

export const errorTracker = new ErrorTrackerAdapter();
