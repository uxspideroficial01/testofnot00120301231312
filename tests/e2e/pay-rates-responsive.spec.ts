import { expect, test, type Page } from "@playwright/test";

async function expectFilterInsideVisibleArea(page: Page) {
  const bounds = await page
    .getByRole("dialog", { name: "Pay rate filters" })
    .boundingBox();
  const scroll = await page.locator(".pay-scroll").boundingBox();
  const viewport = page.viewportSize()!;
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(scroll!.x);
  expect(bounds!.y).toBeGreaterThanOrEqual(scroll!.y);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
  const offsets = await page
    .locator("html, .pay-scroll")
    .evaluateAll((elements) => elements.map((element) => element.scrollLeft));
  expect(offsets).toEqual([0, 0]);
}

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 480 },
  { width: 844, height: 390 },
]) {
  test(`filter stays reachable after resizing to ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.goto("/?view=Payroll");
    await page.getByRole("button", { name: "Filter", exact: true }).click();
    const filters = page.getByRole("dialog", { name: "Pay rate filters" });
    await filters.getByRole("button", { name: "Staff", exact: true }).click();
    await page.setViewportSize(viewport);
    await expectFilterInsideVisibleArea(page);
    const search = filters.getByPlaceholder("Search staff...");
    await search.fill("Zara");
    await expectFilterInsideVisibleArea(page);
    await search.press("ArrowUp");
    await expect(
      filters.getByRole("button", { name: "Zara Ross", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(filters).toHaveCount(0);
    await expect(page.getByRole("region", { name: /pay rates$/ })).toHaveCount(
      1,
    );
    await expect(
      page.getByRole("region", { name: "Zara Ross pay rates", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Filter 1", exact: true }).click();
    await expectFilterInsideVisibleArea(page);
    await filters.getByRole("button", { name: /Staff/ }).click();
    await expectFilterInsideVisibleArea(page);
    await filters
      .getByRole("button", { name: "Clear staff", exact: true })
      .click();
    await expect(page.getByText("150 staff", { exact: true })).toBeVisible();
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflowing = await page
    .locator(
      "html, .main-workspace, .pay-scroll, .pay-list, .pay-staff-summary, .pay-override-table, .pay-dialog, .pay-form-body, .pay-filter-menu",
    )
    .evaluateAll((elements) =>
      elements
        .filter(
          (element) =>
            element.clientWidth > 0 &&
            element.scrollWidth > element.clientWidth + 1,
        )
        .map((element) => element.className || element.tagName),
    );
  expect(overflowing).toEqual([]);
}

test("structure creation form fits mobile and returns to the draft", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?view=Payroll&payDemo=tiered");
  await page
    .getByRole("button", { name: "Add override for Noah Miller", exact: true })
    .click();
  const add = page.getByRole("dialog", { name: "Add override", exact: true });
  await add.getByRole("radio", { name: "Tiered pay", exact: true }).check();
  await add.getByRole("button", { name: /^Pay structure / }).click();
  const create = add.getByRole("button", {
    name: "Create new pay structure",
    exact: true,
  });
  await expect(create).toBeInViewport();
  await create.click();
  const notice = page.getByRole("dialog", {
    name: "Create new tiered pay structure",
    exact: true,
  });
  await notice
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Mobile structure");
  await notice.getByRole("button", { name: "Add tier", exact: true }).click();
  await notice
    .getByRole("textbox", { name: "Start hours for tier 2", exact: true })
    .fill("10");
  await notice
    .getByRole("textbox", { name: "Rate for tier 2", exact: true })
    .fill("65");
  await expectNoHorizontalOverflow(page);
  await notice.getByRole("button", { name: "Save pay structure" }).click();
  await expect(add).toBeVisible();
  await expect(
    add.getByRole("radio", { name: "Tiered pay", exact: true }),
  ).toBeChecked();
  await expect(
    add.getByRole("button", { name: /^Pay structure / }),
  ).toBeFocused();
});

for (const width of [320, 390, 768, 1024]) {
  test(`pay rates and add/edit dialogs fit a ${width}px viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/?view=Payroll");
    await page
      .getByRole("textbox", { name: "Search staff", exact: true })
      .fill("Emma Wilson");
    const staff = page.getByRole("region", {
      name: "Emma Wilson pay rates",
      exact: true,
    });
    await staff
      .getByRole("button", { name: "Expand Emma Wilson", exact: true })
      .click();
    await expect(staff.getByRole("table")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    for (const action of [
      staff.getByRole("button", { name: "Add override for Emma Wilson" }),
      staff.getByRole("button", {
        name: /^Edit override for Piano ·/,
        exact: true,
      }),
      staff.getByRole("button", {
        name: /^Delete override for Piano ·/,
        exact: true,
      }),
    ]) {
      const bounds = await action.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
    await page.getByRole("button", { name: "Filter", exact: true }).click();
    const filters = page.getByRole("dialog", { name: "Pay rate filters" });
    await filters.getByRole("button", { name: "Staff", exact: true }).click();
    const filterBounds = await filters.boundingBox();
    expect(filterBounds!.x).toBeGreaterThanOrEqual(0);
    expect(filterBounds!.x + filterBounds!.width).toBeLessThanOrEqual(width);
    await filters.getByPlaceholder("Search staff...").fill("Zara Ross");
    await expect(
      filters.getByRole("button", { name: "Zara Ross", exact: true }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.keyboard.press("Escape");
    await staff
      .getByRole("button", { name: /^Edit override for Piano ·/ })
      .click();
    const edit = page.getByRole("dialog", {
      name: "Edit override",
      exact: true,
    });
    await expect(edit).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await edit.getByRole("button", { name: "Cancel", exact: true }).click();
    await staff
      .getByRole("button", { name: "Add override for Emma Wilson" })
      .click();
    const add = page.getByRole("dialog", { name: "Add override", exact: true });
    await add
      .getByRole("button", { name: /Select a class or service/ })
      .click();
    await expectNoHorizontalOverflow(page);
    await add
      .getByRole("option", { name: "Songwriting Private service", exact: true })
      .click();
    await add
      .getByRole("textbox", { name: "Hourly rate", exact: true })
      .fill("75");
    await expectNoHorizontalOverflow(page);
    await add
      .getByRole("button", { name: "Add override", exact: true })
      .click();
    await expect(add).toHaveCount(0);
    await expect(
      staff.getByRole("row").filter({ hasText: "Songwriting" }),
    ).toContainText("$75.00/hr");
    await expectNoHorizontalOverflow(page);
    await staff
      .getByRole("button", {
        name: /^Delete override for Songwriting ·/,
        exact: true,
      })
      .click();
    const deletion = page.getByRole("dialog", {
      name: "Delete override?",
      exact: true,
    });
    await expect(deletion).toContainText("The class or service will remain.");
    await expect(deletion).toContainText("Current rate: $75.00/hr");
    await expect(
      deletion.getByRole("button", { name: "Cancel", exact: true }),
    ).toBeFocused();
    await expectNoHorizontalOverflow(page);
    const deleteBounds = await deletion.boundingBox();
    expect(deleteBounds!.x).toBeGreaterThanOrEqual(0);
    expect(deleteBounds!.x + deleteBounds!.width).toBeLessThanOrEqual(width);
    const deleteAction = deletion.getByRole("button", {
      name: "Delete override",
      exact: true,
    });
    const actionBounds = await deleteAction.boundingBox();
    expect(actionBounds!.y + actionBounds!.height).toBeLessThanOrEqual(844);
    await deleteAction.click();
    await expect(deletion).toHaveCount(0);
    await expect(staff.getByRole("table")).toBeVisible();
    await expect(
      staff.getByRole("row").filter({ hasText: "Songwriting" }),
    ).toHaveCount(0);
    await expect(
      staff.getByRole("row").filter({ hasText: "Music theory" }),
    ).toBeVisible();
    await expect(
      staff.getByRole("button", {
        name: /^Delete override for Sophie Bennett · Piano · Weekly 30-minute plan · Emma Wilson$/,
      }),
    ).toBeFocused();
  });
}
