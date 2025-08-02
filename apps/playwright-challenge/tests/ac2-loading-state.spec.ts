import { test, expect } from "@playwright/test";

test("AC2: Loading State", async ({ page }) => {
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await new Promise((res) => setTimeout(res, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    },
  );

  await page.goto("http://localhost:3677");

  await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();

  await expect(page.locator('[data-testid="loading-spinner"]')).toBeHidden();

  await expect(
    page.locator('[data-testid="user-table"], [data-testid="empty-state"]'),
  ).toBeVisible();
});
