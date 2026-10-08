"use client";
import { useState } from "react";
import type { Session } from "@/domain/makeup";

/** Ephemeral detail controls; scheduling state lives in the flow controller. */
export function useSessionDetailState(session: Session) {
  const [privateNote, updatePrivateNote] = useState("");
  const [sharedNote, updateSharedNote] = useState("");
  const [notesOpen, updateNotesOpen] = useState(false);
  const [shared, updateShared] = useState(false);
  const [activity, updateActivity] = useState(false);
  const [status, updateStatus] = useState(
    session.status === "missed"
      ? (session.attendance ?? "No show")
      : session.status === "scheduled"
        ? "Scheduled"
        : "Pending",
  );
  return {
    note: shared ? sharedNote : privateNote,
    notesOpen,
    shared,
    activity,
    status,
    editNote: (value: string) =>
      shared ? updateSharedNote(value) : updatePrivateNote(value),
    toggleNotes: () => updateNotesOpen((open) => !open),
    openPrivateNotes: () => {
      updateShared(false);
      updateNotesOpen(true);
    },
    openSharedNotes: () => {
      updateShared(true);
      updateNotesOpen(true);
    },
    toggleActivity: () => updateActivity((open) => !open),
    markPresent: () => {
      if (session.status !== "missed") updateStatus("Present");
    },
    toggleAttendance: () => {
      if (session.status !== "missed")
        updateStatus((current) =>
          current === "Present" ? "Pending" : "Present",
        );
    },
  };
}
