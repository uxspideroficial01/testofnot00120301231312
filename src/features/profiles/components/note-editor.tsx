import { useRef, useState } from "react";
import {
  Bold,
  CalendarDays,
  Italic,
  Link2,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";

export function NoteEditor({
  task = false,
  onAdd,
}: {
  task?: boolean;
  onAdd: (value: string, adminOnly: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [admin, setAdmin] = useState(false);
  const [formats, setFormats] = useState<string[]>([]);
  const editor = useRef<HTMLTextAreaElement>(null);
  const buttons = [
    ["Bold", Bold],
    ["Italic", Italic],
    ["Underline", Underline],
    ["Bullet list", List],
    ["Numbered list", ListOrdered],
    ["Link", Link2],
  ] as const;
  return (
    <div className={`pp-editor ${task ? "task-editor" : ""}`}>
      <div className="pp-editor-tools">
        {buttons.map(([label, Icon]) => (
          <button
            className={`pp-button ${formats.includes(label) ? "pressed" : ""}`}
            key={label}
            aria-label={label}
            aria-pressed={formats.includes(label)}
            onClick={() => {
              setFormats((current) =>
                current.includes(label)
                  ? current.filter((item) => item !== label)
                  : [...current, label],
              );
              if (label === "Bullet list" || label === "Numbered list")
                setValue(
                  (current) =>
                    current +
                    (current ? "\n" : "") +
                    (label === "Bullet list" ? "• " : "1. "),
                );
              editor.current?.focus();
            }}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <textarea
        ref={editor}
        maxLength={10000}
        aria-label={task ? "Add a task" : "Write a note"}
        placeholder={task ? "Add a task..." : "Write a note..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          fontWeight: formats.includes("Bold") ? 600 : 400,
          fontStyle: formats.includes("Italic") ? "italic" : "normal",
          textDecoration: formats.includes("Underline") ? "underline" : "none",
        }}
      />
      <div className="pp-editor-bottom">
        {task ? (
          <>
            <span className="pp-author">HM</span>
            <label className="pp-task-date">
              <CalendarDays size={16} />
              <input aria-label="Task due date" type="date" />
            </label>
          </>
        ) : (
          <label>
            <input
              className="pp-toggle"
              type="checkbox"
              checked={admin}
              onChange={(e) => setAdmin(e.target.checked)}
            />
            Visible to admin only
          </label>
        )}
        <button
          className="pp-button pp-primary"
          disabled={!value.trim()}
          onClick={() => {
            onAdd(value.trim(), admin);
            setValue("");
          }}
        >
          Add {task ? "task" : "note"}
        </button>
      </div>
    </div>
  );
}
