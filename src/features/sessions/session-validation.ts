import type { OfficialSession } from "../../domain/official.ts";

/** Reject malformed drafts before they can produce invalid calendar positions. */
export function getSessionDraftError(
  draft: Pick<OfficialSession, "title" | "date" | "start" | "end">,
): string | null {
  if (!draft.title.trim()) return "Enter a session name.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date))
    return "Enter a date as YYYY-MM-DD.";
  const date = new Date(`${draft.date}T12:00:00Z`);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== draft.date
  ) {
    return "Enter a valid calendar date.";
  }
  const validTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  if (!validTime.test(draft.start) || !validTime.test(draft.end)) {
    return "Enter start and end times as HH:MM (24-hour time).";
  }
  if (draft.end <= draft.start) return "End time must be after start time.";
  return null;
}
