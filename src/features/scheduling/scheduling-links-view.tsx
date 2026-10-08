import { initialLinkNames } from "./fixtures";
import { useState } from "react";
import { ArrowDown, Plus } from "lucide-react";
import { Button, Panel } from "../secondary-shared/controls";

export function SchedulingLinks() {
  const [reverse, setReverse] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [linkName, setLinkName] = useState("");
  const [draftIndexes, setDraftIndexes] = useState<number[]>([]);
  const [names, setNames] = useState(initialLinkNames);
  return (
    <div className="sv-page sv-padded">
      <div className="sv-toolbar sv-right sv-no-border">
        <Button onClick={() => setReverse(!reverse)}>
          <ArrowDown size={16} />
          Sort by: Last updated
        </Button>
        <Button
          primary
          onClick={() => {
            setLinkName("New scheduling link");
            setEditingIndex(-1);
          }}
        >
          <Plus size={16} />
          New scheduling link
        </Button>
      </div>
      <div className="sv-table-scroll">
        <table className="sv-table sv-links">
          <thead>
            <tr>
              <th>Name</th>
              <th>Staff</th>
              <th>Booking options</th>
              <th>Last updated</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(reverse
              ? [...names.entries()].reverse()
              : [...names.entries()]
            ).map(([i, n]) => (
              <tr key={i}>
                <td>
                  <button
                    className="sv-text-button"
                    onClick={() => {
                      setLinkName(n);
                      setEditingIndex(i);
                    }}
                  >
                    {n}
                  </button>
                </td>
                <td className="sv-muted">
                  {draftIndexes.includes(i)
                    ? "No staff"
                    : [
                        "Vicky Qiu, Vicky Qiu",
                        "AJ Ding, Anna Alworth +4 more",
                        "Hassan Ahmed, Hassan Instructor",
                        "AJ Ding, Cory Zhou +3 more",
                        "Artemy Staff",
                        "No staff",
                      ][i % 6]}
                </td>
                <td className="sv-muted">
                  {draftIndexes.includes(i)
                    ? "No booking options"
                    : [
                        "Vicky’s Chocolate Chip Cookie Making Class · 60 min · $2.00",
                        "Math · 60 min",
                        "Hassan Private Class · 60 min · $3.00",
                        "Andrii private class · 60 min, coding class · 60 min",
                        "Soprano Saxophone Lesson · 60 min",
                      ][i % 5]}
                </td>
                <td className="sv-muted">
                  {draftIndexes.includes(i) ? "Oct 8, 2026" : "Sep 25, 2026"}
                </td>
                <td>
                  <span
                    className={`sv-dot ${draftIndexes.includes(i) ? "sv-gray" : ""}`}
                  />
                  {draftIndexes.includes(i) ? "Draft" : "Active"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingIndex !== null && (
        <Panel
          title={editingIndex === -1 ? "New scheduling link" : linkName}
          close={() => setEditingIndex(null)}
        >
          <form
            className="sv-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!linkName.trim()) return;
              if (editingIndex === -1) {
                setNames([...names, linkName.trim()]);
                setDraftIndexes([...draftIndexes, names.length]);
              } else {
                setNames(
                  names.map((name, index) =>
                    index === editingIndex ? linkName.trim() : name,
                  ),
                );
              }
              setEditingIndex(null);
            }}
          >
            <label>
              Name
              <input
                required
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
              />
            </label>
            <h3>Booking options</h3>
            <div className="sv-emptybox">
              {editingIndex === -1 || draftIndexes.includes(editingIndex)
                ? "No booking options"
                : [
                    "Vicky’s Chocolate Chip Cookie Making Class · 60 min · $2.00",
                    "Math · 60 min",
                    "Hassan Private Class · 60 min · $3.00",
                    "Andrii private class · 60 min",
                    "Soprano Saxophone Lesson · 60 min",
                  ][editingIndex % 5]}
            </div>
            <div className="sv-form-actions">
              <Button onClick={() => setEditingIndex(null)}>Cancel</Button>
              <button className="sv-button sv-primary" type="submit">
                {editingIndex === -1 ? "Save draft" : "Save changes"}
              </button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  );
}
