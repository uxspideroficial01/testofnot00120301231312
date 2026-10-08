import {
  Check,
  CheckCircle2,
  Mail,
  MoreVertical,
  Plus,
  SquarePen,
} from "lucide-react";

import type { SessionPanelController } from "./use-session-panel";
import { initials } from "./format";
import { StatusIcon } from "./status-icon";
import { ATTENDANCE_STATUSES } from "@/domain/attendance";
export function SessionRoster({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const {
    session,
    group,
    onUpdate,
    record,
    showModal,
    onOpenMember,
    setStudentNote,
    menu,
    setMenu,
    changeStatus,
    setRemoving,
  } = controller;
  return (
    <>
      <section
        className={`official-roster ${group ? "" : "official-individual"}`}
      >
        <div className="official-roster-header">
          <div>
            <span className="official-label">Class roster</span>
            {group && (
              <small>
                {session.students.length}
                {session.capacity ? ` / ${session.capacity}` : ""} enrolled
              </small>
            )}
          </div>
          {group && (
            <div className="official-roster-actions">
              <button
                className="official-button"
                onClick={() => {
                  onUpdate({
                    ...session,
                    students: session.students.map((student) => ({
                      ...student,
                      status: "Present",
                    })),
                  });
                  record("All students marked present.");
                }}
              >
                <CheckCircle2 size={16} />
                Mark all present
              </button>
              <button
                className="official-button official-square"
                aria-label="Email class roster"
                onClick={() => showModal("message")}
              >
                <Mail size={16} />
              </button>
              <button
                className="official-button official-square"
                aria-label="Add student"
                onClick={() => showModal("enrollment")}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
        {session.students.map((student) => (
          <div className="official-student" key={student.id}>
            <span className="official-avatar">{initials(student.name)}</span>
            <button
              className="official-student-name official-plain"
              onClick={() => onOpenMember(student.name)}
            >
              {student.name}
            </button>
            {(student.adHoc || student.enrollment === "Ad hoc") && (
              <small className="official-ad-hoc">Ad hoc</small>
            )}
            <div className="official-student-tools">
              {group && (
                <button
                  className="official-button official-note-shortcut"
                  onClick={() => setStudentNote(student.id)}
                >
                  <SquarePen size={12} />
                  Student note
                </button>
              )}
              <div className="official-menu-anchor">
                <button
                  className="official-plain official-attendance"
                  aria-label={`${student.name} attendance: ${student.status}`}
                  onClick={() =>
                    setMenu(
                      menu === `status-${student.id}`
                        ? null
                        : `status-${student.id}`,
                    )
                  }
                >
                  <StatusIcon status={student.status} />
                  {student.status}
                </button>
                {menu === `status-${student.id}` && (
                  <div
                    className="official-menu official-attendance-menu"
                    role="menu"
                  >
                    {ATTENDANCE_STATUSES.map((status) => (
                      <button
                        role="menuitemradio"
                        aria-checked={student.status === status}
                        key={status}
                        onClick={() => changeStatus(student.id, status)}
                      >
                        <StatusIcon status={status} />
                        {status}
                        {student.status === status && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {group && (
                <div className="official-menu-anchor">
                  <button
                    className="official-plain official-square"
                    aria-label={`Actions for ${student.name}`}
                    onClick={() =>
                      setMenu(menu === student.id ? null : student.id)
                    }
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menu === student.id && (
                    <div
                      className="official-menu official-remove-menu"
                      role="menu"
                    >
                      <button
                        className="official-danger-text"
                        role="menuitem"
                        onClick={() => {
                          setRemoving(student);
                          setMenu(null);
                        }}
                      >
                        Remove from class...
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
