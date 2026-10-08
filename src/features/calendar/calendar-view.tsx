"use client";
import { useCalendar } from "./use-calendar";
import type { CalendarViewProps } from "./types";
import { CalendarFilters } from "./calendar-filters";
import { CalendarToolbar } from "./calendar-toolbar";
import { CalendarGrid } from "./calendar-grid";
export function CalendarView(props: CalendarViewProps) {
  const controller = useCalendar(props);
  return (
    <div className="calendar-layout">
      <CalendarFilters controller={controller} />
      <section className="calendar-main">
        <CalendarToolbar controller={controller} />
        <CalendarGrid controller={controller} />
      </section>
    </div>
  );
}
