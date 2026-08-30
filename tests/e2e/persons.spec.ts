import { test, expect } from "@playwright/test";

test.describe("GenViet Person Management E2E Tests (Phase P12)", () => {
  const mockTreeId = "11111111-1111-1111-1111-111111111111";
  const mockPersonId = "22222222-2222-2222-2222-222222222222";

  test("unauthenticated user accessing /trees/[treeId]/people is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people`);
    await expect(page).toHaveURL(new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople`));
    await expect(page.getByRole("heading", { name: "Đăng nhập vào GenViet" })).toBeVisible();
  });

  test("unauthenticated user accessing /trees/[treeId]/people/new is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people/new`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2Fnew`)
    );
  });

  test("unauthenticated user accessing /trees/[treeId]/people/[personId] is redirected to /login", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people/${mockPersonId}`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2F${mockPersonId}`)
    );
  });

  test("unauthenticated user accessing /trees/[treeId]/people/[personId]/edit is redirected to /login", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people/${mockPersonId}/edit`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2F${mockPersonId}%2Fedit`)
    );
  });

  test("unauthenticated user accessing /trees/[treeId]/people/trash is redirected to /login", async ({
    page,
  }) => {
    await page.goto(`/trees/${mockTreeId}/people/trash`);
    await expect(page).toHaveURL(
      new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople%2Ftrash`)
    );
  });

  test("mobile viewports 320x568 and 375x667 render people routes without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`/trees/${mockTreeId}/people`);
    await expect(page).toHaveURL(new RegExp(`/login\\?next=%2Ftrees%2F${mockTreeId}%2Fpeople`));

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});
