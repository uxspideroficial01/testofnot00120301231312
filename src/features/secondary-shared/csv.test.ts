import assert from "node:assert/strict";
import test from "node:test";
import { serializeCsv } from "./csv.ts";

test("CSV quotes commas, newlines and embedded double quotes", () => {
  assert.equal(
    serializeCsv([["Doe, Jane", 'She said "hello"', "line\nnext"]]),
    '"Doe, Jane","She said ""hello""","line\nnext"',
  );
});

test("CSV neutralizes formula prefixes including leading whitespace", () => {
  const values = [
    "=SUM(A1)",
    "+SUM(A1)",
    "-SUM(A1)",
    "@SUM(A1)",
    "  =SUM(A1)",
    "\tvalue",
    "\rvalue",
  ];
  assert.equal(
    serializeCsv([values]),
    values.map((value) => `"'${value}"`).join(","),
  );
});

test("CSV preserves ordinary text and separates records with CRLF", () => {
  assert.equal(
    serializeCsv([
      ["Name", "Email"],
      ["Maria", "maria@example.com"],
    ]),
    '"Name","Email"\r\n"Maria","maria@example.com"',
  );
});
