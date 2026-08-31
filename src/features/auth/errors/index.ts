/**
 * GenViet Authentication Error Taxonomy (P09-T14, P29-T05..T10)
 * Maps error codes to user-friendly Vietnamese messages and retryable flags.
 */

export const AUTH_ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_EMAIL_NOT_CONFIRMED: "AUTH_EMAIL_NOT_CONFIRMED",
  AUTH_SIGNUP_FAILED: "AUTH_SIGNUP_FAILED",
  AUTH_CONFIRMATION_INVALID: "AUTH_CONFIRMATION_INVALID",
  AUTH_CONFIRMATION_EXPIRED: "AUTH_CONFIRMATION_EXPIRED",
  AUTH_RECOVERY_INVALID: "AUTH_RECOVERY_INVALID",
  AUTH_RECOVERY_EXPIRED: "AUTH_RECOVERY_EXPIRED",
  AUTH_SESSION_EXPIRED: "AUTH_SESSION_EXPIRED",
  AUTH_SESSION_INVALID: "AUTH_SESSION_INVALID",
  AUTH_RATE_LIMITED: "AUTH_RATE_LIMITED",
  AUTH_PROVIDER_ERROR: "AUTH_PROVIDER_ERROR",
  AUTH_CALLBACK_INVALID: "AUTH_CALLBACK_INVALID",
  AUTH_REDIRECT_REJECTED: "AUTH_REDIRECT_REJECTED",
  AUTH_PROFILE_PROVISION_FAILED: "AUTH_PROFILE_PROVISION_FAILED",
  AUTH_PASSWORD_UPDATE_FAILED: "AUTH_PASSWORD_UPDATE_FAILED",
  AUTH_NETWORK_ERROR: "AUTH_NETWORK_ERROR",
  AUTH_UNKNOWN_ERROR: "AUTH_UNKNOWN_ERROR",

  // Phase P29: Google OAuth Error Codes
  AUTH_PROVIDER_UNSUPPORTED: "AUTH_PROVIDER_UNSUPPORTED",
  AUTH_GOOGLE_INIT_FAILED: "AUTH_GOOGLE_INIT_FAILED",
  AUTH_OAUTH_CONFIGURATION_MISSING: "AUTH_OAUTH_CONFIGURATION_MISSING",
  AUTH_OAUTH_RETURN_PATH_INVALID: "AUTH_OAUTH_RETURN_PATH_INVALID",
  AUTH_OAUTH_CALLBACK_CODE_MISSING: "AUTH_OAUTH_CALLBACK_CODE_MISSING",
  AUTH_OAUTH_CALLBACK_INVALID: "AUTH_OAUTH_CALLBACK_INVALID",
  AUTH_OAUTH_CALLBACK_EXPIRED: "AUTH_OAUTH_CALLBACK_EXPIRED",
  AUTH_OAUTH_CALLBACK_REUSED: "AUTH_OAUTH_CALLBACK_REUSED",
  AUTH_OAUTH_CANCELLED: "AUTH_OAUTH_CANCELLED",
  AUTH_OAUTH_PROVIDER_ERROR: "AUTH_OAUTH_PROVIDER_ERROR",
  AUTH_OAUTH_SESSION_EXCHANGE_FAILED: "AUTH_OAUTH_SESSION_EXCHANGE_FAILED",
  AUTH_OAUTH_SESSION_MISSING: "AUTH_OAUTH_SESSION_MISSING",
  AUTH_OAUTH_REDIRECT_INVALID: "AUTH_OAUTH_REDIRECT_INVALID",
  AUTH_OAUTH_IDENTITY_CONFLICT: "AUTH_OAUTH_IDENTITY_CONFLICT",
  AUTH_SESSION_CLEANUP_FAILED: "AUTH_SESSION_CLEANUP_FAILED",
  AUTH_ACCOUNT_SWITCH_ISOLATION_FAILED: "AUTH_ACCOUNT_SWITCH_ISOLATION_FAILED",
  AUTH_MEMBERSHIP_ESCALATION_DETECTED: "AUTH_MEMBERSHIP_ESCALATION_DETECTED",
  AUTH_PERSON_AUTO_LINK_DETECTED: "AUTH_PERSON_AUTO_LINK_DETECTED",
  AUTH_OAUTH_SECRET_EXPOSED: "AUTH_OAUTH_SECRET_EXPOSED",
  P29_UNKNOWN_ERROR: "P29_UNKNOWN_ERROR",
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERROR_CODES;

