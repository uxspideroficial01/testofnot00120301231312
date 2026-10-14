import { expect, test, type Locator, type Page } from "@playwright/test";

function staffRates(page: Page, name: string) {
  return page.getByRole("region", { name: `${name} pay rates`, exact: true });
}

async function openAdd(page: Page, name: string) {
  await staffRates(page, name)
    .getByRole("button", { name: `Add override for ${name}`, exact: true })
    .click();
  return page.getByRole("dialog", { name: "Add override", exact: true });
}

async function chooseTarget(dialog: Locator, name: string | RegExp) {
  await dialog
    .getByRole("button", { name: /Select (a class or service|an enrollment)/ })
    .click();
  await dialog.getByRole("option", { name }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/?view=Payroll");
  await expect(
    page.getByRole("heading", { name: "Pay rates", exact: true }),
  ).toBeVisible();
});

test("column headings sort 150 staff in both directions and preserve expanded rows and search", async ({
  page,
}) => {
  const headings = page.getByRole("group", { name: "Sort staff pay rates" });
  const rows = page.getByRole("region", { name: / pay rates$/ });
  await staffRates(page, "Emma Wilson")
    .getByRole("button", { name: "Expand Emma Wilson", exact: true })
    .click();
  await headings
    .getByRole("button", { name: "Staff: sort A to Z", exact: true })
    .press("Enter");
  await expect(rows.first()).toHaveAttribute(
    "aria-label",
    "Adrian Anderson pay rates",
  );
  await expect(
    headings.getByRole("button", { name: "Staff: sort Z to A" }),
  ).toHaveAttribute("aria-pressed", "true");
  await headings
    .getByRole("button", { name: "Staff: sort Z to A", exact: true })
    .click();
  await expect(rows.first()).toHaveAttribute(
    "aria-label",
    "Zara Ross pay rates",
  );
  await expect(
    staffRates(page, "Emma Wilson").getByRole("table"),
  ).toBeAttached();

  await headings
    .getByRole("button", {
      name: "Default rate: sort lowest to highest",
      exact: true,
    })
    .click();
  await expect(rows.first()).toHaveAttribute(
    "aria-label",
    "Amelia Brooks pay rates",
  );
  await expect(rows.last()).toHaveAttribute(
    "aria-label",
    "Evelyn Wright pay rates",
  );
  await headings
    .getByRole("button", {
      name: "Default rate: sort highest to lowest",
      exact: true,
    })
    .click();
  await expect(rows.first()).toHaveAttribute(
    "aria-label",
    "Alice Castillo pay rates",
  );
  await expect(rows.last()).toHaveAttribute(
    "aria-label",
    "Evelyn Wright pay rates",
  );

  await headings
    .getByRole("button", {
      name: "Overrides: sort lowest to highest",
      exact: true,
    })
    .click();
  await expect(rows.first()).toHaveAttribute(
    "aria-label",
    "Adrian Anderson pay rates",
  );
  await headings
    .getByRole("button", {
      name: "Overrides: sort highest to lowest",
      exact: true,
    })
    .click();
  await expect(rows.first()).toHaveAttribute(
    "aria-label",
    "Adrian Hughes pay rates",
  );
  await page
    .getByRole("textbox", { name: "Search staff", exact: true })
    .fill("Zara");
  await expect(rows).toHaveCount(8);
  await expect(rows.first()).toHaveAttribute(
    "aria-label",
    "Zara Castillo pay rates",
  );
  await expect(rows.last()).toHaveAttribute(
    "aria-label",
    "Zara Evans pay rates",
  );
});

