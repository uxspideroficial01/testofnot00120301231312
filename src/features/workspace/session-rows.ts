import type { Family } from "@/domain/family";
import type { Session } from "@/domain/makeup";
import type { OfficialSession } from "@/domain/official";
import { formatTime, sessionDate } from "./format";
import type { SessionRow } from "./types";

export function officialRows(
  sessions: OfficialSession[],
  query: string,
): SessionRow[] {
  const search = query.trim().toLowerCase();
  return sessions
    .filter((session) => session.id.startsWith("recorded-"))
    .map((session): SessionRow => {
      const start = formatTime(session.start);
      const end = formatTime(session.end);
      const status = session.table?.status ?? "Pending";
      return {
        id: session.id,
        date: sessionDate(session.date),
        time: `${start.slice(-2) === end.slice(-2) ? start.slice(0, -2) : start} – ${end}`,
        title: session.table?.title ?? session.title,
        staff: session.table?.instructor ?? session.instructor,
        location: session.table?.location ?? session.location ?? "Unassigned",
        status,
        indicator: status === "Occurred" ? "occurred" : "pending",
        selectionLabel: session.table?.title ?? session.title,
        source: { kind: "official" },
      };
    })
    .filter((row) =>
      [row.date, row.time, row.title, row.staff, row.location, row.status]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
}

export function familyRows(
  sessions: Session[],
  query: string,
  family?: Family | null,
): SessionRow[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!family && !words.length) return [];
  const memberIds =
    family && new Set(family.members.map((member) => member.id));
  return sessions
    .filter((session) => !memberIds || memberIds.has(session.studentId))
    .filter((session) => {
      const fields = [
        session.studentName,
        session.service,
        session.teacher,
        session.location,
        session.date,
        family?.name,
        family?.guardian.name,
      ];
      const text = fields.filter(Boolean).join(" ").toLowerCase();
      return words.every((word) => text.includes(word));
    })
    .map((session) => ({
      id: session.id,
      date: sessionDate(session.date, true),
      time: `${formatTime(session.start)} – ${formatTime(session.end)}`,
      title: `${session.studentName} - ${session.service}`,
      staff: session.teacher,
      location: session.location,
      status: session.makeupFor
        ? "Makeup scheduled"
        : session.status === "missed"
          ? (session.attendance ?? "No show")
          : "Scheduled",
      indicator: session.status === "missed" ? "missed" : "pending",
      selectionLabel: session.studentName,
      source: { kind: "family", session },
    }));
}
