import { createInitialBookingState } from "./booking";
import { DEMO_FAMILIES, DEMO_FAMILY } from "./families";
import type { BookingState, Session } from "../domain/makeup";

/** Each directory family has its own synthetic, non-conflicting lesson day. */
export function createDirectorySessions(): Session[] {
  return DEMO_FAMILIES.filter((family) => family.id !== DEMO_FAMILY.id).flatMap(
    (family, familyIndex) => {
      const date = new Date(Date.UTC(2026, 10, 1 + familyIndex))
        .toISOString()
        .slice(0, 10);
      return family.members.map((member, memberIndex) => {
        const hour = String(13 + memberIndex).padStart(2, "0");
        return {
          id: `directory-${member.id}-${date}`,
          studentId: member.id,
          studentName: member.name,
          service: member.service,
          date,
          start: `${hour}:00`,
          end: `${hour}:30`,
          teacher: `Demo Instructor ${memberIndex + 1}`,
          location: `Demo Studio · Room ${memberIndex + 1}`,
          status: "scheduled" as const,
        };
      });
    },
  );
}

/** Keep the focused makeup scenario intact; only the workspace adds directory rows. */
export function createWorkspaceBookingState(): BookingState {
  const initial = createInitialBookingState();
  return {
    ...initial,
    sessions: [...initial.sessions, ...createDirectorySessions()],
  };
}
