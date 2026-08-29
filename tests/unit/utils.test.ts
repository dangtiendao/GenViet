import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utility function cn", () => {
  it("should merge basic class names correctly", () => {
    const result = cn("px-4", "py-2", "text-sm");
    expect(result).toBe("px-4 py-2 text-sm");
  });

  it("should handle conditional class names properly", () => {
    const isPrimary = true;
    const isSecondary = false;
    const result = cn("btn", isPrimary && "btn-primary", isSecondary && "btn-secondary");
    expect(result).toBe("btn btn-primary");
  });

  it("should resolve Tailwind class conflicts with tailwind-merge", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle empty or undefined inputs gracefully", () => {
    const result = cn("base-class", undefined, null, false, "");
    expect(result).toBe("base-class");
  });
});
