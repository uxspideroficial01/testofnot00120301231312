"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  getMakeupForSession,
  issueMakeup,
  scheduleMakeup,
  type BookingState,
  type Session,
} from "@/domain/makeup";
import { DEMO_FAMILY } from "@/demo/families";
import type { Family } from "@/domain/family";
import { dateLabel } from "@/shared/lib/date-time";
import {
  getEligibleSlots,
  INITIAL_FLOW,
  transitionFlow,
  type FlowEvent,
  type FlowState,
  type TimePreference,
} from "./flow-state";
import { useSessionDetailState } from "./use-session-detail-state";

export function useMakeupFlow({
  session,
  booking,
  onClose,
  onBooking,
  family = DEMO_FAMILY,
}: {
  family?: Family;
  session: Session;
  booking: BookingState;
  onClose: () => void;
  onBooking: (state: BookingState) => void;
}) {
  const context = { session, booking, family };
  const [state, dispatch] = useReducer(
    (current: FlowState, event: FlowEvent) =>
      transitionFlow(current, event, context),
    INITIAL_FLOW,
  );
  const detail = useSessionDetailState(session);
  const [issuing, updateIssuing] = useState(false);
  const [makeupName, updateMakeupName] = useState(
    `Makeup for ${session.studentName} - ${session.service} on ${dateLabel(session.date)}`,
  );
  const [issueError, updateIssueError] = useState("");
  const [notify, updateNotify] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Prevent duplicate submissions before React commits the success render.
  const submittingRef = useRef(false);
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    if (state.stage !== "detail")
      headingRef.current?.focus({ preventScroll: true });
  }, [state.stage]);
  const issuance = getMakeupForSession(booking, session.id);
  const existing = booking.sessions.find(
    (candidate) => candidate.makeupFor === session.id,
  );
  const eligible = getEligibleSlots(context, state);

  function confirmBooking() {
    if (state.stage !== "review" || submittingRef.current) return;
    if (!eligible.some((candidate) => candidate.id === state.slot.id)) {
      dispatch({
        type: "booking-failed",
        reason: "This time is no longer available. Choose another time.",
      });
      return;
    }
    submittingRef.current = true;
    const result = scheduleMakeup(booking, session.id, state.slot.id);
    if (!result.ok) {
      submittingRef.current = false;
      dispatch({ type: "booking-failed", reason: result.reason });
      return;
    }
    onBooking(result.state);
    dispatch({ type: "booking-completed", created: result.session });
  }

  function submitIssuance() {
    if (!issuing) return;
    const result = issueMakeup(booking, session.id, makeupName);
    if (!result.ok) {
      updateIssueError(result.reason);
      return;
    }
    onBooking(result.state);
    updateIssuing(false);
  }

  return {
    ...state,
    ...detail,
    session,
    booking,
    onClose,
    family,
    issuing,
    makeupName,
    issueError,
    notify,
    contentRef,
    headingRef,
    issuance,
    existing,
    eligible,
    title:
      session.id.startsWith("recorded-") || session.id.startsWith("calendar-")
        ? session.service
        : `${session.studentName} - ${session.service}`,
    isFamily: family.members.some((member) => member.id === session.studentId),
    startScheduling: () => {
      submittingRef.current = false;
      dispatch({ type: "start" });
    },
    goBack: () => dispatch({ type: "back" }),
    chooseSlot: (slotId: string) => dispatch({ type: "select-slot", slotId }),
    changePreference: (preference: TimePreference) =>
      dispatch({ type: "change-preference", preference }),
    changeInstructor: (teacher: string) =>
      dispatch({ type: "change-instructor", teacher }),
    clearSlotFilters: () => dispatch({ type: "clear-filters" }),
    reviewBooking: () => dispatch({ type: "review" }),
    confirmBooking,
    requestIssuance: () => {
      if (
        state.stage === "detail" &&
        session.status === "missed" &&
        !issuance
      ) {
        updateIssueError("");
        updateIssuing(true);
      }
    },
    cancelIssuance: () => updateIssuing(false),
    renameMakeup: (name: string) => {
      updateMakeupName(name);
      updateIssueError("");
    },
    submitIssuance,
    changeNotification: (enabled: boolean) => updateNotify(enabled),
  };
}
