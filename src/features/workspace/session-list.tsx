import { useCallback, useState } from "react";
import {
  ArrowUp,
  CalendarDays,
  ListFilter,
  Plus,
  UsersRound,
  X,
} from "lucide-react";
import { SearchField } from "@/components/ui";
import { DEMO_FAMILIES } from "@/demo/families";
import type { Family } from "@/domain/family";
import type { Session } from "@/domain/makeup";
import type { OfficialSession } from "@/domain/official";
import { familyRows, officialRows } from "./session-rows";
import { SessionFiltersMenu } from "./session-filters-menu";
import {
  filterSessionRows,
  getFilterValues,
  type SessionFilters,
  type ValueFilterCategory,
} from "./session-filter-model";
import { SessionTable } from "./session-table";
import { useFilterDismiss } from "./use-filter-dismiss";
import type { SessionRow } from "./types";
import "./session-filters.css";

type Props = {
  sessions: Session[];
  officialSessions: OfficialSession[];
  query: string;
  onQueryChange: (query: string) => void;
  family: Family | null;
  onFamilyChange: (id: string | null) => void;
  onSchedule: () => void;
  onOpen: (row: SessionRow) => void;
};

export function SessionList({
  sessions,
  officialSessions,
  query,
  onQueryChange,
  family,
  onFamilyChange,
  onSchedule,
  onOpen,
}: Props) {
  const [filterEntry, setFilterEntry] = useState<
    "categories" | "Family" | null
  >(null);
  const [filters, setFilters] = useState<SessionFilters>({});
  const [sortDesc, setSortDesc] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const closeFilter = useCallback(() => setFilterEntry(null), []);
  const { anchorRef, triggerRef } = useFilterDismiss(
    filterEntry !== null,
    closeFilter,
  );
  const baseRows = family
    ? familyRows(sessions, query, family)
    : [
        ...officialRows(officialSessions, query),
        ...(query.trim() ? familyRows(sessions, query) : []),
      ];
  const rows = filterSessionRows(baseRows, filters, officialSessions);
  const sortedRows = [...rows].sort(
    (a, b) => a.status.localeCompare(b.status) * (sortDesc ? -1 : 1),
  );
  const activeCount = Object.keys(filters).length + (family ? 1 : 0);
  const familyDates = family
    ? sessions
        .filter((session) =>
          family.members.some((member) => member.id === session.studentId),
        )
        .map((session) => session.date)
        .sort()
    : [];
  const dateRange = familyDates.length
    ? `${dateLabel(familyDates[0])} - ${dateLabel(familyDates.at(-1)!)}`
    : "Thu Oct 08, 2026 - Fri Oct 08, 2027";

  function applyValue(category: ValueFilterCategory, value: string | null) {
    setFilters((current) => {
      const next = { ...current };
      if (value === null) delete next[category];
      else next[category] = value;
      return next;
    });
    setSelectedIds([]);
    closeFilter();
    triggerRef.current?.focus();
  }
  function applyFamily(id: string | null) {
    onFamilyChange(id);
    onQueryChange("");
    setSelectedIds([]);
    closeFilter();
    triggerRef.current?.focus();
  }
  function resetFilters() {
    onFamilyChange(null);
    onQueryChange("");
    setFilters({});
    setSelectedIds([]);
    setActionsOpen(false);
  }

  return (
    <>
      <header className="page-header">
        <h1>Sessions</h1>
        <div className="header-actions">
          <SearchField value={query} onChange={onQueryChange} />
          <span className="btn date-range">
            <CalendarDays size={16} />
            {dateRange}
          </span>
          <div
            className="filter-anchor"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setActionsOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setActionsOpen(false);
            }}
          >
            <button
              className="btn"
              aria-expanded={actionsOpen}
              aria-haspopup="menu"
              onClick={() => setActionsOpen(!actionsOpen)}
            >
              Actions
            </button>
            {actionsOpen && (
              <div className="filter-popover" role="menu">
                <button
                  className="btn"
                  role="menuitem"
                  onClick={() => {
                    setSelectedIds([]);
                    setActionsOpen(false);
                  }}
                >
                  Clear selection
                </button>
                <button className="btn" role="menuitem" onClick={resetFilters}>
                  Reset filters
                </button>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={onSchedule}>
            <Plus size={17} />
            Schedule session
          </button>
        </div>
      </header>
      <div
        className={`table-toolbar ${activeCount ? "has-session-filters" : ""}`}
      >
        <div className="toolbar-start session-active-filters">
          {family && (
            <>
              <div className="session-filter-chip">
                <button
                  aria-label={`Change family filter: ${family.name}`}
                  onClick={() => setFilterEntry("Family")}
                >
                  <UsersRound size={13} />
                  {family.name}
                </button>
                <button
                  aria-label="Remove family filter"
                  onClick={() => applyFamily(null)}
                >
                  <X size={12} />
                </button>
              </div>
              <span className="family-context">
                {family.members.length} students · Guardian:{" "}
                {family.guardian.name}
              </span>
            </>
          )}
          {Object.entries(filters).map(([category, value]) => (
            <div className="session-filter-chip" key={category}>
              <span>
                {category}: {value}
              </span>
              <button
                aria-label={`Remove ${category.toLowerCase()} filter`}
                onClick={() =>
                  applyValue(category as ValueFilterCategory, null)
                }
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <div
          className="filter-anchor session-filter-anchor"
          ref={anchorRef}
          onBlur={(event) => {
            if (
              event.relatedTarget &&
              !event.currentTarget.contains(event.relatedTarget)
            )
              closeFilter();
          }}
        >
          <button
            ref={triggerRef}
            className={`btn ${filterEntry ? "selected" : ""}`}
            aria-haspopup="dialog"
            aria-controls={filterEntry ? "session-filters" : undefined}
            aria-expanded={filterEntry !== null}
            onClick={() => setFilterEntry(filterEntry ? null : "categories")}
          >
            <ListFilter size={16} />
            Filter
            {activeCount > 0 && (
              <span className="session-filter-count">{activeCount}</span>
            )}
          </button>
          {filterEntry && (
            <SessionFiltersMenu
              key={filterEntry}
              initialCategory={filterEntry === "Family" ? "Family" : null}
              families={DEMO_FAMILIES}
              family={family}
              filters={filters}
              getValues={(category) =>
                getFilterValues(category, baseRows, officialSessions)
              }
              onFamilyApply={applyFamily}
              onValueApply={applyValue}
            />
          )}
        </div>
        <button
          className="btn sort-button"
          onClick={() => setSortDesc(!sortDesc)}
        >
          <ArrowUp
            size={17}
            style={{ transform: sortDesc ? "rotate(180deg)" : undefined }}
          />
          <span>
            Sort by: <strong>Status</strong>
          </span>
        </button>
      </div>
      <SessionTable
        rows={sortedRows}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onOpen={onOpen}
      />
    </>
  );
}

function dateLabel(date: string) {
  return new Date(`${date}T12:00:00`)
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .replace(/^(\w+), /, "$1 ");
}
