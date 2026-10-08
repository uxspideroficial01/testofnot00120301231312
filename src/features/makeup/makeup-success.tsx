"use client";
import { Avatar } from "@/components/ui";
import { Check, CheckCircle2, Mail } from "lucide-react";

import { dateLabel, timeLabel } from "@/shared/lib/date-time";
import { downloadText } from "@/shared/lib/download";
import { FamilyDay } from "./family-day";
import { useMakeupContext } from "./makeup-context";

export function MakeupSuccess() {
  const { family, session, booking, slot, created, notify } =
    useMakeupContext();
  if (!created) return null;
  return (
    <>
      <div className="success-heading">
        <span className="success-icon">
          <Check size={24} />
        </span>
        <h3>{session.studentName.split(" ")[0]}’s makeup is scheduled</h3>
        <p>{dateLabel(created.date)}</p>
        <strong>
          {timeLabel(created.start)} – {timeLabel(created.end)} EDT
        </strong>
      </div>
      <section className="detail-section detail-grid">
        <span>Student</span>
        <div className="person-line">
          <Avatar name={session.studentName} />
          {session.studentName}
        </div>
        <span>Service</span>
        <div>{session.service} · 30 minutes</div>
        <span>Instructor</span>
        <div>{created.teacher}</div>
        <span>Location</span>
        <div>{created.location}</div>
        <span>Original lesson</span>
        <div>
          {dateLabel(session.date)} · {timeLabel(session.start)}
        </div>
        <span>Makeup</span>
        <div>Issued makeup applied</div>
        <span>Scheduled by</span>
        <div>UX Spider · Admin</div>
      </section>
      <FamilyDay
        family={family}
        original={session}
        sessions={booking.sessions}
        slot={slot}
      />
      <section className="detail-section">
        <div className="inline-note">
          <CheckCircle2 size={16} />
          <span>Other family lessons are unchanged.</span>
        </div>
        {notify && (
          <div className="notification-draft">
            <Mail size={16} />
            <div>
              <strong>Confirmation ready for {family.guardian.name}</strong>
              <button
                className="text-button"
                onClick={() => {
                  const text = `Hi ${family.guardian.name},\n\n${session.studentName}'s makeup ${session.service.toLowerCase()} lesson is scheduled for ${dateLabel(created.date)}, ${timeLabel(created.start)}–${timeLabel(created.end)} EDT, with ${created.teacher} at ${created.location}.\n\nThe issued makeup has been applied. Other family lessons are unchanged.\n`;
                  downloadText("makeup-confirmation.txt", text);
                }}
              >
                Download confirmation
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
