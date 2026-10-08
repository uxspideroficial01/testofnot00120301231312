import type { BookingState, Session, Slot } from "./makeup.ts";
import { isValidSchedulingInterval } from "./scheduling-time.ts";

export function getSlotConflict(
  state: BookingState,
  original: Session,
  slot: Slot,
): string | null {
  if (
    !isValidSchedulingInterval(slot) ||
    !slot.teacher.trim() ||
    !slot.location.trim()
  ) {
    return "This time has invalid scheduling details. Choose another time.";
  }
  if (!slot.available)
    return "This time is no longer available. Choose another time.";
  const overlapping = state.sessions.filter(
    (session) =>
      session.status !== "missed" &&
      session.date === slot.date &&
      session.start < slot.end &&
      slot.start < session.end,
  );
  if (overlapping.some((session) => session.studentId === original.studentId)) {
    return "This student already has a lesson at that time.";
  }
  if (
    overlapping.some(
      (session) =>
        session.teacher === slot.teacher || session.location === slot.location,
    )
  ) {
    return "This time is no longer available. Choose another time.";
  }
  return null;
}

/** Read-only availability query; it never issues or applies a makeup. */
export function getAvailableSlots(
  state: BookingState,
  original: Session,
): Slot[] {
  const current = state.sessions.find(
    (session) =>
      session.id === original.id && session.studentId === original.studentId,
  );
  if (!current || current.status !== "missed") return [];
  return state.slots
    .filter((slot) => getSlotConflict(state, current, slot) === null)
    .map((slot) => ({ ...slot }));
}
