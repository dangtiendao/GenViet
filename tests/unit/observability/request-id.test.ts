import { describe, it, expect } from "vitest";
import {
  generateRequestId,
  sanitizeRequestId,
  attachRequestIdToHeaders,
  REQUEST_ID_HEADER,
} from "@/lib/observability/request-id";

describe("P25-T05: Request ID Correlation Tests", () => {
  it("sinh Request ID hợp lệ không rỗng", () => {
    const id = generateRequestId();
    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThanOrEqual(8);
  });

  it("giữ nguyên Request ID nhận vào nếu hợp lệ", () => {
    const validId = "req-custom-12345678";
    expect(sanitizeRequestId(validId)).toBe(validId);
  });

  it("loại bỏ và thay thế Request ID nếu chứa ký tự đặc biệt hoặc nguy cơ Header Injection", () => {
    const maliciousId = "invalid\r\nSet-Cookie: admin=true";
    const sanitized = sanitizeRequestId(maliciousId);
    expect(sanitized).not.toContain("\r");
    expect(sanitized).not.toContain("\n");
    expect(sanitized).not.toBe(maliciousId);
  });

  it("gắn Request ID vào Headers phản hồi HTTP", () => {
    const headers = new Headers();
    attachRequestIdToHeaders(headers, "req-test-12345678");
    expect(headers.get(REQUEST_ID_HEADER)).toBe("req-test-12345678");
  });
});
