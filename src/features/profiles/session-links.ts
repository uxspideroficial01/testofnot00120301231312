import {
  findOfficialSessionById,
  type OfficialSession,
} from "../../domain/official.ts";

export type ProfileSessionLink = {
  id: string;
  title: string;
  date: string;
  dateKey: string;
  weekday: string;
  shortDate: string;
  startTime: string;
  time: string;
};

/** Resolve fixture relationships against current records, omitting archived IDs. */
export function resolveProfileSessionLinks(
  sessions: readonly OfficialSession[],
  ids: readonly string[],
): ProfileSessionLink[] {
  return ids.flatMap((id) => {
    const session = findOfficialSessionById(sessions, id);
    if (!session) return [];
    const date = new Date(`${session.date}T12:00:00Z`);
    const format = (options: Intl.DateTimeFormatOptions) =>
      date.toLocaleDateString("en-US", { timeZone: "UTC", ...options });
    return [
      {
        id: session.id,
        dateKey: session.date,
        title: session.title,
        date: format({
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        weekday: format({ weekday: "short" }),
        shortDate: format({ month: "short", day: "numeric" }),
        startTime: formatTime(session.start),
        time: `${formatTime(session.start)} – ${formatTime(session.end)}`,
      },
    ];
  });
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
}
