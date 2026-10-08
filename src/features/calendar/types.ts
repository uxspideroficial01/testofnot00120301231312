import type { Session } from "@/domain/makeup";
import type { OfficialSession } from "@/domain/official";
export type CalendarViewProps = {
  sessions: Session[];
  onOpenSession: (s: Session) => void;
  onSchedule: () => void;
  officialSessions: OfficialSession[];
  onOpenOfficialSession: (id: string) => void;
  onOpenStaff: (name: string) => void;
};
