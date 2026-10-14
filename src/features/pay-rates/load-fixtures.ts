import type { PayOverride, PayStaff, PayTarget } from "./model.ts";

const FIRST_NAMES = [
  "Adrian",
  "Alice",
  "Caleb",
  "Diana",
  "Elliot",
  "Freya",
  "Gabriel",
  "Hazel",
  "Isaac",
  "Julia",
  "Leon",
  "Nina",
  "Oscar",
  "Zara",
] as const;
const LAST_NAMES = [
  "Anderson",
  "Castillo",
  "Evans",
  "Flores",
  "Grant",
  "Hughes",
  "Nguyen",
  "Ross",
  "Santos",
  "Turner",
] as const;
const OVERRIDE_COUNTS = [0, 1, 3, 6, 12, 23] as const;

/** Deterministic, fictional load data. Kept separate from the curated walkthrough. */
export function createLoadFixtures(
  templates: readonly Omit<PayTarget, "id">[],
  count: number,
): { staff: PayStaff[]; overrides: PayOverride[] } {
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    count > FIRST_NAMES.length * LAST_NAMES.length
  ) {
    throw new RangeError("The load fixture requires between 0 and 140 staff.");
  }
  if (templates.length < 24) {
    throw new RangeError(
      "The load fixture requires 24 targets to cover large override lists.",
    );
  }

  const overrides: PayOverride[] = [];
  const staff = Array.from({ length: count }, (_, index): PayStaff => {
    const id = `demo-load-staff-${String(index + 1).padStart(3, "0")}`;
    const overrideCount = OVERRIDE_COUNTS[index % OVERRIDE_COUNTS.length];
    // Small rosters rotate through service groups; large rosters cover all targets.
    const selected =
      overrideCount >= 6
        ? templates
        : templates.slice((index % 6) * 4, (index % 6) * 4 + 4);
    const targets = selected.map((target, targetIndex) => ({
      ...target,
      id: `${id}-target-${targetIndex + 1}`,
    }));
    overrides.push(
      ...targets
        .slice(0, overrideCount)
        .map((target, targetIndex): PayOverride => ({
          id: `${id}-override-${targetIndex + 1}`,
          staffId: id,
          targetId: target.id,
          rate: {
            method: targetIndex % 3 === 0 ? "session" : "hourly",
            cents: 3500 + ((index + targetIndex) % 15) * 500,
          },
        })),
    );
    return {
      id,
      name: `${FIRST_NAMES[Math.floor(index / LAST_NAMES.length)]} ${LAST_NAMES[index % LAST_NAMES.length]}`,
      detail:
        overrideCount >= 6
          ? "Music programs"
          : targets
              .filter((target) => target.kind === "class-service")
              .map((target) => target.name)
              .join(" & "),
      defaultRate: { method: "hourly", cents: 3000 + (index % 12) * 500 },
      targets,
    };
  });
  return { staff, overrides };
}
