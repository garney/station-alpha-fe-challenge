import { test, expect } from "@playwright/test";

test("AC6: Error handling", async ({ page }) => {
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    },
  );

  await page.goto("http://localhost:3677");

  const errorModal = page.locator('[data-testid="error-modal"]');
  await expect(errorModal).toBeVisible();

  await expect(errorModal.locator('[data-testid="error-message"]')).toHaveText(
    "Failed to load users. Please try again later.",
  );

  await page.locator('[data-testid="error-close-button"]').click();

  await expect(errorModal).toBeHidden();

  await page.reload();
  await expect(errorModal).toBeVisible();

  await page.locator('[data-testid="error-action-button"]').click();

  await expect(errorModal).toBeHidden();
});
