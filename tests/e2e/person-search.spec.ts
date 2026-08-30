import { test, expect } from "@playwright/test";

test.describe("GenViet Person Search E2E Tests (Phase P16)", () => {
  const mockTreeId = "11111111-1111-1111-1111-111111111111";

  test("unauthenticated user accessing /trees/[treeId]/people/search is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people/search`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2Fsearch`)
    );
  });

  test("unauthenticated user accessing global /search is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto("/search");
    await expect(page).toHaveURL(new RegExp(`/login\\?next=%2Fsearch`));
  });

  test("mobile viewports 375x667 and 320x568 render search redirect cleanly without horizontal overflow", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`/trees/${mockTreeId}/people/search`);
      await expect(page).toHaveURL(/login/);

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    }
  });
});
