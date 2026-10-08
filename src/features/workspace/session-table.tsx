import {
  ChevronsLeft,
  ChevronsRight,
  CircleCheck,
  CircleMinus,
  CircleX,
} from "lucide-react";
import type { SessionRow } from "./types";

type Props = {
  rows: SessionRow[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onOpen: (row: SessionRow) => void;
};

export function SessionTable({
  rows,
  selectedIds,
  onSelectionChange,
  onOpen,
}: Props) {
  const selectedCount = rows.filter((row) =>
    selectedIds.includes(row.id),
  ).length;
  return (
    <div className="table-scroll">
      <table className="data-table sessions-table">
        <colgroup>
          <col style={{ width: 36 }} />
          <col style={{ width: 138 }} />
          <col style={{ width: 113 }} />
          <col style={{ width: 298 }} />
          <col />
          <col style={{ width: 166 }} />
          <col style={{ width: 84 }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                aria-label="Select all sessions"
                checked={rows.length > 0 && selectedCount === rows.length}
                onChange={(event) =>
                  onSelectionChange(
                    event.target.checked ? rows.map((row) => row.id) : [],
                  )
                }
              />
            </th>
            <th>Date</th>
            <th>Time (EDT)</th>
            <th>Name</th>
            <th>Staff</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  aria-label={`Select ${row.selectionLabel}`}
                  checked={selectedIds.includes(row.id)}
                  onChange={(event) =>
                    onSelectionChange(
                      event.target.checked
                        ? [...selectedIds, row.id]
                        : selectedIds.filter((id) => id !== row.id),
                    )
                  }
                />
              </td>
              <td>{row.date}</td>
              <td>{row.time}</td>
              <td>
                <button className="session-link" onClick={() => onOpen(row)}>
                  {row.indicator === "occurred" ? (
                    <CircleCheck className="occurred-dot" size={14} />
                  ) : row.indicator === "missed" ? (
                    <CircleX className="missed-dot" size={13} />
                  ) : (
                    <CircleMinus className="pending-dot" size={13} />
                  )}
                  <span>{row.title}</span>
                </button>
              </td>
              <td>{row.staff}</td>
              <td>{row.location}</td>
              <td>{row.status}</td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={7} className="empty-cell">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <footer className="table-footer">
        <span className="muted">
          {selectedCount} selected ({rows.length} rows).
        </span>
        <span>Rows per page</span>
        <select aria-label="Rows per page" defaultValue="50">
          <option>50</option>
          <option>100</option>
        </select>
        <strong>Page 1 of 1</strong>
        <button className="icon-button" disabled aria-label="Previous page">
          <ChevronsLeft size={16} />
        </button>
        <button className="icon-button" disabled aria-label="Next page">
          <ChevronsRight size={16} />
        </button>
      </footer>
    </div>
  );
}
