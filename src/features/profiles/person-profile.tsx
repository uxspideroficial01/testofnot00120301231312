"use client";
import { useState } from "react";
import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { Overlay } from "@/components/ui";
import type { PersonProfileProps } from "./types";
import { MEMBER_TABS, STAFF_TABS, STAFF_TAB_COUNTS } from "./demo-fixtures";
import "./styles/index.css";
import { ProfileDetails } from "./components/profile-details";
import { Enrollments } from "./components/enrollments";
import { Billing } from "./components/billing";
import { NoteEditor } from "./components/note-editor";
import { Attendance } from "./components/attendance";
import { Documents } from "./components/documents";
import { Activity } from "./components/activity";
import { Availability } from "./components/availability";
import { SessionCards } from "./components/session-cards";
import { getDemoProfileSessionReferences } from "@/demo/profile-session-links";
import { resolveProfileSessionLinks } from "./session-links";

export function PersonProfile(props: PersonProfileProps) {
  // Unsaved demo state belongs to one person, never the next opened profile.
  return (
    <ProfileScreen
      key={`${props.kind}:${props.name ?? "default"}`}
      {...props}
    />
  );
}

function ProfileScreen({
  kind,
  name: providedName,
  onBack,
  onOpenSession,
  sessions,
}: PersonProfileProps) {
  const name =
    providedName ??
    (kind === "member" ? "Garcia Lopez-Paul" : "Cory Zhou Instructor 3");
  const [tab, setTab] = useState(kind === "member" ? "Billing" : "Activity");
  const [notes, setNotes] = useState<{ text: string; adminOnly: boolean }[]>(
    [],
  );
  const [tasks, setTasks] = useState<string[]>([]);
  const [action, setAction] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [noteFilter, setNoteFilter] = useState("all");
  const isStaff = kind === "staff";
  const references = getDemoProfileSessionReferences(kind, name);
  return (
    <div
      className={`person-profile ${isStaff ? "pp-staff-profile" : "pp-member-profile"}`}
    >
      <header className="pp-header">
        <button className="pp-plain pp-breadcrumb" onClick={onBack}>
          {isStaff ? "Staff" : "Members"}
        </button>
        <ChevronRight size={14} />
        <span>{name}</span>
        {!isStaff && (
          <label className="pp-member-search">
            <Search size={16} />
            <input
              aria-label="Search members"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <div className="pp-search-results">
                <button onClick={() => setSearch("")}>
                  {name.toLowerCase().includes(search.toLowerCase())
                    ? name
                    : "No results."}
                </button>
              </div>
            )}
          </label>
        )}
      </header>
      <div className="pp-body">
        <main className="pp-main">
          <Enrollments
            kind={kind}
            name={name}
            onAction={setAction}
            onOpenSession={onOpenSession}
            sessions={sessions}
            sessionReferences={references.enrollments}
          />
          <div className="pp-tabs" role="tablist" aria-label="Profile sections">
            {(isStaff ? STAFF_TABS : MEMBER_TABS).map((item) => (
              <button
                role="tab"
                aria-selected={tab === item}
                key={item}
                className={tab === item ? "selected" : ""}
                onClick={() => setTab(item)}
              >
                {item}
                {isStaff && STAFF_TAB_COUNTS[item] && (
                  <b>{STAFF_TAB_COUNTS[item]}</b>
                )}
              </button>
            ))}
          </div>
          <div className="pp-tab-content" role="tabpanel">
            {!isStaff && (
              <div hidden={tab !== "Billing"}>
                <Billing name={name} />
              </div>
            )}
            <div hidden={tab !== "Activity"}>
              <Activity kind={kind} />
            </div>
            <div hidden={tab !== "Attendance"}>
              <Attendance
                kind={kind}
                name={name}
                onOpenSession={onOpenSession}
                sessions={sessions}
                sessionReferences={references.attendance}
              />
            </div>
            {!isStaff && (
              <div hidden={tab !== "Documents"}>
                <Documents name={name} />
              </div>
            )}
            {!isStaff && (
              <div hidden={tab !== "Family Notes"}>
                <div className="pp-note-filter">
                  <SlidersHorizontal size={14} />
                  <select
                    aria-label="Filter family notes"
                    value={noteFilter}
                    onChange={(e) => setNoteFilter(e.target.value)}
                  >
                    <option value="all">All ({notes.length + 1})</option>
                    <option value="admin">Visible to admin only</option>
                  </select>
                </div>
                <NoteEditor
                  onAdd={(text, adminOnly) =>
                    setNotes((current) => [{ text, adminOnly }, ...current])
                  }
                />
                {notes
                  .filter((note) => noteFilter === "all" || note.adminOnly)
                  .map((note, i) => (
                    <div className="pp-note" key={i}>
                      <strong>UX Spider</strong>
                      <span>Oct 8</span>
                      <p>{note.text}</p>
                    </div>
                  ))}
                {noteFilter === "all" && (
                  <div className="pp-note">
                    <strong>Demo Admin</strong>
                    <span>Nov 5</span>
                  </div>
                )}
              </div>
            )}
            {!isStaff && (
              <div hidden={tab !== "Tasks"}>
                <NoteEditor
                  task
                  onAdd={(value) => setTasks((current) => [value, ...current])}
                />
                {tasks.map((task, i) => (
                  <label className="pp-task" key={i}>
                    <input type="checkbox" />
                    {task}
                  </label>
                ))}
              </div>
            )}
            {isStaff && (
              <div hidden={tab !== "Availability"}>
                <Availability />
              </div>
            )}
            {(tab === "Upcoming" || tab === "Past") && (
              <SessionCards
                past={tab === "Past"}
                onOpenSession={onOpenSession}
                sessions={resolveProfileSessionLinks(
                  sessions,
                  tab === "Past" ? references.past : references.upcoming,
                )}
              />
            )}
          </div>
        </main>
        <ProfileDetails kind={kind} name={name} onAction={setAction} />
      </div>
      {action && (
        <Overlay modal title={action} onClose={() => setAction(null)}>
          <div className="pp-local-dialog">
            <h2>{action}</h2>
            {action.includes("invite") ||
            action.includes("Impersonate") ||
            action.includes("portal") ? (
              <p>Portal access is not connected in this prototype.</p>
            ) : action.includes("Archive") ? (
              <p>Archive {name}?</p>
            ) : (
              <label>
                {action === "Add family member" ? "Member" : "Name"}
                <input
                  defaultValue={action === "Add family member" ? "" : name}
                />
              </label>
            )}
            <div className="pp-dialog-actions">
              <button className="pp-button" onClick={() => setAction(null)}>
                Cancel
              </button>
              {!action.includes("invite") &&
                !action.includes("Impersonate") &&
                !action.includes("portal") && (
                  <button
                    className="pp-button pp-primary"
                    onClick={() => setAction(null)}
                  >
                    Save
                  </button>
                )}
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}
