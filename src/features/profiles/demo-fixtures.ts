import type { ProfileKind, WeeklyHours } from "./types";
// Synthetic contact fields; reference titles are retained for local navigation.
export const DEMO_PROFILE_CONTACT = {
  staffEmail: "instructor@example.com",
  memberAddress: "123 Example Street",
  memberInfo: "Demo member profile",
  birthDate: "1/1/2025",
} as const;

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const MEMBER_TABS = [
  "Billing",
  "Activity",
  "Attendance",
  "Documents",
  "Family Notes",
  "Tasks",
];
export const STAFF_TABS = [
  "Activity",
  "Attendance",
  "Upcoming",
  "Past",
  "Availability",
];
export const STAFF_TAB_COUNTS: Record<string, string> = {
  Activity: "98",
  Attendance: "11",
  Upcoming: "324",
  Past: "196",
};

export function enrollmentRows(kind: ProfileKind, name: string) {
  return kind === "staff"
    ? [
        {
          id: "staff-solidcore",
          title: "Aaron Schwartz - Cory's Private solidcore Class",
        },
        { id: "staff-camp", title: "Cory's Summer Camp: Week 4 - AJ Ding" },
        { id: "staff-private", title: "Andrii private class" },
        { id: "staff-clarinet", title: "Cory's Private Clarinet Lesson" },
      ]
    : [
        {
          id: "member-oneiromancy-primary",
          title: `${name} - Introduction to Oneiromancy`,
        },
        {
          id: "member-oneiromancy-secondary",
          title: `${name} - Introduction to Oneiromancy`,
        },
        { id: "member-coding", title: `${name} - coding class` },
        {
          id: "member-oneiromancy-third",
          title: `${name} - Introduction to Oneiromancy`,
        },
      ];
}

export const DEMO_INVOICE_DATES = [
  ["Mar 30, 2026", "Mar 31, 2026"],
  ["Mar 30, 2026", "Mar 31, 2026"],
  ["Jan 29, 2026", "Jan 30, 2026"],
  ["Sep 19, 2025", "Sep 20, 2025"],
  ["Aug 27, 2025", "Aug 28, 2025"],
  ["Aug 25, 2025", "Aug 26, 2025"],
];

export function attendanceRows(kind: ProfileKind, name: string) {
  return kind === "member"
    ? [
        {
          id: "member-coding",
          title: `${name} - coding class`,
          dates: "Sep 10, 2025 to Jun 16, 2027",
        },
        {
          id: "member-oneiromancy",
          title: `${name} - Introduction to Oneiromancy`,
          dates: "Aug 25, 2025 to Aug 26, 2027",
        },
      ]
    : [
        {
          id: "staff-private",
          title: "Andrii private class",
          dates: "Mar 17 to Mar 17, 2026",
        },
        {
          id: "staff-test",
          title: "damian testing event",
          dates: "Feb 20 to Apr 28, 2025",
        },
        {
          id: "staff-solidcore",
          title: "Cory's solidcore Class",
          dates: "Apr 23, 2025 to Jun 14, 2027",
        },
        {
          id: "staff-private-solidcore",
          title: "Cory's Private solidcore Class",
          dates: "Sep 10, 2025 to Jun 16, 2027",
        },
        {
          id: "staff-clarinet",
          title: "Cory's Private Clarinet Lesson",
          dates: "Jan 5 to Jan 6, 2026",
        },
        {
          id: "staff-barry",
          title: "Cory's barry's class",
          dates: "Apr 2, 2025 to Jun 14, 2027",
        },
      ];
}

export const DEMO_ACTIVITY_ACTORS = [
  "Alex Morgan",
  "Alex Morgan",
  "Alex Morgan",
  "Alex Morgan",
  "Taylor Reed",
  "Taylor Reed",
  "Taylor Reed",
  "Jordan Lee",
  "Jordan Lee",
  "Alex Morgan",
  "Alex Morgan",
  "Jordan Lee",
  "Jordan Lee",
  "Demo Admin",
  "Demo Admin",
  "Jordan Lee",
  "Jordan Lee",
  "Jordan Lee",
  "Jordan Lee",
  "Jordan Lee",
];

export const DEMO_PAST_SESSIONS = [
  ["Cory Lead - Cory's barry's class", "Wed Apr 2, 2025", "1:15 PM - 2:00 PM"],
  [
    "Steve (ef4) - Cory's Private solidcore Class",
    "Wed Sep 10, 2025",
    "12:11 AM - 1:11 AM",
  ],
  ["Cory's solidcore Class", "Wed Sep 10, 2025", "4:00 PM - 5:00 PM"],
];
export const DEMO_UPCOMING_SESSIONS = [
  ["Cory's barry's class", "Fri Oct 9, 2026", "1:00 PM - 2:00 PM"],
  ["Nanhua's Volley Camp", "Fri Oct 9, 2026", "5:30 PM - 6:30 PM"],
  ["Cory's Private solidcore Class", "Mon Oct 12, 2026", "4:00 PM - 5:00 PM"],
];
export function createDemoWeeklyHours(): WeeklyHours {
  return Object.fromEntries(
    WEEKDAYS.map((day, index) => [
      day,
      index > 2 ? [{ start: "09:00", end: "20:00", location: "Online" }] : [],
    ]),
  );
}
