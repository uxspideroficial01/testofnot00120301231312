import assert from "node:assert/strict";
import test from "node:test";
import { PAY_DEMOS } from "./demo-scenarios.ts";
import { PAY_OVERRIDES, PAY_STAFF } from "./fixtures.ts";

test("standard and tiered demos preserve roster and targets without mutating the tiered fixtures", () => {
  const { standard, tiered } = PAY_DEMOS;
  assert.equal(standard.capabilities.tieredEnabled, false);
  assert.equal(standard.staff.length, 150);
  assert.deepEqual(
    standard.staff.map(({ id, targets }) => ({ id, targets })),
    tiered.staff.map(({ id, targets }) => ({ id, targets })),
  );
  assert.deepEqual(
    standard.overrides.map(({ id, staffId, targetId }) => ({
      id,
      staffId,
      targetId,
    })),
    tiered.overrides.map(({ id, staffId, targetId }) => ({
      id,
      staffId,
      targetId,
    })),
  );
  assert.ok(
    standard.staff.every(({ defaultRate }) => defaultRate.method !== "tiered"),
  );
  assert.ok(standard.overrides.every(({ rate }) => rate.method !== "tiered"));
  assert.equal(standard.structures.length, 0);
  assert.equal(tiered.capabilities.tieredEnabled, true);
  assert.equal(tiered.staff, PAY_STAFF);
  assert.equal(tiered.overrides, PAY_OVERRIDES);
  assert.ok(tiered.overrides.some(({ rate }) => rate.method === "tiered"));
  assert.ok(
    tiered.staff.some(({ defaultRate }) => defaultRate.method === "tiered"),
  );
});
