export type LeadCard = {
  id: string;
  name: string;
  owner: string;
  subtitle?: string;
  tags?: string[];
  age: string;
  interaction?: string;
};
export type LeadGroup = {
  name: string;
  color: string;
  cards: LeadCard[];
  count?: number;
};

export type Composer = "note" | "email" | null;

export type LeadRecord = {
  fields: Record<string, string>;
  notes: string[];
  summary: string;
};

export const EMPTY_LEAD_RECORD: LeadRecord = {
  fields: {},
  notes: [],
  summary: "",
};
