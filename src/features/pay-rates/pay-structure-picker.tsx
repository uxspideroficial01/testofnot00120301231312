import { useState } from "react";
import type { PayStructure } from "./model";
import { CreateStructureDialog } from "./create-structure-dialog";
import type {
  StructureDraft,
  StructureCreationResult,
} from "./structure-draft";
import { TargetPicker } from "./target-picker";

export function PayStructurePicker({
  structures,
  value,
  onChange,
  onCreate,
  enabled,
  error,
  describedBy,
}: {
  structures: readonly PayStructure[];
  value: string;
  onChange: (id: string) => void;
  onCreate: (draft: StructureDraft) => StructureCreationResult;
  enabled: boolean;
  error?: string;
  describedBy: string;
}) {
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");

  return (
    <>
      <TargetPicker
        triggerId="pay-structure"
        label="Pay structure"
        placement="above"
        placeholder="Select an existing structure"
        targets={structures.map((structure) => ({
          id: structure.id,
          name: structure.name,
          detail: structure.description,
        }))}
        value={value}
        onChange={onChange}
        disabled={!enabled}
        error={error}
        describedBy={describedBy}
        secondaryAction={
          enabled
            ? {
                label: "Create new pay structure",
                onSelect: () => {
                  setNotice("");
                  setCreating(true);
                },
              }
            : undefined
        }
      />
      {notice && (
        <p className="pay-field-note" role="status">
          {notice}
        </p>
      )}
      {creating && enabled && (
        <CreateStructureDialog
          onCreate={onCreate}
          onClose={() => setCreating(false)}
          onCreated={(structure) => {
            setCreating(false);
            setNotice(
              `Pay structure “${structure.name}” created. Select it from the list to use it for this override.`,
            );
          }}
        />
      )}
    </>
  );
}
