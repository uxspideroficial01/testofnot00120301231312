import { expect, test } from "@playwright/test";

test("standard demo exposes only fixed pay methods and retains that configuration after reset", async ({
  page,
}) => {
  await page.goto("/?view=Payroll");
  await expect(page.getByText("150 staff", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Add override for Noah Miller", exact: true })
    .click();
  const add = page.getByRole("dialog", { name: "Add override", exact: true });
  await expect(
    add.getByText(
      "Set a rate for a group class or private service this staff member teaches.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    add.getByText(
      "Set a rate for one student's enrollment in a specific service and billing plan.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    add
      .getByRole("group", { name: "How is pay calculated?" })
      .getByRole("radio"),
  ).toHaveCount(2);
  await expect(
    add.getByRole("radio", { name: "Tiered pay", exact: true }),
  ).toHaveCount(0);
  await add.getByRole("button", { name: "Cancel", exact: true }).click();
  await page
    .getByRole("button", { name: "Expand Marcus Reed", exact: true })
    .click();
  const marcus = page.getByRole("region", {
    name: "Marcus Reed pay rates",
    exact: true,
  });
  await expect(marcus).not.toContainText("Tiered pay");
  await marcus
    .getByRole("button", {
      name: /Edit override for Sophie Bennett · Piano · Weekly 30-minute plan/,
    })
    .click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  await expect(
    edit.getByRole("radio", { name: "Tiered pay", exact: true }),
  ).toHaveCount(0);
  await edit.getByRole("button", { name: "Cancel", exact: true }).click();
  await page
    .getByRole("button", { name: "Reset workspace", exact: true })
    .click();
  await page.getByRole("button", { name: "Payroll", exact: true }).click();
  await page
    .getByRole("button", { name: "Add override for Noah Miller", exact: true })
    .click();
  await expect(
    add.getByRole("radio", { name: "Tiered pay", exact: true }),
  ).toHaveCount(0);
});

test("edit summary compares effective changes and returns to current rate when reverted", async ({
  page,
}) => {
  await page.goto("/?view=Payroll");
  await page
    .getByRole("button", { name: "Expand Emma Wilson", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Edit override for Piano · Private service · Emma Wilson",
      exact: true,
    })
    .click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  const summary = edit.getByRole("region", {
    name: "Override summary",
    exact: true,
  });
  await expect(summary).toContainText("Current rate");
  await expect(summary).not.toContainText("From");
  const amount = edit.getByRole("textbox", {
    name: "Hourly rate",
    exact: true,
  });
  await amount.fill("60");
  await expect(summary).toContainText("Current rate");
  await amount.fill("65");
  await expect(summary).toContainText("From $60.00/hr to $65.00/hr.");
  await amount.fill("60.00");
  await edit
    .getByRole("radio", { name: "Flat per session", exact: true })
    .check();
  await expect(summary).toContainText("From $60.00/hr to $60.00/session.");
  await edit.getByRole("radio", { name: "Hourly rate", exact: true }).check();
  await expect(summary).toContainText("Current rate");
  await expect(summary).not.toContainText("From");
});

test("tiered demo retains current structures and does not announce an unchanged structure as a change", async ({
  page,
}) => {
  await page.goto("/?view=Payroll&payDemo=tiered");
  await page
    .getByRole("button", { name: "Expand Marcus Reed", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: /Edit override for Sophie Bennett · Piano · Weekly 30-minute plan · Marcus Reed/,
    })
    .click();
  const edit = page.getByRole("dialog", { name: "Edit override", exact: true });
  const summary = edit.getByRole("region", {
    name: "Override summary",
    exact: true,
  });
  await expect(
    edit.getByRole("radio", { name: "Tiered pay", exact: true }),
  ).toBeChecked();
  await expect(summary).toContainText("Current rate");
  await expect(summary).toContainText("Experienced teaching structure");
  await edit.getByRole("button", { name: /^Pay structure / }).click();
  await expect(
    edit.getByRole("button", { name: "Create new pay structure", exact: true }),
  ).toBeVisible();
  await edit
    .getByRole("option", { name: /^Foundation teaching structure/ })
    .click();
  await expect(summary).toContainText(
    "From Experienced teaching structure (tiered pay) to Foundation teaching structure (tiered pay).",
  );
});
