import { expect, test } from "@playwright/test";

test("hourly example follows valid draft amounts without submitting or retaining stale examples", async ({
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
  const amount = dialog.getByRole("textbox", {
    name: "Hourly rate",
    exact: true,
  });
  const help = dialog.locator("#pay-method-help");
  await expect(help).toHaveText(
    "Pay depends on session duration. For example, $45/hour pays $22.50 for 30 minutes.",
  );
  for (const [input, example] of [
    ["100", "$100/hour pays $50"],
    ["75.50", "$75.50/hour pays $37.75"],
    ["60.01", "$60.01/hour pays about $30.01"],
    ["0", "$0/hour pays $0"],
  ]) {
    await amount.fill(input);
    await expect(help).toHaveText(
      `Pay depends on session duration. For example, ${example} for 30 minutes.`,
    );
  }
  for (const invalid of ["", "abc", "-1", "1.234"]) {
    await amount.fill(invalid);
    await expect(help).toHaveText("Pay depends on session duration.");
  }
  await amount.fill("100");
  await dialog
    .getByRole("radio", { name: "Flat per session", exact: true })
    .check();
  await expect(help).toHaveText(
    "The same amount for each session, regardless of duration.",
  );
  await dialog.getByRole("radio", { name: "Hourly rate", exact: true }).check();
  await expect(help).toContainText("$100/hour pays $50");
});
