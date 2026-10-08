import { useState } from "react";
import { ChevronDown, Mail, Plus, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "../secondary-shared/controls";
import { LeadTimeline } from "./lead-timeline";
import type { Composer, LeadRecord } from "./types";
export function LeadActivity({
  composer,
  setComposer,
  record,
  onUpdate,
}: {
  composer: Composer;
  setComposer: (value: Composer) => void;
  record: LeadRecord;
  onUpdate: (patch: Partial<LeadRecord>) => void;
}) {
  const [activityTab, setActivityTab] = useState("All");
  const { notes, summary } = record;
  const setNotes = (notes: string[]) => onUpdate({ notes });
  const setSummary = (summary: string) => onUpdate({ summary });
  const [note, setNote] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(false);
  return (
    <section className="sv-crm-right">
      <button
        className="sv-crm-tasks-heading"
        onClick={() => setTasksOpen(!tasksOpen)}
      >
        Tasks
        <ChevronDown size={13} />
      </button>
      {tasksOpen && <div className="sv-crm-task-empty">No tasks.</div>}
      <div className="sv-crm-activity-scroll" aria-label="Lead timeline">
        <nav
          className="sv-crm-activity-tabs"
          aria-label="Lead activity filters"
        >
          {[
            "All",
            "Notes",
            "Emails",
            "Text & Voice",
            "Activity",
            "AI Summary",
          ].map((tab) => (
            <button
              key={tab}
              className={
                activityTab === tab || tab === "AI Summary" ? "active" : ""
              }
              onClick={() => {
                setActivityTab(tab);
                if (tab === "AI Summary") setSummaryOpen(!summaryOpen);
              }}
            >
              {tab === "AI Summary" && <Sparkles size={13} />} {tab}
            </button>
          ))}
        </nav>
        {(activityTab === "All" || activityTab === "Emails") && (
          <button
            className="sv-crm-compose-trigger"
            onClick={() => setComposer(composer === "email" ? null : "email")}
          >
            <Mail size={14} />
            New email
          </button>
        )}
        {(activityTab === "All" || activityTab === "Notes") && (
          <button
            className="sv-crm-compose-trigger"
            onClick={() => setComposer(composer === "note" ? null : "note")}
          >
            <Plus size={15} />
            Add note
          </button>
        )}
        {composer && (
          <form
            className="sv-crm-compose"
            onSubmit={(event) => {
              event.preventDefault();
              if (!note.trim()) return;
              setNotes([note.trim(), ...notes]);
              setNote("");
              setComposer(null);
            }}
          >
            {composer === "email" && (
              <input aria-label="Email subject" placeholder="Subject" />
            )}
            <textarea
              autoFocus
              aria-label={composer === "note" ? "Note text" : "Email draft"}
              placeholder={
                composer === "note" ? "Write a note..." : "Write an email..."
              }
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <div>
              <Button onClick={() => setComposer(null)}>Cancel</Button>
              <button className="sv-button sv-primary" disabled={!note.trim()}>
                {composer === "note" ? "Add note" : "Save draft"}
              </button>
            </div>
          </form>
        )}
        {(activityTab === "All" || activityTab === "AI Summary") &&
          summaryOpen && (
            <div className="sv-crm-summary">
              <header>
                <button onClick={() => setSummaryOpen(false)}>
                  <ChevronDown size={13} />
                  <Sparkles size={14} />
                  AI summary
                </button>
                <button
                  onClick={() =>
                    setSummary(
                      "ParentFirst ParentLast enrolled in Greyson Pickleball Lessons. Greyson Moroney is the lead owner; the lead is in New.",
                    )
                  }
                >
                  <RefreshCw size={12} />
                  Generate
                </button>
              </header>
              <p>{summary || "No summary generated yet."}</p>
            </div>
          )}
        {(activityTab === "All" || activityTab === "Notes") &&
          notes.map((entry, index) => (
            <article className="sv-crm-note" key={index}>
              <header>
                UX Spider · admin only<small>Today</small>
              </header>
              <p>{entry}</p>
            </article>
          ))}
        {(activityTab === "All" || activityTab === "Activity") && (
          <LeadTimeline />
        )}
        {activityTab === "Text & Voice" && (
          <div className="sv-empty">No conversations.</div>
        )}
      </div>
    </section>
  );
}
