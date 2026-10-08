import { useState, type KeyboardEvent } from "react";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import type { Family } from "@/domain/family";
import { FamilyFilter } from "./family-filter";
import { FilterSearch } from "./filter-search";
import {
  FILTER_CATEGORIES,
  type SessionFilters,
  type ValueFilterCategory,
} from "./session-filter-model";

type Props = {
  initialCategory: "Family" | null;
  families: readonly Family[];
  family: Family | null;
  filters: SessionFilters;
  getValues: (category: ValueFilterCategory) => string[];
  onFamilyApply: (id: string | null) => void;
  onValueApply: (category: ValueFilterCategory, value: string | null) => void;
};

export function SessionFiltersMenu({
  initialCategory,
  families,
  family,
  filters,
  getValues,
  onFamilyApply,
  onValueApply,
}: Props) {
  const [category, setCategory] = useState<
    (typeof FILTER_CATEGORIES)[number] | null
  >(initialCategory);
  const [query, setQuery] = useState("");
  const categories = FILTER_CATEGORIES.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase().trim()),
  );
  function open(next: typeof category) {
    setQuery("");
    setCategory(next);
  }
  return (
    <div
      id="session-filters"
      role="dialog"
      aria-label="Session filters"
      className={`session-filters-menu ${category === "Family" ? "family-picker-menu" : ""}`}
      onKeyDown={navigateFilterOptions}
    >
      {category ? (
        <header className="session-filter-heading">
          <button aria-label="Back to filters" onClick={() => open(null)}>
            <ArrowLeft size={16} />
          </button>
          <strong>{category}</strong>
        </header>
      ) : null}
      {!category ? (
        <>
          <FilterSearch
            value={query}
            onChange={setQuery}
            placeholder="Search filter..."
          />
          <div className="filter-categories">
            {categories.map((item) => (
              <button key={item} data-filter-option onClick={() => open(item)}>
                <span>{item}</span>
                {(item === "Family" ? family : filters[item]) && (
                  <Check size={14} className="filter-applied-check" />
                )}
                {item === "Family" && (
                  <ChevronRight size={14} className="filter-category-chevron" />
                )}
              </button>
            ))}
            {!categories.length && (
              <p className="filter-empty">No matching filters.</p>
            )}
          </div>
        </>
      ) : category === "Family" ? (
        <FamilyFilter
          families={families}
          selectedId={family?.id ?? null}
          onApply={onFamilyApply}
        />
      ) : (
        <ValueFilter
          key={category}
          category={category}
          values={getValues(category)}
          selected={filters[category]}
          onApply={(value) => onValueApply(category, value)}
        />
      )}
    </div>
  );
}

function ValueFilter({
  category,
  values,
  selected,
  onApply,
}: {
  category: ValueFilterCategory;
  values: string[];
  selected?: string;
  onApply: (value: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const options = values.filter((value) =>
    value.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <FilterSearch
        value={query}
        onChange={setQuery}
        placeholder={`Search ${category.toLowerCase()}...`}
      />
      <div className="filter-value-list">
        {options.map((value) => (
          <button key={value} data-filter-option onClick={() => onApply(value)}>
            <span>{value}</span>
            {value === selected && <Check size={15} />}
          </button>
        ))}
        {!options.length && <p className="filter-empty">No matching values.</p>}
      </div>
      {selected && (
        <footer className="filter-picker-footer">
          <button className="text-button" onClick={() => onApply(null)}>
            Clear {category.toLowerCase()}
          </button>
        </footer>
      )}
    </>
  );
}

function navigateFilterOptions(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  const options = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      "button[data-filter-option]",
    ),
  );
  if (!options.length) return;
  const current = options.indexOf(document.activeElement as HTMLButtonElement);
  const next =
    current < 0
      ? event.key === "ArrowDown"
        ? 0
        : options.length - 1
      : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
        options.length;
  event.preventDefault();
  options[next].focus();
  if (options[next].getAttribute("role") === "radio") options[next].click();
}
