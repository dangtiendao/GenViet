import { test, expect } from "@playwright/test";

test.describe("P22-T28: Mobile Viewport & Device Matrix E2E Tests", () => {
  const viewports = [
    { name: "iPhone SE 1st gen (Narrow 320px)", width: 320, height: 568 },
    { name: "iPhone SE 2nd/3rd gen (375px)", width: 375, height: 667 },
    { name: "iPhone 12/13/14 Pro (390px)", width: 390, height: 844 },
    { name: "Google Pixel 7 / Android (412px)", width: 412, height: 915 },
  ];

  const publicRoutes = ["/login", "/sign-up", "/forgot-password", "/offline", "/ui-preview"];

  for (const vp of viewports) {
    test.describe(`Device Profile: ${vp.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
      });

      for (const route of publicRoutes) {
        test(`route ${route} renders without horizontal scroll on ${vp.name}`, async ({ page }) => {
          await page.goto(route);

          const hasHorizontalScroll = await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth
          );
          expect(hasHorizontalScroll).toBe(false);
        });
      }
    });
  }
});
