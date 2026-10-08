import { useState } from "react";
import { Eye, Mail, Plus } from "lucide-react";
import { Overlay } from "@/components/ui";
import type { ProfileKind } from "../types";
import { NoteEditor } from "./note-editor";
import { DEMO_ACTIVITY_ACTORS } from "../demo-fixtures";

export function Activity({ kind }: { kind: ProfileKind }) {
  const [tab, setTab] = useState("All");
  const [editor, setEditor] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [drafts, setDrafts] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  return (
    <div className="pp-activity">
      {kind === "member" && (
        <>
          <div className="pp-filter-tabs">
            {["All", "Notes", "Emails", "Activity"].map((item) => (
              <button
                className={item === tab ? "selected" : ""}
                onClick={() => setTab(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          {(tab === "All" || tab === "Emails") && (
            <button
              className="pp-new-activity"
              onClick={() => setEmailOpen(true)}
            >
              <Mail size={14} />
              New email
            </button>
          )}
          {(tab === "All" || tab === "Notes") && (
            <button
              className="pp-new-activity"
              onClick={() => setEditor(!editor)}
            >
              <Plus size={14} />
              Add note
            </button>
          )}
          {editor && (
            <NoteEditor
              onAdd={(value) => {
                setNotes((current) => [value, ...current]);
                setEditor(false);
              }}
            />
          )}
          {notes.map((note, i) => (
            <div className="pp-note" key={i}>
              <strong>UX Spider</strong>
              <p>{note}</p>
            </div>
          ))}
        </>
      )}
      {(tab === "All" || tab === "Emails") &&
        drafts.map((draft, i) => (
          <div className="pp-note" key={i}>
            <Mail size={14} />
            <strong>{draft}</strong>
            <span>Draft</span>
          </div>
        ))}
      {emailOpen && (
        <Overlay modal title="New email" onClose={() => setEmailOpen(false)}>
          <div className="pp-local-dialog">
            <h2>New email</h2>
            <label>
              Subject
              <input
                value={emailSubject}
                onChange={(event) => setEmailSubject(event.target.value)}
              />
            </label>
            <label>
              Message
              <textarea
                className="pp-info-input"
                value={emailBody}
                onChange={(event) => setEmailBody(event.target.value)}
              />
            </label>
            <button
              className="pp-button pp-primary"
              disabled={!emailSubject.trim()}
              onClick={() => {
                setDrafts((current) => [emailSubject, ...current]);
                setEmailOpen(false);
                setEmailSubject("");
                setEmailBody("");
              }}
            >
              Save draft
            </button>
          </div>
        </Overlay>
      )}
      {kind === "staff" && (
        <div className="pp-activity-log">
          {DEMO_ACTIVITY_ACTORS.map((person, i) => (
            <div key={i}>
              <span className="pp-eye">
                <Eye size={12} />
              </span>
              <p>
                <strong>{person}</strong> {i % 2 ? "started" : "ended"} an
                impersonation session
              </p>
              <time>
                {i < 4
                  ? "Sep 17"
                  : i < 7
                    ? "Sep 16"
                    : i < 11
                      ? "Sep 14"
                      : i < 13
                        ? "Aug 27"
                        : i < 17
                          ? "Aug 20"
                          : "Aug 18"}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
