import { expect, test } from "@playwright/test";

test("selecting a class by mouse retains the choice after search loses focus", async ({
  page,
}) => {
  await page.goto("/?view=Payroll");
  await page
    .getByRole("button", { name: "Add override for Emma Wilson", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Add override",
    exact: true,
  });
  await dialog
    .getByRole("button", {
      name: "Class/Service Select a class or service",
      exact: true,
    })
    .click();
  await expect(
    dialog.getByRole("textbox", { name: "Search Class/Service", exact: true }),
  ).toBeFocused();
  await dialog
    .getByRole("option", { name: "Songwriting Private service", exact: true })
    .click();
  await expect(
    dialog.getByRole("button", {
      name: "Class/Service Songwriting Private service",
      exact: true,
    }),
  ).toBeVisible();
  await expect(dialog.getByRole("listbox")).toHaveCount(0);
  await expect(
    dialog.getByRole("region", { name: "Override summary" }),
  ).toContainText("Songwriting");
  await dialog
    .getByRole("button", { name: "Add override", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("table", { name: "Overrides for Emma Wilson", exact: true }),
  ).toContainText("Songwriting");
});

test("enrollment selection survives search blur and retains student and plan", async ({
  page,
}) => {
  await page.goto("/?view=Payroll");
  await page
    .getByRole("button", { name: "Add override for Noah Miller", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Add override",
    exact: true,
  });
  await dialog.getByRole("radio", { name: /^Enrollment / }).check();
  await dialog
    .getByRole("button", {
      name: "Enrollment Select an enrollment",
      exact: true,
    })
    .click();
  await dialog
    .getByRole("textbox", { name: "Search Enrollment", exact: true })
    .fill("Sophie");
  await dialog
    .getByRole("option", {
      name: "Sophie Bennett Piano · Weekly 60-minute plan",
      exact: true,
    })
    .click();
  await expect(
    dialog.getByRole("button", {
      name: "Enrollment Sophie Bennett Piano · Weekly 60-minute plan",
      exact: true,
    }),
  ).toBeVisible();
});

test("pay structure option and create action both work with mouse", async ({
  page,
}) => {
  await page.goto("/?view=Payroll&payDemo=tiered");
  await page
    .getByRole("button", { name: "Add override for Noah Miller", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Add override",
    exact: true,
  });
  await dialog.getByRole("radio", { name: "Tiered pay", exact: true }).check();
  const picker = dialog.getByRole("button", { name: /^Pay structure / });
  await picker.click();
  await dialog
    .getByRole("option", { name: /^Foundation teaching structure / })
    .click();
  await expect(picker).toContainText("Foundation teaching structure");
  await picker.click();
  await dialog
    .getByRole("button", { name: "Create new pay structure", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", {
      name: "Create new tiered pay structure",
      exact: true,
    }),
  ).toBeVisible();
});

test("picker dismisses outside and preserves keyboard selection and escape", async ({
  page,
}) => {
  await page.goto("/?view=Payroll");
  await page
    .getByRole("button", { name: "Add override for Emma Wilson", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Add override",
    exact: true,
  });
  const picker = dialog.getByRole("button", { name: /^Class\/Service / });
  await picker.click();
  await dialog
    .getByRole("heading", { name: "Add override", exact: true })
    .click();
  await expect(dialog.getByRole("listbox")).toHaveCount(0);
  await picker.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await expect(picker).toBeFocused();
  await picker.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(picker).toContainText("Beginner ensemble");
  await picker.click();
  await dialog
    .getByRole("textbox", { name: "Hourly rate", exact: true })
    .focus();
  await expect(dialog.getByRole("listbox")).toHaveCount(0);
});
