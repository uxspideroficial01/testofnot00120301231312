import { X } from "lucide-react";

import { Dialog } from "./session-dialog";
import { useState } from "react";
export function NoteEditor({
  title,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  initial: string;
  onClose: () => void;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <Dialog label={title} onClose={onClose}>
      <button
        className="official-close"
        aria-label="Close notes"
        onClick={onClose}
      >
        <X size={16} />
      </button>
      <h2>{title}</h2>
      <textarea
        className="official-note-editor"
        aria-label={title}
        autoFocus
        rows={7}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <footer>
        <button className="official-button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="official-button official-primary"
          onClick={() => onSave(value)}
        >
          Save
        </button>
      </footer>
    </Dialog>
  );
}
