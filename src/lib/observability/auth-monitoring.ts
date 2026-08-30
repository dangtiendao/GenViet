import { logger } from "./logger";
import { errorTracker } from "./error-tracker";

export type AuthFailureType =
  | "login_rejected"
  | "callback_failed"
  | "session_refresh_failed"
  | "logout_failed"
  | "system_failure";

/**
 * Ghi nhận sự cố xác thực mà tuyệt đối không log mật khẩu, token hoặc email (P25-T08)
 */
export function recordAuthFailure(options: {
  type: AuthFailureType;
  errorCode: string;
  message: string;
  requestId?: string;
  route?: string;
  error?: unknown;
}): void {
  const { type, errorCode, message, requestId, route, error } = options;

  if (type === "system_failure" || type === "callback_failed") {
    logger.error({
      event: `auth.${type}`,
      message: `Auth failure: ${message}`,
      requestId,
      route,
      errorCode,
      error,
    });

    if (error) {
      errorTracker.captureException(error, {
        requestId,
        route,
        tags: { authFailureType: type, errorCode },
      });
    }
  } else {
    // Các lỗi thông thường như sai thông tin đăng nhập (expected rejection) chỉ log ở mức warn
    logger.warn({
      event: `auth.${type}`,
      message: `Auth operation rejected: ${message}`,
      requestId,
      route,
      errorCode,
    });
  }
}
