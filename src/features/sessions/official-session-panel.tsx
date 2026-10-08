"use client";
import { X } from "lucide-react";
import { Dialog } from "./session-dialog";
import { useSessionPanel } from "./use-session-panel";
import type { OfficialSessionPanelProps } from "./types";
import { SessionDetails } from "./session-details";
import { SessionRoster } from "./session-roster";
import { SessionNotes } from "./session-notes";
import { ArchiveDialog } from "./archive-dialog";
import { RemoveAttendeeDialog } from "./remove-attendee-dialog";
import { EnrollmentDialog } from "./enrollment-dialog";
import { NotesDialog } from "./notes-dialog";
import { EditSessionDialog } from "./edit-session-dialog";
import { EmailDialog } from "./email-dialog";
import "./official-session-panel.css";
export type { OfficialSession } from "@/domain/official";
export function OfficialSessionPanel(props: OfficialSessionPanelProps) {
  const controller = useSessionPanel(props);
  return (
    <>
      <Dialog
        variant="drawer"
        label={props.session.title}
        onClose={props.onClose}
      >
        <button
          className="official-close"
          aria-label="Close session"
          onClick={props.onClose}
        >
          <X size={16} />
        </button>
        <SessionDetails controller={controller} />
        <SessionRoster controller={controller} />
        <SessionNotes controller={controller} />
      </Dialog>
      {controller.modal === "archive" && (
        <ArchiveDialog controller={controller} />
      )}
      {controller.removing && <RemoveAttendeeDialog controller={controller} />}
      {controller.modal === "enrollment" && (
        <EnrollmentDialog controller={controller} />
      )}
      {(controller.note || controller.studentNote) && (
        <NotesDialog controller={controller} />
      )}
      {(controller.modal === "edit" ||
        controller.modal === "duplicate" ||
        controller.modal === "add-session") && (
        <EditSessionDialog controller={controller} />
      )}
      {controller.modal === "message" && (
        <EmailDialog controller={controller} />
      )}
    </>
  );
}
