"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X, Search } from "lucide-react";

export function Avatar({
  name,
  tone = "blue",
  initials,
}: {
  name: string;
  tone?: string;
  initials?: string;
}) {
  return (
    <span className={`avatar ${tone}`} aria-hidden="true">
      {initials ??
        name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
    </span>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="search-field">
      <Search size={16} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}
export function Overlay({
  children,
  onClose,
  title,
  wide = false,
  modal = false,
  className = "",
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  wide?: boolean;
  modal?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.showModal();
    return () => el.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`${modal ? "modal" : `drawer ${wide ? "drawer-wide" : ""}`} ${className}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="overlay-content">
        <button
          className="icon-button overlay-close"
          aria-label="Close panel"
          onClick={onClose}
        >
          <X size={19} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
