import { X } from "lucide-react";

import { Dialog } from "./session-dialog";
import type { SessionPanelController } from "./use-session-panel";
import { useState } from "react";
export function RemoveAttendeeDialog({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const { removing, setRemoving, session, onUpdate, record, setToast } =
    controller;
  const [removeScope, setRemoveScope] = useState("single");
  return (
    <>
      {removing && (
        <Dialog
          label={`Remove ${removing.name}`}
          onClose={() => setRemoving(null)}
        >
          <button
            className="official-close"
            aria-label="Close removal"
            onClick={() => setRemoving(null)}
          >
            <X size={16} />
          </button>
          <h2>Remove {removing.name}</h2>
          <p className="official-modal-subtitle">
            Choose how much of this student&apos;s schedule to remove.
          </p>
          <div className="official-radio-list official-remove-options">
            <label>
              <input
                type="radio"
                name="remove-scope"
                checked={removeScope === "single"}
                onChange={() => setRemoveScope("single")}
              />
              <span>
                This session only
                <small>
                  Remove the student from only this session. The student remains
                  enrolled in the class.
                </small>
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="remove-scope"
                checked={removeScope === "following"}
                onChange={() => setRemoveScope("following")}
              />
              <span>
                This and following sessions
                <small>
                  Remove the student from this session and all later sessions in
                  the class. Past sessions will remain unchanged. The
                  student&apos;s enrollment will stay active unless you
                  deactivate it separately.
                </small>
              </span>
            </label>
          </div>
          <footer>
            <button
              className="official-button"
              onClick={() => setRemoving(null)}
            >
              Cancel
            </button>
            <button
              className="official-button official-destructive"
              onClick={() => {
                onUpdate({
                  ...session,
                  students: session.students.filter(
                    (student) => student.id !== removing.id,
                  ),
                });
                record(`${removing.name} removed from this session.`);
                setToast({
                  title: "Student removed",
                  body:
                    removeScope === "single"
                      ? "Removed from this session. Student is still enrolled."
                      : "Removed from this session. This prototype has no later enrollments for this class.",
                });
                setRemoving(null);
              }}
            >
              Remove
            </button>
          </footer>
        </Dialog>
      )}
    </>
  );
}
