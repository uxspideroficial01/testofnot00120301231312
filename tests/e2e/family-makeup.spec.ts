import { expect, test, type Page } from "@playwright/test";

async function openFamilyFilter(page: Page) {
  await page.getByRole("button", { name: /^Filter/ }).click();
  const dialog = page.getByRole("dialog", { name: "Session filters" });
  await dialog.getByRole("button", { name: "Family", exact: true }).click();
  return dialog;
}

test("profile dates open the exact recurring session occurrence", async ({
  page,
}) => {
  await page.goto("/?view=Members&person=Garcia%20Lopez-Paul");
  await page.getByRole("button", { name: /Mar 29/ }).click();
  const dialog = page.getByRole("dialog", {
    name: "Garcia Lopez-Paul - Introduction to Oneiromancy",
  });
  await expect(dialog).toContainText("March 29, 2027");
  await expect(dialog).not.toContainText("March 28, 2027");
});

test("family selection is a cancellable draft and isolates homonymous households", async ({
  page,
}) => {
  await page.goto("/?view=Sessions&family=martins");
  let picker = await openFamilyFilter(page);
  await picker.getByRole("textbox").fill("martins");
  await expect(picker.getByRole("radio")).toHaveCount(2);
  await picker.getByRole("radio", { name: /Olivia Martins/ }).click();
  await page.keyboard.press("Escape");
  await expect(picker).not.toBeVisible();
  await expect(page).toHaveURL(/family=martins$/);
  await expect(page.getByRole("table")).toContainText("Clara Martins");

  picker = await openFamilyFilter(page);
  await picker.getByRole("textbox").fill("olivia.martins@example.com");
  await picker.getByRole("radio", { name: /Olivia Martins/ }).click();
  await picker.getByRole("button", { name: "Apply filter" }).click();
  await expect(page).toHaveURL(/family=martins-olivia$/);
  const table = page.getByRole("table");
  await expect(table).toContainText("Theo Martins");
  await expect(table).toContainText("Lily Martins");
  await expect(table).not.toContainText("Clara Martins");
  await page.reload();
  await expect(table).toContainText("Theo Martins");
});

test("family search pages results, reports empty results and supports keyboard selection", async ({
  page,
}) => {
  await page.goto("/?view=Sessions");
  const picker = await openFamilyFilter(page);
  await expect(picker.getByRole("radio")).toHaveCount(8);
  await expect(picker).toContainText("1–8 of 125");
  await picker.getByRole("button", { name: "Next families" }).click();
  await expect(picker).toContainText("9–16 of 125");
  await picker.getByRole("textbox").fill("no-such-household");
  await expect(picker).toContainText("No matching families");
  await expect(picker.getByRole("radio")).toHaveCount(0);
  await picker.getByRole("textbox").fill("Clara");
  await picker.getByRole("textbox").press("ArrowDown");
  await expect(picker.getByRole("radio")).toBeFocused();
  await expect(picker.getByRole("radio")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await picker.getByRole("button", { name: "Apply filter" }).click();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(4);
});

test("private notes never populate the shared note editor", async ({
  page,
}) => {
  await page.goto("/?view=Sessions&family=martins");
  await page
    .getByRole("table")
    .getByRole("button", { name: "Clara Martins - Piano", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Clara Martins - Piano",
    exact: true,
  });
  await dialog
    .getByRole("button", { name: "Private notes", exact: true })
    .click();
  await dialog
    .getByRole("textbox", { name: "Private notes", exact: true })
    .fill("Internal scheduling context");
  await dialog
    .getByRole("button", { name: "Shared notes", exact: true })
    .click();
  await expect(
    dialog.getByRole("textbox", { name: "Shared notes", exact: true }),
  ).toHaveValue("");
  await dialog
    .getByRole("textbox", { name: "Shared notes", exact: true })
    .fill("Family-facing reminder");
  await dialog
    .getByRole("button", { name: "Private notes", exact: true })
    .click();
  await expect(
    dialog.getByRole("textbox", { name: "Private notes", exact: true }),
  ).toHaveValue("Internal scheduling context");
});

test("makeup confirmation preserves the original and siblings, then prevents another booking", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?view=Sessions&family=martins");
  const table = page.getByRole("table");
  const siblingRows = table
    .getByRole("row")
    .filter({ hasText: /Lucas Martins|Sofia Martins/ });
  const siblingsBefore = await siblingRows.allTextContents();
  await table
    .getByRole("button", { name: "Clara Martins - Piano", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Schedule makeup", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Schedule makeup",
    exact: true,
  });
  await expect(
    dialog.getByRole("button", { name: "Review makeup" }),
  ).toBeDisabled();
  await dialog.getByRole("radio", { name: /Thu, Oct 8.*4:00 PM/ }).click();
  await dialog.getByRole("button", { name: "All available times" }).click();
  await expect(
    dialog.getByRole("button", { name: "Review makeup" }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Same day as siblings" }).click();
  await dialog.getByRole("radio", { name: /Thu, Oct 8.*4:00 PM/ }).click();
  await dialog.getByRole("button", { name: "Review makeup" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Review makeup lesson" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Issue & schedule" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Clara’s makeup is scheduled" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Done", exact: true }).click();
  await expect(
    table.getByRole("row").filter({ hasText: "Makeup scheduled" }),
  ).toHaveCount(1);
  expect(await siblingRows.allTextContents()).toEqual(siblingsBefore);
  const original = table.getByRole("row").filter({ hasText: "Cancelled" });
  await expect(original).toContainText("Thu Oct 01 2026");
  await original.getByRole("button", { name: "Clara Martins - Piano" }).click();
  const details = page.getByRole("dialog", {
    name: "Clara Martins - Piano",
    exact: true,
  });
  await expect(
    details.getByRole("button", { name: "Schedule makeup", exact: true }),
  ).toHaveCount(0);
  await expect(details).toContainText("Scheduled");
  expect(errors).toEqual([]);
});
