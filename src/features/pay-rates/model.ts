export type FixedPayRate = { method: "hourly" | "session"; cents: number };

export type PayRate =
  | FixedPayRate
  | { method: "tiered"; structureId: string; retainedFlatRate?: FixedPayRate };

export type PayCapabilities = { tieredEnabled: boolean };

/** Dormant form data, never a second applicable pay method. */
export function getFixedRate(rate: PayRate): FixedPayRate | undefined {
  return rate.method === "tiered" ? rate.retainedFlatRate : rate;
}

export type PayTarget = {
  id: string;
  kind: "class-service" | "enrollment";
  name: string;
  detail: string;
  serviceId: string;
};

export type PayStaff = {
  id: string;
  name: string;
  detail: string;
  defaultRate: PayRate;
  targets: PayTarget[];
};

export type PayOverride = {
  id: string;
  staffId: string;
  targetId: string;
  rate: PayRate;
};

export type PayStructure = {
  id: string;
  name: string;
  description: string;
  definition?: PayStructureDefinition;
};

/** Captured form data only; this prototype does not evaluate tiered payroll. */
export type PayStructureDefinition = {
  referralHourlyCents: number;
  tiers: { startHours: number; cents: number }[];
};

const dollarAmount = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPayRate(
  rate: PayRate,
  structures: readonly PayStructure[],
): string {
  if (rate.method === "tiered") {
    return (
      structures.find((structure) => structure.id === rate.structureId)?.name ??
      "Unavailable pay structure"
    );
  }
  return `${dollarAmount.format(rate.cents / 100)}/${rate.method === "hourly" ? "hr" : "session"}`;
}

/** Decimal input to integer cents without floating-point multiplication. */
export function parseRateAmount(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [dollars, decimals = ""] = normalized.split(".");
  const cents = Number(`${dollars}${decimals.padEnd(2, "0")}`);
  return Number.isSafeInteger(cents) ? cents : null;
}

/**
 * Prototype form constraints only; this does not calculate payroll.
 * One override per staff/target is a demo assumption awaiting product confirmation.
 * Existing targets cannot be reassigned through the edit flow.
 */
export function validateOverride(
  staff: PayStaff,
  overrides: readonly PayOverride[],
  input: { id?: string; targetId: string; rate: PayRate },
  structures?: readonly PayStructure[],
  capabilities: PayCapabilities = { tieredEnabled: false },
): string | null {
  const existing = input.id
    ? overrides.find((override) => override.id === input.id)
    : undefined;
  if (input.id && (!existing || existing.staffId !== staff.id)) {
    return "This override is no longer available. Close and reopen the form.";
  }
  if (!staff.targets.some((target) => target.id === input.targetId)) {
    return "Select a Class/Service or Enrollment for this staff member.";
  }
  if (existing && existing.targetId !== input.targetId) {
    return "The Class/Service or Enrollment cannot be changed while editing.";
  }
  if (
    overrides.some(
      (override) =>
        override.staffId === staff.id &&
        override.targetId === input.targetId &&
        override.id !== input.id,
    )
  ) {
    return "An override already exists for this selection. Edit the existing override.";
  }
  if (input.rate.method === "tiered") {
    const preservesExisting =
      existing?.rate.method === "tiered" &&
      existing.rate.structureId === input.rate.structureId;
    if (!capabilities.tieredEnabled && !preservesExisting) {
      return "Tiered pay is not available for new assignments.";
    }
    const retained = input.rate.retainedFlatRate;
    if (
      retained &&
      (!Number.isSafeInteger(retained.cents) || retained.cents < 0)
    ) {
      return "Enter a valid amount with up to two decimal places.";
    }
    const structureId = input.rate.structureId;
    if (
      !structureId.trim() ||
      (structures &&
        !structures.some((structure) => structure.id === structureId))
    ) {
      return "Select an existing pay structure.";
    }
  } else if (!Number.isSafeInteger(input.rate.cents) || input.rate.cents < 0) {
    return "Enter a valid amount with up to two decimal places.";
  }
  return null;
}
