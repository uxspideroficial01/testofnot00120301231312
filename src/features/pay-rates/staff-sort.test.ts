import assert from "node:assert/strict";
import test from "node:test";
import type { PayOverride, PayStaff } from "./model.ts";
import { nextStaffSort, sortStaff, type StaffSort } from "./staff-sort.ts";

const roster: PayStaff[] = [
  {
    id: "zoe",
    name: "Zoe",
    detail: "",
    defaultRate: { method: "hourly", cents: 900 },
    targets: [],
  },
  {
    id: "amy",
    name: "Amy",
    detail: "",
    defaultRate: { method: "hourly", cents: 10000 },
    targets: [],
  },
  {
    id: "ada",
    name: "Ada",
    detail: "",
    defaultRate: { method: "hourly", cents: 900 },
    targets: [],
  },
  {
    id: "zero",
    name: "Zero",
    detail: "",
    defaultRate: { method: "hourly", cents: 0 },
    targets: [],
  },
  {
    id: "tiered",
    name: "Tiered",
    detail: "",
    defaultRate: {
      method: "tiered",
      structureId: "existing",
      retainedFlatRate: { method: "hourly", cents: 999999 },
    },
    targets: [],
  },
];
const overrides: PayOverride[] = [
  {
    id: "one",
    staffId: "zoe",
    targetId: "one",
    rate: { method: "hourly", cents: 1000 },
  },
  {
    id: "two",
    staffId: "zoe",
    targetId: "two",
    rate: { method: "hourly", cents: 1000 },
  },
  {
    id: "three",
    staffId: "amy",
    targetId: "three",
    rate: { method: "hourly", cents: 1000 },
  },
];
const ids = (sort: StaffSort) =>
  sortStaff(roster, overrides, sort).map((staff) => staff.id);

test("names sort alphabetically in both directions without mutating the source roster", () => {
  const before = structuredClone(roster);
  assert.deepEqual(ids({ key: "name", direction: "ascending" }), [
    "ada",
    "amy",
    "tiered",
    "zero",
    "zoe",
  ]);
  assert.deepEqual(ids({ key: "name", direction: "descending" }), [
    "zoe",
    "zero",
    "tiered",
    "amy",
    "ada",
  ]);
  assert.deepEqual(sortStaff(roster, overrides, null), before);
  assert.deepEqual(roster, before);
});

test("rates sort numerically, include zero, break ties by name and keep tiered pay last in either direction", () => {
  assert.deepEqual(ids({ key: "default-rate", direction: "ascending" }), [
    "zero",
    "ada",
    "zoe",
    "amy",
    "tiered",
  ]);
  assert.deepEqual(ids({ key: "default-rate", direction: "descending" }), [
    "amy",
    "ada",
    "zoe",
    "zero",
    "tiered",
  ]);
});

test("override sorting counts current assignments including zero and updates after deletion", () => {
  assert.deepEqual(ids({ key: "overrides", direction: "ascending" }), [
    "ada",
    "tiered",
    "zero",
    "amy",
    "zoe",
  ]);
  assert.deepEqual(ids({ key: "overrides", direction: "descending" }), [
    "zoe",
    "amy",
    "ada",
    "tiered",
    "zero",
  ]);
  const remaining = overrides.filter((override) => override.staffId !== "zoe");
  assert.equal(
    sortStaff(roster, remaining, {
      key: "overrides",
      direction: "descending",
    })[0].id,
    "amy",
  );
});

test("the same heading reverses order and another heading starts ascending", () => {
  const first = nextStaffSort(null, "name");
  assert.deepEqual(first, { key: "name", direction: "ascending" });
  assert.deepEqual(nextStaffSort(first, "name"), {
    key: "name",
    direction: "descending",
  });
  assert.deepEqual(nextStaffSort(first, "overrides"), {
    key: "overrides",
    direction: "ascending",
  });
});
