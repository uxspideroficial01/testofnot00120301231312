"use client";
import { getAvailableSlots } from "@/domain/availability";
import {
  getMakeupForSession,
  scheduleMakeup,
  type BookingState,
  type Session,
  type Slot,
} from "@/domain/makeup";
import { useEffect, useRef, useState } from "react";

import { DEMO_FAMILY } from "@/demo/families";
import type { Family } from "@/domain/family";
import { dateLabel } from "@/shared/lib/date-time";
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
  const [stage, setStage] = useState<"detail" | "slots" | "review" | "success">(
    "detail",
  );
  const [issuing, setIssuing] = useState(false);
  const [makeupName, setMakeupName] = useState(
    `Makeup for ${session.studentName} - ${session.service} on ${dateLabel(session.date)}`,
  );
  const [issueError, setIssueError] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [preference, setPreference] = useState<"family" | "all">("family");
  const [teacher, setTeacher] = useState("Any eligible instructor");
  const [note, setNote] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [activity, setActivity] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Session | null>(null);
  const [notify, setNotify] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    if (stage !== "detail") headingRef.current?.focus({ preventScroll: true });
  }, [stage]);
  const [status, setStatus] = useState(
    session.status === "missed"
      ? (session.attendance ?? "No show")
      : session.status === "scheduled"
        ? "Scheduled"
        : "Pending",
  );
  const issuance = getMakeupForSession(booking, session.id);
  const existing = booking.sessions.find((s) => s.makeupFor === session.id);
  const title =
    session.id.startsWith("recorded-") || session.id.startsWith("calendar-")
      ? session.service
      : `${session.studentName} - ${session.service}`;
  const isFamily = family.members.some(
    (member) => member.id === session.studentId,
  );
  const eligible = getAvailableSlots(booking, session).filter(
    (s) =>
      (preference === "all" ||
        booking.sessions.some(
          (sibling) =>
            sibling.studentId !== session.studentId &&
            family.members.some((member) => member.id === sibling.studentId) &&
            sibling.status !== "missed" &&
            sibling.date === s.date,
        )) &&
      (teacher === "Any eligible instructor" || s.teacher === teacher),
  );
  function confirm() {
    if (!slot) return;
    const result = scheduleMakeup(booking, session.id, slot.id);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    onBooking(result.state);
    setCreated(result.session);
    setStage("success");
  }
  return {
    session,
    booking,
    onClose,
    onBooking,
    family,
    stage,
    setStage,
    issuing,
    setIssuing,
    makeupName,
    setMakeupName,
    issueError,
    setIssueError,
    slot,
    setSlot,
    preference,
    setPreference,
    teacher,
    setTeacher,
    note,
    setNote,
    notesOpen,
    setNotesOpen,
    shared,
    setShared,
    activity,
    setActivity,
    error,
    setError,
    created,
    setCreated,
    notify,
    setNotify,
    contentRef,
    headingRef,
    status,
    setStatus,
    issuance,
    existing,
    title,
    isFamily,
    eligible,
    confirm,
  };
}
