import { describe, it, expect } from "vitest";
import { getSafeRedirectUrl } from "@/lib/auth/redirects";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/constants";

describe("Safe Redirect Helper Tests (P09-T09 / AC-P09-089..091)", () => {
  it("should allow valid internal relative path", () => {
    expect(getSafeRedirectUrl("/dashboard")).toBe("/dashboard");
    expect(getSafeRedirectUrl("/account")).toBe("/account");
    expect(getSafeRedirectUrl("/dashboard?tab=profile")).toBe("/dashboard?tab=profile");
  });

  it("should fallback to default for null or empty string", () => {
    expect(getSafeRedirectUrl(null)).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(getSafeRedirectUrl(undefined)).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(getSafeRedirectUrl("")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(getSafeRedirectUrl("   ")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("should reject external absolute URLs (Open Redirect)", () => {
    expect(getSafeRedirectUrl("https://attacker.example")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(getSafeRedirectUrl("http://attacker.example/malicious")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(getSafeRedirectUrl("javascript:alert(1)")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(getSafeRedirectUrl("data:text/html,malicious")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("should reject protocol-relative URLs", () => {
    expect(getSafeRedirectUrl("//attacker.example")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(getSafeRedirectUrl("//google.com/dashboard")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("should reject backslash tricks", () => {
    expect(getSafeRedirectUrl("/\\attacker.example")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("should reject CRLF injection", () => {
    expect(getSafeRedirectUrl("/dashboard\r\nSet-Cookie: evil=1")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(getSafeRedirectUrl("/dashboard\nLocation: http://evil.com")).toBe(
      DEFAULT_LOGIN_REDIRECT
    );
  });
});
