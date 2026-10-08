import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_FAMILY } from "../demo/families.ts";
import { createInitialBookingState } from "../demo/booking.ts";
import { getSiblingSessions, getVisitLabel } from "./family-schedule.ts";
import { matchesFamily } from "./family.ts";

test("sibling context includes only this family's members on the requested day", () => {
  const { sessions } = createInitialBookingState();
  sessions.push(
    {
      ...sessions[1],
      id: "other-family",
      studentId: "another-lucas",
      studentName: "Lucas Martins",
    },
    { ...sessions[2], id: "missed", status: "missed" },
    { ...sessions[2], id: "another-day", date: "2026-10-09" },
  );
  const siblings = getSiblingSessions(
    DEMO_FAMILY,
    sessions,
    "clara-martins",
    "2026-10-08",
  );
  assert.deepEqual(
    siblings.map((session) => session.id),
    ["lucas-oct08", "sofia-oct08"],
  );
  assert.deepEqual(
    getSiblingSessions(DEMO_FAMILY, sessions, "another-lucas", "2026-10-08"),
    [],
  );
});

test("sibling queries sort a new collection without modifying scheduling state", () => {
  const { sessions } = createInitialBookingState();
  sessions.reverse();
  const snapshot = structuredClone(sessions);
  sessions.forEach(Object.freeze);
  Object.freeze(sessions);
  const siblings = getSiblingSessions(
    DEMO_FAMILY,
    sessions,
    "clara-martins",
    "2026-10-08",
  );
  assert.deepEqual(
    siblings.map((session) => session.start),
    ["16:00", "16:30"],
  );
  siblings[0].studentName = "Local display edit";
  siblings.reverse();
  assert.deepEqual(sessions, snapshot);
});

test("visit summaries distinguish different rooms from different campuses", () => {
  const { sessions, slots } = createInitialBookingState();
  const siblings = getSiblingSessions(
    DEMO_FAMILY,
    sessions,
    "clara-martins",
    slots[0].date,
  );
  assert.equal(
    getVisitLabel(siblings, slots[0]),
    "All lessons at Upper East Side",
  );
  assert.equal(
    getVisitLabel(siblings, { ...slots[0], location: "Downtown · Room 1" }),
    "Family lessons are at different locations",
  );
  assert.equal(
    getVisitLabel([], slots[0]),
    "Upper East Side · No sibling lessons this day",
  );
});

test("family search matches names, ignores case/extra spaces, and rejects unrelated families", () => {
  for (const query of ["", "  MARIA   MARTINS ", "Clara", "Lucas Martins"]) {
    assert.equal(matchesFamily(DEMO_FAMILY, query), true);
  }
  assert.equal(matchesFamily(DEMO_FAMILY, "Rivera"), false);
  assert.equal(matchesFamily(DEMO_FAMILY, "Maria Rivera"), false);
});
