import {
  PAY_CAPABILITIES,
  PAY_OVERRIDES,
  PAY_STAFF,
  PAY_STRUCTURES,
} from "./fixtures.ts";
import { getFixedRate, type PayRate } from "./model.ts";

export type PayDemoScenario = "standard" | "tiered";

function fixedFixtureRate(rate: PayRate): PayRate {
  const fixed = getFixedRate(rate);
  if (!fixed)
    throw new Error("The standard demo requires a fixed fixture rate.");
  return fixed;
}

/** Separate fictional organizations, not a conversion of existing customer rates.
 * URL selection is presentation-only and must never authorize a real account.
 */
export const PAY_DEMOS = {
  standard: {
    capabilities: { tieredEnabled: false },
    staff: PAY_STAFF.map((staff) => ({
      ...staff,
      defaultRate: fixedFixtureRate(staff.defaultRate),
    })),
    overrides: PAY_OVERRIDES.map((override) => ({
      ...override,
      rate: fixedFixtureRate(override.rate),
    })),
    structures: [],
  },
  tiered: {
    capabilities: PAY_CAPABILITIES,
    staff: PAY_STAFF,
    overrides: PAY_OVERRIDES,
    structures: PAY_STRUCTURES,
  },
};
