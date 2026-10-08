"use client";
import { CalendarDays, CheckCircle2 } from "lucide-react";

import { dateLabel, timeLabel } from "@/shared/lib/date-time";
import { FamilyDay } from "./family-day";
import { useMakeupContext } from "./makeup-context";

export function MakeupReview() {
  const {
    family,
    session,
    booking,
    goBack,
    slot,
    notify,
    changeNotification,
    issuance,
  } = useMakeupContext();
  return (
    <>
      <section className="makeup-content">
        <h3>Review makeup lesson</h3>
        <p className="subtle-copy">
          Schedule for {session.studentName}. Guardian: {family.guardian.name}.
        </p>
        <div className="review-date">
          <CalendarDays size={20} />
          <div>
            <strong>{slot && dateLabel(slot.date)}</strong>
            <span>
              {slot && `${timeLabel(slot.start)} – ${timeLabel(slot.end)} EDT`}
            </span>
          </div>
          <button className="text-button" onClick={goBack}>
            Change
          </button>
        </div>
        <dl className="review-fields">
          <dt>Instructor</dt>
          <dd>{slot?.teacher}</dd>
          <dt>Location</dt>
          <dd>{slot?.location}</dd>
          <dt>Makeup</dt>
          <dd>
            {issuance
              ? "Use existing issued makeup"
              : "Issue and apply on confirmation"}
          </dd>
        </dl>
        <div className="inline-note">
          <CheckCircle2 size={15} />
          <span>
            The original lesson keeps its attendance status and links to this
            makeup.
          </span>
        </div>
      </section>
      <FamilyDay
        family={family}
        original={session}
        sessions={booking.sessions}
        slot={slot}
      />
      <section className="detail-section">
        <label className="notification-checkbox">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => changeNotification(e.target.checked)}
          />
          <div>
            <strong>Prepare confirmation for {family.guardian.name}</strong>
            <span>Email · guardian and billing contact</span>
          </div>
        </label>
      </section>
    </>
  );
}
