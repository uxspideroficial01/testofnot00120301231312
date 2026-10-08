import assert from "node:assert/strict";
import test from "node:test";
import { getEnrollmentError } from "./enrollment.ts";

const roster = {
  students: [
    { id: "student-1", name: "Alex Rivera", status: "Pending" as const },
  ],
  capacity: 2,
};

test("enrollment rejects duplicate members even after case or whitespace changes", () => {
  assert.equal(
    getEnrollmentError(roster, " alex RIVERA ", "single"),
    "This member is already enrolled in this session.",
  );
});

test("enrollment rejects a full session without modifying the roster", () => {
  const full = { ...roster, capacity: 1 };
  assert.match(getEnrollmentError(full, "Sam Morgan", "single") ?? "", /full/);
  assert.equal(full.students.length, 1);
});

test("enrollment requires a member and a supported scope", () => {
  assert.match(
    getEnrollmentError(roster, " ", "single") ?? "",
    /Select a member/,
  );
  assert.match(
    getEnrollmentError(roster, "Sam Morgan", "unknown") ?? "",
    /enrollment option/,
  );
});

test("enrollment accepts an available seat with either supported scope", () => {
  assert.equal(getEnrollmentError(roster, "Sam Morgan", "single"), null);
  assert.equal(getEnrollmentError(roster, "Sam Morgan", "following"), null);
  assert.equal(
    getEnrollmentError({ students: [] }, "Sam Morgan", "single"),
    null,
  );
});
