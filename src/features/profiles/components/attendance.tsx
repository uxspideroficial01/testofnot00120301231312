import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProfileKind } from "../types";
import { Status } from "./profile-controls";
import { attendanceRows } from "../demo-fixtures";

export function Attendance({
  kind,
  name,
  onOpenSession,
}: {
  kind: ProfileKind;
  name: string;
  onOpenSession?: (title: string) => void;
}) {
  const [expanded, setExpanded] = useState<number[]>([]);
  const rows = attendanceRows(kind, name);
  return (
    <div className="pp-attendance">
      {rows.map(([title, dates], i) => (
        <div className="pp-attendance-group" key={title}>
          <button
            className="pp-attendance-row"
            aria-expanded={expanded.includes(i)}
            onClick={() =>
              setExpanded((current) =>
                current.includes(i)
                  ? current.filter((index) => index !== i)
                  : [...current, i],
              )
            }
          >
            <ChevronDown
              className={expanded.includes(i) ? "rotated" : ""}
              size={17}
            />
            <Status />
            <strong>{title}</strong>
            <span>{dates}</span>
          </button>
          {expanded.includes(i) && (
            <div className="pp-attendance-expanded">
              <div>
                <span>Date</span>
                <span>Time</span>
                <span>Attendance</span>
              </div>
              {["Thu Oct 8, 2026", "Fri Oct 9, 2026", "Mon Oct 12, 2026"].map(
                (date) => (
                  <button
                    className="pp-plain"
                    key={date}
                    onClick={() => onOpenSession?.(title)}
                  >
                    <span>{date}</span>
                    <span>4:46 PM</span>
                    <span>Pending</span>
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
