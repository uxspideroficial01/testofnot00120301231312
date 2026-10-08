import assert from "node:assert/strict";
import test from "node:test";
import { createInitialBookingState } from "../demo/booking.ts";
import { getAvailableSlots, getSlotConflict } from "./availability.ts";
import type { Session, Slot } from "./makeup.ts";

test("parallel sibling lessons are allowed but student, teacher and room conflicts are blocked", () => {
  const state = createInitialBookingState();
  const original = state.sessions[0];
  const slot = state.slots[0];
  assert.equal(getSlotConflict(state, original, slot), null);
  for (const overrides of [
    { studentId: original.studentId },
    { teacher: slot.teacher },
    { location: slot.location },
  ]) {
    const conflict: Session = {
      ...state.sessions[1],
      id: "conflict",
      ...overrides,
    };
    const conflictingState = {
      ...state,
      sessions: [...state.sessions, conflict],
    };
    assert.notEqual(getSlotConflict(conflictingState, original, slot), null);
  }
});

test("overlap boundaries allow back-to-back, missed, and different-day lessons", () => {
  const state = createInitialBookingState();
  const original = state.sessions[0];
  const slot = state.slots[0];
  for (const overrides of [
    { start: "15:30", end: "16:00" },
    { start: "16:30", end: "17:00" },
    { date: "2026-10-09" },
    { status: "missed" as const },
  ]) {
    const candidate = {
      ...state.sessions[1],
      teacher: slot.teacher,
      ...overrides,
    };
    assert.equal(
      getSlotConflict(
        { ...state, sessions: [original, candidate] },
        original,
        slot,
      ),
      null,
    );
  }
});

test("availability rejects malformed slots instead of comparing invalid timestamps", () => {
  const state = createInitialBookingState();
  const invalid: Partial<Slot>[] = [
    { date: "2026-02-30" },
    { date: "2026-13-01" },
    { date: "tomorrow" },
    { start: "25:00" },
    { start: "16:00", end: "15:00" },
    { start: "16:00", end: "16:00" },
    { end: "16:90" },
    { teacher: " " },
    { location: " " },
    { available: false },
  ];
  for (const overrides of invalid) {
    const slot = { ...state.slots[0], ...overrides };
    assert.notEqual(
      getSlotConflict(state, state.sessions[0], slot),
      null,
      JSON.stringify(overrides),
    );
    assert.deepEqual(
      getAvailableSlots({ ...state, slots: [slot] }, state.sessions[0]),
      [],
    );
  }
});

test("availability queries require an existing missed lesson with matching ownership", () => {
  const state = createInitialBookingState();
  for (const original of [
    { ...state.sessions[0], id: "not-in-state" },
    { ...state.sessions[0], studentId: "different-student" },
    state.sessions[1],
  ]) {
    assert.deepEqual(getAvailableSlots(state, original), []);
  }
});

test("availability queries do not issue credits, change state, or expose mutable slot references", () => {
  const state = createInitialBookingState();
  const snapshot = structuredClone(state);
  const first = getAvailableSlots(state, state.sessions[0]);
  assert.ok(first.length > 0);
  first[0].available = false;
  first.reverse();
  assert.deepEqual(state, snapshot);
  state.sessions.forEach(Object.freeze);
  state.slots.forEach(Object.freeze);
  Object.freeze(state.sessions);
  Object.freeze(state.slots);
  Object.freeze(state.makeups);
  Object.freeze(state);
  assert.deepEqual(getAvailableSlots(state, state.sessions[0]), snapshot.slots);
  assert.deepEqual(state.makeups, []);
});

test("initial demo states do not share mutable session and slot records", () => {
  const first = createInitialBookingState();
  const second = createInitialBookingState();
  const snapshot = structuredClone(second);
  first.sessions[0].studentName = "Edited locally";
  first.slots[0].available = false;
  assert.deepEqual(second, snapshot);
  assert.deepEqual(createInitialBookingState(), snapshot);
});
