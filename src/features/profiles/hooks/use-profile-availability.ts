import { useState } from "react";
import type { AvailabilityRange, WeeklyHours } from "../types";
import { createDemoWeeklyHours } from "../demo-fixtures";

export function useProfileAvailability() {
  const [hours, setHours] = useState<WeeklyHours>(createDemoWeeklyHours);
  const [saved, setSaved] = useState(false);
  const [addKind, setAddKind] = useState<string | null>(null);
  const [date, setDate] = useState("2026-10-08");
  const [exceptions, setExceptions] = useState<
    { type: string; date: string }[]
  >([]);
  const [settings, setSettings] = useState(false);
  const change = (day: string, next: AvailabilityRange[]) => {
    setHours((current) => ({ ...current, [day]: next }));
    setSaved(false);
  };
  return {
    hours,
    saved,
    setSaved,
    addKind,
    setAddKind,
    date,
    setDate,
    exceptions,
    setExceptions,
    settings,
    setSettings,
    change,
  };
}
