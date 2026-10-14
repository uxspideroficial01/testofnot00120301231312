import assert from "node:assert/strict";
import test from "node:test";
import {
  PAY_CAPABILITIES,
  PAY_OVERRIDES,
  PAY_STAFF,
  PAY_STRUCTURES,
} from "./fixtures.ts";
import {
  formatPayRate,
  getFixedRate,
  parseRateAmount,
  validateOverride,
} from "./model.ts";
import type { PayOverride, PayRate, PayStaff } from "./model.ts";

const staff: PayStaff = {
  id: "staff-test",
  name: "Fictional instructor",
  detail: "Demo",
  defaultRate: { method: "hourly", cents: 5000 },
  targets: [
    {
      id: "piano",
      kind: "class-service",
      name: "Piano",
      detail: "Private service",
      serviceId: "piano",
    },
    {
      id: "enrollment",
      kind: "enrollment",
      name: "Fictional student",
      detail: "Piano · Weekly plan",
      serviceId: "piano",
    },
  ],
};
const saved: PayOverride = {
  id: "saved",
  staffId: staff.id,
  targetId: "piano",
  rate: { method: "hourly", cents: 6000 },
};

test("decimal parsing preserves cents exactly and rejects ambiguous or unsafe input", () => {
  for (const [input, cents] of [
    ["0", 0],
    ["0.00", 0],
    ["60", 6000],
    ["1.23", 123],
    ["0.29", 29],
    [" 45.5 ", 4550],
  ] as const) {
    assert.equal(parseRateAmount(input), cents);
  }
  for (const input of [
    "",
    " ",
    "-1",
    "1.234",
    "NaN",
    "Infinity",
    "1e3",
    "$60",
    "1,000",
    "5.0.1",
    "60abc",
    "9007199254740992",
  ]) {
    assert.equal(parseRateAmount(input), null, input);
  }
});

test("money display distinguishes hourly, per-session and named tiered structures", () => {
  assert.equal(
    formatPayRate({ method: "hourly", cents: 0 }, PAY_STRUCTURES),
    "$0.00/hr",
  );
  assert.equal(
    formatPayRate({ method: "session", cents: 4550 }, PAY_STRUCTURES),
    "$45.50/session",
  );
  assert.equal(
    formatPayRate(
      { method: "tiered", structureId: "demo-foundation" },
      PAY_STRUCTURES,
    ),
    "Foundation teaching structure",
  );
  assert.equal(
    formatPayRate({ method: "tiered", structureId: "missing" }, PAY_STRUCTURES),
    "Unavailable pay structure",
  );
});

