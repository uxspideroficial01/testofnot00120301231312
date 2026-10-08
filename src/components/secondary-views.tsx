"use client";
import { People } from "../features/people/people-view";
import { Tasks } from "../features/tasks/tasks-view";
import { Forms } from "../features/forms/forms-view";
import { CRM } from "../features/crm/crm-view";
import { Email } from "../features/messaging/email-view";
import { Inbox } from "../features/messaging/inbox-view";
import { SchedulingLinks } from "../features/scheduling/scheduling-links-view";
import { Availability } from "../features/scheduling/availability-view";
import { Templates } from "../features/templates/templates-view";
import type { OpenPerson } from "../features/secondary-shared/types";
import "./secondary-views.css";
type Props = {
  view: string;
  onOpenSession: () => void;
  onOpenPerson?: OpenPerson;
};
export function SecondaryView({ view, onOpenSession, onOpenPerson }: Props) {
  if (view === "Members" || view === "Staff")
    return (
      <People
        key={view}
        isStaff={view === "Staff"}
        onOpenSession={onOpenSession}
        onOpenPerson={onOpenPerson}
      />
    );
  if (view === "Tasks") return <Tasks />;
  if (view === "Forms") return <Forms />;
  if (view === "CRM") return <CRM />;
  if (view === "Email") return <Email />;
  if (view === "Text & Voice") return <Inbox />;
  if (view === "Scheduling Links") return <SchedulingLinks />;
  if (view === "Availability Finder")
    return <Availability onOpenPerson={onOpenPerson} />;
  if (view === "Email Templates") return <Templates />;
  return <div className="sv-empty">No results.</div>;
}
