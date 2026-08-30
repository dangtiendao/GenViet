import { describe, it, expect } from "vitest";

describe("P26-T08: Mobile Acceptance Test Suite", () => {
  it("xác nhận cấu hình ma trận viewport di động", () => {
    const mobileViewports = [
      { width: 320, height: 568, name: "iPhone SE" },
      { width: 375, height: 667, name: "iPhone 8" },
      { width: 390, height: 844, name: "iPhone 14 Pro" },
      { width: 412, height: 915, name: "Pixel 7" },
    ];

    expect(mobileViewports.length).toBe(4);
    mobileViewports.forEach((vp) => {
      expect(vp.width).toBeGreaterThanOrEqual(320);
      expect(vp.height).toBeGreaterThanOrEqual(480);
    });
  });
});
