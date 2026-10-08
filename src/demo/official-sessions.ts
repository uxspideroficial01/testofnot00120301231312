import type {
  Attendance,
  OfficialSession,
  OfficialStudent,
} from "../domain/official.ts";

/** Reference-derived demo sessions. Changes remain local to the workspace. */
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
