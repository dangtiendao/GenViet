import { describe, it, expect } from "vitest";
import { MAIN_NAVIGATION } from "@/config/navigation";

describe("Navigation Configuration & Structure Tests (P10-T16..T19 / AC-P10-114..153)", () => {
  it("should have at least 4 items in main navigation", () => {
    expect(MAIN_NAVIGATION.length).toBeGreaterThanOrEqual(4);
  });

  it("should have unique keys and valid Vietnamese labels", () => {
    const keys = new Set<string>();
    MAIN_NAVIGATION.forEach((item) => {
      expect(keys.has(item.key)).toBe(false);
      keys.add(item.key);
      expect(item.label).toBeTruthy();
      expect(item.href).toMatch(/^\/[a-zA-Z0-9_-]*$/);
    });
  });

  it("should have no more than 5 mobile navigation items to avoid layout crowding", () => {
    const mobileItems = MAIN_NAVIGATION.filter((i) => i.showInMobileNav);
    expect(mobileItems.length).toBeLessThanOrEqual(5);
    expect(mobileItems.length).toBeGreaterThanOrEqual(3);
  });
});
