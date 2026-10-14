import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2 } from "lucide-react";
import { PayDialog } from "./pay-dialog";
import type { PayStructure } from "./model";
import type {
  StructureDraft,
  StructureCreationResult,
  TierDraft,
} from "./structure-draft";

export function CreateStructureDialog({
  onCreate,
  onCreated,
  onClose,
}: {
  onCreate: (draft: StructureDraft) => StructureCreationResult;
  onCreated: (structure: PayStructure) => void;
  onClose: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const tierInputs = useRef(new Map<string, HTMLInputElement>());
  const pendingTierFocus = useRef<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [referralAmount, setReferralAmount] = useState("0.00");
  const [tiers, setTiers] = useState<TierDraft[]>([
    { id: "first", startHours: "0", amount: "0" },
  ]);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    if (pendingTierFocus.current) {
      tierInputs.current.get(pendingTierFocus.current)?.focus();
      pendingTierFocus.current = null;
    }
  }, [tiers]);

  function registerTierInput(key: string, input: HTMLInputElement | null) {
    if (input) tierInputs.current.set(key, input);
    else tierInputs.current.delete(key);
  }

  function addTier() {
    const id = crypto.randomUUID();
    pendingTierFocus.current = `${id}:startHours`;
    setTiers([...tiers, { id, startHours: "", amount: "0" }]);
    setError("");
  }

  function removeTier(id: string, index: number) {
    if (tiers.length === 1) return;
    const remaining = tiers
      .filter((tier) => tier.id !== id)
      .map((tier, position) =>
        position === 0 ? { ...tier, startHours: "0" } : tier,
      );
    const nextIndex = Math.min(index, remaining.length - 1);
    const next = remaining[nextIndex];
    // The first start boundary is read-only; focus its editable rate instead.
    pendingTierFocus.current = `${next.id}:${nextIndex === 0 ? "amount" : "startHours"}`;
    setTiers(remaining);
    setError("");
  }

  function updateTier(
    id: string,
    field: "startHours" | "amount",
    value: string,
  ) {
    setTiers((current) =>
      current.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier,
      ),
    );
    setError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Portals still bubble through React's tree: never submit the override form.
    event.stopPropagation();
    try {
      const result = onCreate({ name, description, referralAmount, tiers });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onCreated(result.structure);
    } catch {
      setError("Couldn't save this pay structure. Please try again.");
    }
  }

  // Separate DOM forms while preserving the parent override's unsaved draft.
  return createPortal(
    <PayDialog
      title="Create new tiered pay structure"
      onClose={onClose}
      initialFocusRef={nameRef}
      fallbackFocusId="pay-structure"
    >
      <form onSubmit={submit} noValidate>
        <div className="pay-form-body pay-structure-body">
          <div className="pay-field">
            <label htmlFor="structure-name">Name</label>
            <input
              ref={nameRef}
              id="structure-name"
              value={name}
              maxLength={120}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              aria-describedby="structure-name-help"
            />
            <p id="structure-name-help" className="pay-field-note">
              Provide a name to help you identify this pay structure.
            </p>
          </div>
          <div className="pay-field">
            <label htmlFor="structure-description">Description</label>
            <input
              id="structure-description"
              value={description}
              maxLength={1000}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="pay-field">
            <label htmlFor="structure-referral">Referral Hourly Rate</label>
            <div className="pay-amount">
              <span>$</span>
              <input
                id="structure-referral"
                inputMode="decimal"
                value={referralAmount}
                onChange={(event) => {
                  setReferralAmount(event.target.value);
                  setError("");
                }}
              />
            </div>
          </div>
          <fieldset className="pay-tier-fields">
            <legend>Rate tiers</legend>
            {tiers.map((tier, index) => (
              <div
                className="pay-tier-row"
                key={tier.id}
                role="group"
                aria-label={`Tier ${index + 1}`}
              >
                <label>
                  Start hours
                  <input
                    aria-label={`Start hours for tier ${index + 1}`}
                    ref={(input) => {
                      registerTierInput(`${tier.id}:startHours`, input);
                    }}
                    inputMode="decimal"
                    value={tier.startHours}
                    disabled={index === 0}
                    onChange={(event) =>
                      updateTier(tier.id, "startHours", event.target.value)
                    }
                  />
                </label>
                <label>
                  End hours
                  <input
                    aria-label={`End hours for tier ${index + 1}`}
                    disabled
                    value={tiers[index + 1]?.startHours ?? ""}
                  />
                </label>
                <label>
                  Rate
                  <div className="pay-amount">
                    <span>$</span>
                    <input
                      aria-label={`Rate for tier ${index + 1}`}
                      ref={(input) => {
                        registerTierInput(`${tier.id}:amount`, input);
                      }}
                      inputMode="decimal"
                      value={tier.amount}
                      onChange={(event) =>
                        updateTier(tier.id, "amount", event.target.value)
                      }
                    />
                  </div>
                </label>
                <button
                  type="button"
                  className="icon-button pay-tier-remove"
                  aria-label={`Remove tier ${index + 1}`}
                  disabled={tiers.length === 1}
                  title={
                    tiers.length === 1
                      ? "At least one tier is required"
                      : "Remove tier"
                  }
                  onClick={() => removeTier(tier.id, index)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn pay-tier-add"
              onClick={addTier}
            >
              <Plus size={16} />
              Add tier
            </button>
          </fieldset>
          {error && (
            <p className="pay-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <footer className="pay-dialog-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save pay structure
          </button>
        </footer>
      </form>
    </PayDialog>,
    document.body,
  );
}
