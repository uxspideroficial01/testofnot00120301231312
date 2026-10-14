import assert from "node:assert/strict";
import { test } from "node:test";
import { getOverrideTargets } from "./override-targets.ts";
import type { PayStaff, PayOverride } from "./model.ts";

const staff: PayStaff = {
  id: "teacher",
  name: "Teacher",
  detail: "",
  defaultRate: { method: "hourly", cents: 5000 },
  targets: [
    {
      id: "piano",
      kind: "class-service",
      name: "Piano",
      detail: "Private service",
      serviceId: "piano",
    },
  ],
};
const override: PayOverride = {
  id: "override",
  staffId: staff.id,
  targetId: "piano",
  rate: { method: "hourly", cents: 6000 },
};

test("missing links are not described as existing overrides", () => {
  const result = getOverrideTargets(staff, "enrollment", [override]);
  assert.equal(result.available.length, 0);
  assert.match(result.emptyMessage!, /^No enrollments are linked/);
  const empty = getOverrideTargets(
    { ...staff, targets: [] },
    "class-service",
    [],
  );
  assert.match(empty.emptyMessage!, /^No classes or services are linked/);
});

test("fully assigned targets explain how to edit existing overrides", () => {
  const result = getOverrideTargets(staff, "class-service", [override]);
  assert.equal(result.available.length, 0);
  assert.match(
    result.emptyMessage!,
    /^All linked classes or services already have overrides/,
  );
});

test("another staff member's override does not exhaust linked targets", () => {
  const result = getOverrideTargets(staff, "class-service", [
    { ...override, staffId: "other" },
  ]);
  assert.deepEqual(result.available, staff.targets);
  assert.equal(result.emptyMessage, undefined);
});

test("editing retains the current target while additions exclude it", () => {
  const result = getOverrideTargets(
    staff,
    "class-service",
    [override],
    override.id,
  );
  assert.deepEqual(result.available, staff.targets);
  assert.equal(result.emptyMessage, undefined);
  assert.equal(
    getOverrideTargets(staff, "class-service", [override]).available.length,
    0,
  );
});
