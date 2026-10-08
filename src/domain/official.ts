/** Session contracts shared by the calendar, profiles and session editor. */
import type { Attendance } from "./attendance";
export type { Attendance } from "./attendance";
export type OfficialStudent = {
  id: string;
  name: string;
  status: Attendance;
  enrollment?: string;
  adHoc?: boolean;
  note?: string;
};
export type OfficialSession = {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  instructor: string;
  students: OfficialStudent[];
  group?: boolean;
  capacity?: number;
  location?: string;
  previousDate?: string;
  privateNotes?: string;
  sharedNotes?: string;
  enrollmentNotes?: string;
  reviewed?: boolean;
  table?: {
    title?: string;
    instructor?: string;
    location?: string;
    status: "Occurred" | "Pending";
  };
};

export function calendarPosition(
  session: Pick<OfficialSession, "start" | "end">,
) {
  const minutes = (time: string) => {
    const [hours, mins] = time.split(":").map(Number);
    return hours * 60 + mins;
  };
  return {
    top: ((minutes(session.start) - 720) * 100) / 60,
    height: ((minutes(session.end) - minutes(session.start)) * 100) / 60,
  };
}

/** An occurrence is identified by ID, never by its non-unique display title. */
export function findOfficialSessionById(
  sessions: readonly OfficialSession[],
  id: string,
) {
  return sessions.find((session) => session.id === id);
}
