import { expect, test } from "@playwright/test";

test("user can complete the primary flow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
});
