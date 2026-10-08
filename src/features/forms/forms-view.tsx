import { initialFormNames } from "./fixtures";
import { useState } from "react";
import { ArrowDown, Info, MoreHorizontal, Plus } from "lucide-react";
import { Button, Panel } from "../secondary-shared/controls";

export function Forms() {
  const [names, setNames] = useState(initialFormNames);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  return (
    <div className="sv-page sv-padded">
      <div className="sv-notice">
        <Info size={17} />
        <span>
          Self-enrollment forms have moved to <u>Group Classes</u>. Open the
          Self-Enrollment Forms tab there to view or create them.
        </span>
      </div>
      <div className="sv-toolbar sv-right sv-no-border">
        <Button onClick={() => setNames([...names].reverse())}>
          <ArrowDown size={16} />
          Sort by: Last updated
        </Button>
        <Button
          primary
          onClick={() => {
            setDraft("");
            setEditing(-1);
          }}
        >
          <Plus size={16} />
          Create form
        </Button>
      </div>
      <div className="sv-table-scroll">
        <table className="sv-table">
          <thead>
            <tr>
              {[
                "Name",
                "Template",
                "Submissions",
                "Last updated",
                "Status",
                "",
              ].map((t, i) => (
                <th key={i}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {names.map((n, i) => (
              <tr key={i}>
                <td>
                  <button
                    className="sv-text-button"
                    onClick={() => {
                      setEditing(i);
                      setDraft(n);
                    }}
                  >
                    {n}
                  </button>
                </td>
                <td className="sv-muted">Interest</td>
                <td className="sv-muted">
                  {i < 4 ? [5, 6, 0, 5][i] : 0} submissions
                </td>
                <td className="sv-muted">
                  {i < 4 ? "Sep, 15 2026" : "Aug, 11 2026"}
                </td>
                <td className="sv-muted">
                  <span className={`sv-dot ${i === 8 ? "sv-gray" : ""}`} />
                  {i === 8 ? "Unpublished" : "Published"}
                </td>
                <td>
                  <button
                    className="sv-icon"
                    aria-label={`Edit ${n}`}
                    onClick={() => {
                      setEditing(i);
                      setDraft(n);
                    }}
                  >
                    <MoreHorizontal size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing !== null && (
        <Panel
          title={editing === -1 ? "Create form" : "Edit form"}
          close={() => setEditing(null)}
        >
          <form
            className="sv-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              setNames(
                editing === -1
                  ? [draft, ...names]
                  : names.map((n, i) => (i === editing ? draft : n)),
              );
              setEditing(null);
            }}
          >
            <label>
              Form name
              <input
                required
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </label>
            <label>
              Template
              <select>
                <option>Interest</option>
                <option>Open</option>
              </select>
            </label>
            <h3>Fields</h3>
            {["First name", "Last name", "Email", "Phone"].map((f) => (
              <label key={f}>
                {f}
                <input disabled placeholder={f} />
              </label>
            ))}
            <button className="sv-button sv-primary">Save form</button>
          </form>
        </Panel>
      )}
    </div>
  );
}
