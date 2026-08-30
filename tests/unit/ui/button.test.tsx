import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, buttonVariants } from "@/components/ui/button";

describe("Button UI Primitive Tests (P10-T05 / AC-P10-021..034)", () => {
  it("should generate proper classes for default variant and size", () => {
    const html = renderToStaticMarkup(<Button>Test Button</Button>);
    expect(html).toContain("bg-emerald-700");
    expect(html).toContain("text-white");
    expect(html).toContain("Test Button");
  });

  it("should generate proper classes for destructive variant", () => {
    const html = renderToStaticMarkup(<Button variant="destructive">Delete</Button>);
    expect(html).toContain("bg-red-600");
    expect(html).toContain("Delete");
  });

  it("should render loading spinner and aria-busy when loading is true", () => {
    const html = renderToStaticMarkup(<Button loading>Saving</Button>);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("animate-spin");
    expect(html).toContain('disabled=""');
  });

  it("should support asChild rendering without creating double button elements", () => {
    const html = renderToStaticMarkup(
      <Button asChild>
        <a href="/dashboard">Dashboard Link</a>
      </Button>
    );
    expect(html).toContain('<a href="/dashboard"');
    expect(html).toContain("bg-emerald-700");
    expect(html).not.toContain("<button");
  });
});
