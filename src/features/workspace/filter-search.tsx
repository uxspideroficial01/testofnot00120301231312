import { Search, X } from "lucide-react";

export function FilterSearch({
  value,
  onChange,
  placeholder,
  autoFocus = true,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="session-filter-search">
      <Search size={16} aria-hidden="true" />
      <input
        autoFocus={autoFocus}
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button aria-label="Clear filter search" onClick={() => onChange("")}>
          <X size={14} />
        </button>
      )}
    </label>
  );
}
