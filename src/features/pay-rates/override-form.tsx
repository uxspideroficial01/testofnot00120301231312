import { useId, useState, type FormEvent } from "react";
import {
  formatPayRate,
  type PayOverride,
  type PayStaff,
  type PayTarget,
} from "./model";
import { PayDialog } from "./pay-dialog";
import { TargetPicker } from "./target-picker";
import { RateFields } from "./rate-fields";
import { useOverrideDraft } from "./use-override-draft";
import { getOverrideTargets } from "./override-targets";
import { OverrideSummary } from "./override-summary";
import type { PayRatesStore } from "./use-pay-rates";

type Props = {
  staff: PayStaff;
  existing?: PayOverride;
  store: PayRatesStore;
  onClose: () => void;
  onSaved: (message: string) => void;
};

export function OverrideForm({
  staff,
  existing,
  store,
  onClose,
  onSaved,
}: Props) {
  const targetTriggerId = useId();
  const targetHelpId = useId();
  const originalTarget = staff.targets.find(
    (target) => target.id === existing?.targetId,
  );
  const draft = useOverrideDraft(
    existing?.rate ?? staff.defaultRate,
    !!existing,
    store.capabilities,
  );
  const [kind, setKind] = useState<PayTarget["kind"]>(
    originalTarget?.kind ?? "class-service",
  );
  const [targetId, setTargetId] = useState(existing?.targetId ?? "");
  const [targetError, setTargetError] = useState("");
  const [rateError, setRateError] = useState("");
  const [error, setError] = useState("");
  const target = staff.targets.find((item) => item.id === targetId);
  const { available: targets, emptyMessage } = getOverrideTargets(
    staff,
    kind,
    store.overrides,
    existing?.id,
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setTargetError("");
    setRateError("");
    if (!target) {
      setTargetError(
        "Select the class, service or enrollment this override applies to.",
      );
      document.getElementById(targetTriggerId)?.focus();
      return;
    }
    if (!draft.rate) {
      setRateError(
        draft.method === "tiered"
          ? "Select an existing pay structure."
          : "Enter a valid amount with up to two decimal places.",
      );
      event.currentTarget
        .querySelector<HTMLElement>(
          draft.method === "tiered" ? "#pay-structure" : "#pay-amount",
        )
        ?.focus();
      return;
    }
    const problem = store.save(staff.id, {
      id: existing?.id,
      targetId,
      rate: draft.rate,
    });
    if (problem) {
      setError(problem);
      return;
    }
    const message = `${target.name} · ${target.detail} · ${formatPayRate(draft.rate, store.structures)}${draft.rate.method === "tiered" ? " (Tiered pay)" : ""}`;
    onSaved(
      `Override ${existing ? "updated" : "added"} for ${staff.name}: ${message}`,
    );
    onClose();
  }

  return (
    <PayDialog
      title={existing ? "Edit override" : "Add override"}
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate>
        <div className="pay-form-body">
          <div className="pay-staff-context">
            <span className="pay-context-label">Staff</span>
            <strong>{staff.name}</strong>
            <span className="pay-context-default">
              Default: {formatPayRate(staff.defaultRate, store.structures)}
              {staff.defaultRate.method === "tiered" ? " · Tiered pay" : ""}
            </span>
          </div>
          {existing ? (
            <div className="pay-edit-target">
              <span className="pay-context-label">
                {kind === "class-service" ? "Class/Service" : "Enrollment"}
              </span>
              <strong>{target?.name}</strong>
              <span>{target?.detail}</span>
            </div>
          ) : (
            <>
              <fieldset className="pay-scope">
                <legend>What does this override apply to?</legend>
                <div className="pay-scope-options">
                  {(
                    [
                      [
                        "class-service",
                        "Class/Service",
                        "Set a rate for a group class or private service this staff member teaches.",
                      ],
                      [
                        "enrollment",
                        "Enrollment",
                        "Set a rate for one student's enrollment in a specific service and billing plan.",
                      ],
                    ] as const
                  ).map(([value, label, description]) => (
                    <label
                      key={value}
                      className={kind === value ? "is-selected" : ""}
                    >
                      <input
                        type="radio"
                        name="scope"
                        value={value}
                        checked={kind === value}
                        onChange={() => {
                          setKind(value);
                          setTargetId("");
                          setTargetError("");
                          setError("");
                        }}
                      />
                      <span>
                        <strong>{label}</strong>
                        <small>{description}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <TargetPicker
                triggerId={targetTriggerId}
                disabled={!targets.length}
                describedBy={emptyMessage ? targetHelpId : undefined}
                targets={targets}
                value={targetId}
                onChange={(value) => {
                  setTargetId(value);
                  setTargetError("");
                  setError("");
                }}
                label={
                  kind === "class-service" ? "Class/Service" : "Enrollment"
                }
                error={targetError}
              />
              {emptyMessage && (
                <p id={targetHelpId} className="pay-field-note">
                  {emptyMessage}
                </p>
              )}
            </>
          )}
          <RateFields
            capabilities={store.capabilities}
            structures={store.structures}
            onCreateStructure={store.createStructure}
            draft={draft}
            existingTiered={existing?.rate.method === "tiered"}
            error={rateError}
            onChange={() => {
              setRateError("");
              setError("");
            }}
          />
          {target && draft.rate && (
            <OverrideSummary
              staff={staff}
              target={target}
              rate={draft.rate}
              previousRate={existing?.rate}
              structures={store.structures}
            />
          )}
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!existing && !targets.length}
            aria-describedby={
              !existing && emptyMessage ? targetHelpId : undefined
            }
          >
            {existing ? "Save changes" : "Add override"}
          </button>
        </footer>
      </form>
    </PayDialog>
  );
}
