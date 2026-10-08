import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Panel } from "../secondary-shared/controls";

export function Details({
  name,
  type,
  close,
  onOpenSession,
}: {
  name: string;
  type: string;
  close: () => void;
  onOpenSession: () => void;
}) {
  const [tab, setTab] = useState("Activity");
  const isFamily = type === "Member" && name.includes("Martins");
  return (
    <Panel title={name} close={close}>
      <div className="sv-detail-grid">
        <div className="sv-detail-main">
          <h3>
            Enrollments{" "}
            <span className="sv-count">{isFamily ? "3 total" : "0 total"}</span>
          </h3>
          {isFamily ? (
            [
              "Clara Martins · Piano · 30 min",
              "Lucas Martins · Guitar · 30 min",
              "Sofia Martins · Voice · 30 min",
            ].map((s, i) => (
              <button
                key={s}
                className="sv-enrollment"
                onClick={() => {
                  if (i === 0) {
                    close();
                    onOpenSession();
                  } else {
                    setTab("Upcoming");
                  }
                }}
              >
                <span>
                  <strong>{s}</strong>
                  <small>Private lesson · Weekly</small>
                </span>
                <span className={i === 0 ? "sv-missed" : "sv-status"}>
                  {i === 0 ? "Missed" : "Active"}
                </span>
                <ChevronRight size={16} />
              </button>
            ))
          ) : (
            <div className="sv-emptybox">No enrollments found</div>
          )}
          <div className="sv-tabs sv-detail-tabs">
            {["Activity", "Upcoming", "Past", "Availability"].map((t) => (
              <button
                className={tab === t ? "active" : ""}
                key={t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "Activity" ? (
            <ul className="sv-timeline">
              <li>
                Session created <small>Oct 8</small>
              </li>
              <li>
                Enrollment updated <small>Oct 6</small>
              </li>
              <li>
                Account created <small>Sep 25</small>
              </li>
            </ul>
          ) : (
            <div className="sv-emptybox">
              {tab === "Availability"
                ? "Monday – Friday · 9:00 AM – 5:00 PM"
                : `No ${tab.toLowerCase()} sessions`}
            </div>
          )}
        </div>
        <aside className="sv-contact">
          <h4>CONTACT</h4>
          <dl>
            <dt>Email</dt>
            <dd>{name.toLowerCase().replaceAll(" ", ".")}@example.com</dd>
            <dt>Portal access</dt>
            <dd>
              <span className="sv-status">Registered</span>
            </dd>
            <dt>Phone</dt>
            <dd className="sv-muted">Add phone...</dd>
            <dt>Address</dt>
            <dd className="sv-muted">Add address...</dd>
            <dt>Timezone</dt>
            <dd>Organization default</dd>
          </dl>
          <h4>{type === "Member" ? "ACCOUNT" : "ROLE & PAY"}</h4>
          <dl>
            <dt>Role</dt>
            <dd>{type === "Member" ? "Guardian" : "Admin"}</dd>
            <dt>{type === "Member" ? "Auto-Pay" : "Default Pay Rate"}</dt>
            <dd>{type === "Member" ? "Plan Default" : "$50.00"}</dd>
          </dl>
        </aside>
      </div>
    </Panel>
  );
}
