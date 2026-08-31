import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppHeader } from "@/components/layout/app-header";

describe("AppHeader Component & Logout Structure (P29 Regression Safeguard)", () => {
  it("renders user information and accessible sign-out button properly", () => {
    const html = renderToStaticMarkup(
      <AppHeader displayName="Nguyễn Văn A" email="vana@example.com" />
    );

    expect(html).toContain("Nguyễn Văn A");
    expect(html).toContain("vana@example.com");
    expect(html).toContain("Đăng xuất");
    expect(html).toContain('aria-label="Đăng xuất khỏi tài khoản"');
    expect(html).toContain('type="button"');
  });

  it("renders fallback display name when display name is null", () => {
    const html = renderToStaticMarkup(<AppHeader displayName={null} email="member@example.com" />);

    expect(html).toContain("member");
    expect(html).toContain("member@example.com");
    expect(html).toContain("Đăng xuất");
  });
});
