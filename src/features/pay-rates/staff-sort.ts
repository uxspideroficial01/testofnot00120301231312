import type { PayOverride, PayStaff } from "./model.ts";

export type StaffSortKey = "name" | "default-rate" | "overrides";
export type StaffSort = {
  key: StaffSortKey;
  direction: "ascending" | "descending";
};

const names = new Intl.Collator("en", { sensitivity: "base", numeric: true });

export function nextStaffSort(
  current: StaffSort | null,
  key: StaffSortKey,
): StaffSort {
  return {
    key,
    direction:
      current?.key === key && current.direction === "ascending"
        ? "descending"
        : "ascending",
  };
}

/** Sort only the displayed roster. Tiered structures have no single comparable price. */
export function sortStaff(
  staff: readonly PayStaff[],
  overrides: readonly PayOverride[],
  sort: StaffSort | null,
): PayStaff[] {
  if (!sort) return [...staff];
  const counts = new Map<string, number>();
  for (const override of overrides) {
    counts.set(override.staffId, (counts.get(override.staffId) ?? 0) + 1);
  }
  const direction = sort.direction === "ascending" ? 1 : -1;
  return [...staff].sort((a, b) => {
    const byName = names.compare(a.name, b.name) || names.compare(a.id, b.id);
    if (sort.key === "name") return direction * byName;
    if (sort.key === "overrides") {
      return (
        direction * ((counts.get(a.id) ?? 0) - (counts.get(b.id) ?? 0)) ||
        byName
      );
    }
    const aRate = a.defaultRate;
    const bRate = b.defaultRate;
    if (aRate.method === "tiered")
      return bRate.method === "tiered" ? byName : 1;
    if (bRate.method === "tiered") return -1;
    return direction * (aRate.cents - bRate.cents) || byName;
  });
}
