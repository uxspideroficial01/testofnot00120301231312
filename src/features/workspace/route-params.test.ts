import assert from "node:assert/strict";
import test from "node:test";
import { parseWorkspaceParams } from "./route-params.ts";
import { DEMO_FAMILIES, DEMO_FAMILY } from "@/demo/families";

test("only the explicit tiered demo link selects the tiered fixture organization", () => {
  assert.equal(
    parseWorkspaceParams({ payDemo: "tiered" }).payDemoScenario,
    "tiered",
  );
  for (const payDemo of [
    undefined,
    "standard",
    "true",
    "unknown",
    ["tiered", "standard"],
  ]) {
    assert.equal(parseWorkspaceParams({ payDemo }).payDemoScenario, "standard");
  }
});

test("unknown or repeated view parameters fall back to Calendar", () => {
  for (const view of ["unknown", ["Staff", "Members"], "<script>"]) {
    assert.equal(parseWorkspaceParams({ view }).initialView, "Calendar");
  }
});

test("family parameters resolve stable directory IDs and preserve the original Martins link", () => {
  for (const family of DEMO_FAMILIES) {
    assert.equal(
      parseWorkspaceParams({ view: "Sessions", family: family.id })
        .initialFamilyId,
      family.id,
    );
  }
  assert.equal(
    parseWorkspaceParams({ family: "Martins" }).initialFamilyId,
    DEMO_FAMILY.id,
  );
  assert.equal(parseWorkspaceParams({ family: "Martins" }).initialFamily, true);
});

test("invalid or repeated family parameters never select a different family", () => {
  for (const family of [
    "unknown",
    "mart",
    "<script>",
    "martins\u0000",
    ["martins", "martin-james"],
  ]) {
    const parsed = parseWorkspaceParams({ family });
    assert.equal(parsed.initialFamilyId, null);
    assert.equal(parsed.initialFamily, false);
  }
});
test("only people views accept a bounded profile name", () => {
  assert.equal(
    parseWorkspaceParams({ view: "Staff", person: "  Demo Teacher  " })
      .initialPerson,
    "Demo Teacher",
  );
  for (const person of ["x".repeat(121), "bad\u0000name", ["a", "b"]]) {
    assert.equal(
      parseWorkspaceParams({ view: "Staff", person }).initialPerson,
      undefined,
    );
  }
  assert.equal(
    parseWorkspaceParams({ view: "Calendar", person: "Demo Teacher" })
      .initialPerson,
    undefined,
  );
});