test("150 staff remain searchable, filterable and expandable through the last record", async ({
  page,
}) => {
  const rows = page.getByRole("region", { name: / pay rates$/ });
  const search = page.getByRole("textbox", {
    name: "Search staff",
    exact: true,
  });
  await expect(page.getByText("150 staff", { exact: true })).toBeVisible();
  await expect(rows).toHaveCount(150);
  await page.getByRole("button", { name: "Expand all", exact: true }).click();
  await expect(page.getByRole("table", { name: /Overrides for/ })).toHaveCount(
    120,
  );
  await expect(staffRates(page, "Zara Ross").getByRole("table")).toBeAttached();
  await page.getByRole("button", { name: "Collapse all", exact: true }).click();
  await expect(page.getByRole("table", { name: /Overrides for/ })).toHaveCount(
    0,
  );

  await search.fill("zara ross");
  await expect(rows).toHaveCount(1);
  const lastStaff = staffRates(page, "Zara Ross");
  await lastStaff.getByText("Zara Ross", { exact: true }).click();
  await expect(lastStaff.getByRole("table").getByRole("row")).toHaveCount(24);
  await search.fill("No matching instructor");
  await expect(rows).toHaveCount(0);
  await page.getByRole("button", { name: "Clear staff search" }).click();
  await expect(rows).toHaveCount(150);

  await page.getByRole("button", { name: "Filter", exact: true }).click();
  const filters = page.getByRole("dialog", { name: "Pay rate filters" });
  await filters.getByRole("button", { name: "Staff", exact: true }).click();
  await filters.getByPlaceholder("Search staff...").fill("Zara Ross");
  await filters.getByRole("button", { name: "Zara Ross", exact: true }).click();
  await expect(filters).toHaveCount(0);
  await page.getByRole("button", { name: "Filter 1", exact: true }).click();
  await filters.getByRole("button", { name: "Services", exact: true }).click();
  await filters.getByPlaceholder("Search services...").fill("Violin");
  await filters.getByRole("button", { name: "Violin", exact: true }).click();
  await expect(rows).toHaveCount(1);
  await expect(lastStaff).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(rows).toHaveCount(150);
});

test("filter popover anchors without shifting rows and supports search, keyboard and dismissal", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: /^Filter/ });
  const filters = page.getByRole("dialog", { name: "Pay rate filters" });
  const staff = staffRates(page, "Emma Wilson");
  const before = await staff.boundingBox();
  await trigger.click();
  await expect(filters).toBeVisible();
  expect((await staff.boundingBox())?.y).toBe(before?.y);
  const search = filters.getByPlaceholder("Search filter...");
  await search.fill("service");
  await expect(
    filters.getByRole("button", { name: "Staff", exact: true }),
  ).toHaveCount(0);
  await search.press("ArrowUp");
  await page.keyboard.press("Enter");
  await expect(filters.getByPlaceholder("Search services...")).toBeFocused();
  await filters.getByRole("button", { name: "Back to filters" }).click();
  await expect(search).toHaveValue("");
  await search.fill("no category");
  await expect(filters.getByText("No matching filters.")).toBeVisible();
  await search.press("Escape");
  await expect(filters).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await search.press("ArrowDown");
  await page.keyboard.press("Enter");
  const staffSearch = filters.getByPlaceholder("Search staff...");
  await staffSearch.fill("Emma Wilson");
  await staffSearch.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(filters).toHaveCount(0);
  await expect(page.getByRole("region", { name: /pay rates$/ })).toHaveCount(1);
  await expect(staff).toBeVisible();
  await trigger.click();
  await filters.getByRole("button", { name: /Staff/ }).click();
  await filters
    .getByRole("button", { name: "Clear staff", exact: true })
    .click();
  await expect(page.getByText("150 staff", { exact: true })).toBeVisible();
  await trigger.click();
  await trigger.click();
  await expect(filters).toHaveCount(0);
  await trigger.click();
  await page.getByRole("heading", { name: "Pay rates", exact: true }).click();
  await expect(filters).toHaveCount(0);
});

test("staff summary toggles from its name, rate, count and keyboard without intercepting Add", async ({
  page,
}) => {
  const staff = staffRates(page, "Emma Wilson");
  const table = staff.getByRole("table");
  await staff.getByText("Emma Wilson", { exact: true }).click();
  await expect(table).toBeVisible();
  await staff.getByText("$50.00/hr", { exact: false }).click();
  await expect(table).toHaveCount(0);
  await staff.getByText("3 overrides", { exact: true }).click();
  await expect(table).toBeVisible();
  await staff
    .getByRole("button", { name: "Collapse Emma Wilson", exact: true })
    .press("Space");
  await expect(table).toHaveCount(0);
  await staff
    .getByRole("button", { name: "Expand Emma Wilson", exact: true })
    .press("Enter");
  await expect(table).toBeVisible();
  await staff
    .getByRole("button", { name: "Collapse Emma Wilson", exact: true })
    .click();
  const dialog = await openAdd(page, "Emma Wilson");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(table).toHaveCount(0);
  await expect(
    staffRates(page, "Noah Miller").getByRole("button", {
      name: /Expand|Collapse/,
    }),
  ).toHaveCount(0);
});

