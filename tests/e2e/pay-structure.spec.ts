import { expect, test } from "@playwright/test";

test("adding and removing tiers keeps keyboard focus on an editable field", async ({
  page,
}) => {
  await page.goto("/?view=Payroll&payDemo=tiered");
  await page
    .getByRole("button", { name: "Add override for Noah Miller" })
    .click();
  const add = page.getByRole("dialog", { name: "Add override", exact: true });
  await add.getByRole("radio", { name: "Tiered pay", exact: true }).check();
  await add.getByRole("button", { name: /^Pay structure / }).click();
  await add.getByRole("button", { name: "Create new pay structure" }).click();
  const create = page.getByRole("dialog", {
    name: "Create new tiered pay structure",
  });
  const addTier = create.getByRole("button", { name: "Add tier", exact: true });
  await addTier.focus();
  await page.keyboard.press("Enter");
  await expect(
    create.getByRole("textbox", { name: "Start hours for tier 2" }),
  ).toBeFocused();
  await page.keyboard.type("10");
  await page.keyboard.press("Tab");
  await expect(
    create.getByRole("textbox", { name: "Rate for tier 2" }),
  ).toBeFocused();
  await page.keyboard.type("60");
  await addTier.focus();
  await page.keyboard.press("Enter");
  await expect(
    create.getByRole("textbox", { name: "Start hours for tier 3" }),
  ).toBeFocused();
  await create.getByRole("button", { name: "Remove tier 2" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    create.getByRole("textbox", { name: "Start hours for tier 2" }),
  ).toBeFocused();
  await create.getByRole("button", { name: "Remove tier 2" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    create.getByRole("textbox", { name: "Rate for tier 1" }),
  ).toBeFocused();
  await expect(
    create.getByRole("button", { name: "Remove tier 1" }),
  ).toBeDisabled();
});

test("creating a structure and assigning an override are independent saves", async ({
  page,
}) => {
  await page.goto("/?view=Payroll&payDemo=tiered");
  await page
    .getByRole("button", { name: "Add override for Noah Miller", exact: true })
    .click();
  const add = page.getByRole("dialog", { name: "Add override", exact: true });
  await add.getByRole("button", { name: /Select a class or service/ }).click();
  await add
    .getByRole("option", { name: "Piano Private service", exact: true })
    .click();
  await add
    .getByRole("textbox", { name: "Hourly rate", exact: true })
    .fill("82.50");
  await add.getByRole("radio", { name: "Tiered pay", exact: true }).check();
  const picker = add.getByRole("button", { name: /^Pay structure / });
  await picker.click();
  await add
    .getByRole("button", { name: "Create new pay structure", exact: true })
    .click();
  const create = page.getByRole("dialog", {
    name: "Create new tiered pay structure",
    exact: true,
  });
  await expect(
    create.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeFocused();
  await expect(
    create.getByRole("button", { name: "Remove tier 1" }),
  ).toBeDisabled();
  await create.getByRole("button", { name: "Save pay structure" }).click();
  await expect(create.getByRole("alert")).toContainText("Enter a name");
  await create
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Progressive piano");
  await create
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Demo teaching progression");
  await create
    .getByRole("textbox", { name: "Referral Hourly Rate", exact: true })
    .fill("25");
  await create
    .getByRole("textbox", { name: "Rate for tier 1", exact: true })
    .fill("50");
  await create.getByRole("button", { name: "Add tier", exact: true }).click();
  await create
    .getByRole("textbox", { name: "Start hours for tier 2", exact: true })
    .fill("0");
  await create.getByRole("button", { name: "Save pay structure" }).click();
  await expect(create.getByRole("alert")).toContainText(
    "after the previous tier",
  );
  await create
    .getByRole("textbox", { name: "Start hours for tier 2", exact: true })
    .fill("10");
  await create
    .getByRole("textbox", { name: "Rate for tier 2", exact: true })
    .fill("65");
  await expect(
    create.getByRole("textbox", { name: "End hours for tier 1", exact: true }),
  ).toHaveValue("10");
  await create.getByRole("button", { name: "Add tier", exact: true }).click();
  await create
    .getByRole("button", { name: "Remove tier 3", exact: true })
    .click();
  await create.getByRole("button", { name: "Save pay structure" }).click();
  await expect(create).toHaveCount(0);
  await expect(add).toBeVisible();
  await expect(picker).toBeFocused();
  await expect(picker).toContainText("Select an existing structure");
  await expect(add.getByRole("status")).toContainText("Progressive piano");
  await add.getByRole("radio", { name: "Hourly rate", exact: true }).check();
  await expect(
    add.getByRole("textbox", { name: "Hourly rate", exact: true }),
  ).toHaveValue("82.50");
  await add.getByRole("button", { name: "Cancel", exact: true }).click();
  const staff = page.getByRole("region", {
    name: "Noah Miller pay rates",
    exact: true,
  });
  await expect(staff).toContainText("No overrides");
  // The saved structure survives cancellation of its independent override draft.
  await page
    .getByRole("button", { name: "Add override for Olivia Chen", exact: true })
    .click();
  await add.getByRole("radio", { name: "Tiered pay", exact: true }).check();
  await picker.click();
  await expect(
    add.getByRole("option", { name: /^Progressive piano/ }),
  ).toHaveCount(1);
  await page.keyboard.press("Escape");
  await add.getByRole("button", { name: "Cancel", exact: true }).click();
  await page
    .getByRole("button", { name: "Add override for Noah Miller", exact: true })
    .click();
  await add.getByRole("button", { name: /Select a class or service/ }).click();
  await add
    .getByRole("option", { name: "Piano Private service", exact: true })
    .click();
  await add.getByRole("radio", { name: "Tiered pay", exact: true }).check();
  await picker.click();
  await add.getByRole("option", { name: /^Progressive piano/ }).click();
  await add.getByRole("button", { name: "Add override", exact: true }).click();
  await expect(add).toHaveCount(0);
  await expect(staff).toContainText("Progressive piano");
  await staff
    .getByRole("button", { name: /^Edit override for Piano ·/ })
    .click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  await expect(
    edit.getByRole("button", { name: /^Pay structure / }),
  ).toContainText("Progressive piano");
  await edit.getByRole("button", { name: "Cancel", exact: true }).click();
  await staff
    .getByRole("button", { name: /^Delete override for Piano ·/ })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Delete override?", exact: true }),
  ).toContainText("Progressive piano");
});
