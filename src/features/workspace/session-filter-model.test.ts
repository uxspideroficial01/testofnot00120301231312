import assert from "node:assert/strict";
import test from "node:test";
import type { OfficialSession } from "../../domain/official.ts";
import type { Session } from "../../domain/makeup.ts";
import type { SessionRow } from "./types.ts";
import {
  FILTER_CATEGORIES,
  filterSessionRows,
  getFilterValues,
  type SessionFilters,
} from "./session-filter-model.ts";

function official(
  id: string,
  overrides: Partial<OfficialSession> = {},
): OfficialSession {
  return {
    id,
    title: "Piano",
    date: "2026-10-08",
    start: "16:00",
    end: "16:30",
    instructor: "Emma",
    students: [],
    ...overrides,
  };
}

function row(id: string, overrides: Partial<SessionRow> = {}): SessionRow {
  return {
    id,
    date: "Oct 8, 2026",
    time: "4 – 4:30pm",
    title: "Piano",
    staff: "Emma",
    location: "Main Studio (Room 1)",
    status: "Pending",
    indicator: "pending",
    selectionLabel: "Piano",
    source: { kind: "official" },
    ...overrides,
  };
}

function familyRow(
  studentId: string,
  studentName: string,
  service: string,
): SessionRow {
  const session: Session = {
    id: `${studentId}-lesson`,
    studentId,
    studentName,
    service,
    date: "2026-10-08",
    start: "16:00",
    end: "16:30",
    teacher: "Emma",
    location: "Main Studio · Room 1",
    status: "scheduled",
  };
  return row(session.id, {
    title: `${studentName} - ${service}`,
    location: session.location,
    status: "Scheduled",
    source: { kind: "family", session },
  });
}

test("categories retain the recorded order with Family as a separate entry", () => {
  assert.deepEqual(FILTER_CATEGORIES, [
    "Staff",
    "Room",
    "Location",
    "Status",
    "Service",
    "Attendees",
    "Review Status",
    "Family",
  ]);
});

test("room matching is exact for parentheses and middle-dot locations", () => {
  const rows = [
    row("one"),
    row("eleven", { location: "Main Studio (Room 11)" }),
    row("other-campus", { location: "West Studio · Room 1" }),
  ];
  assert.deepEqual(getFilterValues("Room", rows, []), ["Room 1", "Room 11"]);
  assert.deepEqual(
    filterSessionRows(rows, { Room: "Room 1" }, []).map((item) => item.id),
    ["one", "other-campus"],
  );
  assert.deepEqual(
    filterSessionRows(
      rows,
      { Room: "Room 1", Location: "Main Studio" },
      [],
    ).map((item) => item.id),
    ["one"],
  );
});

test("online is a location and never appears as a room", () => {
  const rows = [
    row("online", { location: "Online" }),
    row("named-online", { location: "Location for Testing (Online)" }),
    row("dot-online", { location: "Main Studio · Online" }),
  ];
  assert.deepEqual(getFilterValues("Room", rows, []), []);
  assert.deepEqual(getFilterValues("Location", rows, []), ["Online"]);
  assert.equal(filterSessionRows(rows, { Location: "Online" }, []).length, 3);
  assert.equal(filterSessionRows(rows, { Room: "Online" }, []).length, 0);
});

test("staff are individual exact names, deduplicated across comma-separated lists", () => {
  const rows = [
    row("team", { staff: " Emma, Emma, Noah " }),
    row("similar", { staff: "Emma Wilson" }),
  ];
  assert.deepEqual(getFilterValues("Staff", rows, []), [
    "Emma",
    "Emma Wilson",
    "Noah",
  ]);
  assert.deepEqual(
    filterSessionRows(rows, { Staff: "Emma" }, []).map((item) => item.id),
    ["team"],
  );
});

