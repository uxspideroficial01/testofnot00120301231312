import {
  ArrowRight,
  CalendarPlus,
  Copy,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { SessionPanelController } from "./use-session-panel";
import { displayDate, displayTime, initials } from "./format";
export function SessionDetails({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const { session, menu, setMenu, showModal, onOpenInstructor } = controller;
  return (
    <>
      <header className="official-session-header">
        <span className="official-class-color" />
        <h2>{session.title}</h2>
        <div className="official-menu-anchor">
          <button
            className="official-plain official-square"
            aria-label="Session actions"
            aria-expanded={menu === "session"}
            onClick={() => setMenu(menu === "session" ? null : "session")}
          >
            <MoreHorizontal size={17} />
          </button>
          {menu === "session" && (
            <div className="official-menu" role="menu">
              <button role="menuitem" onClick={() => showModal("edit")}>
                <Pencil size={16} />
                Edit
              </button>
              <button role="menuitem" onClick={() => showModal("duplicate")}>
                <Copy size={16} />
                Duplicate
              </button>
              <button role="menuitem" onClick={() => showModal("add-session")}>
                <CalendarPlus size={16} />
                Add sessions
              </button>
              <button
                className="official-danger-text"
                role="menuitem"
                onClick={() => showModal("archive")}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </header>
      <section className="official-metadata">
        <div>
          <span>Date</span>
          <p>{displayDate(session.date)}</p>
        </div>
        <div>
          <span>Time</span>
          <p className="official-time">
            <span>{displayTime(session.start)}</span>
            <ArrowRight size={15} />
            <span>{displayTime(session.end)}</span>
            <small>EDT</small>
          </p>
        </div>
        <div>
          <span>Location</span>
          <p>{session.location ?? "Unassigned"}</p>
        </div>
      </section>
      <section className="official-instructor">
        <span className="official-label">Instructor(s)</span>
        <span className="official-avatar official-instructor-avatar">
          {initials(session.instructor)}
        </span>
        <button
          className="official-plain"
          onClick={() => onOpenInstructor?.(session.instructor)}
        >
          {session.instructor}
        </button>
      </section>
    </>
  );
}
