import type { PayCapabilities, PayStructure } from "./model";
import type { PayRatesStore } from "./use-pay-rates";
import type { OverrideDraft } from "./use-override-draft";
import { PayStructurePicker } from "./pay-structure-picker";

export function RateFields({
  capabilities,
  draft,
  structures,
  onCreateStructure,
  existingTiered,
  error,
  onChange,
}: {
  capabilities: PayCapabilities;
  draft: OverrideDraft;
  structures: readonly PayStructure[];
  onCreateStructure: PayRatesStore["createStructure"];
  existingTiered: boolean;
  error: string;
  onChange: () => void;
}) {
  const structure = structures.find((item) => item.id === draft.structureId);
  const methods = [
    { value: "hourly", label: "Hourly rate" },
    { value: "session", label: "Flat per session" },
    ...(capabilities.tieredEnabled || existingTiered
      ? ([{ value: "tiered", label: "Tiered pay" }] as const)
      : []),
  ] as const;

  return (
    <>
      <fieldset className="pay-method">
        <legend>How is pay calculated?</legend>
        <div className="pay-method-options">
          {methods.map(({ value, label }) => (
            <label
              className={draft.method === value ? "is-selected" : ""}
              key={value}
            >
              <input
                type="radio"
                name="method"
                checked={draft.method === value}
                onChange={() => {
                  draft.selectMethod(value);
                  onChange();
                }}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="pay-field">
        {draft.method === "tiered" ? (
          <>
            <PayStructurePicker
              onCreate={onCreateStructure}
              structures={structures}
              value={draft.structureId}
              onChange={(id) => {
                draft.setStructureId(id);
                onChange();
              }}
              enabled={capabilities.tieredEnabled}
              error={error}
              describedBy="pay-method-help"
            />
            <p id="pay-method-help" className="pay-field-note">
              {!capabilities.tieredEnabled
                ? "The existing structure is retained. New tiered assignments are disabled in this organization."
                : (structure?.description ??
                  "Select an existing structure based on accumulated teaching hours.")}
            </p>
          </>
        ) : (
          <>
            <label htmlFor="pay-amount">
              {draft.method === "hourly" ? "Hourly rate" : "Session rate"}
            </label>
            <div className="pay-amount">
              <span>$</span>
              <input
                id="pay-amount"
                inputMode="decimal"
                autoComplete="off"
                value={draft.amount}
                onChange={(event) => {
                  draft.setAmount(event.target.value);
                  onChange();
                }}
                aria-invalid={!!error || undefined}
                aria-describedby={`pay-method-help${error ? " pay-rate-error" : ""}`}
              />
              <span>{draft.method === "hourly" ? "/ hour" : "/ session"}</span>
            </div>
            <p id="pay-method-help" className="pay-field-note">
              {draft.method === "hourly"
                ? "Pay depends on session duration. For example, $60/hour pays $30 for 30 minutes."
                : "The same amount for each session, regardless of duration."}
            </p>
          </>
        )}
        {error && draft.method !== "tiered" && (
          <p id="pay-rate-error" className="pay-field-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
