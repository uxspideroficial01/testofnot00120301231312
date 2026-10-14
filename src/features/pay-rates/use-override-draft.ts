import { useState } from "react";
import {
  getFixedRate,
  parseRateAmount,
  type FixedPayRate,
  type PayRate,
  type PayCapabilities,
} from "./model";

/** A dialog owns its draft; cancellation never writes to the workspace. */
export function useOverrideDraft(
  initialRate: PayRate,
  editing: boolean,
  capabilities: PayCapabilities,
) {
  const fixed = getFixedRate(initialRate);
  const initialMethod =
    initialRate.method === "tiered" && !capabilities.tieredEnabled && !editing
      ? (fixed?.method ?? "hourly")
      : initialRate.method;
  const [method, setMethod] = useState<PayRate["method"]>(initialMethod);
  const [fixedMethod, setFixedMethod] = useState<FixedPayRate["method"]>(
    fixed?.method ?? "hourly",
  );
  const [amount, setAmount] = useState(
    fixed ? (fixed.cents / 100).toFixed(2) : "",
  );
  const [structureId, setStructureId] = useState(
    initialRate.method === "tiered" ? initialRate.structureId : "",
  );
  const cents = parseRateAmount(amount);
  const rate: PayRate | null =
    method === "tiered"
      ? structureId
        ? {
            method,
            structureId,
            retainedFlatRate:
              cents === null ? undefined : { method: fixedMethod, cents },
          }
        : null
      : cents === null
        ? null
        : { method, cents };

  function selectMethod(next: PayRate["method"]) {
    setMethod(next);
    if (next !== "tiered") setFixedMethod(next);
  }

  return {
    method,
    amount,
    structureId,
    rate,
    selectMethod,
    setAmount,
    setStructureId,
  };
}

export type OverrideDraft = ReturnType<typeof useOverrideDraft>;
