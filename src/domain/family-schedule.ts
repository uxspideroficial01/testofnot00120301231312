import type { Family } from "./family.ts";
import type { Session, Slot } from "./makeup.ts";

export function getSiblingSessions(
  family: Family,
  sessions: Session[],
  studentId: string,
  date: string,
) {
  const members = new Set(family.members.map((member) => member.id));
  if (!members.has(studentId)) return [];
  return sessions
    .filter(
      (session) =>
        members.has(session.studentId) &&
        session.studentId !== studentId &&
        session.status !== "missed" &&
        session.date === date,
    )
    .map((session) => ({ ...session }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function campusName(location: string): string {
  return location.split(" · ")[0];
}

export function getVisitLabel(siblings: Session[], slot: Slot): string {
  if (!siblings.length)
    return `${campusName(slot.location)} · No sibling lessons this day`;
  const sameCampus = siblings.every(
    (session) => campusName(session.location) === campusName(slot.location),
  );
  return sameCampus
    ? `All lessons at ${campusName(slot.location)}`
    : "Family lessons are at different locations";
}
