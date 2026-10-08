import { DEMO_PAST_SESSIONS, DEMO_UPCOMING_SESSIONS } from "../demo-fixtures";
import type { ProfileSessionLink } from "../session-links";

export function SessionCards({
  past,
  onOpenSession,
  sessions,
}: {
  past: boolean;
  onOpenSession?: (sessionId: string) => void;
  sessions: readonly ProfileSessionLink[];
}) {
  const rows = past ? DEMO_PAST_SESSIONS : DEMO_UPCOMING_SESSIONS;
  return (
    <div className="pp-session-cards">
      {sessions.length
        ? sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onOpenSession?.(session.id)}
            >
              <i />
              <strong>{session.title}</strong>
              <span>{session.date}</span>
              <span>{session.time}</span>
            </button>
          ))
        : rows.map(([title, date, time]) => (
            <button
              key={`${title}:${date}`}
              disabled
              title="Session unavailable"
            >
              <i />
              <strong>{title}</strong>
              <span>{date}</span>
              <span>{time}</span>
            </button>
          ))}
    </div>
  );
}
