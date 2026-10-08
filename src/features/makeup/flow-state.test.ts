import assert from "node:assert/strict";
import test from "node:test";
import { createInitialBookingState } from "../../demo/booking.ts";
import { DEMO_FAMILY } from "../../demo/families.ts";
import { scheduleMakeup } from "../../domain/makeup.ts";
import {
  ANY_INSTRUCTOR,
  INITIAL_FLOW,
  getEligibleSlots,
  transitionFlow,
  type FlowContext,
  type FlowState,
} from "./flow-state.ts";

function fixture() {
  const booking = createInitialBookingState();
  const session = booking.sessions[0];
  const context: FlowContext = { booking, session, family: DEMO_FAMILY };
  const choosing = transitionFlow(INITIAL_FLOW, { type: "start" }, context);
  const selected = transitionFlow(
    choosing,
    { type: "select-slot", slotId: "slot-oct08-1600" },
    context,
  );
  assert.ok(selected.slot);
  return { context, choosing, selected };
}

test("review cannot be entered before choosing a currently eligible slot", () => {
  const { context, choosing } = fixture();
  assert.equal(
    transitionFlow(INITIAL_FLOW, { type: "review" }, context),
    INITIAL_FLOW,
  );
  assert.equal(transitionFlow(choosing, { type: "review" }, context), choosing);
  assert.equal(
    transitionFlow(
      choosing,
      { type: "select-slot", slotId: "unknown" },
      context,
    ),
    choosing,
  );
  const unavailable = { ...context.booking.slots[0], available: false };
  const unavailableContext = {
    ...context,
    booking: { ...context.booking, slots: [unavailable] },
  };
  assert.equal(
    transitionFlow(
      choosing,
      { type: "select-slot", slotId: unavailable.id },
      unavailableContext,
    ),
    choosing,
  );
});

test("review revalidates availability against a newer booking snapshot", () => {
  const { context, selected } = fixture();
  const changedContext = {
    ...context,
    booking: {
      ...context.booking,
      slots: context.booking.slots.map((slot) => ({
        ...slot,
        available: false,
      })),
    },
  };
  const state = transitionFlow(selected, { type: "review" }, changedContext);
  assert.equal(state.stage, "slots");
  assert.equal(state.slot, null);
  assert.match(state.error, /no longer available/);
});

test("changing either preference or instructor atomically clears a reviewed slot", () => {
  const { context, selected } = fixture();
  const review = transitionFlow(selected, { type: "review" }, context);
  assert.equal(review.stage, "review");
  const states = [
    transitionFlow(
      review,
      { type: "change-preference", preference: "all" },
      context,
    ),
    transitionFlow(
      review,
      { type: "change-instructor", teacher: "No matching instructor" },
      context,
    ),
    transitionFlow(review, { type: "clear-filters" }, context),
  ];
  for (const state of states) {
    assert.equal(state.stage, "slots");
    assert.equal(state.slot, null);
    assert.equal(state.created, null);
  }
  assert.equal(states[0].preference, "all");
  assert.equal(getEligibleSlots(context, states[1]).length, 0);
  assert.equal(states[2].teacher, ANY_INSTRUCTOR);
});

test("completed booking contains the created session and cannot restart the original lesson", () => {
  const { context, selected } = fixture();
  const review = transitionFlow(selected, { type: "review" }, context);
  const result = scheduleMakeup(
    context.booking,
    context.session.id,
    "slot-oct08-1600",
  );
  assert.ok(result.ok);
  const snapshot = structuredClone(review);
  const completedContext = { ...context, booking: result.state };
  const success = transitionFlow(
    review,
    { type: "booking-completed", created: result.session },
    completedContext,
  );
  assert.equal(success.stage, "success");
  assert.deepEqual(success.created, result.session);
  assert.deepEqual(review, snapshot);
  assert.equal(
    transitionFlow(success, { type: "review" }, completedContext),
    success,
  );
  assert.equal(
    transitionFlow(success, { type: "back" }, completedContext),
    success,
  );
  assert.equal(
    transitionFlow(INITIAL_FLOW, { type: "start" }, completedContext),
    INITIAL_FLOW,
  );
});

test("booking results for another lesson or student cannot complete this flow", () => {
  const { context, selected } = fixture();
  const review = transitionFlow(selected, { type: "review" }, context);
  for (const created of [
    { ...context.session, makeupFor: "another-original" },
    {
      ...context.session,
      makeupFor: context.session.id,
      studentId: "another-student",
    },
  ]) {
    assert.equal(
      transitionFlow(review, { type: "booking-completed", created }, context),
      review,
    );
  }
});

test("failed confirmation returns to time selection without a stale slot", () => {
  const { context, selected } = fixture();
  const review = transitionFlow(selected, { type: "review" }, context);
  const failed = transitionFlow(
    review,
    { type: "booking-failed", reason: "Instructor is already booked." },
    context,
  );
  assert.equal(failed.stage, "slots");
  assert.equal(failed.slot, null);
  assert.equal(failed.error, "Instructor is already booked.");
  assert.equal(transitionFlow(failed, { type: "review" }, context), failed);
});

test("only missed lessons can start makeup scheduling", () => {
  const { context } = fixture();
  const scheduledContext = { ...context, session: context.booking.sessions[1] };
  assert.equal(
    transitionFlow(INITIAL_FLOW, { type: "start" }, scheduledContext),
    INITIAL_FLOW,
  );
});

test("back from review preserves selection; back to details discards it", () => {
  const { context, selected } = fixture();
  let state: FlowState = transitionFlow(selected, { type: "review" }, context);
  state = transitionFlow(state, { type: "back" }, context);
  assert.equal(state.stage, "slots");
  assert.equal(state.slot?.id, selected.slot?.id);
  state = transitionFlow(state, { type: "back" }, context);
  assert.equal(state.stage, "detail");
  assert.equal(state.slot, null);
});
