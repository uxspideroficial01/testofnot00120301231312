import { downloadText } from "../../shared/lib/download";
import { serializeCsv } from "../secondary-shared/csv";
import { useState } from "react";
import { ArrowUp, Filter } from "lucide-react";
import { Button, SearchBox, Footer } from "../secondary-shared/controls";
import type { OpenPerson } from "../secondary-shared/types";
import { staff, members } from "./fixtures";
import { Details } from "./person-details";
export function People({
  isStaff,
  onOpenSession,
  onOpenPerson,
}: {
  isStaff: boolean;
  onOpenSession: () => void;
  onOpenPerson?: OpenPerson;
}) {
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState("");
  const [tab, setTab] = useState("Members");
  const [filtered, setFiltered] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const rows = isStaff
    ? staff.filter(
        (n, i) =>
          n.toLowerCase().includes(query.toLowerCase()) &&
          (!filtered || i % 3 === 0),
      )
    : members.filter(
        (m) =>
          m.join(" ").toLowerCase().includes(query.toLowerCase()) &&
          (!filtered || m[2] === "Guardian"),
      );
  const exportRows = () => {
    const data = isStaff
      ? [
          ["Name", "Role", "Email"],
          ...staff.map((name) => [
            name,
            "Instructor",
            `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
          ]),
        ]
      : [["First name", "Last name", "Role", "Email", "Phone"], ...members];
    downloadText(
      isStaff ? "staff.csv" : "members.csv",
      serializeCsv(data),
      "text/csv;charset=utf-8",
    );
  };
  return (
    <div className="sv-page">
      <div className="sv-toolbar">
        {!isStaff && (
          <div className="sv-under-tabs">
            {["Members", "Enrollments"].map((t) => (
              <button
                className={tab === t ? "active" : ""}
                key={t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
        <div className="sv-spacer" />
        <SearchBox value={query} onChange={setQuery} />
        <Button onClick={exportRows}>Export to CSV</Button>
        <Button onClick={() => setFiltered(!filtered)}>
          <Filter size={16} />
          {filtered ? (isStaff ? "Admins" : "Guardians") : "Filter"}
        </Button>
        {!isStaff && (
          <Button onClick={() => setQuery("")}>
            <ArrowUp size={16} />
            Sort by: First name
          </Button>
        )}
      </div>
      <div className="sv-table-scroll">
        <table className={`sv-table ${isStaff ? "sv-staff" : "sv-members"}`}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={selected.length === rows.length && rows.length > 0}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? rows.map((_, i) => String(i)) : [],
                    )
                  }
                />
              </th>
              {(isStaff
                ? ["Name", "Role", "Email", "Phone number"]
                : tab === "Enrollments"
                  ? [
                      "Member",
                      "Service",
                      "Enrollment",
                      "Status",
                      "Next session",
                    ]
                  : [
                      "First name",
                      "Last name",
                      "Role",
                      "Email",
                      "Phone",
                      "Created at",
                      "Labels",
                      "Auto-pay",
                      "Portal access",
                      "Balance",
                    ]
              ).map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const name = typeof r === "string" ? r : `${r[0]} ${r[1]}`;
              return (
                <tr key={i}>
                  <td>
                    <input
                      aria-label={`Select ${name}`}
                      type="checkbox"
                      checked={selected.includes(String(i))}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? [...selected, String(i)]
                            : selected.filter((x) => x !== String(i)),
                        )
                      }
                    />
                  </td>
                  {typeof r === "string" ? (
                    <>
                      <td>
                        <button
                          className="sv-link"
                          onClick={() =>
                            onOpenPerson
                              ? onOpenPerson("staff", r)
                              : setDetail(r)
                          }
                        >
                          {r}
                        </button>
                      </td>
                      <td>
                        {staff.indexOf(r) % 3 === 0 ? "Admin" : "Instructor"}
                      </td>
                      <td>
                        {r.toLowerCase().replaceAll(" ", ".")}@example.com
                      </td>
                      <td>{i % 4 === 0 ? "(212) 555-0136" : ""}</td>
                    </>
                  ) : tab === "Enrollments" ? (
                    <>
                      <td>
                        <button
                          className="sv-link"
                          onClick={() =>
                            onOpenPerson
                              ? onOpenPerson("member", name)
                              : setDetail(name)
                          }
                        >
                          {name}
                        </button>
                      </td>
                      <td>Private Piano Lesson</td>
                      <td>Weekly · 30 minutes</td>
                      <td>
                        <span className="sv-status">Active</span>
                      </td>
                      <td>
                        <button className="sv-link" onClick={onOpenSession}>
                          Oct 8, 2026
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <button
                          className="sv-link"
                          onClick={() =>
                            onOpenPerson
                              ? onOpenPerson("member", name)
                              : setDetail(name)
                          }
                        >
                          {r[0]}
                        </button>
                      </td>
                      <td>
                        <button
                          className="sv-link"
                          onClick={() =>
                            onOpenPerson
                              ? onOpenPerson("member", name)
                              : setDetail(name)
                          }
                        >
                          {r[1]}
                        </button>
                      </td>
                      <td>{r[2]}</td>
                      <td>{r[3]}</td>
                      <td>{r[4]}</td>
                      <td>
                        Mar 16,
                        <br />
                        2026
                      </td>
                      <td>
                        <span
                          className={`sv-tag ${i % 2 ? "sv-tag-pink" : ""}`}
                        >
                          {r[1] === "Martins"
                            ? "Martins family"
                            : "First name starts with A"}
                        </span>
                      </td>
                      <td>
                        <span className="sv-pill">
                          {r[2] === "Guardian" ? "Plan Default" : "n/a"}
                        </span>
                      </td>
                      <td>
                        <span className="sv-pill">
                          {r[2] === "Guardian" ? "Granted" : "No"}
                        </span>
                      </td>
                      <td>{r[2] === "Guardian" ? "$0.00" : "n/a"}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <div className="sv-empty">No results.</div>}
      </div>
      <Footer count={rows.length} />
      {detail && (
        <Details
          name={detail}
          type={isStaff ? "Staff" : "Member"}
          close={() => setDetail("")}
          onOpenSession={onOpenSession}
        />
      )}
    </div>
  );
}
