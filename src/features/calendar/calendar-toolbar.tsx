import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  ListFilter,
  Settings,
  Plus,
} from "lucide-react";

import type { CalendarController } from "./use-calendar";

export function CalendarToolbar({
  controller,
}: {
  controller: CalendarController;
}) {
  const {
    filterVisible,
    setFilterVisible,
    month,
    setMonth,
    day,
    setDay,
    monthLength,
    mode,
    setMode,
    settings,
    setSettings,
    onSchedule,
    family,
    setFamily,
  } = controller;
  return (
    <>
      <header className="calendar-header">
        <button
          className="icon-button"
          aria-label="Toggle calendar filters"
          onClick={() => setFilterVisible(!filterVisible)}
        >
          <PanelLeftClose size={17} />
        </button>
        <div className="today-control">
          <button
            aria-label="Previous day"
            onClick={() => setDay(Math.max(1, day - 1))}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => {
              setDay(8);
              setMonth(9);
            }}
          >
            Today
          </button>
          <button
            aria-label="Next day"
            onClick={() => setDay(Math.min(monthLength, day + 1))}
          >
            <ChevronRight size={15} />
          </button>
        </div>
        <button
          className="date-title"
          onClick={() => setFilterVisible(!filterVisible)}
        >
          {new Date(2026, month, day).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          <ChevronDown size={15} />
        </button>
        <div className="calendar-actions">
          <button
            className="btn"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            <ListFilter size={16} />
            Filters
          </button>
          <select
            className="btn"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            aria-label="Calendar view"
          >
            <option>Day</option>
            <option>Week</option>
          </select>
          <button
            className="icon-button"
            aria-label="Calendar settings"
            onClick={() => setSettings(!settings)}
          >
            <Settings size={17} />
          </button>
          <button
            className="btn btn-primary icon-button"
            aria-label="Schedule session"
            onClick={onSchedule}
          >
            <Plus size={20} />
          </button>
        </div>
        {settings && (
          <div className="calendar-settings filter-popover">
            <strong>Calendar settings</strong>
            <label>
              <input
                type="checkbox"
                checked={family}
                onChange={(e) => setFamily(e.target.checked)}
              />
              Show Martins family
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Show cancelled sessions
            </label>
            <button className="btn" onClick={() => setSettings(false)}>
              Done
            </button>
          </div>
        )}
      </header>
    </>
  );
}
