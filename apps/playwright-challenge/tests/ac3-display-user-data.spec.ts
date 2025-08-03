import { test, expect } from "@playwright/test";
import { users } from "../src/services/users";

test("AC3: Display User Data", async ({ page }) => {
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(users),
      });
    },
  );
  await page.goto("http://localhost:3677");

  for (const user of users) {
    const row = page.locator(`tr[data-testid="user-${user.id}"]`);
    await expect(row.locator(`[data-testid="name-${user.id}"]`)).toHaveText(
      user.name,
    );

    await expect(row.locator(`[data-testid="username-${user.id}"]`)).toHaveText(
      user.username,
    );
    await expect(row.locator(`[data-testid="email-${user.id}"]`)).toHaveText(
      user.email,
    );
    await expect(row.locator(`[data-testid="city-${user.id}"]`)).toHaveText(
      user.address.city,
    );
    await expect(row.locator(`[data-testid="phone-${user.id}"]`)).toHaveText(
      user.phone,
    );
    await expect(row.locator(`[data-testid="company-${user.id}"]`)).toHaveText(
      user.company.name,
    );
    const websiteCell = row.locator(`[data-testid="website-${user.id}"]`);

    await expect(websiteCell).toHaveText(user.website);

    const websiteLink = websiteCell.locator("a");
    await expect(websiteLink).toHaveAttribute(
      "href",
      `https://${user.website}`,
    );
  }
});
