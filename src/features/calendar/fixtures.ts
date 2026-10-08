export const STAFF = [
  "AJ Ding",
  "AJ Test Staff Ding",
  "Aaron De Vega",
  "Aaron de vega",
  "Akiko Sampson",
  "Amanda Ncapayi",
  "Andrii Starusiev",
  "Cory Zhou",
  "Dexter Renick",
  "Hassan Ahmad",
  "Jiaqi Song",
  "Mohit Dalal",
  "Nairo Quintana",
  "Vicky G",
];
export const COLUMNS = [...STAFF, "Emma Wilson", "Noah Miller", "Olivia Chen"];

export type CalendarEvent = {
  column: number;
  top: number;
  height: number;
  title: string;
  time: string;
  detail?: string;
  color: string;
  cancelled?: boolean;
  half?: boolean;
  right?: boolean;
  lesson: {
    id: string;
    start: string;
    end: string;
    instructor: string;
    location: string | null;
    student: { id: string; name: string } | null;
  } | null;
};
// Start times and named columns/locations reproduce the captured tiles. End
// times are one-hour demo assumptions inferred from tile height, not verified
// session metadata. Null roster/location values mean the recording did not
// establish them; the detail view must not substitute another person's data.
export const EVENTS: CalendarEvent[] = [
  {
    column: 0,
    top: 0,
    height: 26,
    title: "",
    time: "",
    color: "gray",
    cancelled: true,
    lesson: null,
  },
  {
    column: 0,
    top: 147,
    height: 100,
    title: "Mohit Dalal – Private class",
    time: "01:29 PM",
    detail: "Bedroom",
    color: "gray",
    cancelled: true,
    lesson: {
      id: "mohit-private",
      start: "13:29",
      end: "14:29",
      instructor: "Cory Zhou",
      location: "Bedroom",
      student: { id: "mohit-dalal", name: "Mohit Dalal" },
    },
  },
  {
    column: 0,
    top: 249,
    height: 100,
    title: "Cory’s Private class",
    time: "02:30",
    color: "pink",
    half: true,
    lesson: {
      id: "cory-private",
      start: "14:30",
      end: "15:30",
      instructor: "Cory Zhou",
      location: null,
      student: null,
    },
  },
  {
    column: 0,
    top: 284,
    height: 100,
    title: "Cory’s lesson",
    time: "02:51",
    color: "pink",
    half: true,
    right: true,
    lesson: {
      id: "cory-lesson",
      start: "14:51",
      end: "15:51",
      instructor: "Cory Zhou",
      location: null,
      student: null,
    },
  },
  {
    column: 1,
    top: 199,
    height: 100,
    title: "Dexter private class",
    time: "02:00",
    color: "rose",
    half: true,
    lesson: {
      id: "dexter-private",
      start: "14:00",
      end: "15:00",
      instructor: "Dexter Renick",
      location: null,
      student: null,
    },
  },
  {
    column: 1,
    top: 249,
    height: 100,
    title: "Dexter’s lesson",
    time: "02:30",
    detail: "Dexter, Jake, Sam",
    color: "rose",
    half: true,
    right: true,
    lesson: {
      id: "dexter-lesson",
      start: "14:30",
      end: "15:30",
      instructor: "Dexter Renick",
      location: null,
      student: null,
    },
  },
  {
    column: 2,
    top: 73,
    height: 100,
    title: "Hassan Private Class",
    time: "12:44 PM",
    detail: "Office",
    color: "purple",
    lesson: {
      id: "hassan-private",
      start: "12:44",
      end: "13:44",
      instructor: "Hassan Ahmad",
      location: "Office",
      student: null,
    },
  },
  {
    column: 4,
    top: -35,
    height: 110,
    title: "Bob Wang - coding class",
    time: "11:45 AM",
    color: "blue",
    lesson: {
      id: "bob-coding",
      start: "11:45",
      end: "12:45",
      instructor: "Mohit Dalal",
      location: null,
      student: { id: "bob-wang", name: "Bob Wang" },
    },
  },
  {
    column: 6,
    top: 299,
    height: 100,
    title: "Vicky’s Special class",
    time: "03:00 PM",
    detail: "Mohit Dalal",
    color: "blue",
    lesson: {
      id: "vicky-special",
      start: "15:00",
      end: "16:00",
      instructor: "Vicky G",
      location: null,
      student: { id: "mohit-dalal", name: "Mohit Dalal" },
    },
  },
];
