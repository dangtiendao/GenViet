import { describe, it, expect } from "vitest";
import { sanitizeOAuthReturnPath } from "@/features/auth/contracts/oauth-return-path";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/constants";

describe("P29: OAuth Safe Return Path Sanitization (AC-P29-025..032)", () => {
  it("chấp nhận các đường dẫn nội bộ hợp lệ", () => {
    expect(sanitizeOAuthReturnPath("/dashboard")).toBe("/dashboard");
    expect(sanitizeOAuthReturnPath("/account")).toBe("/account");
    expect(sanitizeOAuthReturnPath("/trees/tree-uuid/history")).toBe("/trees/tree-uuid/history");
    expect(sanitizeOAuthReturnPath("/trees/123/people/456")).toBe("/trees/123/people/456");
    expect(sanitizeOAuthReturnPath("/dashboard?tab=profile&ref=onboarding")).toBe(
      "/dashboard?tab=profile&ref=onboarding"
    );
  });

  it("fallback về DEFAULT_LOGIN_REDIRECT đối với giá trị rỗng hoặc null/undefined", () => {
    expect(sanitizeOAuthReturnPath(null)).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath(undefined)).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath("")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath("   ")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("chặn đứng Open Redirect tuyệt đối (URL ngoại vi)", () => {
    expect(sanitizeOAuthReturnPath("https://evil.example.com")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath("http://evil.example.com/login")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath("ftp://attacker.com")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("chặn đứng tấn công Protocol-Relative URL", () => {
    expect(sanitizeOAuthReturnPath("//evil.example.com")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath("//google.com/dashboard")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath("///evil.example.com")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("chặn đứng tấn công Backslash bypass", () => {
    expect(sanitizeOAuthReturnPath("/\\evil.example.com")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("chặn đứng tấn công JavaScript, Data URI, VBScript", () => {
    expect(sanitizeOAuthReturnPath("javascript:alert(1)")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath("javascript://alert(1)")).toBe(DEFAULT_LOGIN_REDIRECT);
    expect(sanitizeOAuthReturnPath("data:text/html,<script>alert(1)</script>")).toBe(
      DEFAULT_LOGIN_REDIRECT
    );
    expect(sanitizeOAuthReturnPath("vbscript:msgbox(1)")).toBe(DEFAULT_LOGIN_REDIRECT);
  });

  it("chặn đứng tấn công CRLF Header Injection", () => {
    expect(sanitizeOAuthReturnPath("/dashboard\r\nSet-Cookie: session=evil")).toBe(
      DEFAULT_LOGIN_REDIRECT
    );
    expect(sanitizeOAuthReturnPath("/dashboard\nLocation: https://evil.com")).toBe(
      DEFAULT_LOGIN_REDIRECT
    );
  });
});
