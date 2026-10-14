import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import type { PayTarget } from "./model";

export function TargetPicker({
  targets,
  value,
  onChange,
  label,
  error,
  placeholder,
  triggerId,
  disabled = false,
  describedBy,
  secondaryAction,
  placement = "below",
}: {
  targets: Pick<PayTarget, "id" | "name" | "detail">[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
  placeholder?: string;
  triggerId?: string;
  disabled?: boolean;
  describedBy?: string;
  secondaryAction?: { label: string; onSelect: () => void };
  placement?: "above" | "below";
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const pointerInside = useRef(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);
  const focusSearch = useCallback((node: HTMLInputElement | null) => {
    search.current = node;
    node?.focus();
  }, []);
  useEffect(() => {
    if (!open) return;
    function dismissOutside(event: PointerEvent) {
      pointerInside.current =
        event.target instanceof Node && !!root.current?.contains(event.target);
      if (!pointerInside.current) setOpen(false);
    }
    function releasePointer() {
      pointerInside.current = false;
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("pointerup", releasePointer);
    document.addEventListener("pointercancel", releasePointer);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("pointerup", releasePointer);
      document.removeEventListener("pointercancel", releasePointer);
      releasePointer();
    };
  }, [open]);
  const selected = targets.find((target) => target.id === value);
  const targetNoun =
    label === "Pay structure"
      ? "pay structures"
      : label === "Enrollment"
        ? "enrollments"
        : "classes or services";
  const filtered = targets.filter((target) =>
    `${target.name} ${target.detail}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div
      ref={root}
      className="pay-picker"
      onBlur={(event) => {
        // Safari can move focus to the dialog during an option's mouse press.
        // Let the pending click finish; outside presses are handled separately.
        if (
          !pointerInside.current &&
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}
    >
      <label id={`${id}-label`}>{label}</label>
      <button
        id={triggerId}
        disabled={disabled}
        ref={trigger}
        type="button"
        className="pay-picker-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-haspopup="listbox"
        aria-invalid={!!error || undefined}
        aria-describedby={
          [describedBy, error ? `${id}-error` : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        onClick={() => {
          setOpen(!open);
          setQuery("");
        }}
      >
        <span id={`${id}-value`}>
          {selected ? (
            <>
              <strong>{selected.name}</strong>
              <small>{selected.detail}</small>
            </>
          ) : (
            <span className="muted">
              {placeholder ??
                (label === "Enrollment"
                  ? "Select an enrollment"
                  : "Select a class or service")}
            </span>
          )}
        </span>
        <ChevronDown size={16} />
      </button>
      {error && (
        <p id={`${id}-error`} className="pay-field-error" role="alert">
          {error}
        </p>
      )}
      {open && !disabled && (
        <div
          className={`pay-picker-popover ${placement === "above" ? "is-above" : ""}`}
        >
          <div className="pay-picker-search">
            <Search size={16} />
            <input
              ref={focusSearch}
              aria-label={`Search ${label}`}
              placeholder={
                label === "Pay structure"
                  ? "Search pay structures…"
                  : label === "Enrollment"
                    ? "Search student, service or plan…"
                    : "Search classes and services…"
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.preventDefault();
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  options.current[0]?.focus();
                }
              }}
            />
          </div>
          <div
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            className="pay-picker-options"
          >
            {filtered.map((target, index) => (
              <button
                key={target.id}
                ref={(node) => {
                  options.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={value === target.id}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    const next = index + (event.key === "ArrowDown" ? 1 : -1);
                    if (next < 0) search.current?.focus();
                    else
                      options.current[
                        Math.min(filtered.length - 1, next)
                      ]?.focus();
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    options.current[0]?.focus();
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    options.current[filtered.length - 1]?.focus();
                  }
                }}
                onClick={() => {
                  onChange(target.id);
                  close();
                }}
              >
                <span>
                  <strong>{target.name}</strong>
                  <small>{target.detail}</small>
                </span>
                {value === target.id && <Check size={16} />}
              </button>
            ))}
            {!filtered.length && (
              <p className="pay-picker-empty" role="status">
                {targets.length
                  ? `No matching ${targetNoun}. Try another search.`
                  : `No ${targetNoun} available.`}
              </p>
            )}
          </div>
          {secondaryAction && (
            <footer className="pay-picker-footer">
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  close();
                  secondaryAction.onSelect();
                }}
              >
                {secondaryAction.label}
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}
