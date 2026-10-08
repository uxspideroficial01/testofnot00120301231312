import { X } from "lucide-react";

import { Dialog } from "./session-dialog";
import type { SessionPanelController } from "./use-session-panel";
import { useState } from "react";
export function EmailDialog({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const { modal, closeModal, session, setToast, emailDraft, setEmailDraft } =
    controller;
  const [emailSubject, setEmailSubject] = useState(emailDraft.subject);
  const [emailBody, setEmailBody] = useState(emailDraft.body);
  return (
    <>
      {modal === "message" && (
        <Dialog label="Email class roster" onClose={closeModal}>
          <button
            className="official-close"
            aria-label="Close email"
            onClick={closeModal}
          >
            <X size={16} />
          </button>
          <h2>Email class roster</h2>
          <p className="official-modal-subtitle">
            {session.students.map((student) => student.name).join(", ")}
          </p>
          <label className="official-editor-field">
            Subject
            <input
              value={emailSubject}
              onChange={(event) => setEmailSubject(event.target.value)}
            />
          </label>
          <label className="official-editor-field">
            Message
            <textarea
              rows={5}
              value={emailBody}
              onChange={(event) => setEmailBody(event.target.value)}
            />
          </label>
          <footer>
            <button className="official-button" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="official-button official-primary"
              onClick={() => {
                setEmailDraft({ subject: emailSubject, body: emailBody });
                closeModal();
                setToast({
                  title: "Draft saved",
                  body: "Saved in this preview. No email was sent.",
                });
              }}
            >
              Save draft
            </button>
          </footer>
        </Dialog>
      )}
    </>
  );
}
