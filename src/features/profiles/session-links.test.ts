import assert from "node:assert/strict";
import test from "node:test";
import { OFFICIAL_SESSIONS } from "../../demo/official-sessions.ts";
import { getDemoProfileSessionReferences } from "../../demo/profile-session-links.ts";
import { findOfficialSessionById } from "../../domain/official.ts";
import { resolveProfileSessionLinks } from "./session-links.ts";

test("duplicate titles resolve to their own dated occurrence IDs", () => {
  const ids = ["alchemy-calendar", "recorded-0"];
  const links = resolveProfileSessionLinks(OFFICIAL_SESSIONS, ids);
  assert.deepEqual(
    links.map((link) => link.id),
    ids,
  );
  assert.deepEqual(
    links.map((link) => link.title),
    ["Alchemy II", "Alchemy II"],
  );
  assert.deepEqual(
    links.map((link) => link.dateKey),
    ["2026-10-07", "2027-01-01"],
  );
  assert.equal(
    findOfficialSessionById(OFFICIAL_SESSIONS, links[1].id)?.start,
    "16:30",
  );
});

test("different dates in a recurring enrollment retain distinct occurrence IDs", () => {
  const references = getDemoProfileSessionReferences(
    "member",
    "Garcia Lopez-Paul",
  );
  const links = resolveProfileSessionLinks(
    OFFICIAL_SESSIONS,
    references.enrollments["member-oneiromancy-primary"],
  );
  assert.equal(links.length, 31);
  assert.equal(new Set(links.map((link) => link.id)).size, 31);
  assert.deepEqual(
    links.slice(0, 3).map((link) => [link.id, link.dateKey]),
    [
      ["recorded-2", "2027-03-28"],
      ["recorded-3", "2027-03-29"],
      ["recorded-4", "2027-03-30"],
    ],
  );
  assert.deepEqual(
    references.attendance["member-oneiromancy"],
    references.enrollments["member-oneiromancy-primary"],
  );
});

test("archived occurrences disappear instead of falling back to another title match", () => {
  const remaining = OFFICIAL_SESSIONS.filter(
    (session) => session.id !== "recorded-0",
  );
  assert.deepEqual(resolveProfileSessionLinks(remaining, ["recorded-0"]), []);
  assert.equal(findOfficialSessionById(remaining, "recorded-0"), undefined);
  assert.equal(findOfficialSessionById(remaining, "Alchemy II"), undefined);
});

test("editing the session title or date updates its link without changing identity", () => {
  const original = findOfficialSessionById(OFFICIAL_SESSIONS, "recorded-0");
  assert.ok(original);
  const updated = {
    ...original,
    title: "Advanced alchemy",
    date: "2027-01-08",
  };
  const [link] = resolveProfileSessionLinks([updated], [original.id]);
  assert.equal(link.id, original.id);
  assert.equal(link.title, updated.title);
  assert.equal(link.dateKey, updated.date);
});

test("unmapped profiles cannot inherit records by a partial name match", () => {
  const references = getDemoProfileSessionReferences("member", "Garcia");
  assert.deepEqual(references.enrollments, {});
  assert.deepEqual(references.upcoming, []);
});
