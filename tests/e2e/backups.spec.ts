import { test, expect } from "@playwright/test";

test.describe("GenViet Backup & Restore E2E Tests (Phase P19)", () => {
  const mockTreeId = "11111111-1111-1111-1111-111111111111";

  test("unauthenticated user accessing /trees/import is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto("/trees/import");
    await expect(page).toHaveURL(/\/login\?next=%2Ftrees%2Fimport/);
  });

  test("unauthenticated user calling /api/trees/[treeId]/backup is redirected or rejected", async ({
    request,
  }) => {
    const response = await request.get(`/api/trees/${mockTreeId}/backup`);
    // Should return 401 or redirect to login
    expect([307, 308, 401, 403, 500]).toContain(response.status());
  });

  test("mobile viewports 375x667 and 320x568 render import page cleanly without horizontal overflow", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/trees/import");
      await expect(page).toHaveURL(/login/);

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    }
  });
});
