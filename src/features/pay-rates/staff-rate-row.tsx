import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import {
  formatPayRate,
  type PayOverride,
  type PayStaff,
  type PayStructure,
} from "./model";

export function StaffRateRow({
  staff,
  structures,
  overrides,
  expanded,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
}: {
  staff: PayStaff;
  structures: readonly PayStructure[];
  overrides: PayOverride[];
  expanded: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onEdit: (override: PayOverride) => void;
  onDelete: (override: PayOverride) => void;
}) {
  const hasOverrides = overrides.length > 0;
  const Summary = hasOverrides ? "button" : "div";
  return (
    <section
      className={`pay-staff-row ${expanded ? "is-expanded" : ""}`}
      aria-label={`${staff.name} pay rates`}
    >
      <div className="pay-staff-summary">
        <Summary
          className="pay-staff-overview"
          type={hasOverrides ? "button" : undefined}
          onClick={hasOverrides ? onToggle : undefined}
          aria-label={
            hasOverrides
              ? `${expanded ? "Collapse" : "Expand"} ${staff.name}`
              : undefined
          }
          aria-describedby={
            hasOverrides
              ? `default-rate-${staff.id} override-count-${staff.id}`
              : undefined
          }
          aria-expanded={hasOverrides ? expanded : undefined}
          aria-controls={
            hasOverrides && expanded ? `overrides-${staff.id}` : undefined
          }
        >
          <span className="pay-staff-name">
            {hasOverrides ? (
              <span className="pay-staff-chevron" aria-hidden="true">
                {expanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </span>
            ) : (
              <span className="pay-chevron-spacer" />
            )}
            <strong>{staff.name}</strong>
          </span>
          <span className="pay-default" id={`default-rate-${staff.id}`}>
            <span className="pay-sr-only pay-default-label">
              Default rate:{" "}
            </span>
            {staff.defaultRate.method === "tiered" ? (
              <>
                <span>{formatPayRate(staff.defaultRate, structures)}</span>
                <small>Tiered pay</small>
              </>
            ) : (
              formatPayRate(staff.defaultRate, structures)
            )}
          </span>
          <span className="pay-count" id={`override-count-${staff.id}`}>
            {overrides.length ? (
              <span>
                {overrides.length}{" "}
                {overrides.length === 1 ? "override" : "overrides"}
              </span>
            ) : (
              <span>No overrides</span>
            )}
          </span>
        </Summary>
        <button
          className="btn pay-add"
          id={`add-override-${staff.id}`}
          onClick={onAdd}
          aria-label={`Add override for ${staff.name}`}
        >
          <Plus size={15} />
          Add override
        </button>
      </div>
      {expanded && overrides.length > 0 && (
        <div className="pay-override-wrap" id={`overrides-${staff.id}`}>
          <table className="pay-override-table" role="table">
            <caption className="pay-sr-only">
              Overrides for {staff.name}
            </caption>
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader">Type</th>
                <th role="columnheader">Applies to</th>
                <th role="columnheader">Pay rate</th>
                <th role="columnheader">
                  <span className="pay-sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {overrides.map((override) => {
                const target = staff.targets.find(
                  (item) => item.id === override.targetId,
                );
                const actionContext = [
                  target?.name ?? "Unavailable target",
                  target?.detail,
                  staff.name,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <tr
                    key={override.id}
                    id={`override-row-${override.id}`}
                    data-pay-override-row
                    role="row"
                  >
                    <td role="cell">
                      <span
                        className={`pay-type ${target?.kind === "enrollment" ? "pay-type-enrollment" : ""}`}
                      >
                        {target?.kind === "enrollment"
                          ? "Enrollment"
                          : "Class/Service"}
                      </span>
                    </td>
                    <td role="cell">
                      <strong>{target?.name ?? "Unavailable target"}</strong>
                      <small>{target?.detail}</small>
                    </td>
                    <td role="cell">
                      <span
                        className="pay-mobile-rate-label"
                        aria-hidden="true"
                      >
                        Pay rate
                      </span>
                      <span className="pay-rate-value">
                        {formatPayRate(override.rate, structures)}
                      </span>
                      {override.rate.method === "tiered" && (
                        <small>Tiered pay</small>
                      )}
                    </td>
                    <td role="cell">
                      <div className="pay-row-actions">
                        <button
                          className="text-button"
                          onClick={() => onEdit(override)}
                          aria-label={`Edit override for ${actionContext}`}
                        >
                          Edit
                        </button>
                        <button
                          className="icon-button borderless"
                          id={`delete-override-${override.id}`}
                          onClick={() => onDelete(override)}
                          aria-label={`Delete override for ${actionContext}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