test("attendee and status filters are conjunctive and use the row's own roster", () => {
  const rows = [
    row("occurred", { status: "Occurred" }),
    row("pending"),
    row("different", { status: "Occurred" }),
  ];
  const sessions = [
    official("occurred", {
      students: [{ id: "aaron", name: "Aaron", status: "Present" }],
    }),
    official("pending", {
      students: [{ id: "aaron", name: "Aaron", status: "Pending" }],
    }),
    official("different", {
      students: [{ id: "clara", name: "Clara", status: "Present" }],
    }),
  ];
  assert.deepEqual(
    filterSessionRows(
      rows,
      { Attendees: "Aaron", Status: "Occurred" },
      sessions,
    ).map((item) => item.id),
    ["occurred"],
  );
  assert.deepEqual(getFilterValues("Attendees", [rows[2]], sessions), [
    "Clara",
  ]);
});

test("family attendees and services derive from their own session without surname inference", () => {
  const rows = [
    familyRow("clara-martins", "Clara Martins", "Piano"),
    familyRow("lucas-martins", "Lucas Martins", "Guitar"),
    familyRow("clara-santos", "Clara Santos", "Piano"),
  ];
  assert.deepEqual(getFilterValues("Service", rows, []), ["Guitar", "Piano"]);
  assert.deepEqual(
    filterSessionRows(
      rows,
      { Attendees: "Clara Martins", Service: "Piano" },
      [],
    ).map((item) => item.id),
    ["clara-martins-lesson"],
  );
  assert.equal(
    filterSessionRows(rows, { Attendees: "Clara", Service: "Piano" }, [])
      .length,
    0,
  );
});

test("service uses canonical reference title before table and row fallbacks", () => {
  const rows = [
    row("canonical", { title: "Display title" }),
    row("table", { title: "Row title" }),
    row("missing", { title: "Available row title" }),
  ];
  const sessions = [
    official("canonical", {
      title: "Canonical service",
      table: { title: "Table service", status: "Pending" },
    }),
    official("table", {
      title: "",
      table: { title: "Table service", status: "Pending" },
    }),
  ];
  assert.deepEqual(getFilterValues("Service", rows, sessions), [
    "Available row title",
    "Canonical service",
    "Table service",
  ]);
});

test("review values distinguish recorded review state from unsupported family review", () => {
  const rows = [
    row("reviewed"),
    row("not-reviewed"),
    familyRow("clara", "Clara", "Piano"),
    row("missing"),
  ];
  const sessions = [
    official("reviewed", { reviewed: true }),
    official("not-reviewed"),
  ];
  assert.deepEqual(getFilterValues("Review Status", rows, sessions), [
    "Needs review",
    "Not reviewed",
    "Reviewed",
  ]);
  assert.deepEqual(
    filterSessionRows(rows, { "Review Status": "Needs review" }, sessions).map(
      (item) => item.id,
    ),
    ["not-reviewed"],
  );
  assert.deepEqual(getFilterValues("Review Status", [rows[3]], sessions), []);
});

test("empty or unknown active values and unknown runtime categories never broaden results", () => {
  const rows = [row("one")];
  for (const filters of [
    { Staff: "" },
    { Staff: "   " },
    { Staff: "Not in roster" },
    { Mystery: "Emma" },
    { Family: "Martins" },
  ]) {
    assert.deepEqual(
      filterSessionRows(rows, filters as SessionFilters, []),
      [],
    );
  }
  assert.deepEqual(filterSessionRows(rows, {}, []), rows);
  assert.deepEqual(getFilterValues("Room", [], []), []);
});

test("filtering does not mutate rows, records or filter state", () => {
  const rows = [row("one")];
  const sessions = [official("one")];
  const filters: SessionFilters = { Staff: "Emma" };
  const before = JSON.stringify({ rows, sessions, filters });
  assert.equal(filterSessionRows(rows, filters, sessions)[0], rows[0]);
  getFilterValues("Staff", rows, sessions);
  assert.equal(JSON.stringify({ rows, sessions, filters }), before);
});
