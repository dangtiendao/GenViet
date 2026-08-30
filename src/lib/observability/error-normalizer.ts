import { scrubString, sanitizeLogString } from "./redact";

export interface NormalizedError {
  name: string;
  message: string;
  code: string;
  stack?: string;
  statusCode?: number;
  retryable?: boolean;
}

/**
 * Chuẩn hóa các đối tượng lỗi bất kỳ thành cấu trúc lỗi an toàn
 * Loại bỏ thông tin nhạy cảm trước khi đưa vào hệ thống log hoặc error tracking.
 */
export function normalizeError(
  error: unknown,
  fallbackCode: string = "INTERNAL_ERROR"
): NormalizedError {
  if (!error) {
    return {
      name: "UnknownError",
      message: "An unknown error occurred",
      code: fallbackCode,
    };
  }

  if (typeof error === "string") {
    return {
      name: "Error",
      message: scrubString(error),
      code: fallbackCode,
    };
  }

  if (error instanceof Error) {
    const customCode = (error as any).code || (error as any).errorCode || fallbackCode;
    const statusCode = (error as any).statusCode || (error as any).status;
    const retryable = (error as any).retryable;

    return {
      name: sanitizeLogString(error.name || "Error"),
      message: scrubString(error.message),
      code: sanitizeLogString(String(customCode)),
      stack: error.stack ? scrubString(error.stack, 2000) : undefined,
      statusCode: typeof statusCode === "number" ? statusCode : undefined,
      retryable: typeof retryable === "boolean" ? retryable : undefined,
    };
  }

  if (typeof error === "object") {
    const obj = error as Record<string, any>;
    const message = obj.message || obj.error_description || obj.error || JSON.stringify(obj);
    const code = obj.code || obj.errorCode || fallbackCode;
    const statusCode = obj.statusCode || obj.status;

    return {
      name: sanitizeLogString(obj.name || "ObjectError"),
      message: scrubString(String(message)),
      code: sanitizeLogString(String(code)),
      statusCode: typeof statusCode === "number" ? statusCode : undefined,
    };
  }

  return {
    name: "UnhandledType",
    message: scrubString(String(error)),
    code: fallbackCode,
  };
}
