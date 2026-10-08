import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProfileKind } from "../types";
import { Status } from "./profile-controls";
import { attendanceRows } from "../demo-fixtures";
import type { OfficialSession } from "@/domain/official";
import { resolveProfileSessionLinks } from "../session-links";

export function Attendance({
  kind,
  name,
  onOpenSession,
  sessions,
  sessionReferences,
}: {
  kind: ProfileKind;
  name: string;
  onOpenSession?: (sessionId: string) => void;
  sessions: readonly OfficialSession[];
  sessionReferences: Readonly<Record<string, readonly string[]>>;
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const rows = attendanceRows(kind, name);
  return (
    <div className="pp-attendance">
      {rows.map(({ id, title, dates }) => {
        const links = resolveProfileSessionLinks(
          sessions,
          sessionReferences[id] ?? [],
        );
        return (
          <div className="pp-attendance-group" key={id}>
            <button
              className="pp-attendance-row"
              aria-expanded={expanded.includes(id)}
              onClick={() =>
                setExpanded((current) =>
                  current.includes(id)
                    ? current.filter((currentId) => currentId !== id)
                    : [...current, id],
                )
              }
            >
              <ChevronDown
                className={expanded.includes(id) ? "rotated" : ""}
                size={17}
              />
              <Status />
              <strong>{title}</strong>
              <span>{dates}</span>
            </button>
            {expanded.includes(id) && (
              <div className="pp-attendance-expanded">
                <div>
                  <span>Date</span>
                  <span>Time</span>
                  <span>Attendance</span>
                </div>
                {links.map((session) => (
                  <button
                    className="pp-plain"
                    key={session.id}
                    onClick={() => onOpenSession?.(session.id)}
                  >
                    <span>{session.date}</span>
                    <span>{session.time}</span>
                    <span>Pending</span>
                  </button>
                ))}
                {!links.length && (
                  <p className="pp-muted">No session records available.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
