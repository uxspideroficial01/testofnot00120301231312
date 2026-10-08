import type { OfficialSession } from "@/domain/official";
export type OfficialSessionPanelProps = {
  session: OfficialSession;
  onClose: () => void;
  onArchive: (id: string) => void;
  onUpdate: (session: OfficialSession) => void;
  onOpenMember: (name: string) => void;
  onOpenInstructor?: (name: string) => void;
};
export type SessionModal =
  | "archive"
  | "enrollment"
  | "edit"
  | "duplicate"
  | "add-session"
  | "message"
  | null;
