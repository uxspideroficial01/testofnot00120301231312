import { useId, useRef, useState } from "react";
import {
  formatPayRate,
  type PayOverride,
  type PayStaff,
  type PayStructure,
} from "./model";
import { PayDialog } from "./pay-dialog";

export function DeleteOverrideDialog({
  staff,
  structures,
  override,
  onRemove,
  onDeleted,
  onClose,
  fallbackFocusId,
}: {
  staff: PayStaff;
  structures: readonly PayStructure[];
  override: PayOverride;
  onRemove: (id: string) => string | null;
  onDeleted: () => void;
  onClose: () => void;
  fallbackFocusId?: string;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const descriptionId = useId();
  const [error, setError] = useState<string | null>(null);
  const target = staff.targets.find((item) => item.id === override.targetId);

  function remove() {
    let failure: string | null;
    try {
      failure = onRemove(override.id);
    } catch {
      failure = "Couldn't delete this override. Please try again.";
    }
    if (failure) {
      setError(failure);
      return;
    }
    onDeleted();
  }

  return (
    <PayDialog
      title="Delete override?"
      compact
      initialFocusRef={cancelRef}
      describedBy={descriptionId}
      fallbackFocusId={fallbackFocusId ?? `add-override-${staff.id}`}
      onClose={onClose}
    >
      <div className="pay-form-body pay-delete-body">
        <p className="pay-delete-staff">
          Staff: <strong>{staff.name}</strong>
        </p>
        <div className="pay-edit-target">
          <strong>{target?.name ?? "Unavailable target"}</strong>
          {target && <span>{target.detail}</span>}
          <span className="pay-delete-rate">
            Current rate:{" "}
            <strong>{formatPayRate(override.rate, structures)}</strong>
          </span>
        </div>
        <p id={descriptionId} className="pay-field-note">
          {target &&
            (target.kind === "enrollment"
              ? "The enrollment will remain. "
              : "The class or service will remain. ")}
          There is no undo for deleting this override.
        </p>
        {error && (
          <p className="pay-error" role="alert">
            {error}
          </p>
        )}
      </div>
      <footer className="pay-dialog-footer">
        <button type="button" ref={cancelRef} className="btn" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn pay-danger" onClick={remove}>
          Delete override
        </button>
      </footer>
    </PayDialog>
  );
}
