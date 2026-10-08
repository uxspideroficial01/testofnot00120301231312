import type { OfficialSession } from "../../domain/official.ts";

/** Enforce roster invariants at submission, not only in search results. */
export function getEnrollmentError(
  session: Pick<OfficialSession, "students" | "capacity">,
  member: string,
  enrollment: string,
): string | null {
  const normalizedName = member.trim().toLocaleLowerCase("en-US");
  if (!normalizedName) return "Select a member to enroll.";
  if (enrollment !== "single" && enrollment !== "following") {
    return "Select an enrollment option.";
  }
  if (
    session.students.some(
      (student) =>
        student.name.trim().toLocaleLowerCase("en-US") === normalizedName,
    )
  ) {
    return "This member is already enrolled in this session.";
  }
  if (
    session.capacity !== undefined &&
    session.students.length >= session.capacity
  ) {
    return "This session is full. Remove an attendee before adding another member.";
  }
  return null;
}
