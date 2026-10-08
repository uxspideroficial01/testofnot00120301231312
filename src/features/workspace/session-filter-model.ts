import type { OfficialSession } from "../../domain/official.ts";
import type { SessionRow } from "./types.ts";

export const FILTER_CATEGORIES = [
  "Staff",
  "Room",
  "Location",
  "Status",
  "Service",
  "Attendees",
  "Review Status",
  "Family",
] as const;

export type ValueFilterCategory = Exclude<
  (typeof FILTER_CATEGORIES)[number],
  "Family"
>;

export type SessionFilters = Partial<Record<ValueFilterCategory, string>>;

type LocationParts = { location: string; room?: string };

function parseLocation(value: string): LocationParts {
  const label = value.trim();
  const parenthesized = /^(.*?)\s*\(([^()]*)\)$/.exec(label);
  const separated = label.split(/\s*·\s*/);
  const campus = parenthesized?.[1].trim() ?? separated[0];
  const room = parenthesized?.[2].trim() ?? separated.slice(1).join(" · ");

  // Online describes the delivery location, never a physical room.
  if (label.toLowerCase() === "online" || room.toLowerCase() === "online") {
    return { location: "Online" };
  }

  return room ? { location: campus, room } : { location: label };
}

function isValueCategory(value: string): value is ValueFilterCategory {
  return FILTER_CATEGORIES.some(
    (category) => category !== "Family" && category === value,
  );
}

function rowValues(
  category: ValueFilterCategory,
  row: SessionRow,
  officialById: ReadonlyMap<string, OfficialSession>,
): string[] {
  const familySession =
    row.source.kind === "family" ? row.source.session : null;
  const official =
    row.source.kind === "official" ? officialById.get(row.id) : undefined;

  switch (category) {
    case "Staff":
      return row.staff.split(",");
    case "Room": {
      const room = parseLocation(row.location).room;
      return room ? [room] : [];
    }
    case "Location":
      return [parseLocation(row.location).location];
    case "Status":
      return [row.status];
    case "Service":
      return [
        familySession?.service ||
          official?.title.trim() ||
          official?.table?.title?.trim() ||
          row.title,
      ];
    case "Attendees":
      return familySession
        ? [familySession.studentName]
        : (official?.students.map((student) => student.name) ?? []);
    case "Review Status":
      if (familySession) return ["Not reviewed"];
      return official
        ? [official.reviewed === true ? "Reviewed" : "Needs review"]
        : [];
  }
}

function nonemptyValues(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

/** Available options come only from these rows and their own backing records. */
export function getFilterValues(
  category: ValueFilterCategory,
  rows: SessionRow[],
  officialSessions: OfficialSession[],
): string[] {
  if (!isValueCategory(category)) return [];
  const officialById = new Map(
    officialSessions.map((session) => [session.id, session]),
  );
  const values = rows.flatMap((row) =>
    nonemptyValues(rowValues(category, row, officialById)),
  );
  return [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true }),
  );
}

/** Each active category must match an entire value; categories combine with AND. */
export function filterSessionRows(
  rows: SessionRow[],
  filters: SessionFilters,
  officialSessions: OfficialSession[],
): SessionRow[] {
  const active = Object.entries(filters);
  const officialById = new Map(
    officialSessions.map((session) => [session.id, session]),
  );
  return rows.filter((row) =>
    active.every(([category, value]) => {
      // Invalid runtime state fails closed instead of broadening the result set.
      if (
        !isValueCategory(category) ||
        typeof value !== "string" ||
        !value.trim()
      )
        return false;
      return nonemptyValues(rowValues(category, row, officialById)).includes(
        value.trim(),
      );
    }),
  );
}
