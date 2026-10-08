import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_FAMILIES, DEMO_FAMILY } from "../demo/families.ts";
import { searchFamilies } from "./family-search.ts";
import { normalizeFamilySearch } from "./family.ts";

test("demo directory has 120+ distinct synthetic households with two or three children", () => {
  assert.ok(DEMO_FAMILIES.length >= 120);
  assert.equal(
    DEMO_FAMILIES.find((family) => family.id === "martins"),
    DEMO_FAMILY,
  );
  assert.equal(
    new Set(DEMO_FAMILIES.map((family) => family.id)).size,
    DEMO_FAMILIES.length,
  );
  assert.equal(
    new Set(DEMO_FAMILIES.map((family) => family.guardian.email)).size,
    DEMO_FAMILIES.length,
  );
  const childIds = DEMO_FAMILIES.flatMap((family) =>
    family.members.map((member) => member.id),
  );
  assert.equal(new Set(childIds).size, childIds.length);
  for (const family of DEMO_FAMILIES) {
    assert.match(family.guardian.email, /@example\.com$/);
    assert.ok(family.members.length >= 2 && family.members.length <= 3);
  }
});

test("paginating the whole directory returns every household exactly once in stable order", () => {
  const first = searchFamilies(DEMO_FAMILIES, "");
  assert.equal(first.page, 1);
  assert.equal(first.items.length, 8);
  assert.equal(first.total, DEMO_FAMILIES.length);
  const items = Array.from({ length: first.pageCount }, (_, pageIndex) => {
    const result = searchFamilies(DEMO_FAMILIES, "", { page: pageIndex + 1 });
    assert.ok(result.items.length <= 8);
    assert.equal(result.page, pageIndex + 1);
    assert.equal(result.total, first.total);
    return result.items;
  }).flat();
  const ids = items.map((family) => family.id);
  assert.equal(new Set(ids).size, DEMO_FAMILIES.length);
  assert.deepEqual(
    [...ids].sort(),
    DEMO_FAMILIES.map((family) => family.id).sort(),
  );
  const names = items.map((family) => normalizeFamilySearch(family.name));
  assert.deepEqual(names, [...names].sort());
  const reversedInput = [...DEMO_FAMILIES].reverse();
  const reversedIds = Array.from({ length: first.pageCount }, (_, index) =>
    searchFamilies(reversedInput, "", { page: index + 1 }).items.map(
      (family) => family.id,
    ),
  ).flat();
  assert.deepEqual(reversedIds, ids);
});

test("similar surnames can be distinguished by guardian, child and email", () => {
  assert.deepEqual(
    searchFamilies(DEMO_FAMILIES, "martins").items.map((family) => family.id),
    ["martins", "martins-olivia"],
  );
  assert.deepEqual(
    searchFamilies(DEMO_FAMILIES, "Olivia Martins").items.map(
      (family) => family.id,
    ),
    ["martins-olivia"],
  );
  assert.deepEqual(
    searchFamilies(DEMO_FAMILIES, "Clara").items.map((family) => family.id),
    ["martins"],
  );
  assert.deepEqual(
    searchFamilies(DEMO_FAMILIES, "OLIVIA.MARTINS@EXAMPLE.COM").items.map(
      (family) => family.id,
    ),
    ["martins-olivia"],
  );
  assert.deepEqual(
    searchFamilies(DEMO_FAMILIES, "household.120@example.com").items.map(
      (family) => family.id,
    ),
    ["synthetic-family-120"],
  );
});

test("accent, case and whitespace normalization applies to guardian and child searches", () => {
  for (const query of [
    "jose alvarez",
    "  JOSÉ    ÁLVAREZ  ",
    "Jose\tAlvarez",
  ]) {
    assert.deepEqual(
      searchFamilies(DEMO_FAMILIES, query).items.map((family) => family.id),
      ["alvarez-jose"],
    );
  }
  assert.deepEqual(
    searchFamilies(DEMO_FAMILIES, "ines martinez").items.map(
      (family) => family.id,
    ),
    ["martinez-ana"],
  );
  assert.deepEqual(
    searchFamilies(DEMO_FAMILIES, "Inés Martínez"),
    searchFamilies(DEMO_FAMILIES, "Ines Martinez"),
  );
});

test("pagination clamps sizes and pages, including non-finite inputs", () => {
  assert.equal(
    searchFamilies(DEMO_FAMILIES, "", { pageSize: 1000 }).items.length,
    10,
  );
  assert.equal(
    searchFamilies(DEMO_FAMILIES, "", { pageSize: 0 }).items.length,
    1,
  );
  assert.equal(
    searchFamilies(DEMO_FAMILIES, "", { pageSize: 8.9 }).items.length,
    8,
  );
  assert.equal(
    searchFamilies(DEMO_FAMILIES, "", { pageSize: Number.NaN }).items.length,
    8,
  );
  assert.equal(
    searchFamilies(DEMO_FAMILIES, "", { pageSize: Infinity }).items.length,
    8,
  );
  for (const page of [-10, 0, Number.NaN, Infinity]) {
    assert.equal(searchFamilies(DEMO_FAMILIES, "", { page }).page, 1);
  }
  const last = searchFamilies(DEMO_FAMILIES, "", {
    page: Number.MAX_SAFE_INTEGER,
  });
  assert.equal(last.page, last.pageCount);
  assert.ok(last.items.length > 0 && last.items.length <= 8);
  assert.equal(searchFamilies(DEMO_FAMILIES, "", { page: 2.9 }).page, 2);
});

test("empty search results have a consistent page contract", () => {
  const empty = { items: [], total: 0, page: 1, pageCount: 0 };
  assert.deepEqual(
    searchFamilies(DEMO_FAMILIES, "a-nonexistent-household", { page: 99 }),
    empty,
  );
  assert.deepEqual(searchFamilies([], ""), empty);
});

test("search never sorts or edits the source directory", () => {
  const families = structuredClone(DEMO_FAMILIES).reverse();
  const snapshot = structuredClone(families);
  for (const family of families) {
    Object.freeze(family.guardian);
    family.members.forEach(Object.freeze);
    Object.freeze(family.members);
    Object.freeze(family);
  }
  Object.freeze(families);
  searchFamilies(families, "", { page: 3 });
  searchFamilies(families, "martins");
  assert.deepEqual(families, snapshot);
});
