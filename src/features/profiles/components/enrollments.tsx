import { useState } from "react";
import { Plus } from "lucide-react";
import type { ProfileKind } from "../types";
import { ProfileMenu, Status } from "./profile-controls";
import { enrollmentTitles } from "../demo-fixtures";

export function Enrollments({
  kind,
  name,
  onAction,
  onOpenSession,
}: {
  kind: ProfileKind;
  name: string;
  onAction: (text: string) => void;
  onOpenSession?: (title: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [inactive, setInactive] = useState<number[]>([]);
  const [deleted, setDeleted] = useState<number[]>([]);
  const staff = kind === "staff";
  const titles = enrollmentTitles(kind, name);
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
        {titles.slice(0, expanded ? 4 : 2).map((title, i) =>
          deleted.includes(i) ? null : (
            <article className="pp-enrollment" key={i}>
              <div className="pp-enrollment-heading">
                <button
                  className="pp-enrollment-title pp-plain"
                  onClick={() => onAction("Edit enrollment")}
                >
                  {title}
                </button>
                <Status>{inactive.includes(i) ? "Inactive" : "Active"}</Status>
                <ProfileMenu
                  label={`Enrollment actions ${i + 1}`}
                  items={[
                    {
                      label: "Edit enrollment",
                      action: () => onAction("Edit enrollment"),
                    },
                    {
                      label: inactive.includes(i)
                        ? "Activate enrollment"
                        : "Deactivate enrollment",
                      action: () =>
                        setInactive((current) =>
                          current.includes(i)
                            ? current.filter((index) => index !== i)
                            : [...current, i],
                        ),
                    },
                    {
                      label: "Delete enrollment",
                      action: () => setDeleted((current) => [...current, i]),
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
                  {!staff && i === 0 ? (
                    <>
                      <button
                        className="pp-day pp-faded"
                        onClick={() => onOpenSession?.(title)}
                      >
                        <small>Wed</small>
                        <b>Jan 14</b>
                      </button>
                      <small>4:46 PM</small>
                    </>
                  ) : (
                    <div className="pp-dash">—</div>
                  )}
                </div>
                <div className="pp-upcoming">
                  <span>Upcoming</span>
                  {!staff && i === 0 ? (
                    <div className="pp-days">
                      {[
                        ["Thu", "Oct 8"],
                        ["Fri", "Oct 9"],
                        ["Mon", "Oct 12"],
                      ].map(([day, date]) => (
                        <div key={date}>
                          <button
                            className="pp-day"
                            onClick={() => onOpenSession?.(title)}
                          >
                            <small>{day}</small>
                            <b>{date}</b>
                          </button>
                          <small>4:46 PM</small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pp-dash">—</div>
                  )}
                </div>
              </div>
            </article>
          ),
        )}
      </div>
      <button className="pp-link" onClick={() => setExpanded(!expanded)}>
        {expanded
          ? "Show fewer enrollments"
          : `View all ${staff ? 27 : 4} enrollments`}
      </button>
    </section>
  );
}
