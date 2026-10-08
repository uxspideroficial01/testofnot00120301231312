import { useRef, useEffect, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
} from "lucide-react";

export function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="sv-search">
      <Search size={16} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
export function Button({
  children,
  onClick,
  primary = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={`sv-button${primary ? " sv-primary" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export function Footer({ count, page = 1 }: { count: number; page?: number }) {
  return (
    <footer className="sv-footer">
      <span>
        Showing {count} of {count} rows.
      </span>
      <div>
        Rows per page{" "}
        <select aria-label="Rows per page" defaultValue="50">
          <option>50</option>
          <option>100</option>
        </select>
        <span>
          Page {page} of {count ? 1 : 0}
        </span>
        {[ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight].map(
          (Icon, i) => (
            <button
              key={i}
              disabled
              aria-label={
                ["First page", "Previous page", "Next page", "Last page"][i]
              }
            >
              <Icon size={16} />
            </button>
          ),
        )}
      </div>
    </footer>
  );
}
export function Panel({
  title,
  children,
  close,
  className = "",
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      className={`sv-panel ${className}`}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            close();
        }
      }}
    >
      <header>
        <h2>{title}</h2>
        <button className="sv-icon" aria-label="Close" onClick={close}>
          <X size={19} />
        </button>
      </header>
      {children}
    </dialog>
  );
}
