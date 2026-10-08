"use client";
import { Avatar } from "@/components/ui";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleMinus,
  MoreHorizontal,
} from "lucide-react";

import { dateLabel, timeLabel } from "@/shared/lib/date-time";
import { useMakeupContext } from "./makeup-context";

export function SessionDetails() {
  const {
    family,
    session,
    startScheduling,
    requestIssuance,
    note,
    editNote,
    notesOpen,
    toggleNotes,
    shared,
    openPrivateNotes,
    openSharedNotes,
    activity,
    toggleActivity,
    status,
    markPresent,
    toggleAttendance,
    issuance,
    existing,
    isFamily,
  } = useMakeupContext();
  return (
    <>
      <section className="detail-section detail-grid">
        <span>Date</span>
        <div>{dateLabel(session.date)}</div>
        <span>Time</span>
        <div className="time-detail">
          <span>{timeLabel(session.start)}</span>
          <ArrowRight size={16} />
          <span>{timeLabel(session.end)}</span>
          <span className="muted">EDT</span>
        </div>
        <span>Location</span>
        <div>{session.location}</div>
      </section>
      <section className="detail-section detail-grid">
        <span>Instructor(s)</span>
        <div className="person-line">
          <Avatar name={session.teacher} />
          {session.teacher}
        </div>
      </section>
      <section className="detail-section">
        <div className="section-label-row">
          <span className="muted">Class roster</span>
          {session.status === "missed" ? (
            <span className="badge badge-amber">
              {session.attendance ?? "No show"}
            </span>
          ) : (
            <button className="btn" onClick={markPresent}>
              <CheckCircle2 size={15} />
              Mark all present
            </button>
          )}
        </div>
        <div className="roster-person">
          <Avatar name={session.studentName} />
          <strong>{session.studentName}</strong>
          <button className="status-button" onClick={toggleAttendance}>
            <CircleMinus size={15} />
            {status}
          </button>
          <button
            className="icon-button borderless"
            aria-label="Student options"
            onClick={toggleNotes}
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      </section>
      {session.status === "missed" && (
        <section className="detail-section">
          <div className="section-label-row">
            <span className="muted">Makeup</span>
            <span
              className={`badge ${existing ? "badge-green" : "badge-purple"}`}
            >
              {existing
                ? "Scheduled"
                : issuance
                  ? "Makeup Issued"
                  : "Not issued"}
            </span>
          </div>
          {existing ? (
            <div className="existing-makeup">
              <CalendarDays size={17} />
              <div>
                <strong>{dateLabel(existing.date)}</strong>
                <span>
                  {timeLabel(existing.start)} – {timeLabel(existing.end)}
                </span>
              </div>
              <CheckCircle2 size={18} />
            </div>
          ) : (
            <>
              <p className="subtle-copy">
                {issuance
                  ? "The issued makeup will be applied to this lesson."
                  : "A makeup will be issued when you confirm the new lesson."}
              </p>
              <div className="makeup-detail-actions">
                <button className="btn btn-primary" onClick={startScheduling}>
                  <CalendarDays size={15} />
                  Schedule makeup
                </button>
                {!issuance && (
                  <button className="btn" onClick={requestIssuance}>
                    Issue Makeup
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      )}
      {isFamily && (
        <section className="detail-section">
          <div className="section-label-row">
            <span className="muted">Family</span>
            <span className="muted">{family.members.length} students</span>
          </div>
          <div className="family-member-list">
            {family.members.map((member) => (
              <div key={member.id}>
                <Avatar name={member.name} tone={member.tone} />
                <span>{member.name}</span>
                <span className="muted">{member.service}</span>
              </div>
            ))}
          </div>
          <div className="guardian-line">
            <span className="muted">Guardian</span>
            <span>{family.guardian.name}</span>
          </div>
        </section>
      )}
      <section className="detail-section">
        <div className="section-label-row">
          <span className="muted">Class notes</span>
          <button className="btn" onClick={toggleNotes}>
            Mark for review
          </button>
        </div>
        <button
          className={`btn btn-small ${!shared ? "selected" : ""}`}
          onClick={openPrivateNotes}
        >
          Private notes
        </button>
        <div className="notes-space">
          {notesOpen && (
            <textarea
              aria-label={shared ? "Shared notes" : "Private notes"}
              placeholder={
                shared
                  ? "Add a note for the family..."
                  : "Add a private note..."
              }
              value={note}
              onChange={(e) => editNote(e.target.value)}
            />
          )}
        </div>
        <button
          className={`btn btn-small ${shared ? "selected" : ""}`}
          onClick={openSharedNotes}
        >
          Shared notes
        </button>
      </section>
      <section className="detail-section">
        <span className="small-label">LAST SESSION · SEPTEMBER 24, 2026</span>
        <p className="muted">No notes</p>
      </section>
      <section className="detail-section">
        <button className="full-row-button" onClick={toggleActivity}>
          Activity
          <ChevronDown size={15} />
        </button>
        {activity && (
          <div className="activity-line">
            <span className="activity-bullet" />
            <div>
              {session.status === "missed"
                ? `Attendance marked ${(session.attendance ?? "No show").toLowerCase()}`
                : "Session created"}
              <small>
                October {session.status === "missed" ? "1" : "8"}, 2026
              </small>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