test("creation validates staff ownership and finite, nonnegative integer cents", () => {
  assert.equal(
    validateOverride(staff, [], {
      targetId: "piano",
      rate: { method: "hourly", cents: 0 },
    }),
    null,
  );
  assert.notEqual(
    validateOverride(staff, [], {
      targetId: "another-staff-target",
      rate: saved.rate,
    }),
    null,
  );
  for (const cents of [-1, 0.1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.notEqual(
      validateOverride(staff, [], {
        targetId: "piano",
        rate: { method: "hourly", cents },
      }),
      null,
    );
  }
});

test("demo duplicate policy is scoped to staff and target, and editing excludes itself", () => {
  assert.notEqual(
    validateOverride(staff, [saved], { targetId: "piano", rate: saved.rate }),
    null,
  );
  assert.equal(
    validateOverride(staff, [saved], {
      id: saved.id,
      targetId: saved.targetId,
      rate: { method: "session", cents: 3500 },
    }),
    null,
  );
  assert.equal(
    validateOverride(staff, [saved], {
      targetId: "enrollment",
      rate: saved.rate,
    }),
    null,
  );
  assert.equal(
    validateOverride(staff, [{ ...saved, staffId: "someone-else" }], {
      targetId: "piano",
      rate: saved.rate,
    }),
    null,
  );
});

test("editing cannot retarget an override, cross staff boundaries, or recreate a missing record", () => {
  assert.notEqual(
    validateOverride(staff, [saved], {
      id: saved.id,
      targetId: "enrollment",
      rate: saved.rate,
    }),
    null,
  );
  assert.notEqual(
    validateOverride({ ...staff, id: "someone-else" }, [saved], {
      id: saved.id,
      targetId: "piano",
      rate: saved.rate,
    }),
    null,
  );
  assert.notEqual(
    validateOverride(staff, [], {
      id: saved.id,
      targetId: "piano",
      rate: saved.rate,
    }),
    null,
  );
});

test("tiered flag blocks new assignments but preserves an existing structure", () => {
  const rate: PayRate = { method: "tiered", structureId: "demo-foundation" };
  const existing: PayOverride = { ...saved, rate };
  assert.notEqual(
    validateOverride(staff, [], { targetId: "piano", rate }, PAY_STRUCTURES),
    null,
  );
  assert.equal(
    validateOverride(
      staff,
      [existing],
      { id: existing.id, targetId: "piano", rate },
      PAY_STRUCTURES,
    ),
    null,
  );
  assert.notEqual(
    validateOverride(
      staff,
      [existing],
      {
        id: existing.id,
        targetId: "piano",
        rate: { method: "tiered", structureId: "demo-experienced" },
      },
      PAY_STRUCTURES,
    ),
    null,
  );
  assert.equal(
    validateOverride(staff, [], { targetId: "piano", rate }, PAY_STRUCTURES, {
      tieredEnabled: true,
    }),
    null,
  );
  assert.notEqual(
    validateOverride(
      staff,
      [],
      { targetId: "piano", rate: { method: "tiered", structureId: "missing" } },
      PAY_STRUCTURES,
      { tieredEnabled: true },
    ),
    null,
  );
  assert.equal(
    validateOverride(
      staff,
      [existing],
      {
        id: existing.id,
        targetId: "piano",
        rate: { method: "hourly", cents: 5000 },
      },
      PAY_STRUCTURES,
    ),
    null,
  );
});

test("validation is pure and does not mutate saved compensation", () => {
  const snapshot = structuredClone(saved);
  const overrides = [saved];
  validateOverride(staff, overrides, {
    id: saved.id,
    targetId: "piano",
    rate: { method: "session", cents: 7000 },
  });
  assert.deepEqual(saved, snapshot);
  assert.equal(overrides.length, 1);
});

test("fixtures cover scale, empty staff, similar enrollments and valid references", () => {
  assert.equal(PAY_STAFF.length, 150);
  assert.equal(new Set(PAY_STAFF.map((person) => person.id)).size, 150);
  assert.equal(new Set(PAY_STAFF.map((person) => person.name)).size, 150);
  const targets = PAY_STAFF.flatMap((person) => person.targets);
  assert.equal(
    new Set(targets.map((target) => target.id)).size,
    targets.length,
  );
  assert.equal(
    new Set(PAY_OVERRIDES.map((override) => override.id)).size,
    PAY_OVERRIDES.length,
  );
  const counts = PAY_STAFF.map(
    (person) =>
      PAY_OVERRIDES.filter((override) => override.staffId === person.id).length,
  );
  assert.ok(counts.includes(23));
  assert.ok(counts.filter((count) => count === 0).length >= 3);
  const emma = PAY_STAFF[0];
  assert.equal(emma.name, "Emma Wilson");
  assert.deepEqual(emma.defaultRate, { method: "hourly", cents: 5000 });
  assert.equal(counts[0], 3);
  assert.ok(emma.targets.length - counts[0] >= 3);
  const similar = emma.targets.filter(
    (target) => target.name === "Sophie Bennett",
  );
  assert.equal(similar.length, 2);
  assert.notEqual(similar[0].detail, similar[1].detail);
  for (const override of PAY_OVERRIDES) {
    const owner = PAY_STAFF.find((person) => person.id === override.staffId);
    assert.ok(owner);
    assert.equal(
      validateOverride(
        owner,
        PAY_OVERRIDES,
        override,
        PAY_STRUCTURES,
        PAY_CAPABILITIES,
      ),
      null,
      override.id,
    );
  }
});

test("tiered assignments retain fixed values without displaying them as active pay", () => {
  const fixed: PayRate = { method: "session", cents: 7250 };
  const tiered: PayRate = {
    method: "tiered",
    structureId: "demo-foundation",
    retainedFlatRate: fixed,
  };
  assert.deepEqual(getFixedRate(tiered), fixed);
  assert.equal(
    formatPayRate(tiered, PAY_STRUCTURES),
    "Foundation teaching structure",
  );
  assert.equal(
    getFixedRate({ method: "tiered", structureId: "demo-foundation" }),
    undefined,
  );
  assert.deepEqual(getFixedRate(fixed), fixed);
});
