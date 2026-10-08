import { X } from "lucide-react";

import { Dialog } from "./session-dialog";
import type { SessionPanelController } from "./use-session-panel";
import { useState } from "react";
import { getSessionDraftError } from "./session-validation";
export function EditSessionDialog({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const { modal, closeModal, session, onUpdate, record } = controller;
  const [draft, setDraft] = useState(session);
  const [error, setError] = useState<string | null>(null);
  function saveSession() {
    const validationError = getSessionDraftError(draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    const next =
      modal === "edit"
        ? draft
        : {
            ...draft,
            id: `recorded-copy-${crypto.randomUUID()}`,
            students: draft.students.map((student) => ({
              ...student,
              status: "Pending" as const,
            })),
          };
    onUpdate(next);
    record(modal === "edit" ? "Session details updated." : "Session created.");
    closeModal();
  }
  return (
    <>
      {(modal === "edit" ||
        modal === "duplicate" ||
        modal === "add-session") && (
        <Dialog
          label={
            modal === "edit"
              ? "Edit session"
              : modal === "duplicate"
                ? "Duplicate session"
                : "Add sessions"
          }
          onClose={closeModal}
        >
          <button
            className="official-close"
            aria-label="Close session editor"
            onClick={closeModal}
          >
            <X size={16} />
          </button>
          <h2>
            {modal === "edit"
              ? "Edit session"
              : modal === "duplicate"
                ? "Duplicate session"
                : "Add sessions"}
          </h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveSession();
            }}
          >
            {(
              [
                ["title", "Name"],
                ["date", "Date"],
                ["start", "Start time"],
                ["end", "End time"],
                ["location", "Location"],
              ] as const
            ).map(([key, label]) => (
              <label className="official-editor-field" key={key}>
                {label}
                <input
                  required={key !== "location"}
                  value={draft[key] ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, [key]: event.target.value })
                  }
                />
              </label>
            ))}
            {error && (
              <p role="alert" className="official-danger-text">
                {error}
              </p>
            )}
            <footer>
              <button
                type="button"
                className="official-button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="official-button official-primary"
                type="submit"
              >
                {modal === "edit" ? "Save changes" : "Create session"}
              </button>
            </footer>
          </form>
        </Dialog>
      )}
    </>
  );
}
