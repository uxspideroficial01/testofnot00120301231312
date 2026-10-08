import { DEMO_PAST_SESSIONS, DEMO_UPCOMING_SESSIONS } from "../demo-fixtures";

export function SessionCards({
  past,
  onOpenSession,
}: {
  past: boolean;
  onOpenSession?: (title: string) => void;
}) {
  const rows = past ? DEMO_PAST_SESSIONS : DEMO_UPCOMING_SESSIONS;
  return (
    <div className="pp-session-cards">
      {rows.map(([title, date, time]) => (
        <button key={title} onClick={() => onOpenSession?.(title)}>
          <i />
          <strong>{title}</strong>
          <span>{date}</span>
          <span>{time}</span>
        </button>
      ))}
    </div>
  );
}
