/**
 * Quản lý và lan truyền Request ID (P25-T05)
 * Hỗ trợ liên kết (correlation) xuyên suốt từ Client -> Middleware -> Server Route -> Log -> Error Event.
 */

export const REQUEST_ID_HEADER = "x-request-id";
const VALID_REQUEST_ID_REGEX = /^[a-zA-Z0-9_-]{8,64}$/;

/**
 * Sinh Request ID mới an toàn bằng Crypto UUID
 */
export function generateRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback ngẫu nhiên nếu môi trường cũ
  return `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Xác thực và chuẩn hóa Request ID từ header nhận vào
 * Ngăn chặn header injection attacks hoặc chuỗi quá dài.
 */
export function sanitizeRequestId(incoming?: string | null): string {
  if (!incoming || typeof incoming !== "string") {
    return generateRequestId();
  }

  const trimmed = incoming.trim();
  if (VALID_REQUEST_ID_REGEX.test(trimmed)) {
    return trimmed;
  }

  // Nếu không hợp lệ hoặc chứa ký tự đặc biệt nguy hiểm, sinh ID mới
  return generateRequestId();
}

/**
 * Gắn Request ID vào Header phản hồi HTTP
 */
export function attachRequestIdToHeaders(
  headers: Headers | Record<string, string>,
  requestId: string
): void {
  const sanitized = sanitizeRequestId(requestId);
  if (headers instanceof Headers) {
    headers.set(REQUEST_ID_HEADER, sanitized);
  } else if (typeof headers === "object" && headers !== null) {
    headers[REQUEST_ID_HEADER] = sanitized;
  }
}
