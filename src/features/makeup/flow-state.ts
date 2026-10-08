import { getAvailableSlots } from "../../domain/availability.ts";
import type { Family } from "../../domain/family.ts";
import type { BookingState, Session, Slot } from "../../domain/makeup.ts";

export const ANY_INSTRUCTOR = "Any eligible instructor";
export type TimePreference = "family" | "all";
type Step =
  | { stage: "detail"; slot: null; created: null }
  | { stage: "slots"; slot: Slot | null; created: null }
  | { stage: "review"; slot: Slot; created: null }
  | { stage: "success"; slot: Slot; created: Session };
export type FlowState = Step & {
  preference: TimePreference;
  teacher: string;
  error: string;
};
export interface FlowContext {
  booking: BookingState;
  session: Session;
  family: Family;
}
export type FlowEvent =
  | { type: "start" }
  | { type: "back" }
  | { type: "select-slot"; slotId: string }
  | { type: "change-preference"; preference: TimePreference }
  | { type: "change-instructor"; teacher: string }
  | { type: "clear-filters" }
  | { type: "review" }
  | { type: "booking-failed"; reason: string }
  | { type: "booking-completed"; created: Session };

export const INITIAL_FLOW: FlowState = {
  stage: "detail",
  slot: null,
  created: null,
  preference: "family",
  teacher: ANY_INSTRUCTOR,
  error: "",
};

export function getEligibleSlots(
  context: FlowContext,
  state: FlowState,
): Slot[] {
  const { booking, session, family } = context;
  return getAvailableSlots(booking, session).filter(
    (slot) =>
      (state.preference === "all" ||
        booking.sessions.some(
          (sibling) =>
            sibling.studentId !== session.studentId &&
            family.members.some((member) => member.id === sibling.studentId) &&
            sibling.status !== "missed" &&
            sibling.date === slot.date,
        )) &&
      (state.teacher === ANY_INSTRUCTOR || slot.teacher === state.teacher),
  );
}

/** UI transitions are guarded against the latest booking snapshot. */
export function transitionFlow(
  state: FlowState,
  event: FlowEvent,
  context: FlowContext,
): FlowState {
  switch (event.type) {
    case "start":
      return state.stage === "detail" &&
        context.session.status === "missed" &&
        !context.booking.sessions.some(
          (s) => s.makeupFor === context.session.id,
        )
        ? { ...state, stage: "slots", error: "" }
        : state;
    case "back":
      return state.stage === "review"
        ? { ...state, stage: "slots", error: "" }
        : state.stage === "slots"
          ? { ...state, stage: "detail", slot: null, created: null, error: "" }
          : state;
    case "change-preference":
    case "change-instructor":
    case "clear-filters":
      if (state.stage !== "slots" && state.stage !== "review") return state;
      return {
        ...state,
        stage: "slots",
        slot: null,
        created: null,
        error: "",
        preference:
          event.type === "change-preference"
            ? event.preference
            : event.type === "clear-filters"
              ? "all"
              : state.preference,
        teacher:
          event.type === "change-instructor"
            ? event.teacher
            : event.type === "clear-filters"
              ? ANY_INSTRUCTOR
              : state.teacher,
      };
    case "select-slot": {
      if (state.stage !== "slots") return state;
      const slot = getEligibleSlots(context, state).find(
        (candidate) => candidate.id === event.slotId,
      );
      return slot ? { ...state, slot, error: "" } : state;
    }
    case "review": {
      if (state.stage !== "slots" || !state.slot) return state;
      const slot = getEligibleSlots(context, state).find(
        (candidate) => candidate.id === state.slot?.id,
      );
      return slot
        ? { ...state, stage: "review", slot, error: "" }
        : {
            ...state,
            slot: null,
            error: "This time is no longer available. Choose another time.",
          };
    }
    case "booking-failed":
      return state.stage === "review"
        ? { ...state, stage: "slots", slot: null, error: event.reason }
        : state;
    case "booking-completed":
      if (
        state.stage !== "review" ||
        event.created.makeupFor !== context.session.id ||
        event.created.studentId !== context.session.studentId
      )
        return state;
      return { ...state, stage: "success", created: event.created, error: "" };
  }
}
