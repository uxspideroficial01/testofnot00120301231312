import { matchesFamily, normalizeFamilySearch, type Family } from "./family.ts";

export const DEFAULT_FAMILY_PAGE_SIZE = 8;
export const MAX_FAMILY_PAGE_SIZE = 10;

export interface FamilySearchOptions {
  page?: number;
  pageSize?: number;
}

export interface FamilySearchResult {
  items: Family[];
  total: number;
  page: number;
  pageCount: number;
}

function finiteInteger(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value)
    ? Math.trunc(value)
    : fallback;
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Pure, deterministic search with bounded, one-based pages. */
export function searchFamilies(
  families: readonly Family[],
  query: string,
  options: FamilySearchOptions = {},
): FamilySearchResult {
  const pageSize = Math.min(
    MAX_FAMILY_PAGE_SIZE,
    Math.max(1, finiteInteger(options.pageSize, DEFAULT_FAMILY_PAGE_SIZE)),
  );
  const matching = families
    .filter((family) => matchesFamily(family, query))
    .map((family) => ({
      family,
      name: normalizeFamilySearch(family.name),
      guardian: normalizeFamilySearch(family.guardian.name),
      email: normalizeFamilySearch(family.guardian.email),
    }))
    .sort(
      (left, right) =>
        compareText(left.name, right.name) ||
        compareText(left.guardian, right.guardian) ||
        compareText(left.email, right.email) ||
        compareText(left.family.id, right.family.id),
    );
  const total = matching.length;
  const pageCount = Math.ceil(total / pageSize);
  const page = Math.min(
    Math.max(1, pageCount),
    Math.max(1, finiteInteger(options.page, 1)),
  );
  const offset = (page - 1) * pageSize;
  return {
    items: matching.slice(offset, offset + pageSize).map((item) => item.family),
    total,
    page,
    pageCount,
  };
}
