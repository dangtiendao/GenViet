import { test, expect } from "@playwright/test";

test.describe("GenViet Tree Visualization E2E Tests (Phase P15)", () => {
  const mockTreeId = "11111111-1111-1111-1111-111111111111";

  test("unauthenticated user accessing /trees/[treeId]/tree is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/tree`);
    await expect(page).toHaveURL(new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Ftree`));
  });

  test("mobile viewports 375x667 and 320x568 render tree route redirect cleanly without horizontal overflow", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`/trees/${mockTreeId}/tree`);
      await expect(page).toHaveURL(/login/);

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    }
  });
});
