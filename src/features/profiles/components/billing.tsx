import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { DEMO_INVOICE_DATES } from "../demo-fixtures";

export function Billing({ name }: { name: string }) {
  const [tab, setTab] = useState("Invoices");
  const [selected, setSelected] = useState<number[]>([]);
  const exportInvoices = () => {
    const text = DEMO_INVOICE_DATES.map(
      (dates, i) =>
        `${dates[0]},${i === 3 ? "0.01" : i === 4 ? "1000.00" : "200.00"},${i === 3 || i === 4 ? "Paid" : "Overdue"}`,
    ).join("\n");
    const url = URL.createObjectURL(
      new Blob(["Created,Total,Status\n" + text], { type: "text/csv" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <div
        className="pp-line-tabs"
        role="tablist"
        aria-label="Billing sections"
      >
        {[
          "Invoices",
          "Credits",
          "Payments",
          "Payment methods",
          "Line items",
        ].map((item) => (
          <button
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : ""}
            key={item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="pp-ledger-notice">
        <Info size={16} />
        <span>
          This ledger is the whole family&apos;s. {name} is the ledger owner, so
          anything created here records against them.
        </span>
      </div>
      {tab === "Invoices" ? (
        <>
          <div className="pp-invoice-summary">
            <span>
              Family overdue <strong>$800.00</strong>
            </span>
            <span>
              Family outstanding <strong>$800.00</strong>
            </span>
            <button className="pp-button" onClick={exportInvoices}>
              Actions
              <ChevronDown size={14} />
            </button>
          </div>
          <table className="pp-invoices">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    aria-label="Select all invoices"
                    checked={selected.length === 6}
                    onChange={(e) =>
                      setSelected(e.target.checked ? [0, 1, 2, 3, 4, 5] : [])
                    }
                  />
                </th>
                {[
                  "Name",
                  "Created Date",
                  "Due Date",
                  "Total",
                  "Balance",
                  "Status",
                  "Auto-Pay",
                ].map((text) => (
                  <th key={text}>{text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_INVOICE_DATES.map(([created, due], i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select invoice ${i + 1}`}
                      checked={selected.includes(i)}
                      onChange={(e) =>
                        setSelected((current) =>
                          e.target.checked
                            ? [...current, i]
                            : current.filter((index) => index !== i),
                        )
                      }
                    />
                  </td>
                  <td>
                    <div>
                      {i === 4
                        ? "fake invoice"
                        : `${i === 3 ? "Upfront Enrollment Fee" : i === 5 ? "10-Pack Fee" : "10-Pack Renewal Fee"}: ${name} - ${i === 3 ? "coding class" : "Introduction to Oneiromancy"}`}
                    </div>
                    <small>For {name}</small>
                  </td>
                  <td>{created}</td>
                  <td>{due}</td>
                  <td>
                    {i === 3 ? "$0.01" : i === 4 ? "$1,000.00" : "$200.00"}
                  </td>
                  <td>{i === 3 || i === 4 ? "$0.00" : "$200.00"}</td>
                  <td>
                    <span
                      className={`pp-invoice-status ${i === 3 || i === 4 ? "paid" : ""}`}
                    >
                      {i === 3 || i === 4 ? "PAID" : "OVERDUE"}
                    </span>
                  </td>
                  <td>
                    <span className="pp-neutral">Off</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="pp-empty">No results.</div>
      )}
    </>
  );
}
