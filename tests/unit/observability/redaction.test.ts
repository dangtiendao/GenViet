import { describe, it, expect } from "vitest";
import {
  redactData,
  sanitizeLogString,
  scrubString,
  isSensitiveKey,
} from "@/lib/observability/redact";

describe("P25-T03: Privacy Redaction & Sanitization Tests", () => {
  it("nhận diện chính xác các khóa nhạy cảm trong denylist", () => {
    expect(isSensitiveKey("password")).toBe(true);
    expect(isSensitiveKey("user_password")).toBe(true);
    expect(isSensitiveKey("SUPABASE_SERVICE_ROLE_KEY")).toBe(true);
    expect(isSensitiveKey("authToken")).toBe(true);
    expect(isSensitiveKey("otpCode")).toBe(true);
    expect(isSensitiveKey("signedUrl")).toBe(true);
    expect(isSensitiveKey("biography")).toBe(true);
    expect(isSensitiveKey("requestId")).toBe(false);
    expect(isSensitiveKey("statusCode")).toBe(false);
  });

  it("làm sạch các chuỗi chứa Signed URLs và Bearer Tokens", () => {
    const signedUrl =
      "https://supabase.co/storage/v1/object/sign/avatars/123.jpg?token=secret123&apiKey=anon";
    const scrubbed = scrubString(signedUrl);
    expect(scrubbed).toContain("[REDACTED]");
    expect(scrubbed).not.toContain("secret123");

    const bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz";
    expect(scrubString(bearer)).toBe("Bearer [REDACTED]");
  });

  it("loại bỏ ký tự xuống dòng (CRLF) ngăn chặn Log Injection", () => {
    const maliciousInput = "User Login\r\n[ERROR] Fake Log Injected\nNext Line";
    const sanitized = sanitizeLogString(maliciousInput);
    expect(sanitized).not.toContain("\r");
    expect(sanitized).not.toContain("\n");
    expect(sanitized).toBe("User Login  [ERROR] Fake Log Injected Next Line");
  });

  it("lọc đệ quy đối tượng metadata mà không làm biến đổi (mutate) đối tượng gốc", () => {
    const original = {
      userId: "user-123",
      password: "SuperSecretPassword123!",
      session: {
        token: "jwt-token-456",
        refreshToken: "refresh-token-789",
      },
      treeName: "Gia Phả Họ Nguyễn",
      biography: "Tiểu sử chi tiết rất dài...",
    };

    const redacted = redactData(original);

    // Kiểm tra đối tượng kết quả đã được lọc
    expect(redacted.userId).toBe("user-123");
    expect(redacted.password).toBe("[REDACTED]");
    expect(redacted.session.token).toBe("[REDACTED]");
    expect(redacted.session.refreshToken).toBe("[REDACTED]");
    expect(redacted.biography).toBe("[REDACTED]");

    // Đảm bảo không mutate object gốc
    expect(original.password).toBe("SuperSecretPassword123!");
    expect(original.session.token).toBe("jwt-token-456");
  });

  it("xử lý an toàn đối tượng có tham chiếu vòng (Circular Reference)", () => {
    const circularObj: any = { name: "Test" };
    circularObj.self = circularObj;

    const result = redactData(circularObj);
    expect(result.name).toBe("Test");
    expect(result.self).toBe("[CIRCULAR_REFERENCE]");
  });
});