export interface AuthErrorDetail {
  code: AuthErrorCode;
  messageVi: string;
  isRetryable: boolean;
  httpStatus: number;
}

export const AUTH_ERROR_MAP: Record<AuthErrorCode, AuthErrorDetail> = {
  AUTH_INVALID_CREDENTIALS: {
    code: "AUTH_INVALID_CREDENTIALS",
    messageVi: "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
    isRetryable: true,
    httpStatus: 401,
  },
  AUTH_EMAIL_NOT_CONFIRMED: {
    code: "AUTH_EMAIL_NOT_CONFIRMED",
    messageVi: "Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư đến.",
    isRetryable: true,
    httpStatus: 403,
  },
  AUTH_SIGNUP_FAILED: {
    code: "AUTH_SIGNUP_FAILED",
    messageVi: "Không thể tạo tài khoản vào lúc này. Vui lòng thử lại sau.",
    isRetryable: true,
    httpStatus: 400,
  },
  AUTH_CONFIRMATION_INVALID: {
    code: "AUTH_CONFIRMATION_INVALID",
    messageVi: "Liên kết xác thực email không hợp lệ hoặc đã được sử dụng.",
    isRetryable: false,
    httpStatus: 400,
  },
  AUTH_CONFIRMATION_EXPIRED: {
    code: "AUTH_CONFIRMATION_EXPIRED",
    messageVi: "Liên kết xác thực email đã hết hạn. Vui lòng yêu cầu gửi lại.",
    isRetryable: true,
    httpStatus: 410,
  },
  AUTH_RECOVERY_INVALID: {
    code: "AUTH_RECOVERY_INVALID",
    messageVi: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng.",
    isRetryable: false,
    httpStatus: 400,
  },
  AUTH_RECOVERY_EXPIRED: {
    code: "AUTH_RECOVERY_EXPIRED",
    messageVi: "Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng gửi lại yêu cầu quên mật khẩu.",
    isRetryable: true,
    httpStatus: 410,
  },
  AUTH_SESSION_EXPIRED: {
    code: "AUTH_SESSION_EXPIRED",
    messageVi: "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.",
    isRetryable: true,
    httpStatus: 401,
  },
  AUTH_SESSION_INVALID: {
    code: "AUTH_SESSION_INVALID",
    messageVi: "Phiên làm việc không hợp lệ. Vui lòng đăng nhập lại.",
    isRetryable: true,
    httpStatus: 401,
  },
  AUTH_RATE_LIMITED: {
    code: "AUTH_RATE_LIMITED",
    messageVi: "Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng chờ ít phút rồi thử lại.",
    isRetryable: true,
    httpStatus: 429,
  },
  AUTH_PROVIDER_ERROR: {
    code: "AUTH_PROVIDER_ERROR",
    messageVi: "Đã xảy ra lỗi từ dịch vụ xác thực. Vui lòng thử lại sau.",
    isRetryable: true,
    httpStatus: 502,
  },
  AUTH_CALLBACK_INVALID: {
    code: "AUTH_CALLBACK_INVALID",
    messageVi: "Yêu cầu phản hồi xác thực không hợp lệ hoặc thiếu mã xác thực.",
    isRetryable: false,
    httpStatus: 400,
  },
  AUTH_REDIRECT_REJECTED: {
    code: "AUTH_REDIRECT_REJECTED",
    messageVi: "Địa chỉ chuyển hướng không an toàn và đã bị từ chối.",
    isRetryable: false,
    httpStatus: 400,
  },
  AUTH_PROFILE_PROVISION_FAILED: {
    code: "AUTH_PROFILE_PROVISION_FAILED",
    messageVi: "Không thể khởi tạo hồ sơ người dùng. Vui lòng liên hệ hỗ trợ.",
    isRetryable: true,
    httpStatus: 500,
  },
  AUTH_PASSWORD_UPDATE_FAILED: {
    code: "AUTH_PASSWORD_UPDATE_FAILED",
    messageVi: "Không thể cập nhật mật khẩu mới. Vui lòng thử lại.",
    isRetryable: true,
    httpStatus: 400,
  },
  AUTH_NETWORK_ERROR: {
    code: "AUTH_NETWORK_ERROR",
    messageVi: "Lỗi kết nối mạng. Vui lòng kiểm tra đường truyền và thử lại.",
    isRetryable: true,
    httpStatus: 503,
  },
  AUTH_UNKNOWN_ERROR: {
    code: "AUTH_UNKNOWN_ERROR",
    messageVi: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.",
    isRetryable: true,
    httpStatus: 500,
  },

  // P29 Mappings
  AUTH_PROVIDER_UNSUPPORTED: {
    code: "AUTH_PROVIDER_UNSUPPORTED",
    messageVi: "Phương thức đăng nhập không được hỗ trợ.",
    isRetryable: false,
    httpStatus: 400,
  },
  AUTH_GOOGLE_INIT_FAILED: {
    code: "AUTH_GOOGLE_INIT_FAILED",
    messageVi: "Không thể khởi tạo kết nối đăng nhập với Google. Vui lòng thử lại.",
    isRetryable: true,
    httpStatus: 500,
  },
  AUTH_OAUTH_CONFIGURATION_MISSING: {
    code: "AUTH_OAUTH_CONFIGURATION_MISSING",
    messageVi:
      "Dịch vụ đăng nhập xã hội chưa được cấu hình đầy đủ. Vui lòng liên hệ quản trị viên.",
    isRetryable: false,
    httpStatus: 503,
  },
  AUTH_OAUTH_RETURN_PATH_INVALID: {
    code: "AUTH_OAUTH_RETURN_PATH_INVALID",
    messageVi: "Đường dẫn chuyển hướng sau đăng nhập không an toàn.",
    isRetryable: false,
    httpStatus: 400,
  },
  AUTH_OAUTH_CALLBACK_CODE_MISSING: {
    code: "AUTH_OAUTH_CALLBACK_CODE_MISSING",
    messageVi: "Phản hồi xác thực thiếu mã ủy quyền.",
    isRetryable: true,
    httpStatus: 400,
  },
  AUTH_OAUTH_CALLBACK_INVALID: {
    code: "AUTH_OAUTH_CALLBACK_INVALID",
    messageVi: "Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
    isRetryable: true,
    httpStatus: 400,
  },
  AUTH_OAUTH_CALLBACK_EXPIRED: {
    code: "AUTH_OAUTH_CALLBACK_EXPIRED",
    messageVi: "Phiên xác thực đã hết hạn. Vui lòng thử lại.",
    isRetryable: true,
    httpStatus: 410,
  },
  AUTH_OAUTH_CALLBACK_REUSED: {
    code: "AUTH_OAUTH_CALLBACK_REUSED",
    messageVi: "Mã xác thực này đã được sử dụng. Vui lòng khởi tạo đăng nhập mới.",
    isRetryable: true,
    httpStatus: 400,
  },
  AUTH_OAUTH_CANCELLED: {
    code: "AUTH_OAUTH_CANCELLED",
    messageVi: "Bạn đã hủy quá trình đăng nhập bằng Google.",
    isRetryable: true,
    httpStatus: 200,
  },
  AUTH_OAUTH_PROVIDER_ERROR: {
    code: "AUTH_OAUTH_PROVIDER_ERROR",
    messageVi: "Đã xảy ra lỗi từ dịch vụ Google. Vui lòng thử lại.",
    isRetryable: true,
    httpStatus: 502,
  },
  AUTH_OAUTH_SESSION_EXCHANGE_FAILED: {
    code: "AUTH_OAUTH_SESSION_EXCHANGE_FAILED",
    messageVi: "Không thể thiết lập phiên đăng nhập an toàn. Vui lòng thử lại.",
    isRetryable: true,
    httpStatus: 500,
  },
  AUTH_OAUTH_SESSION_MISSING: {
    code: "AUTH_OAUTH_SESSION_MISSING",
    messageVi: "Không tìm thấy thông tin phiên đăng nhập sau xác thực.",
    isRetryable: true,
    httpStatus: 401,
  },
  AUTH_OAUTH_REDIRECT_INVALID: {
    code: "AUTH_OAUTH_REDIRECT_INVALID",
    messageVi: "Địa chỉ điều hướng sau xác thực không hợp lệ.",
    isRetryable: false,
    httpStatus: 400,
  },
  AUTH_OAUTH_IDENTITY_CONFLICT: {
    code: "AUTH_OAUTH_IDENTITY_CONFLICT",
    messageVi: "Tài khoản có xung đột định danh. Vui lòng liên hệ hỗ trợ.",
    isRetryable: false,
    httpStatus: 409,
  },
  AUTH_SESSION_CLEANUP_FAILED: {
    code: "AUTH_SESSION_CLEANUP_FAILED",
    messageVi: "Quá trình dọn dẹp phiên làm việc gặp sự cố. Vui lòng tải lại trang.",
    isRetryable: true,
    httpStatus: 500,
  },
  AUTH_ACCOUNT_SWITCH_ISOLATION_FAILED: {
    code: "AUTH_ACCOUNT_SWITCH_ISOLATION_FAILED",
    messageVi:
      "Không thể chuyển đổi tài khoản an toàn. Vui lòng đăng xuất hoàn toàn và đăng nhập lại.",
    isRetryable: true,
    httpStatus: 500,
  },
  AUTH_MEMBERSHIP_ESCALATION_DETECTED: {
    code: "AUTH_MEMBERSHIP_ESCALATION_DETECTED",
    messageVi: "Yêu cầu quyền truy cập không hợp lệ và đã bị ngăn chặn.",
    isRetryable: false,
    httpStatus: 403,
  },
  AUTH_PERSON_AUTO_LINK_DETECTED: {
    code: "AUTH_PERSON_AUTO_LINK_DETECTED",
    messageVi: "Không thể tự động liên kết hồ sơ nhân vật.",
    isRetryable: false,
    httpStatus: 403,
  },
  AUTH_OAUTH_SECRET_EXPOSED: {
    code: "AUTH_OAUTH_SECRET_EXPOSED",
    messageVi: "Lỗi bảo mật cấu hình. Yêu cầu đã bị hủy bỏ.",
    isRetryable: false,
    httpStatus: 500,
  },
  P29_UNKNOWN_ERROR: {
    code: "P29_UNKNOWN_ERROR",
    messageVi: "Đã xảy ra sự cố trong quá trình xác thực Google. Vui lòng thử lại.",
    isRetryable: true,
    httpStatus: 500,
  },
};

