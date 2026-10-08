import type { OfficialSession } from "@/domain/official";

export type ProfileKind = "member" | "staff";
export type PersonProfileProps = {
  kind: ProfileKind;
  name?: string;
  onBack: () => void;
  sessions: readonly OfficialSession[];
  onOpenSession?: (sessionId: string) => void;
};
export type AvailabilityRange = {
  start: string;
  end: string;
  location: string;
};
export type WeeklyHours = Record<string, AvailabilityRange[]>;
