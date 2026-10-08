import type { Session, Slot, BookingState } from "../domain/makeup.ts";
export const INITIAL_SESSIONS: Session[] = [
  {
    id: "missed-clara-oct01",
    studentId: "clara-martins",
    studentName: "Clara Martins",
    service: "Piano",
    date: "2026-10-01",
    start: "16:00",
    end: "16:30",
    teacher: "Emma Wilson",
    location: "Upper East Side · Room 2",
    status: "missed",
    attendance: "Cancelled",
  },
  {
    id: "lucas-oct08",
    studentId: "lucas-martins",
    studentName: "Lucas Martins",
    service: "Guitar",
    date: "2026-10-08",
    start: "16:00",
    end: "16:30",
    teacher: "Noah Miller",
    location: "Upper East Side · Room 1",
    status: "scheduled",
  },
  {
    id: "sofia-oct08",
    studentId: "sofia-martins",
    studentName: "Sofia Martins",
    service: "Voice",
    date: "2026-10-08",
    start: "16:30",
    end: "17:00",
    teacher: "Olivia Chen",
    location: "Upper East Side · Room 3",
    status: "scheduled",
  },
];

export const AVAILABLE_SLOTS: Slot[] = [
  {
    id: "slot-oct08-1600",
    date: "2026-10-08",
    start: "16:00",
    end: "16:30",
    teacher: "Emma Wilson",
    location: "Upper East Side · Room 2",
    available: true,
  },
  {
    id: "slot-oct08-1500",
    date: "2026-10-08",
    start: "15:00",
    end: "15:30",
    teacher: "Emma Wilson",
    location: "Upper East Side · Room 2",
    available: true,
  },
  {
    id: "slot-oct09-1600",
    date: "2026-10-09",
    start: "16:00",
    end: "16:30",
    teacher: "Emma Wilson",
    location: "Upper East Side · Room 2",
    available: true,
  },
  {
    id: "slot-oct10-1100",
    date: "2026-10-10",
    start: "11:00",
    end: "11:30",
    teacher: "Daniel Brooks",
    location: "Upper East Side · Room 2",
    available: true,
  },
];

// These local transitions model the administrator demo. The recording confirms
// issuance for a cancelled lesson; eligible slots and atomic scheduling are the
// proposed workflow, not an assertion about the production Noto API.
export function createInitialBookingState(): BookingState {
  return {
    sessions: INITIAL_SESSIONS.map((session) => ({ ...session })),
    makeups: [],
    slots: AVAILABLE_SLOTS.map((slot) => ({ ...slot })),
  };
}