test("missing target receives focus and search recovery preserves the entered rate", async ({
  page,
}) => {
  const add = await openAdd(page, "Noah Miller");
  const amount = add.getByRole("textbox", { name: "Hourly rate", exact: true });
  await amount.fill("82.50");
  await add.getByRole("button", { name: "Add override", exact: true }).click();
  const target = add.getByRole("button", { name: /^Class\/Service / });
  await expect(target).toBeFocused();
  await expect(target).toHaveAttribute("aria-invalid", "true");
  await expect(target).toHaveAccessibleDescription(
    /Select the class, service or enrollment/,
  );
  await expect(amount).toHaveValue("82.50");
  await target.press("Enter");
  const search = add.getByRole("textbox", { name: "Search Class/Service" });
  await search.fill("Nonexistent lesson");
  await expect(add.getByRole("status")).toHaveText(
    "No matching classes or services. Try another search.",
  );
  await search.fill("Piano");
  await add
    .getByRole("option", { name: "Piano Private service", exact: true })
    .click();
  await expect(target).not.toHaveAttribute("aria-invalid", "true");
  await expect(amount).toHaveValue("82.50");
  await add.getByRole("radio", { name: /^Enrollment/ }).check();
  await add.getByRole("button", { name: "Add override", exact: true }).click();
  await expect(
    add.getByRole("button", { name: /Select an enrollment/ }),
  ).toBeFocused();
  await expect(amount).toHaveValue("82.50");
});

test("fully assigned scope explains the empty list and permits switching scope", async ({
  page,
}) => {
  const add = await openAdd(page, "Marcus Reed");
  const target = add.getByRole("button", { name: /Select a class or service/ });
  await expect(target).toBeDisabled();
  await expect(target).toHaveAccessibleDescription(
    /All linked classes or services already have overrides/,
  );
  await expect(
    add.getByRole("button", { name: "Add override", exact: true }),
  ).toBeDisabled();
  await add.getByRole("radio", { name: /^Enrollment/ }).check();
  await expect(
    add.getByRole("button", { name: /Select an enrollment/ }),
  ).toBeEnabled();
  await expect(
    add.getByRole("button", { name: "Add override", exact: true }),
  ).toBeEnabled();
});

