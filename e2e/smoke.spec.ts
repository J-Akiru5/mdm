import { test, expect } from "@playwright/test";

test.describe("Public Site Navigation", () => {
  test("loads the home page successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/MDM/i);
  });

  test("navigates to About page", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to Services page", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to Portfolio page", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to Contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("SEO & Meta", () => {
  test("home page has proper meta tags", async ({ page }) => {
    await page.goto("/");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toBeTruthy();
  });
});
