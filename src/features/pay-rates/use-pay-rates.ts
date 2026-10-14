import { useState } from "react";
import {
  PAY_CAPABILITIES,
  PAY_OVERRIDES,
  PAY_STAFF,
  PAY_STRUCTURES,
} from "./fixtures";
import {
  validateOverride,
  type PayOverride,
  type PayRate,
  type PayStructure,
} from "./model";

import {
  parseStructureDraft,
  type StructureDraft,
  type StructureCreationResult,
} from "./structure-draft";

/** Demo state only. No payroll calculation, network calls, or durable storage. */
export function usePayRates() {
  const [overrides, setOverrides] = useState<PayOverride[]>(PAY_OVERRIDES);

  const [structures, setStructures] = useState<PayStructure[]>(PAY_STRUCTURES);

  function createStructure(draft: StructureDraft): StructureCreationResult {
    if (!PAY_CAPABILITIES.tieredEnabled)
      return { error: "Tiered pay is not enabled for this organization." };
    const parsed = parseStructureDraft(draft);
    if ("error" in parsed) return parsed;
    const structure: PayStructure = {
      id: crypto.randomUUID(),
      ...parsed.value,
    };
    setStructures((current) => [...current, structure]);
    return { structure };
  }

  function save(
    staffId: string,
    input: { id?: string; targetId: string; rate: PayRate },
  ): string | null {
    const staff = PAY_STAFF.find((person) => person.id === staffId);
    if (!staff) return "This staff member is no longer available.";
    const error = validateOverride(
      staff,
      overrides,
      input,
      structures,
      PAY_CAPABILITIES,
    );
    if (error) return error;
    const next: PayOverride = {
      id: input.id ?? crypto.randomUUID(),
      staffId,
      targetId: input.targetId,
      rate: input.rate,
    };
    setOverrides((current) =>
      input.id
        ? current.map((item) => (item.id === input.id ? next : item))
        : [...current, next],
    );
    return null;
  }

  function remove(id: string): string | null {
    if (!overrides.some((item) => item.id === id))
      return "This override is no longer available. Close this dialog and review the list.";
    setOverrides((current) => current.filter((item) => item.id !== id));
    return null;
  }

  return {
    overrides,
    structures,
    createStructure,
    save,
    remove,
    reset: () => {
      setOverrides(PAY_OVERRIDES);
      setStructures(PAY_STRUCTURES);
    },
  };
}

export type PayRatesStore = ReturnType<typeof usePayRates>;
