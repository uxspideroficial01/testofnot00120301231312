"use client";

import { CalendarView } from "@/features/calendar/calendar-view";
import { SecondaryView } from "@/components/secondary-views";
import { SessionPanel } from "@/features/makeup/session-panel";
import { ScheduleModal } from "@/features/makeup/schedule-modal";
import { OfficialSessionPanel } from "@/features/sessions/official-session-panel";
import { PersonProfile } from "@/features/profiles/person-profile";
import { WorkspaceShell } from "./shell";
import { SessionList } from "./session-list";
import { useWorkspace } from "./use-workspace";
import type { WorkspaceProps } from "./types";
import { PayRatesView } from "@/features/pay-rates/pay-rates-view";
import { usePayRates } from "@/features/pay-rates/use-pay-rates";

export function Workspace(props: WorkspaceProps) {
  const workspace = useWorkspace(props);
  const payRates = usePayRates();
  const { view, person, booking, selected, officialSession } = workspace;
  return (
    <WorkspaceShell
      view={view}
      navigate={workspace.navigate}
      setNotice={workspace.setNotice}
      onReset={() => {
        workspace.reset();
        payRates.reset();
      }}
    >
      <main className="main-workspace">
        {person ? (
          <PersonProfile
            kind={person.kind}
            name={person.name}
            onBack={() =>
              workspace.navigate(person.kind === "member" ? "Members" : "Staff")
            }
            sessions={workspace.officialSessions}
            onOpenSession={workspace.openOfficialSession}
          />
        ) : view === "Payroll" ? (
          <PayRatesView store={payRates} />
        ) : view === "Calendar" ? (
          <CalendarView
            sessions={workspace.calendarSessions}
            onOpenSession={workspace.setSelected}
            onSchedule={() => workspace.setSchedule(true)}
            officialSessions={workspace.officialSessions}
            onOpenOfficialSession={workspace.openOfficialSession}
            onOpenStaff={(name) => workspace.openPerson("staff", name)}
          />
        ) : view === "Sessions" ? (
          <SessionList
            sessions={booking.sessions}
            officialSessions={workspace.officialSessions}
            query={workspace.query}
            onQueryChange={workspace.setQuery}
            family={workspace.family}
            onFamilyChange={workspace.changeFamily}
            onSchedule={() => workspace.setSchedule(true)}
            onOpen={(row) =>
              row.source.kind === "official"
                ? workspace.openOfficialSession(row.id)
                : workspace.setSelected(row.source.session)
            }
          />
        ) : (
          <>
            {view !== "CRM" && view !== "Tasks" && (
              <header className="page-header">
                <h1>{view}</h1>
                <div className="header-actions" />
              </header>
            )}
            <SecondaryView
              view={view}
              onOpenPerson={workspace.openPerson}
              onOpenSession={workspace.openFamilySession}
            />
          </>
        )}
      </main>
      {officialSession && (
        <OfficialSessionPanel
          key={officialSession.id}
          session={officialSession}
          onClose={() => workspace.setOfficialId(null)}
          onUpdate={workspace.updateOfficialSession}
          onArchive={workspace.archiveOfficialSession}
          onOpenMember={(name) => workspace.openPerson("member", name)}
          onOpenInstructor={(name) => workspace.openPerson("staff", name)}
        />
      )}
      {selected && (
        <SessionPanel
          key={selected.id}
          family={workspace.selectedFamily}
          session={selected}
          booking={booking}
          onClose={() => workspace.setSelected(null)}
          onBooking={workspace.setBooking}
        />
      )}
      {workspace.schedule && (
        <ScheduleModal
          onClose={() => workspace.setSchedule(false)}
          sessions={booking.sessions}
          onSelect={(session) => {
            workspace.setSchedule(false);
            workspace.setSelected(session);
          }}
        />
      )}
      {workspace.notice && (
        <div role="status" className="workspace-notice">
          {workspace.notice.startsWith("Session archived") && (
            <strong>Session archived</strong>
          )}
          <span>{workspace.notice}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => workspace.setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </WorkspaceShell>
  );
}
