import { LogEvent, LogLevel } from "./log-event.schema";
import { redactData, sanitizeLogString, scrubString } from "./redact";
import { generateRequestId, sanitizeRequestId } from "./request-id";
import { normalizeError } from "./error-normalizer";

const LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

export interface LogOptions {
  event: string;
  message: string;
  requestId?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  errorCode?: string;
  error?: unknown;
  metadata?: Record<string, any>;
  source?: string;
}

class StructuredLogger {
  private currentLevel: LogLevel = "info";
  private environment: "development" | "preview" | "production" | "test" = "development";
  private release: string = "v0.1.0";

  constructor() {
    this.environment =
      (process.env.VERCEL_ENV as any) || (process.env.NODE_ENV as any) || "development";

    if (process.env.LOG_LEVEL && process.env.LOG_LEVEL in LEVEL_SEVERITY) {
      this.currentLevel = process.env.LOG_LEVEL as LogLevel;
    } else if (this.environment === "development" || this.environment === "test") {
      this.currentLevel = "debug";
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_SEVERITY[level] >= LEVEL_SEVERITY[this.currentLevel];
  }

  private emit(level: LogLevel, options: LogOptions): void {
    if (!this.shouldLog(level)) return;

    try {
      let combinedMetadata = options.metadata ? { ...options.metadata } : {};

      if (options.error) {
        const normalized = normalizeError(options.error, options.errorCode);
        combinedMetadata.error = normalized;
        if (!options.errorCode && normalized.code) {
          options.errorCode = normalized.code;
        }
      }

      const logPayload: LogEvent = {
        timestamp: new Date().toISOString(),
        level,
        event: sanitizeLogString(options.event),
        message: scrubString(options.message),
        requestId: sanitizeRequestId(options.requestId || generateRequestId()),
        environment: this.environment,
        release: this.release,
        runtime: typeof window !== "undefined" ? "browser" : "nodejs",
        route: options.route ? sanitizeLogString(options.route) : undefined,
        method: options.method ? sanitizeLogString(options.method).toUpperCase() : undefined,
        statusCode: options.statusCode,
        durationMs: options.durationMs !== undefined ? Math.max(0, options.durationMs) : undefined,
        errorCode: options.errorCode ? sanitizeLogString(options.errorCode) : undefined,
        source: options.source ? sanitizeLogString(options.source) : undefined,
        metadata:
          Object.keys(combinedMetadata).length > 0 ? redactData(combinedMetadata) : undefined,
      };

      const jsonLine = JSON.stringify(logPayload);

      switch (level) {
        case "debug":
          console.debug(jsonLine);
          break;
        case "info":
          console.info(jsonLine);
          break;
        case "warn":
          console.warn(jsonLine);
          break;
        case "error":
        case "fatal":
          console.error(jsonLine);
          break;
      }
    } catch {
      // Fallback an toàn: Không bao giờ làm sập ứng dụng nếu quá trình log xảy ra lỗi
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          event: "observability.log_serialization_failed",
          message: "Failed to serialize structured log event",
        })
      );
    }
  }

  public debug(options: LogOptions): void {
    this.emit("debug", options);
  }

  public info(options: LogOptions): void {
    this.emit("info", options);
  }

  public warn(options: LogOptions): void {
    this.emit("warn", options);
  }

  public error(options: LogOptions): void {
    this.emit("error", options);
  }

  public fatal(options: LogOptions): void {
    this.emit("fatal", options);
  }
}

export const logger = new StructuredLogger();
