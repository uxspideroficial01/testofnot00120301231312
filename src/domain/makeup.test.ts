import { createInitialBookingState } from "../demo/booking.ts";
import assert from "node:assert/strict";
import test from "node:test";
import {
  bookMakeup,
  getMakeupForSession,
  issueMakeup,
  scheduleMakeup,
  type BookingState,
  type Session,
} from "./makeup.ts";

const ORIGINAL_ID = "missed-clara-oct01";
const SLOT_ID = "slot-oct08-1600";

function issuedState(): BookingState {
  const result = issueMakeup(createInitialBookingState(), ORIGINAL_ID);
  assert.equal(result.ok, true);
  return result.state;
}

function conflictingSession(overrides: Partial<Session> = {}): Session {
  return {
    id: "another-lesson",
    studentId: "clara-martins",
    studentName: "Clara Martins",
    service: "Voice",
    date: "2026-10-08",
    start: "16:15",
    end: "16:45",
    teacher: "Another Teacher",
    location: "Upper East Side · Room 4",
    status: "scheduled",
    ...overrides,
  };
}

test("issuing a makeup preserves the cancelled lesson and creates no scheduled lesson", () => {
  const state = createInitialBookingState();
  const snapshot = structuredClone(state);
  assert.equal(state.makeups.length, 0);
  const result = issueMakeup(state, ORIGINAL_ID, "  Clara piano makeup  ");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(state, snapshot);
  assert.deepEqual(result.state.sessions, snapshot.sessions);
  assert.equal(result.state.sessions[0].attendance, "Cancelled");
  assert.equal(result.makeup.name, "Clara piano makeup");
  assert.equal(result.makeup.originalSessionId, ORIGINAL_ID);
  assert.equal(result.makeup.studentId, "clara-martins");
  assert.equal(result.makeup.status, "issued");
  assert.equal(result.makeup.scheduledSessionId, undefined);
});

test("reissuing an existing makeup is idempotent and preserves its original name", () => {
  const state = issuedState();
  const result = issueMakeup(state, ORIGINAL_ID, "Duplicate request");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.state, state);
  assert.equal(result.makeup, state.makeups[0]);
  assert.equal(result.state.makeups.length, 1);
});

test("booking requires issuance tied to both the original lesson and its student", () => {
  const empty = createInitialBookingState();
  const wrongLesson = issuedState();
  wrongLesson.makeups[0].originalSessionId = "different-original";
  const wrongStudent = issuedState();
  wrongStudent.makeups[0].studentId = "lucas-martins";
  for (const state of [empty, wrongLesson, wrongStudent]) {
    const snapshot = structuredClone(state);
    assert.equal(getMakeupForSession(state, ORIGINAL_ID), undefined);
    const result = bookMakeup(state, ORIGINAL_ID, SLOT_ID);
    assert.equal(result.ok, false);
    assert.deepEqual(state, snapshot);
  }
  assert.equal(issueMakeup(wrongStudent, ORIGINAL_ID).ok, false);
});

test("booking applies one issuance and preserves the absence and every sibling session", () => {
  const before = issuedState();
  const snapshot = structuredClone(before);
  const result = bookMakeup(before, ORIGINAL_ID, SLOT_ID);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(before, snapshot);
  assert.deepEqual(result.state.sessions.slice(0, 3), snapshot.sessions);
  assert.equal(result.state.sessions.length, 4);
  assert.equal(result.session.makeupFor, ORIGINAL_ID);
  assert.equal(result.session.makeupIssuanceId, before.makeups[0].id);
  assert.equal(result.session.studentId, "clara-martins");
  assert.equal(result.session.status, "scheduled");
  assert.equal(result.makeup.status, "applied");
  assert.equal(result.makeup.scheduledSessionId, result.session.id);
  assert.equal(result.state.makeups.length, 1);
});

test("retries reuse the booking and issuance even if the requested time has changed", () => {
  const first = scheduleMakeup(
    createInitialBookingState(),
    ORIGINAL_ID,
    SLOT_ID,
  );
  assert.equal(first.ok, true);
  if (!first.ok) return;
  for (const slotId of [SLOT_ID, "slot-oct09-1600"]) {
    const retry = scheduleMakeup(first.state, ORIGINAL_ID, slotId);
    assert.equal(retry.ok, true);
    if (!retry.ok) continue;
    assert.equal(retry.state, first.state);
    assert.equal(retry.session, first.session);
    assert.equal(retry.makeup, first.makeup);
    assert.equal(retry.state.sessions.length, 4);
    assert.equal(retry.state.makeups.length, 1);
  }
  const reissue = issueMakeup(first.state, ORIGINAL_ID);
  assert.equal(reissue.ok, true);
  if (reissue.ok) assert.equal(reissue.state, first.state);
});

