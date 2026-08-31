import { describe, it, expect } from "vitest";
import { AUTH_ERROR_CODES, AUTH_ERROR_MAP, mapAuthError } from "@/features/auth/errors";

describe("Auth Error Taxonomy Tests (P09-T14, P29-T05 / AC-P09-133..141, AC-P29-023)", () => {
  it("should have all defined error codes mapped with user-safe Vietnamese messages", () => {
    const errorCodes = Object.keys(AUTH_ERROR_CODES);
    expect(errorCodes.length).toBe(37);

    errorCodes.forEach((code) => {
      const detail = AUTH_ERROR_MAP[code as keyof typeof AUTH_ERROR_CODES];
      expect(detail).toBeDefined();
      expect(detail.messageVi).toBeTruthy();
      expect(typeof detail.isRetryable).toBe("boolean");
      expect(typeof detail.httpStatus).toBe("number");
    });
  });

  it("should map invalid credentials safely", () => {
    const error = mapAuthError(new Error("Invalid login credentials"));
    expect(error.code).toBe(AUTH_ERROR_CODES.AUTH_INVALID_CREDENTIALS);
    expect(error.messageVi).toContain("Email hoặc mật khẩu không chính xác");
  });

  it("should map email not confirmed safely", () => {
    const error = mapAuthError(new Error("Email not confirmed"));
    expect(error.code).toBe(AUTH_ERROR_CODES.AUTH_EMAIL_NOT_CONFIRMED);
    expect(error.messageVi).toContain("chưa được xác thực");
  });

  it("should map rate limit safely", () => {
    const error = mapAuthError(new Error("Too many requests / rate limit exceeded"));
    expect(error.code).toBe(AUTH_ERROR_CODES.AUTH_RATE_LIMITED);
    expect(error.messageVi).toContain("quá nhiều yêu cầu");
  });

  it("should map OAuth cancelled safely", () => {
    const error = mapAuthError(new Error("User access_denied by user_cancelled"));
    expect(error.code).toBe(AUTH_ERROR_CODES.AUTH_OAUTH_CANCELLED);
    expect(error.messageVi).toContain("hủy");
  });

  it("should fallback to unknown error for unrecognized error", () => {
    const error = mapAuthError(new Error("Some internal database crash"));
    expect(error.code).toBe(AUTH_ERROR_CODES.AUTH_UNKNOWN_ERROR);
    expect(error.messageVi).toBe("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
  });
});
