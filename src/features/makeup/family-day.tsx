import type { Family } from "@/domain/family";
import { getSiblingSessions, getVisitLabel } from "@/domain/family-schedule";
import type { Session, Slot } from "@/domain/makeup";
import { timeLabel } from "@/shared/lib/date-time";
import { MapPin, UsersRound } from "lucide-react";

export function FamilyDay({
  family,
  sessions,
  original,
  slot,
}: {
  family: Family;
  sessions: Session[];
  original: Session;
  slot: Slot | null;
}) {
  if (!slot) return null;
  const siblings = getSiblingSessions(
    family,
    sessions,
    original.studentId,
    slot.date,
  );
  return (
    <section className="family-day detail-section">
      <div className="section-label-row">
        <strong>
          <UsersRound size={15} />
          {family.name} ·{" "}
          {new Date(`${slot.date}T12:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </strong>
        <span className="muted">EDT</span>
      </div>
      <div className="family-agenda">
        <div className="family-agenda-row selected">
          <span className="mini-dot purple" />
          <strong>{original.studentName.split(" ")[0]}</strong>
          <span>
            {timeLabel(slot.start)} – {timeLabel(slot.end)}
          </span>
          <span>{original.service}</span>
        </div>
        {siblings.map((session, index) => (
          <div className="family-agenda-row" key={session.id}>
            <span className={`mini-dot ${index ? "pink" : "blue"}`} />
            <strong>{session.studentName.split(" ")[0]}</strong>
            <span>
              {timeLabel(session.start)} – {timeLabel(session.end)}
            </span>
            <span>{session.service}</span>
          </div>
        ))}
      </div>
      <div className="family-location">
        <MapPin size={13} />
        {getVisitLabel(siblings, slot)}
      </div>
    </section>
  );
}
