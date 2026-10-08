import { Check, ChevronDown, X } from "lucide-react";

import type { SessionPanelController } from "./use-session-panel";
import { displayDate } from "./format";
export function SessionNotes({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const {
    session,
    group,
    onUpdate,
    record,
    setNote,
    activity,
    setActivity,
    events,
    toast,
    setToast,
  } = controller;
  return (
    <>
      <section className="official-class-notes">
        <div className="official-notes-heading">
          <span className="official-label">Class notes</span>
          <button
            className="official-button"
            onClick={() => {
              onUpdate({ ...session, reviewed: !session.reviewed });
              record(
                session.reviewed
                  ? "Review mark cleared."
                  : "Class marked for review.",
              );
            }}
          >
            {session.reviewed ? (
              <>
                <Check size={14} />
                Marked for review
              </>
            ) : (
              "Mark for review"
            )}
          </button>
        </div>
        <button
          className="official-button official-small-button"
          onClick={() => setNote("privateNotes")}
        >
          Private notes
        </button>
        {session.privateNotes && <p>{session.privateNotes}</p>}
        <button
          className="official-button official-small-button"
          onClick={() => setNote("sharedNotes")}
        >
          Shared notes
        </button>
        {session.sharedNotes && <p>{session.sharedNotes}</p>}
      </section>
      {!group && session.previousDate && (
        <section className="official-last-session">
          <strong>
            LAST SESSION ·{" "}
            {displayDate(session.previousDate, false).toUpperCase()}
          </strong>
          <p>No notes</p>
        </section>
      )}
      {!group && (
        <section className="official-enrollment-notes">
          <button
            className="official-plain official-label"
            onClick={() => setNote("enrollmentNotes")}
          >
            Enrollment notes
          </button>
          {session.enrollmentNotes && <p>{session.enrollmentNotes}</p>}
        </section>
      )}
      <section className="official-activity">
        <button
          className="official-plain"
          onClick={() => setActivity(!activity)}
          aria-expanded={activity}
        >
          <span className="official-label">Activity</span>
          <ChevronDown
            size={15}
            style={{ transform: activity ? "rotate(180deg)" : undefined }}
          />
        </button>
        {activity && (
          <div className="official-activity-list">
            {events.length ? (
              events.map((event, index) => (
                <p key={`${index}-${event}`}>
                  {event}
                  <small>Just now</small>
                </p>
              ))
            ) : (
              <p>No activity yet</p>
            )}
          </div>
        )}
      </section>
      {toast && (
        <div className="official-toast" role="status">
          <button
            className="official-close"
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            <X size={15} />
          </button>
          <strong>{toast.title}</strong>
          <p>{toast.body}</p>
        </div>
      )}
    </>
  );
}
