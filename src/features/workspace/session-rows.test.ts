import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_FAMILIES, DEMO_FAMILY } from "@/demo/families";
import { createInitialBookingState } from "@/demo/booking";
import {
  createDirectorySessions,
  createWorkspaceBookingState,
} from "@/demo/directory-booking";
import type { Session } from "@/domain/makeup";
import { familyRows } from "./session-rows";

test("every directory family sees only lessons with its own member IDs", () => {
  const booking = createWorkspaceBookingState();
  for (const family of DEMO_FAMILIES) {
    const memberIds = new Set(family.members.map((member) => member.id));
    const rows = familyRows(booking.sessions, "", family);
    assert.equal(rows.length, family.members.length, family.id);
    for (const row of rows) {
      assert.equal(row.source.kind, "family");
      if (row.source.kind === "family") {
        assert.ok(memberIds.has(row.source.session.studentId), family.id);
      }
    }
  }
});

test("matching surnames or identical displayed names cannot cross the selected family boundary", () => {
  const ownSession = createInitialBookingState().sessions[0];
  const unrelated: Session = {
    ...ownSession,
    id: "unrelated-martins-session",
    studentId: "clara-martins-unrelated",
    studentName: ownSession.studentName,
  };
  const rows = familyRows([ownSession, unrelated], "Martins", DEMO_FAMILY);
  assert.deepEqual(
    rows.map((row) => row.id),
    [ownSession.id],
  );
});

test("a selected family search narrows to the requested child instead of including siblings", () => {
  const booking = createWorkspaceBookingState();
  assert.deepEqual(
    familyRows(booking.sessions, "Clara Piano", DEMO_FAMILY).map(
      (row) => row.id,
    ),
    ["missed-clara-oct01"],
  );
  assert.equal(
    familyRows(booking.sessions, "Maria Martins", DEMO_FAMILY).length,
    3,
  );
  assert.equal(
    familyRows(booking.sessions, "not-a-member", DEMO_FAMILY).length,
    0,
  );
});

test("the unfiltered default remains empty while a direct student search finds only matching rows", () => {
  const booking = createWorkspaceBookingState();
  assert.deepEqual(familyRows(booking.sessions, ""), []);
  assert.deepEqual(familyRows(booking.sessions, "   ", null), []);
  const rows = familyRows(booking.sessions, "Clara Martins");
  assert.ok(rows.length > 0);
  assert.ok(rows.every((row) => row.title.includes("Clara Martins")));
});

test("directory lessons are deterministic, scheduled, and do not alter the original October scenario", () => {
  const original = createInitialBookingState();
  const directory = createDirectorySessions();
  const booking = createWorkspaceBookingState();
  assert.deepEqual(createDirectorySessions(), directory);
  assert.deepEqual(
    booking.sessions.slice(0, original.sessions.length),
    original.sessions,
  );
  assert.deepEqual(booking.slots, original.slots);
  assert.deepEqual(booking.makeups, original.makeups);
  assert.equal(
    new Set(booking.sessions.map((session) => session.id)).size,
    booking.sessions.length,
  );
  assert.ok(
    directory.every(
      (session) =>
        session.status === "scheduled" && session.date >= "2026-11-01",
    ),
  );
  const familyDays = DEMO_FAMILIES.filter(
    (family) => family.id !== DEMO_FAMILY.id,
  ).map((family) => {
    const rows = directory.filter((session) =>
      family.members.some((member) => member.id === session.studentId),
    );
    assert.equal(new Set(rows.map((session) => session.date)).size, 1);
    return rows[0].date;
  });
  assert.equal(new Set(familyDays).size, familyDays.length);
});
