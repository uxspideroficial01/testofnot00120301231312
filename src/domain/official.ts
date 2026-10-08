/** Reference data from the October 8 recordings. All changes stay in memory. */
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

const student = (
  id: string,
  name: string,
  status: Attendance = "Pending",
): OfficialStudent => ({ id, name, status });

export const OFFICIAL_SESSIONS: OfficialSession[] = [
  {
    id: "practice-sat",
    title: "Practice SAT",
    date: "2026-10-07",
    start: "12:00",
    end: "13:00",
    instructor: "AJ Ding",
    group: true,
    students: [{ ...student("aaron", "Aaron Schwartz"), enrollment: "Ad hoc" }],
    previousDate: "2026-10-07",
  },
  {
    id: "steve-junior",
    title: "Steve Junior - Private class",
    date: "2026-10-07",
    start: "13:00",
    end: "14:00",
    instructor: "AJ Ding",
    students: [student("steve-junior", "Steve Junior")],
    location: "Arten",
  },
  {
    id: "viral-assessment",
    title: "Viral Patel - Assessment",
    date: "2026-10-07",
    start: "15:00",
    end: "16:00",
    instructor: "AJ Ding",
    students: [student("viral-patel", "Viral Patel")],
    location: "Online",
  },
  {
    id: "anna-class",
    title: "Anna's Class",
    date: "2026-10-07",
    start: "14:00",
    end: "15:00",
    instructor: "Anna Alworth",
    group: true,
    students: [
      student("cory-kid", "Cory Kid 5"),
      student("cory-8", "Cory Zhou 8"),
      student("test-parent", "Test Parent"),
    ],
    location: "Online",
  },
  {
    id: "alchemy-calendar",
    title: "Alchemy II",
    date: "2026-10-07",
    start: "18:00",
    end: "19:00",
    instructor: "AJ Ding",
    group: true,
    students: [],
  },
  {
    id: "recorded-0",
    table: { status: "Occurred", location: "Cory's Apartment (Bedroom)" },
    title: "Alchemy II",
    date: "2027-01-01",
    start: "16:30",
    end: "17:00",
    instructor:
      "Garcia, Garcia, Jesus Christ, Mohit, Viral (staff), Cory, Zapier, QA",
    group: true,
    students: [],
  },
  {
    id: "recorded-1",
    table: {
      status: "Occurred",
      title: "Intro to Calculus (Group Class AI)",
      instructor: "Andhyka",
      location: "Location for Testing (Online)",
    },
    title: "Intro to Calculus (Group Class AI)",
    date: "2026-10-13",
    start: "16:00",
    end: "17:00",
    instructor: "Andhyka IB",
    group: true,
    capacity: 15,
    students: [
      {
        ...student("aaron", "Aaron Schwartz", "Present"),
        enrollment: "Student rate",
        adHoc: true,
      },
      { ...student("bambang", "Bambang Soeharto"), enrollment: "Student rate" },
    ],
    previousDate: "2026-10-06",
  },
  ...Array.from({ length: 31 }, (_, i): OfficialSession => ({
    id: `recorded-${i + 2}`,
    table: {
      status: "Pending",
      instructor: "Garcia",
      location: "Location for Testing (Room 1)",
    },
    title: "Garcia Lopez-Paul - Introduction to Oneiromancy",
    date: new Date(Date.UTC(2027, 2, 28 + i)).toISOString().slice(0, 10),
    start: "03:33",
    end: "03:48",
    instructor: "Garcia Lopez-Paul",
    students: [student("garcia", "Garcia Lopez-Paul")],
    previousDate: new Date(Date.UTC(2027, 2, 27 + i))
      .toISOString()
      .slice(0, 10),
  })),
];

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
