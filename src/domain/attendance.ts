/** Attendance belongs to an attendee; session lifecycle is a separate concern. */
export const ATTENDANCE_STATUSES = [
  "Present",
  "No show",
  "Cancelled",
  "Late cancelled",
  "Pending",
] as const;
export type Attendance = (typeof ATTENDANCE_STATUSES)[number];

export function isMissedAttendance(value: Attendance): boolean {
  return (
    value === "Cancelled" || value === "Late cancelled" || value === "No show"
  );
}
