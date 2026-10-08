import type { Session } from "../../domain/makeup.ts";
import type { CalendarEvent } from "./fixtures.ts";

/** Translate captured lesson data without deriving identity from tile position. */
export function getCalendarEventSession(
  event: CalendarEvent,
  date: string,
): Session | null {
  const lesson = event.lesson;
  if (!lesson) return null;
  return {
    id: `calendar-${lesson.id}`,
    studentId: lesson.student?.id ?? `unknown-student-${lesson.id}`,
    studentName: lesson.student?.name ?? "Not captured",
    service: event.title,
    date,
    start: lesson.start,
    end: lesson.end,
    teacher: lesson.instructor,
    location: lesson.location ?? "Not captured",
    status: event.cancelled ? "missed" : "pending",
    attendance: event.cancelled ? "Cancelled" : "Pending",
  };
}
