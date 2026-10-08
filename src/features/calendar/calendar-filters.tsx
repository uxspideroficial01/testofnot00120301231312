import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { Avatar, SearchField } from "@/components/ui";

import type { CalendarController } from "./use-calendar";
import { STAFF } from "./fixtures";
export function CalendarFilters({
  controller,
}: {
  controller: CalendarController;
}) {
  const {
    filterVisible,
    monthName,
    month,
    setMonth,
    dates,
    day,
    monthLength,
    setDay,
    openSections,
    setOpenSections,
    selected,
    setSelected,
    active,
    setActive,
    query,
    setQuery,
    family,
    setFamily,
  } = controller;
  return (
    <>
      {filterVisible && (
        <aside className="calendar-filters">
          <div className="mini-month-title">
            <strong>{monthName}</strong>
            <div>
              <button
                className="icon-button"
                aria-label="Previous month"
                onClick={() => setMonth(month - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="icon-button"
                aria-label="Next month"
                onClick={() => setMonth(month + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="mini-calendar">
            <div className="week-labels">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="month-days">
              {dates.map((d, i) => (
                <button
                  key={i}
                  className={`${d === day ? "current" : ""} ${d === 8 && month === 9 ? "today" : ""} ${d < 1 || d > monthLength ? "outside" : ""}`}
                  onClick={() => {
                    if (d > 0 && d <= monthLength) setDay(d);
                  }}
                >
                  {d < 1
                    ? new Date(2026, month, 0).getDate() + d
                    : d > monthLength
                      ? d - monthLength
                      : d}
                </button>
              ))}
            </div>
          </div>
          <div className="staff-section">
            <button
              className="filter-section-heading"
              onClick={() =>
                setOpenSections(
                  openSections.includes("Staff")
                    ? openSections.filter((s) => s !== "Staff")
                    : [...openSections, "Staff"],
                )
              }
            >
              <input
                type="checkbox"
                checked={selected.length > 0}
                readOnly
                tabIndex={-1}
              />
              <strong>Staff</strong>
              <span className="pill">
                {active ? "Active" : `${selected.length} selected`}
              </span>
              {openSections.includes("Staff") ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            {openSections.includes("Staff") && (
              <div className="staff-filter-content">
                <SearchField value={query} onChange={setQuery} />
                <label className="switch-label">
                  <input
                    className="switch"
                    role="switch"
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  Active staff
                </label>
                <div className="staff-list">
                  {STAFF.filter((n) =>
                    n.toLowerCase().includes(query.toLowerCase()),
                  ).map((name, i) => (
                    <label key={name}>
                      <input
                        type="checkbox"
                        checked={selected.includes(name)}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? [...selected, name]
                              : selected.filter((n) => n !== name),
                          )
                        }
                      />
                      <Avatar
                        name={name}
                        initials={
                          name.startsWith("AJ") || name.startsWith("Aaron")
                            ? "AD"
                            : undefined
                        }
                        tone={
                          ["purple", "blue", "gray", "gray", "cyan", "orange"][
                            i % 6
                          ]
                        }
                      />
                      <span>{name}</span>
                      <GripVertical size={13} />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="calendar-filter-bottom">
            {["Locations", "Services", "Members"].map((label) => (
              <div key={label}>
                <button
                  className="filter-section-heading"
                  onClick={() =>
                    setOpenSections(
                      openSections.includes(label)
                        ? openSections.filter((s) => s !== label)
                        : [...openSections, label],
                    )
                  }
                >
                  <input type="checkbox" checked readOnly tabIndex={-1} />
                  <strong>{label}</strong>
                  <span className="muted">
                    {label === "Members" && family ? "3 selected" : "All"}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {openSections.includes(label) && (
                  <div className="filter-section-options">
                    {label === "Members" ? (
                      <label>
                        <input
                          type="checkbox"
                          checked={family}
                          onChange={(e) => setFamily(e.target.checked)}
                        />
                        Martins family
                      </label>
                    ) : (
                      <label>
                        <input type="checkbox" defaultChecked />
                        {label === "Locations"
                          ? "Upper East Side"
                          : "All services"}
                      </label>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}
