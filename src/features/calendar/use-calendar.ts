import { useState } from "react";
import { STAFF, COLUMNS, type CalendarEvent } from "./fixtures";
import type { CalendarViewProps } from "./types";
import { getCalendarEventSession } from "./event-session";
export function useCalendar({
  sessions,
  onOpenSession,
  onSchedule,
  officialSessions,
  onOpenOfficialSession,
  onOpenStaff,
}: CalendarViewProps) {
  const [filterVisible, setFilterVisible] = useState(true);
  const [month, setMonthValue] = useState(9);
  const [day, setDay] = useState(8);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(true);
  const [selected, setSelected] = useState(STAFF);
  const [openSections, setOpenSections] = useState(["Staff"]);
  const [mode, setMode] = useState("Day");
  const [settings, setSettings] = useState(false);
  const [family, setFamily] = useState(false);
  const monthName = new Date(2026, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const firstDay = new Date(2026, month, 1).getDay();
  const monthLength = new Date(2026, month + 1, 0).getDate();
  const cellCount = Math.max(35, Math.ceil((firstDay + monthLength) / 7) * 7);
  const dates = Array.from({ length: cellCount }, (_, i) => i - firstDay + 1);
  function setMonth(nextMonth: number) {
    setMonthValue(nextMonth);
    setDay((current) =>
      Math.min(current, new Date(2026, nextMonth + 1, 0).getDate()),
    );
  }
  const names = family
    ? Array.from(new Set(sessions.map((session) => session.teacher)))
    : COLUMNS.filter((name) => selected.includes(name)).map((name) =>
        day === 7 && month === 9 && name === "Andrii Starusiev"
          ? "Anna Alworth"
          : name,
      );
  const calendarDate = new Date(2026, month, day);
  const selectedDate = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}-${String(calendarDate.getDate()).padStart(2, "0")}`;
  const openSession = (event: CalendarEvent) => {
    const session = getCalendarEventSession(event, selectedDate);
    if (session) onOpenSession(session);
  };
  return {
    sessions,
    onOpenSession,
    onSchedule,
    officialSessions,
    onOpenOfficialSession,
    onOpenStaff,
    filterVisible,
    setFilterVisible,
    month,
    setMonth,
    day,
    setDay,
    query,
    setQuery,
    active,
    setActive,
    selected,
    setSelected,
    openSections,
    setOpenSections,
    mode,
    setMode,
    settings,
    setSettings,
    family,
    setFamily,
    monthName,
    monthLength,
    dates,
    names,
    selectedDate,
    openSession,
  };
}
export type CalendarController = ReturnType<typeof useCalendar>;
