import { expect, test } from "@playwright/test";

for (const width of [390, 1437]) {
  for (const sorted of [false, true]) {
    test(`deleting keeps nearby context at ${width}px with live sorting ${sorted}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/?view=Payroll");
      if (sorted) {
        const sort = page.getByRole("button", { name: /^Overrides: sort/ });
        await sort.click();
        await sort.click();
      }
      const staff = page.getByRole("region", {
        name: "Marcus Reed pay rates",
        exact: true,
      });
      await staff
        .getByRole("button", { name: "Expand Marcus Reed", exact: true })
        .click();
      const rows = staff.locator("[data-pay-override-row]");
      const row = rows.nth(8);
      const next = rows.nth(9);
      const nextId = await next.getAttribute("id");
      await row.evaluate((element) => {
        const scroller = element.closest(".pay-scroll")!;
        scroller.scrollTop +=
          element.getBoundingClientRect().top -
          scroller.getBoundingClientRect().top -
          120;
      });
      const top = (await row.boundingBox())!.y;
      await row.getByRole("button", { name: /^Delete override for/ }).click();
      const dialog = page.getByRole("dialog", {
        name: "Delete override?",
        exact: true,
      });
      await dialog
        .getByRole("button", { name: "Delete override", exact: true })
        .click();
      await expect(dialog).toHaveCount(0);
      await expect(rows).toHaveCount(22);
      const survivor = page.locator(`[id="${nextId}"]`);
      await expect(
        survivor.getByRole("button", { name: /^Delete override for/ }),
      ).toBeFocused();
      await expect
        .poll(async () => Math.abs((await survivor.boundingBox())!.y - top))
        .toBeLessThan(2);

      // The final row has no next sibling; retain the previous row instead.
      const last = rows.last();
      const previous = rows.nth(20);
      const previousId = await previous.getAttribute("id");
      await last.evaluate((element) => {
        const scroller = element.closest(".pay-scroll")!;
        scroller.scrollTop +=
          element.getBoundingClientRect().top -
          scroller.getBoundingClientRect().top -
          330;
      });
      const previousTop = (await previous.boundingBox())!.y;
      await last.getByRole("button", { name: /^Delete override for/ }).click();
      await dialog
        .getByRole("button", { name: "Delete override", exact: true })
        .click();
      await expect(rows).toHaveCount(21);
      const remaining = page.locator(`[id="${previousId}"]`);
      await expect(
        remaining.getByRole("button", { name: /^Delete override for/ }),
      ).toBeFocused();
      await expect
        .poll(async () =>
          Math.abs((await remaining.boundingBox())!.y - previousTop),
        )
        .toBeLessThan(2);
    });
  }
}
