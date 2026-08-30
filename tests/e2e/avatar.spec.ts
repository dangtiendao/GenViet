import { test, expect } from "@playwright/test";

test.describe("GenViet Avatar & Storage E2E Tests (Phase P17)", () => {
  const mockTreeId = "11111111-1111-1111-1111-111111111111";
  const mockPersonId = "22222222-2222-2222-2222-222222222222";

  test("unauthenticated user accessing person edit form is redirected to login", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people/${mockPersonId}/edit`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2F${mockPersonId}%2Fedit`)
    );
  });

  test("unauthenticated user accessing person detail page is redirected to login", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people/${mockPersonId}`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2F${mockPersonId}`)
    );
  });

  test("mobile viewports 375x667 and 320x568 render cleanly without horizontal overflow", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`/trees/${mockTreeId}/people/${mockPersonId}`);
      await expect(page).toHaveURL(/login/);

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    }
  });
});
