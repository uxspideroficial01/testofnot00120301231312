/** Canonical local dates and times make lexical overlap comparisons reliable. */
export function isValidSchedulingInterval(value: {
  date: string;
  start: string;
  end: string;
}): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.date)) return false;
  const date = new Date(`${value.date}T12:00:00Z`);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value.date
  )
    return false;
  const time = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  return (
    time.test(value.start) && time.test(value.end) && value.start < value.end
  );
}
