import { test, expect } from "@playwright/test";
import { fetchUsers } from "../src/services/api";

let mockUsers: any[] = [];

test.beforeAll(async () => {
  mockUsers = await fetchUsers();
});

test("AC5 Company Display", async ({ page }) => {
  await page.goto("http://localhost:3677");

  for (const user of mockUsers) {
    const row = page.locator(`tr[data-testid="user-${user.id}"]`);

    const companyCell = row.locator(`[data-testid="company-${user.id}"]`);

    if (user.company && user.company.name) {
      await expect(companyCell).toHaveText(user.company.name);
      await expect(
        companyCell.locator('[data-testid="no-company-icon"]'),
      ).toHaveCount(0);
    } else {
      await expect(
        companyCell.locator('[data-testid="no-company-icon"]'),
      ).toHaveCount(1);
    }
  }
});
