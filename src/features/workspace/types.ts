import type { Session } from "@/domain/makeup";

export type WorkspaceProps = {
  initialView?: string;
  initialFamily?: boolean;
  initialFamilyId?: string | null;
  initialPerson?: string;
};

export type OpenProfile = { kind: "member" | "staff"; name: string };

export type SessionRow = {
  id: string;
  date: string;
  time: string;
  title: string;
  staff: string;
  location: string;
  status: string;
  indicator: "occurred" | "missed" | "pending";
  selectionLabel: string;
  source: { kind: "official" } | { kind: "family"; session: Session };
};
