import { test, expect } from "@playwright/test";

test("AC4: Empty State", async ({ page }) => {
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    },
  );

  await page.goto("http://localhost:3677");

  const emptyMessage = page.locator('[data-testid="no-users"]');
  await expect(emptyMessage).toBeVisible();
  await expect(emptyMessage).toHaveText("No users found.");
});
