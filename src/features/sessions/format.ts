export function displayDate(value: string, weekday = true) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    ...(weekday ? { weekday: "long" as const } : {}),
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
export function displayTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return value;
  const [hour, minute] = value.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}
export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}
