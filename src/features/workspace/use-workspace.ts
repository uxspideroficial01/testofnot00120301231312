import { useEffect, useState } from "react";
import { createWorkspaceBookingState } from "@/demo/directory-booking";
import { DEMO_FAMILIES, DEMO_FAMILY } from "@/demo/families";
import type { BookingState, Session } from "@/domain/makeup";
import { OFFICIAL_SESSIONS } from "@/demo/official-sessions";
import {
  findOfficialSessionById,
  type OfficialSession,
} from "@/domain/official";
import type { OpenProfile, WorkspaceProps } from "./types";
import { resolveFamilyId } from "./route-params";

/** Coordinates local feature state. No persistence or external service calls. */
export function useWorkspace({
  initialView = "Calendar",
  initialFamily = false,
  initialFamilyId,
  initialPerson,
}: WorkspaceProps) {
  const [view, setView] = useState(initialView);
  const [query, setQuery] = useState("");
  const [familyId, setFamilyId] = useState<string | null>(
    () =>
      resolveFamilyId(initialFamilyId) ??
      (initialFamily ? DEMO_FAMILY.id : null),
  );
  const [schedule, setSchedule] = useState(false);
  const [selected, setSelected] = useState<Session | null>(null);
  const [officialSessions, setOfficialSessions] =
    useState<OfficialSession[]>(OFFICIAL_SESSIONS);
  const [officialId, setOfficialId] = useState<string | null>(null);
  const [person, setPerson] = useState<OpenProfile | null>(
    initialPerson
      ? {
          kind: initialView === "Staff" ? "staff" : "member",
          name: initialPerson,
        }
      : null,
  );
  const [booking, setBooking] = useState<BookingState>(
    createWorkspaceBookingState,
  );
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  function navigate(next: string) {
    setView(next);
    setSelected(null);
    setOfficialId(null);
    setPerson(null);
    setQuery("");
    updateUrl(next);
  }

  function openPerson(kind: OpenProfile["kind"], name: string) {
    setOfficialId(null);
    setSelected(null);
    setPerson({ kind, name });
    const next = kind === "member" ? "Members" : "Staff";
    setView(next);
    updateUrl(next, name);
  }

  function changeFamily(id: string | null) {
    const next = resolveFamilyId(id);
    setFamilyId(next);
    setSelected(null);
    setOfficialId(null);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("family", next);
    else url.searchParams.delete("family");
    window.history.replaceState({}, "", url);
  }

  function openOfficialSession(id: string) {
    const session = findOfficialSessionById(officialSessions, id);
    if (session) setOfficialId(session.id);
    else setNotice("This session is no longer available.");
  }

  function updateOfficialSession(next: OfficialSession) {
    setOfficialSessions((sessions) => {
      const previous = sessions.find((session) => session.id === next.id);
      if (!previous) return [...sessions, next];
      const updated = {
        ...next,
        table: next.table && {
          ...next.table,
          title: previous.title !== next.title ? next.title : next.table.title,
          instructor:
            previous.instructor !== next.instructor
              ? next.instructor
              : next.table.instructor,
          location:
            previous.location !== next.location
              ? next.location
              : next.table.location,
        },
      };
      return sessions.map((session) =>
        session.id === next.id ? updated : session,
      );
    });
  }

  function archiveOfficialSession(id: string) {
    setOfficialSessions((sessions) =>
      sessions.filter((session) => session.id !== id),
    );
    setOfficialId(null);
    setNotice("Session archived successfully");
  }

  function reset() {
    setBooking(createWorkspaceBookingState());
    changeFamily(null);
    setQuery("");
    setSelected(null);
    setOfficialSessions(OFFICIAL_SESSIONS);
    setOfficialId(null);
    setNotice("Workspace reset");
  }

  function openFamilySession() {
    navigate("Sessions");
    changeFamily(DEMO_FAMILY.id);
    const memberIds = new Set(DEMO_FAMILY.members.map((member) => member.id));
    setSelected(
      booking.sessions.find((session) => memberIds.has(session.studentId)) ??
        null,
    );
  }

  const family =
    DEMO_FAMILIES.find((candidate) => candidate.id === familyId) ?? null;
  const calendarMemberIds = new Set(
    (family ?? DEMO_FAMILY).members.map((member) => member.id),
  );

  return {
    view,
    query,
    setQuery,
    familyId,
    family,
    calendarSessions: booking.sessions.filter((session) =>
      calendarMemberIds.has(session.studentId),
    ),
    changeFamily,
    schedule,
    setSchedule,
    selected,
    selectedFamily:
      DEMO_FAMILIES.find((family) =>
        family.members.some((member) => member.id === selected?.studentId),
      ) ?? DEMO_FAMILY,
    setSelected,
    officialSessions,
    officialId,
    setOfficialId,
    officialSession: officialId
      ? findOfficialSessionById(officialSessions, officialId)
      : undefined,
    person,
    booking,
    setBooking,
    notice,
    setNotice,
    navigate,
    openPerson,
    openOfficialSession,
    updateOfficialSession,
    archiveOfficialSession,
    reset,
    openFamilySession,
  };
}

function updateUrl(view: string, person?: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("view", view);
  if (person) url.searchParams.set("person", person);
  else url.searchParams.delete("person");
  window.history.replaceState({}, "", url);
}
