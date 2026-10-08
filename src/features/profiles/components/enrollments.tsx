import { useState } from "react";
import { Plus } from "lucide-react";
import type { ProfileKind } from "../types";
import { ProfileMenu, Status } from "./profile-controls";
import { enrollmentRows } from "../demo-fixtures";
import type { OfficialSession } from "@/domain/official";
import { DEMO_PROFILE_DATE } from "@/demo/profile-session-links";
import { resolveProfileSessionLinks } from "../session-links";

export function Enrollments({
  kind,
  name,
  onAction,
  onOpenSession,
  sessions,
  sessionReferences,
}: {
  kind: ProfileKind;
  name: string;
  onAction: (text: string) => void;
  onOpenSession?: (sessionId: string) => void;
  sessions: readonly OfficialSession[];
  sessionReferences: Readonly<Record<string, readonly string[]>>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [inactive, setInactive] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const staff = kind === "staff";
  const rows = enrollmentRows(kind, name);
  return (
    <section className={`pp-enrollments ${staff ? "staff" : ""}`}>
      <div className="pp-section-heading">
        <h2>{staff ? "Enrollments" : "Existing enrollments"}</h2>
        {staff ? (
          <span className="pp-count">27 total</span>
        ) : (
          <button
            className="pp-button pp-primary"
            onClick={() => onAction("Enroll member")}
          >
            <Plus size={14} />
            Enroll member
          </button>
        )}
      </div>
      <div className="pp-enrollment-grid">
        {rows.slice(0, expanded ? 4 : 2).map(({ id, title }, i) => {
          const links = resolveProfileSessionLinks(
            sessions,
            sessionReferences[id] ?? [],
          );
          const upcoming = links
            .filter((link) => link.dateKey >= DEMO_PROFILE_DATE)
            .slice(0, 3);
          const lastAttended = links
            .filter((link) => link.dateKey < DEMO_PROFILE_DATE)
            .at(-1);
          return deleted.includes(id) ? null : (
            <article className="pp-enrollment" key={id}>
              <div className="pp-enrollment-heading">
                <button
                  className="pp-enrollment-title pp-plain"
                  onClick={() => onAction("Edit enrollment")}
                >
                  {title}
                </button>
                <Status>{inactive.includes(id) ? "Inactive" : "Active"}</Status>
                <ProfileMenu
                  label={`Enrollment actions ${i + 1}`}
                  items={[
                    {
                      label: "Edit enrollment",
                      action: () => onAction("Edit enrollment"),
                    },
                    {
                      label: inactive.includes(id)
                        ? "Activate enrollment"
                        : "Deactivate enrollment",
                      action: () =>
                        setInactive((current) =>
                          current.includes(id)
                            ? current.filter((currentId) => currentId !== id)
                            : [...current, id],
                        ),
                    },
                    {
                      label: "Delete enrollment",
                      action: () => setDeleted((current) => [...current, id]),
                    },
                  ]}
                />
              </div>
              {!staff && i === 1 && (
                <div className="pp-enrollment-instructor">
                  Cory Zhou TEST INSTRUCTOR
                </div>
              )}
              <div
                className={`pp-enrollment-sessions ${!staff && i === 1 ? "with-instructor" : ""}`}
              >
                <div className="pp-last-attended">
                  <span>Last attended</span>
                  {lastAttended ? (
                    <>
                      <button
                        className="pp-day pp-faded"
                        onClick={() => onOpenSession?.(lastAttended.id)}
                      >
                        <small>{lastAttended.weekday}</small>
                        <b>{lastAttended.shortDate}</b>
                      </button>
                      <small>{lastAttended.startTime}</small>
                    </>
                  ) : (
                    <div className="pp-dash">—</div>
                  )}
                </div>
                <div className="pp-upcoming">
                  <span>Upcoming</span>
                  {upcoming.length > 0 ? (
                    <div className="pp-days">
                      {upcoming.map((link) => (
                        <div key={link.id}>
                          <button
                            className="pp-day"
                            onClick={() => onOpenSession?.(link.id)}
                          >
                            <small>{link.weekday}</small>
                            <b>{link.shortDate}</b>
                          </button>
                          <small>{link.startTime}</small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pp-dash">—</div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <button className="pp-link" onClick={() => setExpanded(!expanded)}>
        {expanded
          ? "Show fewer enrollments"
          : `View all ${staff ? 27 : 4} enrollments`}
      </button>
    </section>
  );
}
