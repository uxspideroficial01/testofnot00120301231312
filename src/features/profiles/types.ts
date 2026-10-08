export type ProfileKind = "member" | "staff";
export type PersonProfileProps = {
  kind: ProfileKind;
  name?: string;
  onBack: () => void;
  onOpenSession?: (title: string) => void;
};
export type AvailabilityRange = {
  start: string;
  end: string;
  location: string;
};
export type WeeklyHours = Record<string, AvailabilityRange[]>;
