import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Input } from "@/components/ui/input";

describe("Input UI Primitive Tests (P10-T06 / AC-P10-035..045)", () => {
  it("should render standard input with proper base styling", () => {
    const html = renderToStaticMarkup(<Input placeholder="Nhập họ tên" />);
    expect(html).toContain('placeholder="Nhập họ tên"');
    expect(html).toContain("border-neutral-300");
  });

  it("should render aria-invalid and red border when error is true", () => {
    const html = renderToStaticMarkup(<Input error defaultValue="Invalid email" />);
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("border-red-500");
  });

  it("should support disabled state", () => {
    const html = renderToStaticMarkup(<Input disabled />);
    expect(html).toContain('disabled=""');
    expect(html).toContain("disabled:opacity-50");
  });
});
