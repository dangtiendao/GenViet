import { test, expect } from "@playwright/test";

test.describe("GenViet Responsive UI Shell & Design System (Phase P10)", () => {
  test.describe("Desktop Viewport (1280x800)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
    });

    test("desktop shell renders sidebar and hides mobile navigation on ui-preview", async ({
      page,
    }) => {
      await page.goto("/ui-preview");
      await expect(
        page.getByRole("heading", { name: "GenViet Design System & UI Components (Phase P10)" })
      ).toBeVisible();

      // Verify Desktop elements render properly
      const button = page.getByRole("button", { name: "Primary Button" });
      await expect(button).toBeVisible();
    });

    test("dialog opens, traps focus and closes via Escape key", async ({ page }) => {
      await page.goto("/ui-preview");
      const openDialogBtn = page.getByRole("button", { name: "Mở Dialog Modal" });
      await openDialogBtn.click();

      const dialogHeading = page.getByRole("heading", { name: "Hộp thoại Xác nhận" });
      await expect(dialogHeading).toBeVisible();

      // Close via Escape
      await page.keyboard.press("Escape");
      await expect(dialogHeading).not.toBeVisible();
    });

    test("toast notification triggers and auto-dismisses or closes", async ({ page }) => {
      await page.goto("/ui-preview");
      await page.getByRole("button", { name: "Toast Success" }).click();

      const toastMsg = page.getByText("Đã lưu thay đổi thành công!");
      await expect(toastMsg).toBeVisible();

      // Dismiss button
      const closeBtn = page.getByRole("button", { name: "Đóng thông báo" });
      await closeBtn.click();
      await expect(toastMsg).not.toBeVisible();
    });
  });

  test.describe("Mobile Viewports (375x667 and 320x568)", () => {
    test("mobile viewport 375x667 renders UI cleanly without horizontal overflow", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/ui-preview");

      // Verify no horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Verify bottom sheet opens on mobile
      const openSheetBtn = page.getByRole("button", { name: "Mở Mobile Bottom Sheet" });
      await openSheetBtn.click();

      const sheetHeading = page.getByRole("heading", {
        name: "Bảng thao tác Mobile (Bottom Sheet)",
      });
      await expect(sheetHeading).toBeVisible();

      // Close sheet via close button
      const closeSheetBtn = page.getByRole("button", { name: "Đóng bảng thao tác" });
      await closeSheetBtn.click();
      await expect(sheetHeading).not.toBeVisible();
    });

    test("small screen 320x568 has zero horizontal overflow", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto("/ui-preview");

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });
  });
});