/**
 * Maps raw error message or Supabase error to a safe AuthErrorDetail object.
 */
export function mapAuthError(rawError?: unknown): AuthErrorDetail {
  if (!rawError) {
    return AUTH_ERROR_MAP.AUTH_UNKNOWN_ERROR;
  }

  const message =
    typeof rawError === "object" && rawError !== null && "message" in rawError
      ? String((rawError as { message: unknown }).message).toLowerCase()
      : String(rawError).toLowerCase();

  if (message.includes("invalid login credentials") || message.includes("invalid credentials")) {
    return AUTH_ERROR_MAP.AUTH_INVALID_CREDENTIALS;
  }
  if (message.includes("email not confirmed")) {
    return AUTH_ERROR_MAP.AUTH_EMAIL_NOT_CONFIRMED;
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return AUTH_ERROR_MAP.AUTH_RATE_LIMITED;
  }
  if (message.includes("token has expired") || message.includes("otp expired")) {
    return AUTH_ERROR_MAP.AUTH_CONFIRMATION_EXPIRED;
  }
  if (
    message.includes("access_denied") ||
    message.includes("user_cancelled") ||
    message.includes("cancelled")
  ) {
    return AUTH_ERROR_MAP.AUTH_OAUTH_CANCELLED;
  }
  if (
    message.includes("pkce") ||
    message.includes("code verifier") ||
    message.includes("bad_code") ||
    message.includes("invalid_grant")
  ) {
    return AUTH_ERROR_MAP.AUTH_OAUTH_CALLBACK_INVALID;
  }
  if (
    message.includes("provider") &&
    (message.includes("disabled") || message.includes("unsupported"))
  ) {
    return AUTH_ERROR_MAP.AUTH_PROVIDER_UNSUPPORTED;
  }
  if (message.includes("fetch failed") || message.includes("network")) {
    return AUTH_ERROR_MAP.AUTH_NETWORK_ERROR;
  }

  return AUTH_ERROR_MAP.AUTH_UNKNOWN_ERROR;
}
