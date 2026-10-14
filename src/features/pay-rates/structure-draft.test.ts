import { test } from "node:test";
import assert from "node:assert/strict";
import { parseStructureDraft, type StructureDraft } from "./structure-draft.ts";

const draft: StructureDraft = {
  name: "  Teaching rates  ",
  description: "Progression",
  referralAmount: "12.35",
  tiers: [
    { id: "a", startHours: "0", amount: "50.25" },
    { id: "b", startHours: "10.5", amount: "65" },
  ],
};
test("structure stores exact cents and boundaries without calculating payroll", () => {
  const result = parseStructureDraft(draft);
  assert.ok("value" in result);
  assert.deepEqual(result.value, {
    name: "Teaching rates",
    description: "Progression",
    definition: {
      referralHourlyCents: 1235,
      tiers: [
        { startHours: 0, cents: 5025 },
        { startHours: 10.5, cents: 6500 },
      ],
    },
  });
});
test("structure rejects missing identity, empty tiers and invalid currency", () => {
  for (const invalid of [
    { ...draft, name: " " },
    { ...draft, tiers: [] },
    { ...draft, referralAmount: "-1" },
    { ...draft, referralAmount: "0.001" },
    { ...draft, tiers: [{ id: "a", startHours: "0", amount: "NaN" }] },
  ]) {
    assert.ok("error" in parseStructureDraft(invalid));
  }
});
test("tier boundaries start at zero and strictly increase", () => {
  for (const starts of [
    ["1"],
    ["0", "0"],
    ["0", "10", "5"],
    ["0", ""],
    ["0", "Infinity"],
  ]) {
    assert.ok(
      "error" in
        parseStructureDraft({
          ...draft,
          tiers: starts.map((startHours, index) => ({
            id: String(index),
            startHours,
            amount: "0",
          })),
        }),
    );
  }
});
