"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Search, X } from "lucide-react";
import { type PayOverride, type PayStaff } from "./model";
import { StaffRateRow } from "./staff-rate-row";
import { OverrideForm } from "./override-form";
import { DeleteOverrideDialog } from "./delete-override-dialog";
import { PayFilters } from "./pay-filters";
import { PaySortHeading } from "./pay-sort-heading";
import { useDeletePosition } from "./use-delete-position";
import { sortStaff, type StaffSort } from "./staff-sort";
import type { PayRatesStore } from "./use-pay-rates";
import "./pay-rates.css";

type Editor = {
  staff: PayStaff;
  override?: PayOverride;
  fallbackFocusId?: string;
};

export function PayRatesView({ store }: { store: PayRatesStore }) {
  const deletePosition = useDeletePosition(store.overrides);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [editor, setEditor] = useState<Editor | null>(null);
  const [deleting, setDeleting] = useState<Editor | null>(null);
  const [notice, setNotice] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [sort, setSort] = useState<StaffSort | null>(null);
  const services = [
    ...new Map(
      store.staff.flatMap((staff) =>
        staff.targets
          .filter((target) => target.kind === "class-service")
          .map((target) => [target.serviceId, target.name] as const),
      ),
    ).entries(),
  ];
  const visible = sortStaff(
    store.staff.filter(
      (staff) =>
        staff.name
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()) &&
        (!staffFilter || staff.id === staffFilter) &&
        (!serviceFilter ||
          staff.targets.some((target) => target.serviceId === serviceFilter)),
    ),
    store.overrides,
    sort,
  );
  const expandable = visible.filter((staff) =>
    store.overrides.some((item) => item.staffId === staff.id),
  );
  const allExpanded =
    expandable.length > 0 &&
    expandable.every((staff) => expanded.has(staff.id));
  const filterCount = Number(!!staffFilter) + Number(!!serviceFilter);

  function toggle(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function saved(staff: PayStaff, message: string) {
    setExpanded((current) => new Set([...current, staff.id]));
    setNotice(message);
  }

  return (
    <div className="pay-page">
      <header className="page-header pay-header">
        <h1>Pay rates</h1>
        <nav className="pay-tabs" aria-label="Payroll pages">
          {[
            "Unsubmitted",
            "Contractor invoices",
            "Payout history",
            "Pay rates",
            "Non-teaching hours",
          ].map((tab) =>
            tab === "Pay rates" ? (
              <span key={tab} aria-current="page">
                {tab}
              </span>
            ) : (
              <button
                type="button"
                disabled
                key={tab}
                title="Outside this prototype"
              >
                {tab}
              </button>
            ),
          )}
        </nav>
      </header>
      <div className="pay-scroll">
        <div className="pay-content">
          <div className="pay-intro">
            <div>
              <p>
                Review default rates and manage Class/Service and Enrollment
                overrides.
              </p>
            </div>
            <span className="pay-demo-label">Demo workspace</span>
          </div>
          <div className="pay-toolbar">
            <label className="search-field pay-search">
              <Search size={16} />
              <input
                aria-label="Search staff"
                placeholder="Search staff…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  aria-label="Clear staff search"
                  onClick={() => setQuery("")}
                >
                  <X size={14} />
                </button>
              )}
            </label>
            <span className="pay-staff-total">{visible.length} staff</span>
            <div className="pay-toolbar-actions">
              <PayFilters
                staff={store.staff}
                services={services.map(([id, name]) => ({ id, name }))}
                staffId={staffFilter}
                serviceId={serviceFilter}
                onStaffChange={setStaffFilter}
                onServiceChange={setServiceFilter}
              />
              <button
                className="btn"
                disabled={!expandable.length}
                onClick={() =>
                  setExpanded(
                    allExpanded
                      ? new Set()
                      : new Set(expandable.map((staff) => staff.id)),
                  )
                }
              >
                <ChevronDown size={15} />
                {allExpanded ? "Collapse all" : "Expand all"}
              </button>
            </div>
          </div>
          {filterCount > 0 && (
            <div className="pay-active-filters">
              <span>
                Filtered by{" "}
                {staffFilter
                  ? store.staff.find((staff) => staff.id === staffFilter)?.name
                  : ""}
                {staffFilter && serviceFilter ? " and " : ""}
                {serviceFilter
                  ? services.find(([id]) => id === serviceFilter)?.[1]
                  : ""}
              </span>
              <button
                className="text-button"
                onClick={() => {
                  setStaffFilter("");
                  setServiceFilter("");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
          <div className="pay-list">
            <div
              className="pay-column-headings"
              role="group"
              aria-label="Sort staff pay rates"
            >
              <PaySortHeading
                label="Staff"
                sortKey="name"
                sort={sort}
                onSort={setSort}
              />
              <PaySortHeading
                label="Default rate"
                sortKey="default-rate"
                sort={sort}
                onSort={setSort}
              />
              <PaySortHeading
                label="Overrides"
                sortKey="overrides"
                sort={sort}
                onSort={setSort}
              />
              <span aria-hidden="true" />
            </div>
            <span className="pay-sr-only" role="status">
              {sort &&
                `Sorted by ${sort.key === "name" ? "staff name" : sort.key === "default-rate" ? "default rate" : "override count"}, ${sort.direction}.${sort.key === "default-rate" ? " Tiered pay appears last." : ""}`}
            </span>
            {visible.map((staff) => (
              <StaffRateRow
                structures={store.structures}
                key={staff.id}
                staff={staff}
                overrides={store.overrides.filter(
                  (item) => item.staffId === staff.id,
                )}
                expanded={expanded.has(staff.id)}
                onToggle={() => toggle(staff.id)}
                onAdd={() => {
                  setNotice("");
                  setEditor({ staff });
                }}
                onEdit={(override) => {
                  setNotice("");
                  setEditor({ staff, override });
                }}
                onDelete={(override) => {
                  const staffOverrides = store.overrides.filter(
                    (item) => item.staffId === staff.id,
                  );
                  const index = staffOverrides.findIndex(
                    (item) => item.id === override.id,
                  );
                  const neighbor =
                    staffOverrides[index + 1] ?? staffOverrides[index - 1];
                  setDeleting({
                    staff,
                    override,
                    fallbackFocusId: neighbor
                      ? `delete-override-${neighbor.id}`
                      : `add-override-${staff.id}`,
                  });
                }}
              />
            ))}
            {!visible.length && (
              <div className="pay-empty">
                <Search size={24} />
                <h3>No staff found</h3>
                <p>Try another name or clear your filters.</p>
                <button
                  className="btn"
                  onClick={() => {
                    setQuery("");
                    setStaffFilter("");
                    setServiceFilter("");
                  }}
                >
                  Clear search and filters
                </button>
              </div>
            )}
          </div>
          <p className="pay-page-note">
            Default rates apply when no override applies. All records in this
            demo are fictional; changes reset on reload.
          </p>
        </div>
      </div>
      {notice && !editor && (
        <div className="pay-notice" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
          <button
            className="icon-button borderless"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {editor && (
        <OverrideForm
          key={`${editor.staff.id}-${editor.override?.id ?? "new"}`}
          staff={editor.staff}
          existing={editor.override}
          store={store}
          onClose={() => setEditor(null)}
          onSaved={(message) => saved(editor.staff, message)}
        />
      )}
      {deleting?.override && (
        <DeleteOverrideDialog
          structures={store.structures}
          staff={deleting.staff}
          override={deleting.override}
          fallbackFocusId={deleting.fallbackFocusId}
          onRemove={(id) => {
            deletePosition.capture(id, deleting.staff.id);
            try {
              const error = store.remove(id);
              if (error) deletePosition.cancel();
              return error;
            } catch (error) {
              deletePosition.cancel();
              throw error;
            }
          }}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            saved(
              deleting.staff,
              `Override deleted for ${deleting.staff.name}.`,
            );
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
