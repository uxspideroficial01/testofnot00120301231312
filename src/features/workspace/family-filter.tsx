import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import type { Family } from "@/domain/family";
import { searchFamilies } from "@/domain/family-search";
import { FilterSearch } from "./filter-search";

export function FamilyFilter({
  families,
  selectedId,
  onApply,
}: {
  families: readonly Family[];
  selectedId: string | null;
  onApply: (id: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [draftId, setDraftId] = useState(selectedId);
  const result = searchFamilies(families, query, { page, pageSize: 8 });
  const draft = families.find((family) => family.id === draftId);
  const from = (result.page - 1) * 8 + 1;
  return (
    <>
      <FilterSearch
        value={query}
        onChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        placeholder="Family, student or guardian..."
      />
      <div className="family-result-meta" role="status">
        <span>
          {result.total} {result.total === 1 ? "family" : "families"}
          {query.trim() ? " found" : ""}
        </span>
        <span>Select one family</span>
      </div>
      <div
        key={`${result.page}:${query}`}
        className="family-result-list"
        role="radiogroup"
        aria-label="Matching families"
      >
        {result.items.map((family) => (
          <button
            key={family.id}
            role="radio"
            aria-checked={draftId === family.id}
            className={`family-result ${draftId === family.id ? "is-chosen" : ""}`}
            data-filter-option
            onClick={() => setDraftId(family.id)}
          >
            <span className="family-result-copy">
              <span className="family-result-title">
                <strong>{family.name}</strong>
                <span>{family.members.length} students</span>
              </span>
              <span className="family-result-guardian">
                {family.guardian.name} · {family.guardian.email}
              </span>
              <span className="family-result-students">
                {family.members
                  .map((member) => member.name.split(" ")[0])
                  .join(", ")}
              </span>
            </span>
            <span className="family-choice-mark">
              {draftId === family.id && <Check size={13} />}
            </span>
          </button>
        ))}
        {!result.total && (
          <div className="family-search-empty">
            <SearchX size={22} />
            <strong>No matching families</strong>
            <p>Try a student’s name, a guardian’s name or email.</p>
            <button
              className="text-button"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
      {result.pageCount > 1 && (
        <div className="family-result-pagination">
          <span>
            {from}–{Math.min(from + 7, result.total)} of {result.total}
          </span>
          <div>
            <button
              className="icon-button"
              aria-label="Previous families"
              disabled={result.page <= 1}
              onClick={() => setPage(result.page - 1)}
            >
              <ChevronLeft size={15} />
            </button>
            <span>
              Page {result.page} of {result.pageCount}
            </span>
            <button
              className="icon-button"
              aria-label="Next families"
              disabled={result.page >= result.pageCount}
              onClick={() => setPage(result.page + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
      <footer className="filter-picker-footer family-picker-footer">
        <div className="family-draft-label">
          {draft ? (
            <>
              <strong>{draft.name}</strong>
              <span>{draft.guardian.name}</span>
            </>
          ) : (
            <span>No family selected</span>
          )}
        </div>
        <div className="family-picker-actions">
          <button
            className="text-button"
            disabled={!draftId}
            onClick={() => setDraftId(null)}
          >
            Clear
          </button>
          <button
            className="btn btn-primary"
            disabled={!draftId && !selectedId}
            onClick={() => onApply(draftId)}
          >
            Apply filter
          </button>
        </div>
      </footer>
    </>
  );
}
