import assert from "node:assert/strict";
import test from "node:test";
import { EVENTS } from "./fixtures.ts";
import { getCalendarEventSession } from "./event-session.ts";

test("the Mohit tile opens its own time, student, instructor and room", () => {
  const event = EVENTS.find((event) => event.lesson?.id === "mohit-private");
  assert.ok(event);
  const session = getCalendarEventSession(event, "2026-10-08");
  assert.ok(session);
  assert.equal(session.start, "13:29");
  assert.equal(session.end, "14:29");
  assert.equal(session.studentName, "Mohit Dalal");
  assert.equal(session.teacher, "Cory Zhou");
  assert.equal(session.location, "Bedroom");
  assert.equal(session.attendance, "Cancelled");
});

test("tiles in one column have distinct IDs and unknown data stays explicit", () => {
  const sessions = EVENTS.map((event) =>
    getCalendarEventSession(event, "2026-10-08"),
  ).filter((session) => session !== null);
  assert.equal(
    new Set(sessions.map((session) => session.id)).size,
    sessions.length,
  );
  const cory = sessions.find(
    (session) => session.id === "calendar-cory-private",
  );
  assert.equal(cory?.studentName, "Not captured");
  assert.equal(cory?.location, "Not captured");
  assert.equal(getCalendarEventSession(EVENTS[0], "2026-10-08"), null);
});
