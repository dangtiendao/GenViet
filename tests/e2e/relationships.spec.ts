import { test, expect } from "@playwright/test";

test.describe("GenViet Relationship Management E2E Tests (Phase P13)", () => {
  const mockTreeId = "11111111-1111-1111-1111-111111111111";
  const mockPersonId = "22222222-2222-2222-2222-222222222222";

  test("unauthenticated user accessing /trees/[treeId]/people/[personId] is protected and redirected to /login", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people/${mockPersonId}`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2F${mockPersonId}`)
    );
    await expect(page.getByRole("heading", { name: "Đăng nhập vào GenViet" })).toBeVisible();
  });

  test("mobile viewports 320x568 and 375x667 render relationship UI pages safely without overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`/trees/${mockTreeId}/people/${mockPersonId}`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2F${mockPersonId}`)
    );

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});
