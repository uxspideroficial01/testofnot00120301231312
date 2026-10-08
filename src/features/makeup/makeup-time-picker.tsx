"use client";
import { CalendarDays, UsersRound } from "lucide-react";

import { getSiblingSessions, getVisitLabel } from "@/domain/family-schedule";
import { timeLabel } from "@/shared/lib/date-time";
import { FamilyDay } from "./family-day";
import { useMakeupContext } from "./makeup-context";

export function MakeupTimePicker() {
  const {
    family,
    session,
    booking,
    slot,
    chooseSlot,
    preference,
    changePreference,
    teacher,
    changeInstructor,
    clearSlotFilters,
    eligible,
  } = useMakeupContext();
  return (
    <>
      <section className="makeup-content">
        <h3>Choose a new time</h3>
        <p className="subtle-copy">
          {family.name} · {family.members.length} students · Guardian:{" "}
          {family.guardian.name}
        </p>
        <div className="segmented">
          <button
            className={preference === "family" ? "active" : ""}
            onClick={() => changePreference("family")}
          >
            Same day as siblings
          </button>
          <button
            className={preference === "all" ? "active" : ""}
            onClick={() => changePreference("all")}
          >
            All available times
          </button>
        </div>
        <div className="slot-filters">
          <label className="select-field">
            <span>Instructor</span>
            <select
              value={teacher}
              onChange={(e) => changeInstructor(e.target.value)}
            >
              <option>Any eligible instructor</option>
              {Array.from(
                new Set(booking.slots.map((slot) => slot.teacher)),
              ).map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <div className="select-field">
            <span>Location</span>
            <span>Upper East Side</span>
          </div>
        </div>
        <div
          className="slots-list"
          role="radiogroup"
          aria-label="Available makeup times"
        >
          {eligible.map((s) => (
            <button
              role="radio"
              aria-checked={slot?.id === s.id}
              key={s.id}
              className={`slot-option ${slot?.id === s.id ? "chosen" : ""}`}
              onClick={() => chooseSlot(s.id)}
            >
              <span className="radio-indicator">
                {slot?.id === s.id && <span />}
              </span>
              <span className="slot-main">
                <strong>
                  {new Date(s.date + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                  <span>
                    {timeLabel(s.start)} – {timeLabel(s.end)}
                  </span>
                </strong>
                <span>
                  {s.teacher} · {s.location.split(" · ")[1] ?? s.location}
                </span>
                {getSiblingSessions(
                  family,
                  booking.sessions,
                  session.studentId,
                  s.date,
                ).length > 0 && (
                  <span className="slot-match">
                    <UsersRound size={12} />
                    {getVisitLabel(
                      getSiblingSessions(
                        family,
                        booking.sessions,
                        session.studentId,
                        s.date,
                      ),
                      s,
                    )}
                  </span>
                )}
              </span>
              {s.teacher === session.teacher && (
                <span className="badge">Same instructor</span>
              )}
            </button>
          ))}
          {eligible.length === 0 && (
            <div className="empty-slots">
              <CalendarDays size={25} />
              <strong>No matching times</strong>
              <p>Try another instructor or see all available times.</p>
              <button className="btn" onClick={clearSlotFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
      {slot && (
        <FamilyDay
          family={family}
          original={session}
          sessions={booking.sessions}
          slot={slot}
        />
      )}
    </>
  );
}
