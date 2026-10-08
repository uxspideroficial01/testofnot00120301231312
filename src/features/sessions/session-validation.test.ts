import assert from "node:assert/strict";
import test from "node:test";
import { getSessionDraftError } from "./session-validation.ts";

const valid = {
  title: "Piano",
  date: "2026-10-08",
  start: "12:00",
  end: "13:00",
};

test("session drafts reject impossible dates and malformed times", () => {
  for (const date of ["2026-02-30", "2026-13-01", "tomorrow"]) {
    assert.notEqual(getSessionDraftError({ ...valid, date }), null);
  }
  for (const start of ["25:00", "12:60", "12pm"]) {
    assert.notEqual(getSessionDraftError({ ...valid, start }), null);
  }
});

test("session drafts require a name and positive duration", () => {
  assert.notEqual(getSessionDraftError({ ...valid, title: " " }), null);
  assert.notEqual(getSessionDraftError({ ...valid, end: "12:00" }), null);
  assert.notEqual(getSessionDraftError({ ...valid, end: "11:00" }), null);
  assert.equal(getSessionDraftError(valid), null);
  assert.equal(getSessionDraftError({ ...valid, date: "2028-02-29" }), null);
});