test("staff without overrides can add directly, then edit hourly pay to per-session pay", async ({
  page,
}) => {
  const staff = staffRates(page, "Noah Miller");
  await expect(staff).toContainText("No overrides");
  await expect(staff.getByRole("table")).toHaveCount(0);
  const add = await openAdd(page, "Noah Miller");
  await chooseTarget(add, "Piano Private service");
  await add
    .getByRole("textbox", { name: "Hourly rate", exact: true })
    .fill("60");
  await add.getByRole("button", { name: "Add override", exact: true }).click();

  await expect(add).toHaveCount(0);
  const notice = page
    .getByRole("status")
    .filter({ hasText: "Override added for Noah Miller" });
  await expect(notice).toContainText("Piano");
  await expect(notice).toContainText("$60.00/hr");
  await expect(
    staff.getByRole("button", {
      name: "Add override for Noah Miller",
      exact: true,
    }),
  ).toBeFocused();
  await expect(
    staff.getByRole("button", { name: "Collapse Noah Miller", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  const reopened = await openAdd(page, "Noah Miller");
  await expect(
    reopened.getByRole("textbox", { name: "Hourly rate", exact: true }),
  ).toHaveValue("45.00");
  await reopened
    .getByRole("button", { name: /Select a class or service/ })
    .click();
  await expect(
    reopened.getByRole("option", {
      name: "Piano Private service",
      exact: true,
    }),
  ).toHaveCount(0);
  await reopened.getByRole("button", { name: "Cancel", exact: true }).click();
  const row = staff.getByRole("row").filter({ hasText: "Private service" });
  await expect(row).toContainText("$60.00/hr");
  await expect(staff.getByText("1 override", { exact: true })).toBeVisible();
  await row.getByRole("button", { name: /^Edit override for Piano ·/ }).click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  await expect(edit).toContainText("Noah Miller");
  await expect(edit).toContainText("Piano");
  await edit
    .getByRole("radio", { name: "Flat per session", exact: true })
    .check();
  await edit
    .getByRole("textbox", { name: "Session rate", exact: true })
    .fill("80");
  const summary = edit.getByRole("region", { name: "Override summary" });
  await expect(summary).toContainText("Noah Miller · Piano");
  await expect(summary).toContainText("From $60.00/hr to $80.00/session.");
  await expect(summary).toContainText("Private service");
  await edit.getByRole("button", { name: "Save changes" }).click();
  await expect(edit).not.toBeVisible();
  await expect(row).toContainText("$80.00/session");
  await expect(staff.getByText("1 override", { exact: true })).toBeVisible();
});

test("enrollment selection and editing distinguish the same student on different plans", async ({
  page,
}) => {
  const staff = staffRates(page, "Emma Wilson");
  const add = await openAdd(page, "Emma Wilson");
  await add.getByRole("radio", { name: /^Enrollment/ }).check();
  await add.getByRole("button", { name: /Select an enrollment/ }).click();
  await add.getByRole("textbox", { name: "Search Enrollment" }).fill("Sophie");
  await expect(add.getByRole("option")).toHaveCount(1);
  await add
    .getByRole("option", { name: /Sophie Bennett.*Weekly 60-minute plan/ })
    .click();
  await add
    .getByRole("radio", { name: "Flat per session", exact: true })
    .check();
  await add
    .getByRole("textbox", { name: "Session rate", exact: true })
    .fill("95");
  await add.getByRole("button", { name: "Add override", exact: true }).click();
  await expect(add).toHaveCount(0);
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Override added for Emma Wilson" }),
  ).toContainText("Weekly 60-minute plan");

  const original = staff
    .getByRole("row")
    .filter({ hasText: "Weekly 30-minute plan" });
  const added = staff
    .getByRole("row")
    .filter({ hasText: "Weekly 60-minute plan" });
  const originalBefore = await original.textContent();
  await expect(original).toContainText("$45.00/session");
  await expect(added).toContainText("$95.00/session");
  for (const plan of ["Weekly 30-minute plan", "Weekly 60-minute plan"]) {
    for (const action of ["Edit", "Delete"]) {
      await expect(
        page.getByRole("button", {
          name: `${action} override for Sophie Bennett · Piano · ${plan} · Emma Wilson`,
          exact: true,
        }),
      ).toHaveCount(1);
    }
  }
  await added
    .getByRole("button", {
      name: /^Edit override for Sophie Bennett ·/,
      exact: true,
    })
    .click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  await expect(edit).toContainText("Weekly 60-minute plan");
  await expect(
    edit.getByRole("button", { name: /Select an enrollment/ }),
  ).toHaveCount(0);
  await edit.getByRole("radio", { name: "Hourly rate", exact: true }).check();
  await edit
    .getByRole("textbox", { name: "Hourly rate", exact: true })
    .fill("110");
  await edit.getByRole("button", { name: "Save changes" }).click();
  await expect(added).toContainText("$110.00/hr");
  expect(await original.textContent()).toBe(originalBefore);
  await expect(staff.getByText("4 overrides", { exact: true })).toBeVisible();
});

test("Escape dismisses the target picker first, then cancels the unsaved form and restores focus", async ({
  page,
}) => {
  const staff = staffRates(page, "Noah Miller");
  const addButton = staff.getByRole("button", {
    name: "Add override for Noah Miller",
    exact: true,
  });
  const dialog = await openAdd(page, "Noah Miller");
  const picker = dialog.getByRole("button", {
    name: /Select a class or service/,
  });
  await picker.click();
  const search = dialog.getByRole("textbox", { name: "Search Class/Service" });
  await search.fill("Music theory");
  await search.press("ArrowDown");
  const option = dialog.getByRole("option", {
    name: "Music theory Group class",
  });
  await expect(option).toBeFocused();
  await option.press("Escape");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("listbox")).toHaveCount(0);
  await expect(picker).toBeFocused();
  await picker.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(addButton).toBeFocused();
  await expect(staff).toContainText("No overrides");
});

test("invalid amounts keep the draft intact, and cancelling an edit leaves the saved rate unchanged", async ({
  page,
}) => {
  const staff = staffRates(page, "Emma Wilson");
  await staff
    .getByRole("button", { name: "Expand Emma Wilson", exact: true })
    .click();
  const row = staff.getByRole("row").filter({ hasText: "Private service" });
  await row.getByRole("button", { name: /^Edit override for Piano ·/ }).click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  const amount = edit.getByRole("textbox", {
    name: "Hourly rate",
    exact: true,
  });
  await amount.fill("60.999");
  await edit.getByRole("button", { name: "Save changes" }).click();
  await expect(edit.getByRole("alert")).toContainText("two decimal places");
  await expect(amount).toHaveValue("60.999");
  await expect(edit).toContainText("Piano");
  await amount.fill("99");
  await edit.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(row).toContainText("$60.00/hr");
  await row.getByRole("button", { name: /^Edit override for Piano ·/ }).click();
  await expect(
    edit.getByRole("textbox", { name: "Hourly rate", exact: true }),
  ).toHaveValue("60.00");
});

test("replacing a tiered structure preserves the inactive flat rate across saved edits", async ({
  page,
}) => {
  const staff = staffRates(page, "Marcus Reed");
  await staff
    .getByRole("button", { name: "Expand Marcus Reed", exact: true })
    .click();
  const row = staff
    .getByRole("row")
    .filter({ hasText: "Sophie Bennett" })
    .filter({ hasText: "Weekly 30-minute plan" });
  const adjacent = staff
    .getByRole("row")
    .filter({ hasText: "Sophie Bennett" })
    .filter({ hasText: "Weekly 60-minute plan" });
  const adjacentBefore = await adjacent.textContent();
  await row
    .getByRole("button", {
      name: /^Edit override for Sophie Bennett ·/,
      exact: true,
    })
    .click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  await expect(
    edit.getByRole("radio", { name: "Tiered pay", exact: true }),
  ).toBeChecked();
  await expect(
    edit.getByRole("textbox", { name: "Hourly rate", exact: true }),
  ).toHaveCount(0);
  await edit.getByRole("button", { name: /^Pay structure / }).click();
  await edit
    .getByRole("option", { name: /^Foundation teaching structure/ })
    .click();
  await expect(
    edit.getByRole("region", { name: "Override summary" }),
  ).toContainText(
    "From Experienced teaching structure (tiered pay) to Foundation teaching structure (tiered pay).",
  );
  await edit.getByRole("button", { name: "Save changes" }).click();
  await expect(row).toContainText("Foundation teaching structure");
  await row
    .getByRole("button", {
      name: /^Edit override for Sophie Bennett ·/,
      exact: true,
    })
    .click();
  await edit.getByRole("radio", { name: "Hourly rate", exact: true }).check();
  await expect(
    edit.getByRole("textbox", { name: "Hourly rate", exact: true }),
  ).toHaveValue("60.00");
  await expect(
    edit.getByRole("region", { name: "Override summary" }),
  ).toContainText(
    "From Foundation teaching structure (tiered pay) to $60.00/hr.",
  );
  await expect(
    edit.getByRole("button", { name: /^Pay structure / }),
  ).toHaveCount(0);
  await edit.getByRole("button", { name: "Save changes" }).click();
  await expect(row).toContainText("$60.00/hr");
  await expect(row).not.toContainText("Tiered pay");
  await expect(staff.getByText("23 overrides", { exact: true })).toBeVisible();
  expect(await adjacent.textContent()).toBe(adjacentBefore);
});

test("canceling structure creation preserves add and edit drafts", async ({
  page,
}) => {
  const add = await openAdd(page, "Noah Miller");
  await chooseTarget(add, "Piano Private service");
  await add
    .getByRole("textbox", { name: "Hourly rate", exact: true })
    .fill("82.50");
  await expect(
    add.getByRole("button", { name: "Create new pay structure", exact: true }),
  ).toHaveCount(0);
  await add.getByRole("radio", { name: "Tiered pay", exact: true }).check();
  const picker = add.getByRole("button", { name: /^Pay structure / });
  await picker.click();
  await add
    .getByRole("textbox", { name: "Search Pay structure", exact: true })
    .fill("Foundation");
  await add
    .getByRole("option", { name: /^Foundation teaching structure/ })
    .click();
  await picker.click();
  const count = await add.getByRole("option").count();
  await add
    .getByRole("button", { name: "Create new pay structure", exact: true })
    .click();
  const notice = page.getByRole("dialog", {
    name: "Create new tiered pay structure",
    exact: true,
  });
  await expect(
    notice.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeFocused();
  await notice
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Unsaved structure");
  await page.keyboard.press("Escape");
  await expect(notice).toHaveCount(0);
  await expect(add).toBeVisible();
  await expect(picker).toBeFocused();
  await expect(picker).toContainText("Foundation teaching structure");
  await picker.click();
  await expect(add.getByRole("option")).toHaveCount(count);
  await page.keyboard.press("Escape");
  await add.getByRole("button", { name: "Add override", exact: true }).click();
  const staff = staffRates(page, "Noah Miller");
  await staff
    .getByRole("button", { name: /^Edit override for Piano ·/ })
    .click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  await edit.getByRole("button", { name: /^Pay structure / }).click();
  await edit
    .getByRole("button", { name: "Create new pay structure", exact: true })
    .click();
  await notice.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    edit.getByRole("button", { name: /^Pay structure / }),
  ).toContainText("Foundation teaching structure");
  await edit.getByRole("radio", { name: "Hourly rate", exact: true }).check();
  await expect(
    edit.getByRole("textbox", { name: "Hourly rate", exact: true }),
  ).toHaveValue("82.50");
  await edit.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(staff).toContainText("Foundation teaching structure");
});

test("Enter in target search cannot submit the previously selected target", async ({
  page,
}) => {
  const staff = staffRates(page, "Noah Miller");
  const dialog = await openAdd(page, "Noah Miller");
  await chooseTarget(dialog, "Piano Private service");
  await dialog
    .getByRole("textbox", { name: "Hourly rate", exact: true })
    .fill("70");
  await dialog
    .getByRole("button", {
      name: "Class/Service Piano Private service",
      exact: true,
    })
    .click();
  const search = dialog.getByRole("textbox", { name: "Search Class/Service" });
  await search.fill("Music theory");
  await search.press("Enter");
  await expect(dialog.getByRole("listbox")).toBeVisible();
  await expect(dialog.getByRole("status")).toHaveCount(0);
  await search.press("ArrowDown");
  const option = dialog.getByRole("option", {
    name: "Music theory Group class",
  });
  await expect(option).toBeFocused();
  await option.press("Enter");
  await dialog
    .getByRole("button", { name: "Add override", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(
    staff.getByRole("row").filter({ hasText: "Music theory" }),
  ).toContainText("$70.00/hr");
  await expect(
    staff.getByRole("row").filter({ hasText: "Private service" }),
  ).toHaveCount(0);
  await expect(staff.getByText("1 override", { exact: true })).toBeVisible();
});

test("deleting an override confirms the exact target and restores focus to the surviving staff action", async ({
  page,
}) => {
  const staff = staffRates(page, "Charlotte Hayes");
  await staff
    .getByRole("button", { name: "Expand Charlotte Hayes", exact: true })
    .click();
  const row = staff.getByRole("row").filter({ hasText: "Sophie Bennett" });
  const remove = row.getByRole("button", {
    name: /^Delete override for Sophie Bennett ·/,
    exact: true,
  });
  await remove.click();
  const dialog = page.getByRole("dialog", {
    name: "Delete override?",
    exact: true,
  });
  await expect(dialog).toContainText("Charlotte Hayes");
  await expect(dialog).toContainText("Sophie Bennett");
  await expect(dialog).toContainText("Weekly 30-minute plan");
  await expect(dialog).toContainText("The enrollment will remain.");
  await expect(
    dialog.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(row).toBeVisible();
  await expect(remove).toBeFocused();
  await remove.click();
  await dialog
    .getByRole("button", { name: "Delete override", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(staff).toContainText("No overrides");
  await expect(
    page.getByRole("status").filter({
      hasText: "Override deleted for Charlotte Hayes.",
    }),
  ).toBeVisible();
  await expect(
    staff.getByRole("button", {
      name: "Add override for Charlotte Hayes",
      exact: true,
    }),
  ).toBeFocused();
});
