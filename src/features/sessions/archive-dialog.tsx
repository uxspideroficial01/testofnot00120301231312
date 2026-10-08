import { Dialog } from "./session-dialog";
import type { SessionPanelController } from "./use-session-panel";
export function ArchiveDialog({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const { modal, closeModal, session, onArchive } = controller;
  return (
    <>
      {modal === "archive" && (
        <Dialog label="Delete session" onClose={closeModal}>
          <h2>Delete session</h2>
          <p className="official-modal-intro">Apply changes to:</p>
          <div className="official-radio-list">
            {[
              { value: "single", label: "This session" },
              { value: "following", label: "This and following sessions" },
              { value: "custom", label: "Custom" },
            ].map((option) => (
              <label
                key={option.value}
                className={
                  option.value !== "single" ? "official-disabled-option" : ""
                }
              >
                <input
                  type="radio"
                  name="archive-scope"
                  checked={option.value === "single"}
                  readOnly
                  disabled={option.value !== "single"}
                />
                <span>
                  {option.label}
                  {option.value !== "single" && (
                    <small>
                      {session.date === "2026-10-07" ||
                      session.date.includes("October 7, 2026")
                        ? "Can't select for a past session"
                        : "Only this session is available in this prototype"}
                    </small>
                  )}
                </span>
              </label>
            ))}
          </div>
          <footer>
            <button className="official-button" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="official-button official-destructive"
              onClick={() => {
                closeModal();
                onArchive(session.id);
              }}
            >
              Archive
            </button>
          </footer>
        </Dialog>
      )}
    </>
  );
}