test("an applied issuance cannot create another booking even if its booking is absent", () => {
  const state = issuedState();
  state.makeups[0] = {
    ...state.makeups[0],
    status: "applied",
    scheduledSessionId: "previous-booking",
  };
  const snapshot = structuredClone(state);
  assert.equal(bookMakeup(state, ORIGINAL_ID, SLOT_ID).ok, false);
  assert.deepEqual(state, snapshot);
});

test("confirmation issues and books atomically, reusing a separately issued makeup", () => {
  for (const state of [createInitialBookingState(), issuedState()]) {
    const snapshot = structuredClone(state);
    const result = scheduleMakeup(state, ORIGINAL_ID, SLOT_ID);
    assert.equal(result.ok, true);
    if (!result.ok) continue;
    assert.deepEqual(state, snapshot);
    assert.equal(result.state.makeups.length, 1);
    assert.equal(result.makeup.status, "applied");
    assert.equal(result.session.makeupIssuanceId, result.makeup.id);
    if (state.makeups.length)
      assert.equal(result.makeup.id, state.makeups[0].id);
  }
});

test("failed confirmation does not commit issuance or change sessions", () => {
  for (const state of [createInitialBookingState(), issuedState()]) {
    state.sessions.push(conflictingSession());
    const snapshot = structuredClone(state);
    const result = scheduleMakeup(state, ORIGINAL_ID, SLOT_ID);
    assert.equal(result.ok, false);
    if (!result.ok)
      assert.match(result.reason, /student already has a lesson/i);
    assert.deepEqual(state, snapshot);
    assert.equal("state" in result, false);
  }
});

test("back-to-back lessons do not overlap", () => {
  const state = issuedState();
  state.sessions.push(conflictingSession({ start: "15:30", end: "16:00" }));
  assert.equal(bookMakeup(state, ORIGINAL_ID, SLOT_ID).ok, true);
});

test("teacher and room conflicts are rechecked when confirming a booking", () => {
  for (const resource of [
    { teacher: "Emma Wilson" },
    { location: "Upper East Side · Room 2" },
  ]) {
    const state = issuedState();
    state.sessions.push(
      conflictingSession({ studentId: "another-student", ...resource }),
    );
    const snapshot = structuredClone(state);
    const result = bookMakeup(state, ORIGINAL_ID, SLOT_ID);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.reason, /no longer available/i);
    assert.deepEqual(state, snapshot);
  }
});

test("only a known missed lesson and a known slot can create a makeup booking", () => {
  for (const originalId of ["unknown-lesson", "lucas-oct08"]) {
    const state = createInitialBookingState();
    const snapshot = structuredClone(state);
    assert.equal(issueMakeup(state, originalId).ok, false);
    assert.equal(scheduleMakeup(state, originalId, SLOT_ID).ok, false);
    assert.deepEqual(state, snapshot);
  }
  const state = createInitialBookingState();
  assert.equal(scheduleMakeup(state, ORIGINAL_ID, "unknown-slot").ok, false);
  assert.equal(state.makeups.length, 0);
});

test("invalid slot intervals fail confirmation atomically without issuing credit", () => {
  for (const interval of [
    { date: "2026-02-30" },
    { start: "25:00" },
    { start: "16:00", end: "15:00" },
    { start: "16:00", end: "16:00" },
  ]) {
    const state = createInitialBookingState();
    state.slots[0] = { ...state.slots[0], ...interval };
    const snapshot = structuredClone(state);
    const result = scheduleMakeup(state, ORIGINAL_ID, SLOT_ID);
    assert.equal(result.ok, false);
    assert.equal("state" in result, false);
    assert.deepEqual(state, snapshot);
  }
});

test("identifier collisions cannot overwrite another lesson's credit or booking", () => {
  const issuanceCollision = createInitialBookingState();
  issuanceCollision.makeups.push({
    id: `issuance-${ORIGINAL_ID}`,
    originalSessionId: "other-original",
    studentId: "other-student",
    name: "Another makeup",
    status: "issued",
  });
  const bookingCollision = createInitialBookingState();
  bookingCollision.sessions.push({
    ...bookingCollision.sessions[1],
    id: `makeup-${ORIGINAL_ID}`,
  });
  for (const state of [issuanceCollision, bookingCollision]) {
    const snapshot = structuredClone(state);
    const result = scheduleMakeup(state, ORIGINAL_ID, SLOT_ID);
    assert.equal(result.ok, false);
    assert.equal("state" in result, false);
    assert.deepEqual(state, snapshot);
  }
});
