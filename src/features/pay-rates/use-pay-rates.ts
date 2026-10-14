import { useState } from "react";
import { PAY_DEMOS, type PayDemoScenario } from "./demo-scenarios";
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
export function usePayRates(scenario: PayDemoScenario = "standard") {
  const demo = PAY_DEMOS[scenario];
  const [overrides, setOverrides] = useState<PayOverride[]>(demo.overrides);

  const [structures, setStructures] = useState<PayStructure[]>(demo.structures);

  function createStructure(draft: StructureDraft): StructureCreationResult {
    if (!demo.capabilities.tieredEnabled)
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
    const staff = demo.staff.find((person) => person.id === staffId);
    if (!staff) return "This staff member is no longer available.";
    const error = validateOverride(
      staff,
      overrides,
      input,
      structures,
      demo.capabilities,
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
    staff: demo.staff,
    capabilities: demo.capabilities,
    overrides,
    structures,
    createStructure,
    save,
    remove,
    reset: () => {
      setOverrides(demo.overrides);
      setStructures(demo.structures);
    },
  };
}

export type PayRatesStore = ReturnType<typeof usePayRates>;
