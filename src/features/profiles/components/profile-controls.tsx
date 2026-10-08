import { useState, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";

export function ProfileMenu({
  items,
  label = "More options",
}: {
  items: { label: string; action: () => void }[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="pp-menu-wrap"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        className="pp-plain pp-menu-trigger"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="pp-menu" role="menu">
          {items.map((item) => (
            <button
              role="menuitem"
              key={item.label}
              onClick={() => {
                setOpen(false);
                item.action();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Status({ children = "Active" }: { children?: ReactNode }) {
  return <span className="pp-active">{children}</span>;
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="pp-field">
      <span>{label}</span>
      <div>{children}</div>
    </div>
  );
}

export function EditableValue({
  placeholder,
  initial = "",
  icon,
}: {
  placeholder: string;
  initial?: string;
  icon?: ReactNode;
}) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  return editing ? (
    <input
      className="pp-field-input"
      aria-label={placeholder}
      maxLength={240}
      autoFocus
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === "Escape") setEditing(false);
      }}
    />
  ) : (
    <button
      className={`pp-editable ${value ? "has-value" : ""}`}
      onClick={() => setEditing(true)}
    >
      {icon}
      {value || placeholder}
    </button>
  );
}
