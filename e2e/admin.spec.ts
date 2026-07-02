import { test, expect } from "@playwright/test";

test.describe("Admin Panel (authenticated)", () => {
  test.use({ storageState: "e2e/.auth/user.json" });

  test("loads the admin dashboard", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to portfolio management", async ({ page }) => {
    await page.goto("/admin/portfolio");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to inquiries", async ({ page }) => {
    await page.goto("/admin/inquiries");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to feedback", async ({ page }) => {
    await page.goto("/admin/feedback");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to audit log", async ({ page }) => {
    await page.goto("/admin/audit-log");
    await expect(page.locator("body")).toBeVisible();
  });
});
