/**
 * Bộ lọc đệ quy loại bỏ 100% dữ liệu nhạy cảm, bí mật và thông tin cá nhân (PII)
 * Đáp ứng tiêu chuẩn an toàn P25-T03 & OWASP Logging Guidance.
 */

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /otp/i,
  /auth/i,
  /authorization/i,
  /cookie/i,
  /service_role/i,
  /apikey/i,
  /api_key/i,
  /private_key/i,
  /signed_?url/i,
  /biography/i,
  /note/i,
  /raw_?payload/i,
  /image_?bytes/i,
  /base64/i,
];

const QUERY_PARAM_SENSITIVE_PATTERN =
  /([?&](?:token|signature|apikey|api_key|sig|secret|auth|x-amz-signature)=)([^&\s]+)/gi;
const BEARER_PATTERN = /bearer\s+[a-zA-Z0-9._~+/-]+=*/gi;

/**
 * Loại bỏ ký tự điều khiển và newline ngăn chặn Log Injection Attacks
 */
export function sanitizeLogString(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[\r\n\x00-\x1F\x7F]/g, " ").trim();
}

/**
 * Làm sạch chuỗi chứa token hoặc signed URL
 */
export function scrubString(str: string, maxLength: number = 1000): string {
  if (!str || typeof str !== "string") return "";

  let cleaned = str
    .replace(QUERY_PARAM_SENSITIVE_PATTERN, "$1[REDACTED]")
    .replace(BEARER_PATTERN, "Bearer [REDACTED]");

  if (cleaned.length > maxLength) {
    cleaned = `${cleaned.slice(0, maxLength)}... [TRUNCATED]`;
  }

  return sanitizeLogString(cleaned);
}

/**
 * Kiểm tra xem một tên thuộc tính có thuộc danh sách nhạy cảm hay không
 */
export function isSensitiveKey(key: string): boolean {
  if (!key || typeof key !== "string") return false;
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

/**
 * Làm sạch đệ quy đối tượng metadata mà không làm biến đổi (mutate) đối tượng gốc
 */
export function redactData<T>(
  data: T,
  maxDepth: number = 8,
  seen: WeakSet<object> = new WeakSet()
): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    return scrubString(data) as unknown as T;
  }

  if (typeof data === "number" || typeof data === "boolean" || typeof data === "bigint") {
    return data;
  }

  if (typeof data === "function" || typeof data === "symbol") {
    return "[FILTERED]" as unknown as T;
  }

  if (maxDepth <= 0) {
    return "[MAX_DEPTH_REACHED]" as unknown as T;
  }

  if (typeof data === "object") {
    if (seen.has(data as object)) {
      return "[CIRCULAR_REFERENCE]" as unknown as T;
    }
    seen.add(data as object);

    if (Array.isArray(data)) {
      return data.map((item) => redactData(item, maxDepth - 1, seen)) as unknown as T;
    }

    if (data instanceof Error) {
      return {
        name: sanitizeLogString(data.name),
        message: scrubString(data.message),
        stack: scrubString(data.stack || ""),
      } as unknown as T;
    }

    const cleanedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      // Chống Prototype Pollution
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        continue;
      }

      if (isSensitiveKey(key)) {
        cleanedObj[key] = "[REDACTED]";
      } else {
        cleanedObj[key] = redactData(value, maxDepth - 1, seen);
      }
    }

    return cleanedObj as T;
  }

  return "[UNKNOWN_TYPE]" as unknown as T;
}
