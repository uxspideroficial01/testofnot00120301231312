import { getSlotConflict } from "./availability.ts";
import type { Attendance } from "./attendance.ts";
export interface Session {
  id: string;
  studentId: string;
  studentName: string;
  service: string;
  date: string;
  start: string;
  end: string;
  teacher: string;
  location: string;
  status: "pending" | "missed" | "scheduled";
  attendance?: Attendance;
  makeupFor?: string;
  makeupIssuanceId?: string;
}

export interface Slot {
  id: string;
  date: string;
  start: string;
  end: string;
  teacher: string;
  location: string;
  available: boolean;
}

export interface MakeupIssuance {
  id: string;
  originalSessionId: string;
  studentId: string;
  name: string;
  status: "issued" | "applied";
  scheduledSessionId?: string;
}

export interface BookingState {
  sessions: Session[];
  slots: Slot[];
  makeups: MakeupIssuance[];
}

export type IssueMakeupResult =
  | { ok: true; state: BookingState; makeup: MakeupIssuance }
  | { ok: false; reason: string };

export type BookingResult =
  | { ok: true; state: BookingState; session: Session; makeup: MakeupIssuance }
  | { ok: false; reason: string };

export function getMakeupForSession(
  state: BookingState,
  originalSessionId: string,
): MakeupIssuance | undefined {
  const original = state.sessions.find(
    (session) => session.id === originalSessionId,
  );
  return original
    ? state.makeups.find(
        (makeup) =>
          makeup.originalSessionId === original.id &&
          makeup.studentId === original.studentId,
      )
    : undefined;
}

export function issueMakeup(
  state: BookingState,
  originalSessionId: string,
  name?: string,
): IssueMakeupResult {
  const original = state.sessions.find(
    (session) => session.id === originalSessionId,
  );
  if (!original)
    return { ok: false, reason: "The original lesson could not be found." };
  if (original.status !== "missed") {
    return {
      ok: false,
      reason: "Only cancelled or missed lessons can receive a makeup.",
    };
  }

  const existing = state.makeups.find(
    (makeup) => makeup.originalSessionId === original.id,
  );
  if (existing) {
    if (existing.studentId !== original.studentId) {
      return {
        ok: false,
        reason: "This makeup belongs to a different student.",
      };
    }
    return { ok: true, state, makeup: existing };
  }

  const issuanceId = `issuance-${original.id}`;
  if (state.makeups.some((makeup) => makeup.id === issuanceId)) {
    return {
      ok: false,
      reason: "This makeup identifier is already assigned to another lesson.",
    };
  }
  const makeup: MakeupIssuance = {
    id: issuanceId,
    originalSessionId: original.id,
    studentId: original.studentId,
    name:
      name?.trim() ||
      `${original.studentName} - ${original.service} - ${original.date}`,
    status: "issued",
  };
  return {
    ok: true,
    makeup,
    state: { ...state, makeups: [...state.makeups, makeup] },
  };
}

export function bookMakeup(
  state: BookingState,
  originalSessionId: string,
  slotId: string,
): BookingResult {
  const original = state.sessions.find(
    (session) => session.id === originalSessionId,
  );

  if (!original) {
    return { ok: false, reason: "The original lesson could not be found." };
  }

  if (original.status !== "missed") {
    return {
      ok: false,
      reason: "Only cancelled or missed lessons can receive a makeup.",
    };
  }

  const makeup = getMakeupForSession(state, originalSessionId);
  if (!makeup) {
    return {
      ok: false,
      reason: "Issue a makeup for this lesson before scheduling it.",
    };
  }

  // A retry resolves by the original lesson and its issuance, not by the newly
  // requested slot. An applied issuance can never fund a second booking.
  const existing = state.sessions.find(
    (session) => session.makeupFor === originalSessionId,
  );
  if (existing) {
    if (
      makeup.status === "applied" &&
      makeup.scheduledSessionId === existing.id &&
      existing.makeupIssuanceId === makeup.id &&
      existing.studentId === original.studentId
    ) {
      return { ok: true, state, session: existing, makeup };
    }
    return {
      ok: false,
      reason: "A makeup booking already exists for this lesson.",
    };
  }
  if (makeup.status !== "issued" || makeup.scheduledSessionId) {
    return {
      ok: false,
      reason: "This makeup has already been applied to a lesson.",
    };
  }

  const slot = state.slots.find((candidate) => candidate.id === slotId);
  if (!slot || !slot.available) {
    return {
      ok: false,
      reason: "This time is no longer available. Choose another time.",
    };
  }

  const conflict = getSlotConflict(state, original, slot);
  if (conflict) return { ok: false, reason: conflict };

  const sessionId = `makeup-${originalSessionId}`;
  if (state.sessions.some((session) => session.id === sessionId)) {
    return {
      ok: false,
      reason: "This booking identifier is already assigned to another lesson.",
    };
  }
  const session: Session = {
    id: sessionId,
    studentId: original.studentId,
    studentName: original.studentName,
    service: original.service,
    date: slot.date,
    start: slot.start,
    end: slot.end,
    teacher: slot.teacher,
    location: slot.location,
    status: "scheduled",
    makeupFor: originalSessionId,
    makeupIssuanceId: makeup.id,
  };
  const appliedMakeup: MakeupIssuance = {
    ...makeup,
    status: "applied",
    scheduledSessionId: session.id,
  };

  return {
    ok: true,
    session,
    makeup: appliedMakeup,
    state: {
      ...state,
      sessions: [...state.sessions, session],
      makeups: state.makeups.map((item) =>
        item.id === makeup.id ? appliedMakeup : item,
      ),
    },
  };
}

// Commit issuance and booking together. Failure returns no new state, so callers
// cannot accidentally persist an unused issuance from a failed confirmation.
export function scheduleMakeup(
  state: BookingState,
  originalSessionId: string,
  slotId: string,
): BookingResult {
  const issued = issueMakeup(state, originalSessionId);
  return issued.ok
    ? bookMakeup(issued.state, originalSessionId, slotId)
    : issued;
}
