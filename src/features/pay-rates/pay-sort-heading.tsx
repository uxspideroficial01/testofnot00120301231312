import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { nextStaffSort, type StaffSort, type StaffSortKey } from "./staff-sort";

export function PaySortHeading({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: StaffSortKey;
  sort: StaffSort | null;
  onSort: (sort: StaffSort) => void;
}) {
  const active = sort?.key === sortKey;
  const next = nextStaffSort(sort, sortKey);
  const Icon = active
    ? sort.direction === "ascending"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;
  const nextLabel =
    sortKey === "name"
      ? next.direction === "ascending"
        ? "A to Z"
        : "Z to A"
      : next.direction === "ascending"
        ? "lowest to highest"
        : "highest to lowest";

  return (
    <button
      type="button"
      className="pay-sort-heading"
      aria-pressed={active}
      aria-label={`${label}: sort ${nextLabel}`}
      title={`${label}: sort ${nextLabel}${sortKey === "default-rate" ? ". Tiered pay appears last." : ""}`}
      onClick={() => onSort(next)}
    >
      {label}
      <Icon size={13} strokeWidth={1.75} aria-hidden="true" />
      {active && (
        <span className="pay-sr-only">Currently {sort.direction}</span>
      )}
    </button>
  );
}
