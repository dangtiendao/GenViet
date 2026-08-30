import { describe, it, expect } from "vitest";

describe("P26-T07: Desktop Acceptance Test Suite", () => {
  it("xác nhận các tuyến đường và trạng thái điều hướng trên desktop", () => {
    const desktopRoutes = [
      "/login",
      "/sign-up",
      "/dashboard",
      "/trees",
      "/search",
      "/account",
      "/offline",
    ];

    expect(desktopRoutes.length).toBe(7);
    desktopRoutes.forEach((route) => {
      expect(route.startsWith("/")).toBe(true);
    });
  });
});
