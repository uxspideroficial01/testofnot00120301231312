import { Pencil, X } from "lucide-react";

import { calendarPosition } from "@/domain/official";

import type { CalendarController } from "./use-calendar";
import { COLUMNS, EVENTS } from "./fixtures";
export function CalendarGrid({
  controller,
}: {
  controller: CalendarController;
}) {
  const {
    family,
    mode,
    names,
    day,
    month,
    openSession,
    selectedDate,
    officialSessions,
    onOpenOfficialSession,
    sessions,
    onOpenSession,
    onOpenStaff,
  } = controller;
  return (
    <>
      <div className="schedule-scroll">
        <div
          className={`schedule-grid ${family ? "family-calendar" : ""}`}
          style={{
            minWidth:
              mode === "Week" ? 1100 : family ? 600 : 32 + names.length * 120,
          }}
        >
          <div
            className="schedule-column-head"
            style={{
              gridTemplateColumns: `32px repeat(${mode === "Week" ? 7 : names.length}, minmax(0, 1fr))`,
            }}
          >
            <div />
            {(mode === "Week"
              ? [
                  "Mon 5",
                  "Tue 6",
                  "Wed 7",
                  "Thu 8",
                  "Fri 9",
                  "Sat 10",
                  "Sun 11",
                ]
              : names
            ).map((name) => (
              <div key={name}>
                <span>
                  {name === "AJ Test Staff Ding" ? (
                    <>
                      AJ Test
                      <br />
                      Staff...
                    </>
                  ) : (
                    name
                  )}
                </span>
                {mode === "Day" && (
                  <button
                    aria-label={`View ${name} availability`}
                    onClick={() => onOpenStaff(name)}
                  >
                    <Pencil size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="schedule-body" style={{ height: 650 }}>
            <div className="time-axis">
              {["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"].map(
                (t, i) => (
                  <span key={t} style={{ top: i * 100 - 8 }}>
                    {t}
                  </span>
                ),
              )}
            </div>
            <div className="time-columns">
              {(mode === "Week" ? Array.from({ length: 7 }) : names).map(
                (_, i) => (
                  <div
                    key={i}
                    className={`time-column ${!family && i === 0 ? "available-column" : ""}`}
                  >
                    {Array.from({ length: 7 }, (_, j) => (
                      <div key={j} className="hour-line" />
                    ))}
                  </div>
                ),
              )}
            </div>
            {!family &&
              mode === "Day" &&
              day === 8 &&
              month === 9 &&
              EVENTS.map((event, i) => {
                const column = names.indexOf(COLUMNS[event.column + 7]);
                if (column < 0) return null;
                const Tile = event.lesson ? "button" : "div";
                return (
                  <Tile
                    key={i}
                    className={`calendar-event event-${event.color} ${event.cancelled ? "event-cancelled" : ""}`}
                    style={{
                      left: 32 + column * 120 + (event.right ? 60 : 0) + 3,
                      top: event.top,
                      width: event.half ? 55 : 115,
                      height: event.height,
                    }}
                    onClick={
                      event.lesson ? () => openSession(event) : undefined
                    }
                  >
                    <strong>{event.title}</strong>
                    <span>
                      {event.time} {event.detail}
                    </span>
                    {event.cancelled && <X size={12} className="cancel-mark" />}
                  </Tile>
                );
              })}
            {!family &&
              mode === "Day" &&
              officialSessions
                .filter((session) => session.date === selectedDate)
                .map((session) => {
                  const column = names.indexOf(session.instructor);
                  if (column < 0) return null;
                  const position = calendarPosition(session);
                  return (
                    <button
                      key={session.id}
                      className="calendar-event recorded-calendar-event"
                      style={{
                        left: 32 + column * 120 + 2,
                        width: 104,
                        ...position,
                      }}
                      onClick={() => onOpenOfficialSession(session.id)}
                    >
                      <strong>{session.title}</strong>
                      <span>
                        {new Date(
                          `${session.date}T${session.start}`,
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        {session.location}
                      </span>
                      {session.group &&
                        session.students.map((student) => (
                          <span className="calendar-attendee" key={student.id}>
                            {student.name}
                          </span>
                        ))}
                    </button>
                  );
                })}
            {!family && day === 7 && month === 9 && (
              <div
                className="calendar-unavailable"
                style={{
                  left: 32 + 5 * 120,
                  top: 300,
                  width: 120,
                  height: 100,
                }}
              />
            )}
            {family &&
              sessions
                .filter((s) => s.date === selectedDate && s.status !== "missed")
                .map((s) => {
                  const i = names.indexOf(s.teacher);
                  if (i < 0) return null;
                  return (
                    <button
                      key={s.id}
                      className={`calendar-event event-${i === 0 ? "purple" : i === 1 ? "blue" : "pink"}`}
                      style={{
                        left: `calc(32px + (100% - 32px) / ${names.length} * ${i} + 3px)`,
                        ...calendarPosition(s),
                        width: `calc((100% - 32px) / ${names.length} - 5px)`,
                      }}
                      onClick={() => onOpenSession(s)}
                    >
                      <strong>
                        {s.studentName} - {s.service}
                      </strong>
                      <span>
                        {s.start} {s.makeupFor ? "· Makeup" : ""}
                      </span>
                    </button>
                  );
                })}
            {mode === "Week" && sessions[1] && (
              <button
                className="calendar-event event-purple"
                style={{
                  left: "calc(32px + (100% - 32px) / 7 * 3 + 3px)",
                  width: "calc((100% - 32px) / 7 - 5px)",
                  top: 400,
                  height: 50,
                }}
                onClick={() => onOpenSession(sessions[1])}
              >
                <strong>
                  {sessions[1].studentName} - {sessions[1].service}
                </strong>
                <span>
                  {new Date(
                    `${sessions[1].date}T${sessions[1].start}`,
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
