import { useCallback, useId, useState, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CircleUserRound,
  ListFilter,
} from "lucide-react";
import { FilterSearch } from "../workspace/filter-search";
import { useFilterDismiss } from "../workspace/use-filter-dismiss";
import { useFilterPosition } from "./use-filter-position";
import "../workspace/session-filters.css";
import "./pay-filters.css";

type Category = "Staff" | "Services";
type FilterOption = { id: string; name: string };

export function PayFilters({
  staff,
  services,
  staffId,
  serviceId,
  onStaffChange,
  onServiceChange,
}: {
  staff: readonly FilterOption[];
  services: readonly FilterOption[];
  staffId: string;
  serviceId: string;
  onStaffChange: (id: string) => void;
  onServiceChange: (id: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const close = useCallback(() => setOpen(false), []);
  const { anchorRef, triggerRef } = useFilterDismiss(open, close);
  const menuRef = useFilterPosition(open, category, anchorRef);
  const count = Number(!!staffId) + Number(!!serviceId);
  const selected = category === "Staff" ? staffId : serviceId;
  const categories: Category[] = ["Staff", "Services"];
  const matches = (name: string) =>
    name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  const options = (category === "Staff" ? staff : services).filter((option) =>
    matches(option.name),
  );

  function show(next: Category | null) {
    setQuery("");
    setCategory(next);
  }
  function apply(value: string) {
    if (category === "Staff") onStaffChange(value);
    else onServiceChange(value);
    close();
    triggerRef.current?.focus();
  }
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    if (
      event.target instanceof HTMLInputElement &&
      ["Home", "End"].includes(event.key)
    )
      return;
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        "[data-pay-filter-option]",
      ),
    );
    if (!buttons.length) return;
    const current = buttons.findIndex(
      (button) => button === document.activeElement,
    );
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : current === -1
            ? event.key === "ArrowDown"
              ? 0
              : buttons.length - 1
            : (current +
                (event.key === "ArrowDown" ? 1 : -1) +
                buttons.length) %
              buttons.length;
    event.preventDefault();
    buttons[next].focus();
  }

  return (
    <div
      className="pay-filter-anchor"
      ref={anchorRef}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          close();
      }}
    >
      <button
        type="button"
        ref={triggerRef}
        className={`btn ${count ? "selected" : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? id : undefined}
        onClick={() => {
          if (!open) show(null);
          setOpen(!open);
        }}
      >
        <ListFilter size={16} aria-hidden="true" />
        Filter
        {count > 0 && <span className="pay-filter-count">{count}</span>}
      </button>
      {open && (
        <div
          id={id}
          ref={menuRef}
          role="dialog"
          aria-label="Pay rate filters"
          className="session-filters-menu pay-filter-menu"
          onKeyDown={navigate}
        >
          {category && (
            <header className="session-filter-heading">
              <button
                type="button"
                aria-label="Back to filters"
                onClick={() => show(null)}
              >
                <ArrowLeft size={16} />
              </button>
              <strong>{category}</strong>
            </header>
          )}
          <FilterSearch
            autoFocus={false}
            key={category ?? "categories"}
            value={query}
            onChange={setQuery}
            placeholder={
              category
                ? `Search ${category.toLowerCase()}...`
                : "Search filter..."
            }
          />
          {!category ? (
            <div className="filter-categories">
              {categories.filter(matches).map((name) => {
                const Icon = name === "Staff" ? CircleUserRound : BookOpen;
                const active = name === "Staff" ? staffId : serviceId;
                return (
                  <button
                    type="button"
                    key={name}
                    data-pay-filter-option
                    onClick={() => show(name)}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span>{name}</span>
                    {active && (
                      <Check
                        size={14}
                        className="filter-applied-check"
                        aria-label="Applied"
                      />
                    )}
                  </button>
                );
              })}
              {!categories.some(matches) && (
                <p className="filter-empty">No matching filters.</p>
              )}
            </div>
          ) : (
            <>
              <div
                className="filter-value-list"
                role="group"
                aria-label={`${category} options`}
              >
                {options.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    data-pay-filter-option
                    aria-pressed={option.id === selected}
                    onClick={() => apply(option.id)}
                  >
                    <span>{option.name}</span>
                    {option.id === selected && (
                      <Check size={15} aria-hidden="true" />
                    )}
                  </button>
                ))}
                {!options.length && (
                  <p className="filter-empty">
                    No matching {category.toLowerCase()}.
                  </p>
                )}
              </div>
              {selected && (
                <footer className="filter-picker-footer">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => apply("")}
                  >
                    Clear {category.toLowerCase()}
                  </button>
                </footer>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
