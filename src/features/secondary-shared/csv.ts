/** Quote every cell and neutralize formula prefixes before spreadsheet import. */
export function serializeCsv(rows: readonly (readonly string[])[]): string {
  return rows
    .map((row) =>
      row
        .map((value) => {
          const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(value)
            ? `'${value}`
            : value;
          return `"${safe.replaceAll('"', '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");
}
