import { parseRateAmount, type PayStructure } from "./model";

export type TierDraft = { id: string; startHours: string; amount: string };
export type StructureDraft = {
  name: string;
  description: string;
  referralAmount: string;
  tiers: TierDraft[];
};
export type StructureCreationResult =
  { structure: PayStructure } | { error: string };

/** Demo input validation, not confirmed payroll rules or a tier calculator. */
export function parseStructureDraft(
  draft: StructureDraft,
): { value: Omit<PayStructure, "id"> } | { error: string } {
  const name = draft.name.trim();
  if (!name) return { error: "Enter a name for this pay structure." };
  if (name.length > 120 || draft.description.length > 1000)
    return {
      error:
        "Use up to 120 characters for the name and 1,000 for the description.",
    };
  const referralHourlyCents = parseRateAmount(draft.referralAmount);
  if (referralHourlyCents === null)
    return {
      error:
        "Enter a valid Referral Hourly Rate with up to two decimal places.",
    };
  if (!draft.tiers.length) return { error: "Keep at least one rate tier." };
  const tiers: { startHours: number; cents: number }[] = [];
  for (const [index, tier] of draft.tiers.entries()) {
    const start = tier.startHours.trim();
    const startHours = Number(start);
    if (
      !/^\d+(?:\.\d{1,2})?$/.test(start) ||
      !Number.isFinite(startHours) ||
      startHours > Number.MAX_SAFE_INTEGER
    )
      return { error: `Enter valid start hours for tier ${index + 1}.` };
    if (index === 0 && startHours !== 0)
      return { error: "The first tier must start at 0 hours." };
    if (index > 0 && startHours <= tiers[index - 1].startHours)
      return { error: "Each tier must start after the previous tier." };
    const cents = parseRateAmount(tier.amount);
    if (cents === null)
      return {
        error: `Enter a valid rate for tier ${index + 1} with up to two decimal places.`,
      };
    tiers.push({ startHours, cents });
  }
  return {
    value: {
      name,
      description: draft.description.trim(),
      definition: { referralHourlyCents, tiers },
    },
  };
}
